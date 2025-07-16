
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { OverseasStartup, Source } from "../../types";
import { withRetry, parseJsonFromResponse, getSearchConfig, getEnhancedSourcesFromResponse } from './shared';
import { getOverseasStartupsSystemInstruction } from '../prompts';
import { USE_DEMO_DATA } from '../../config';
import * as mock from '../mockData';
import { overseasStartupArraySchema } from "../zodSchemas";

export const getOverseasStartups = async (ai: GoogleGenAI | null, query: string, existingStartups: OverseasStartup[] = [], useDemoData: boolean = USE_DEMO_DATA): Promise<{ startups: OverseasStartup[], sources: Source[] }> => {
    if (useDemoData) {
        console.log("体験モード: getOverseasStartupsのモックデータを使用中");
         if (existingStartups.length > 0) {
            return { startups: [], sources: [] };
        }
        await new Promise(resolve => setTimeout(resolve, 800));
        return { startups: mock.mockOverseasStartups, sources: mock.mockSources.slice(0, 2) };
    }
    if (!ai) throw new Error("API client is not initialized.");
    
    try {
        const resultCount = 3;
        const userPrompt = existingStartups.length > 0
        ? `以下の海外スタートアップは既に発見済みです。これら**以外**の新しい関連スタートアップを最大${resultCount}社調査してください。もし新しいものが見つからなければ、何も出力しないでください。\n\n発見済みリスト:\n${existingStartups.map(s => `- ${s.startupName} (${s.country})`).join('\n')}\n\n技術キーワード: 「${query}」`
        : `技術キーワード: 「${query}」`;

        const response: GenerateContentResponse = await withRetry(() => ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: userPrompt,
            config: {
                systemInstruction: getOverseasStartupsSystemInstruction(),
                ...getSearchConfig(),
            }
        }));
        
        const enhancedSources = getEnhancedSourcesFromResponse(response);
        const startups = parseJsonFromResponse(response.text, overseasStartupArraySchema) ?? [];
        
        // Log quality metrics for monitoring
        console.log(`Overseas Startups Quality Metrics for "${query}":`, {
            startupCount: startups.length,
            sourceCount: enhancedSources.sources.length,
            sourceReliability: enhancedSources.qualityMetrics.averageReliability,
            highQualitySources: enhancedSources.qualityMetrics.highQualityCount
        });
        
        return { startups, sources: enhancedSources.sources };

    } catch (error) {
        // Gracefully handle cases where JSON is not found or invalid
        if (error instanceof Error && (error.message.includes("解析できませんでした") || error.message.includes("一致しませんでした"))) {
            console.warn("Could not find or parse valid JSON from Gemini response for startups. Raw text was likely empty or non-JSON.");
            return { startups: [], sources: [] }; // Return empty results instead of throwing
        }

        console.error("Gemini API call for overseas startups failed:", error);
        if (error instanceof Error) {
            throw new Error(`AIによる海外スタートアップ情報の取得に失敗しました: ${error.message}`);
        }
        throw new Error("AIによる海外スタートアップ情報の取得中に不明なエラーが発生しました。");
    }
};