
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { DeepTech, Source } from "../../types";
import { withRetry, getSearchConfig, getSourcesFromResponse, parseJsonFromResponse } from './shared';
import { getHuntSystemInstruction } from '../prompts';
import { USE_DEMO_DATA } from '../../config';
import * as mock from '../mockData';
import { deepTechArraySchema } from "../zodSchemas";

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
        const resultCount = 3;
        const userPrompt = existingResults.length > 0
            ? `以下の技術は既に発見済みです。これら**以外**の新しい関連技術を、日本の大学から最大${resultCount}件調査してください。もし新しいものが見つからなければ、何も出力しないでください。\n\n発見済みリスト:\n${existingResults.map(t => `- ${t.techName} (${t.university})`).join('\n')}\n\n検索キーワード: 「${query}」`
            : `検索キーワード: 「${query}」`;

        const response: GenerateContentResponse = await withRetry(() => ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: userPrompt,
            config: {
                systemInstruction: getHuntSystemInstruction(),
                ...getSearchConfig(),
            }
        }));

        const sources = getSourcesFromResponse(response);
        // Use Zod schema for parsing and validation.
        // If response.text is empty or doesn't contain the expected JSON, this will handle it.
        const results = parseJsonFromResponse(response.text, deepTechArraySchema) ?? [];

        const resultsWithIds = results.map(r => ({ ...r, id: crypto.randomUUID() }));
        return { results: resultsWithIds, sources };

    } catch (error) {
        // Gracefully handle cases where JSON is not found or invalid
        if (error instanceof Error && (error.message.includes("解析できませんでした") || error.message.includes("一致しませんでした"))) {
             console.warn("Could not find or parse valid JSON from Gemini response for deep tech hunt. Raw text was likely empty or non-JSON.");
             return { results: [], sources: [] }; // Return empty results instead of throwing
        }

        console.error("Gemini API call for deep tech hunt failed:", error);
        if (error instanceof Error) {
            throw new Error(`AIによる国内大学技術の探索に失敗しました: ${error.message}`);
        }
        throw new Error("AIによる国内大学技術の探索中に不明なエラーが発生しました。");
    }
};