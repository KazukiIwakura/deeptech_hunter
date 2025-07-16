import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { DeepTech, Source } from "../../types";
import { withRetry, getSearchConfig, getEnhancedSourcesFromResponse, parseJsonFromResponse } from './shared';
import { getHuntSystemInstruction } from '../prompts';
import { deepTechArraySchema } from "../zodSchemas";

/**
 * より堅牢な検索機能 - 複数の戦略で結果を取得
 */
export const huntDeepTechWithRetry = async (
    ai: GoogleGenAI,
    query: string,
    existingResults: DeepTech[] = []
): Promise<{ results: DeepTech[], sources: Source[] }> => {
    const resultCount = 3;
    
    // 戦略1: 標準的な検索
    const standardPrompt = existingResults.length > 0
        ? `以下の技術は既に発見済みです。これら**以外**の新しい関連技術を、日本の大学から最大${resultCount}件調査してください。もし新しいものが見つからなければ、何も出力しないでください。\n\n発見済みリスト:\n${existingResults.map(t => `- ${t.techName} (${t.university})`).join('\n')}\n\n検索キーワード: 「${query}」`
        : `検索キーワード: 「${query}」`;

    // 戦略2: より具体的な検索（フォールバック用）
    const specificPrompt = `日本の大学で研究されている「${query}」に関連する技術シーズを調査してください。以下の条件で検索してください：
- 具体的な技術名や研究内容を含む
- 実用化の可能性がある技術
- 投資価値のある革新的な技術
- 最大${resultCount}件まで

必ず以下のJSON形式で回答してください：
[{"techName": "技術名", "university": "大学名", "summary": "概要", ...}]`;

    // 戦略3: 広範囲検索（最終フォールバック用）
    const broadPrompt = `「${query}」というキーワードに関連する日本の大学の研究技術を幅広く調査してください。
関連する分野や応用技術も含めて、投資価値のある技術シーズを最大${resultCount}件探してください。`;

    const strategies = [
        { name: 'standard', prompt: standardPrompt },
        { name: 'specific', prompt: specificPrompt },
        { name: 'broad', prompt: broadPrompt }
    ];

    let lastError: Error | null = null;
    
    for (const strategy of strategies) {
        try {
            console.log(`Trying ${strategy.name} search strategy for "${query}"`);
            
            const response: GenerateContentResponse = await withRetry(() => ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: strategy.prompt,
                config: {
                    systemInstruction: getHuntSystemInstruction(),
                    ...getSearchConfig(),
                }
            }), 2); // 各戦略で2回まで再試行

            const enhancedSources = getEnhancedSourcesFromResponse(response);
            
            // レスポンステキストの詳細ログ
            console.log(`${strategy.name} strategy response:`, {
                responseLength: response.text?.length || 0,
                hasJson: response.text?.includes('{') && response.text?.includes('}'),
                sourceCount: enhancedSources.sources.length
            });
            
            // 空のレスポンスの場合は次の戦略を試す
            if (!response.text || response.text.trim().length < 20) {
                console.warn(`${strategy.name} strategy returned empty response, trying next strategy`);
                continue;
            }
            
            const results = parseJsonFromResponse(response.text, deepTechArraySchema) ?? [];
            
            // 結果が見つかった場合
            if (results.length > 0) {
                const resultsWithIds = results.map(r => ({ ...r, id: crypto.randomUUID() }));
                
                console.log(`${strategy.name} strategy succeeded:`, {
                    resultCount: results.length,
                    sourceCount: enhancedSources.sources.length
                });
                
                return { results: resultsWithIds, sources: enhancedSources.sources };
            } else {
                console.warn(`${strategy.name} strategy returned no results, trying next strategy`);
            }
            
        } catch (error) {
            console.warn(`${strategy.name} strategy failed:`, error);
            lastError = error as Error;
            continue;
        }
    }
    
    // すべての戦略が失敗した場合
    console.error(`All search strategies failed for "${query}"`);
    
    if (lastError) {
        throw new Error(`検索に失敗しました: ${lastError.message}`);
    } else {
        throw new Error(`「${query}」に関連する技術が見つかりませんでした。キーワードを変更して再度お試しください。`);
    }
};