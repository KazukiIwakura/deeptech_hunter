import { GoogleGenAI, GenerateContentResponse, Chat, Type } from "@google/genai";
import type { DeepTech } from "../../types";
import { withRetry, parseJsonFromResponse, getSearchConfig } from './shared';
import * as prompts from '../prompts';
import { USE_DEMO_DATA } from '../../config';
import * as mock from '../mockData';
import { suggestionsSchema } from "../zodSchemas";

const chatSuggestionsSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.STRING,
        description: "投資判断の決め手となりうる、核心を突いた鋭い質問",
    }
};

export const getChatSuggestions = async (ai: GoogleGenAI | null, techName: string, university: string, analysis: string, useDemoData: boolean = USE_DEMO_DATA): Promise<string[]> => {
    if (useDemoData) {
        console.log("体験モード: getChatSuggestionsのモックデータを使用中");
        await new Promise(resolve => setTimeout(resolve, 400));
        return mock.mockChatSuggestions;
    }
    if (!ai) throw new Error("API client is not initialized.");

    try {
        const prompt = `
以下の技術シーズの分析レポートを読み、VCとしてすべき鋭い質問を3つ提案してください。

- **技術名**: ${techName}
- **所属大学**: ${university}

---
**分析レポート:**
${analysis}
---
`;

        const response: GenerateContentResponse = await withRetry(() => ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: prompts.getChatSuggestionsSystemInstruction(),
                responseMimeType: "application/json",
                responseSchema: chatSuggestionsSchema,
                temperature: 0.7,
            }
        }));

        const parsedData = parseJsonFromResponse(response.text, suggestionsSchema);
        return parsedData;

    } catch (error) {
        console.error("Gemini API call for chat suggestions failed:", error);
        if (error instanceof Error) {
            throw new Error(`AIからの質問提案の取得に失敗しました: ${error.message}`);
        }
        throw new Error("AIからの質問提案の取得中に不明なエラーが発生しました。");
    }
};

export const createDeepDiveChat = (ai: GoogleGenAI | null, techName: string, initialAnalysis: string, useDemoData: boolean = USE_DEMO_DATA): Chat | null => {
    if (useDemoData) {
        console.log("体験モード: モックチャットセッションを使用中");
        return mock.mockChatSession;
    }
    if (!ai) {
        console.error("Cannot create chat session, API client is not initialized.");
        return null;
    }
    
    const systemInstructionWithContext = `
${prompts.getChatSystemInstruction()}

以下は、対話の前提となる初期分析レポートです。
---
${initialAnalysis}
---
`;

    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: systemInstructionWithContext,
            ...getSearchConfig(),
        },
    });
    return chat;
};