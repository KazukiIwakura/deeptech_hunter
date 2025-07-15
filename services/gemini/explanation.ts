
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import type { TechExplanationData } from "../../types";
import { withRetry, parseJsonFromResponse } from './shared';
import { getTechExplanationSystemInstruction } from '../prompts';
import { USE_DEMO_DATA } from '../../config';
import * as mock from '../mockData';
import { techExplanationSchema as zodTechExplanationSchema } from '../zodSchemas';

const techExplanationSchema = {
    type: Type.OBJECT,
    properties: {
        what_is_it: {
            type: Type.STRING,
            description: "この技術の基本的な概念を、専門用語を避け、比喩などを使いながら平易な言葉で説明した文章。",
        },
        why_is_it_important: {
            type: Type.STRING,
            description: "この技術が解決しようとしている根本的な課題や、既存の技術に対する優位性を明確にした文章。",
        },
        what_future_it_creates: {
            type: Type.STRING,
            description: "この技術が社会や産業に与えるであろう、大きなインパクトや可能性を具体的に示した文章。",
        },
    },
    required: ["what_is_it", "why_is_it_important", "what_future_it_creates"],
};


export const getTechExplanation = async (ai: GoogleGenAI | null, query: string, useDemoData: boolean = USE_DEMO_DATA): Promise<TechExplanationData | null> => {
    if (useDemoData) {
        console.log("体験モード: getTechExplanationのモックデータを使用中");
        await new Promise(resolve => setTimeout(resolve, 500));
        return mock.mockTechExplanation;
    }
    if (!ai) throw new Error("API client is not initialized.");

    try {
        const response: GenerateContentResponse = await withRetry(() => ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `技術キーワード: 「${query}」について解説してください。`,
            config: {
                systemInstruction: getTechExplanationSystemInstruction(),
                responseMimeType: "application/json",
                responseSchema: techExplanationSchema,
                temperature: 0.5,
            }
        }));

        const parsedData = parseJsonFromResponse(response.text, zodTechExplanationSchema);
        return parsedData;

    } catch (error) {
        console.error("Gemini API call for tech explanation failed:", error);
        if (error instanceof Error) {
            throw new Error(`AIによる技術解説の生成に失敗しました: ${error.message}`);
        }
        throw new Error("AIによる技術解説の生成中に不明なエラーが発生しました。");
    }
};