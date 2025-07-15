
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { withRetry, parseJsonFromResponse } from './shared';
import { getDiscoverySystemInstruction } from '../prompts';
import { USE_DEMO_DATA } from '../../config';
import * as mock from '../mockData';
import { suggestionsSchema } from '../zodSchemas';

const discoverySuggestionsSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.STRING,
        description: "投資家が「金脈」と感じるような、具体的で魅力的なディープテックのキーワード",
    }
};

export const getDiscoverySuggestions = async (apiKey: string | null, useDemoData: boolean = USE_DEMO_DATA): Promise<string[]> => {
    if (useDemoData) {
        console.log("体験モード: getDiscoverySuggestionsのモックデータを使用中");
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
        return mock.mockDiscoverySuggestions;
    }

    if (!apiKey) {
        throw new Error("APIキーが設定されていません。");
    }
    const ai = new GoogleGenAI({apiKey});

    try {
        const response: GenerateContentResponse = await withRetry(() => ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "有望なディープテックの分野を10個提案してください。",
            config: {
                systemInstruction: getDiscoverySystemInstruction(),
                responseMimeType: "application/json",
                responseSchema: discoverySuggestionsSchema,
                temperature: 0.8,
            }
        }));

        const parsedData = parseJsonFromResponse(response.text, suggestionsSchema);
        return parsedData;

    } catch (error) {
        console.error("Gemini API call for discovery suggestions failed:", error);
        if (error instanceof Error) {
            throw new Error(`AIからの提案取得に失敗しました: ${error.message}`);
        }
        throw new Error("AIからの提案取得中に不明なエラーが発生しました。");
    }
}