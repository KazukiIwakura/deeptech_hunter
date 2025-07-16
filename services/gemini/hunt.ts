
import { GoogleGenAI } from "@google/genai";
import type { DeepTech, Source } from "../../types";
import { withRetry, getSearchConfig, getEnhancedSourcesFromResponse, parseJsonFromResponse } from './shared';
import { getHuntSystemInstruction } from '../prompts';
import { USE_DEMO_DATA } from '../../config';
import * as mock from '../mockData';
import { deepTechArraySchema } from "../zodSchemas";
import { huntDeepTechWithRetry } from './huntWithRetry';

export const huntDeepTech = async (
    ai: GoogleGenAI | null,
    query: string,
    existingResults: DeepTech[] = [],
    useDemoData: boolean = USE_DEMO_DATA
): Promise<{ results: DeepTech[], sources: Source[] }> => {
    if (useDemoData) {
        console.log("体験モード: huntDeepTechのモックデータを使用中");
        if (existingResults.length > 0) {
            return { results: [], sources: [] };
        }
        await new Promise(res => setTimeout(res, 1000));
        const resultsWithIds = mock.mockDeepTechResults.map(r => ({ ...r, id: crypto.randomUUID() }));
        return { results: resultsWithIds, sources: mock.mockSources };
    }
    if (!ai) throw new Error("API client is not initialized.");

    try {
        // 改良版の検索ロジックを使用
        return await huntDeepTechWithRetry(ai, query, existingResults);
        
    } catch (error) {
        console.error("Enhanced hunt failed, falling back to standard hunt:", error);
        
        // フォールバック: 標準的な検索を1回試行
        try {
            const resultCount = 3;
            const userPrompt = existingResults.length > 0
                ? `以下の技術は既に発見済みです。これら**以外**の新しい関連技術を、日本の大学から最大${resultCount}件調査してください。\n\n発見済みリスト:\n${existingResults.map(t => `- ${t.techName} (${t.university})`).join('\n')}\n\n検索キーワード: 「${query}」`
                : `検索キーワード: 「${query}」`;

            const response = await withRetry(() => ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: userPrompt,
                config: {
                    systemInstruction: getHuntSystemInstruction(),
                    ...getSearchConfig(),
                }
            }));

            const enhancedSources = getEnhancedSourcesFromResponse(response);
            const results = parseJsonFromResponse(response.text, deepTechArraySchema) ?? [];
            const resultsWithIds = results.map(r => ({ ...r, id: crypto.randomUUID() }));
            
            console.log(`Fallback hunt succeeded for "${query}":`, {
                resultCount: results.length,
                sourceCount: enhancedSources.sources.length
            });
            
            return { results: resultsWithIds, sources: enhancedSources.sources };
            
        } catch (fallbackError) {
            console.error("Fallback hunt also failed:", fallbackError);
            
            // 最終的にエラーを投げる前に、より具体的なメッセージを提供
            if (fallbackError instanceof Error && fallbackError.message.includes("解析できませんでした")) {
                throw new Error("検索結果の解析に失敗しました。しばらく待ってから「さらに調査する」ボタンで再度お試しください。");
            }
            
            throw new Error(`検索に失敗しました。「さらに調査する」ボタンで再度お試しいただくか、キーワードを変更してください。`);
        }
    }
};