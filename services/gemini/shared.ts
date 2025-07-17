import { GenerateContentResponse } from "@google/genai";
import { z, ZodError } from 'zod';
import type { Source } from '../../types';
import { sourceReliabilityAnalyzer } from '../quality/sourceReliability';

/**
 * A utility to retry an async function if it fails.
 * Uses exponential backoff for delays.
 * @param apiCall The async function to call.
 * @param retries The total number of attempts.
 * @param initialDelay The initial delay in ms.
 * @returns The result of the apiCall.
 */
export const withRetry = async <T>(apiCall: () => Promise<T>, retries = 3, initialDelay = 1000): Promise<T> => {
    let lastError: Error | undefined;
    for (let i = 0; i < retries; i++) {
        try {
            return await apiCall();
        } catch (error) {
            lastError = error as Error;
            if (i < retries - 1) {
                const delay = initialDelay * Math.pow(2, i);
                console.warn(`API call failed. Retrying in ${delay}ms... (Attempt ${i + 2}/${retries})`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }
    console.error("API call failed after all retries.", lastError);
    throw lastError;
};

/**
 * Parses JSON from Gemini response, handles markdown fences, and validates with a Zod schema.
 * @param text The raw text response from the API.
 * @param schema The Zod schema to validate against.
 * @returns The parsed and validated data.
 * @throws An error if parsing or validation fails.
 */
export const parseJsonFromResponse = <T>(text: string, schema: z.Schema<T>): T => {
    let jsonStr = text.trim();
    // This regex looks for a JSON block inside markdown-style code fences (```json ... ```)
    const fenceRegex = /```(?:json)?\s*([\s\S]*?)\s*```/s;
    const match = jsonStr.match(fenceRegex);
    
    if (match && match[1]) {
        jsonStr = match[1].trim();
    }

    try {
        const parsedJson = JSON.parse(jsonStr);
        return schema.parse(parsedJson);
    } catch (e) {
        if (e instanceof ZodError) {
            console.error("Zod validation failed:", e.issues, "Raw text:", text, "Attempted to parse:", jsonStr);
            throw new Error(`AIからの応答が期待されるデータ形式と一致しませんでした。`);
        } else {
            console.error("Failed to parse JSON:", e, "Raw text:", text, "Attempted to parse:", jsonStr);
            throw new Error(`AIからの応答をJSONとして解析できませんでした。`);
        }
    }
};

export const getSearchConfig = () => {
    // With 'eco' mode removed, all modes use Google Search.
    return { tools: [{ googleSearch: {} }] };
};

export const getSourcesFromResponse = (response: GenerateContentResponse): Source[] => {
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    const sources: Source[] = groundingMetadata?.groundingChunks
        ?.map(chunk => chunk.web)
        .filter((web): web is { uri: string; title: string; snippet?: string } => !!web && !!web.uri && !!web.title)
        .map(web => {
            let domain = '';
            try {
                const hostname = new URL(web.uri).hostname;
                const isProxy = hostname.includes('cloud.google.com') || hostname.includes('googleapis.com');
                // Heuristic: if URI is a known proxy and title looks like a domain, use title as the domain.
                if (isProxy && web.title.includes('.') && !web.title.includes(' ')) {
                    domain = web.title;
                } else {
                    domain = hostname;
                }
            } catch (e) {
                 // If URI is invalid, maybe the title is a domain.
                 if (web.title.includes('.') && !web.title.includes(' ')) {
                    domain = web.title;
                 }
            }

            return { 
                uri: web.uri, 
                title: web.title.trim(), 
                snippet: web.snippet?.trim(),
                domain: domain.replace(/^www\./, ''),
            };
        })
        .filter(source => source.domain) // Only include sources where we could determine a domain
        ?? [];
    
    // Deduplicate based on URI
    return sources.reduce((acc: Source[], current) => {
        if (!acc.some(item => item.uri === current.uri)) {
            acc.push(current);
        }
        return acc;
    }, []);
};

/**
 * Enhanced source processing with reliability scoring
 */
export const getEnhancedSourcesFromResponse = (response: GenerateContentResponse): {
    sources: Source[];
    qualityMetrics: {
        averageReliability: number;
        highQualityCount: number;
        recommendations: string[];
    };
} => {
    const sources = getSourcesFromResponse(response);
    
    // Analyze source reliability
    const sourceEvaluation = sourceReliabilityAnalyzer.evaluateSourceSet(sources);
    
    return {
        sources,
        qualityMetrics: {
            averageReliability: sourceEvaluation.overallReliability,
            highQualityCount: sourceEvaluation.highQualitySources,
            recommendations: sourceEvaluation.recommendations
        }
    };
};