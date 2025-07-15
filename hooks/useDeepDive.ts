
import { useReducer, useCallback } from 'react';
import { streamDeepDiveAnalysis } from '../services/geminiService';
import type { DeepDiveStreamEvent } from '../services/gemini/deepdive';
import type { DeepTech, Source, DeepDiveAnalysisData } from '../types';
import * as mock from '../services/mockData';
import { parseJsonFromResponse } from '../services/gemini/shared';
import type { GoogleGenAI } from '@google/genai';
import { deepDiveAnalysisSchema } from '../services/zodSchemas';

// 1. State and Action Types
interface DeepDiveState {
    selectedTech: DeepTech | null;
    analysisJsonString: string;
    deepDiveAnalysis: DeepDiveAnalysisData | null;
    deepDiveSources: Source[];
    isStreaming: boolean;
    statusMessage: string;
    deepDiveError: string | null;
}

type DeepDiveAction =
    | { type: 'RESET' }
    | { type: 'START'; payload: { tech: DeepTech, message: string } }
    | { type: 'RESTORE'; payload: { tech: DeepTech; analysisJsonString: string; sources: Source[] } }
    | { type: 'ADD_ANALYSIS_CHUNK'; payload: string }
    | { type: 'SET_SOURCES'; payload: Source[] }
    | { type: 'SET_STATUS_MESSAGE', payload: string }
    | { type: 'SET_ERROR'; payload: string }
    | { type: 'FINISH_STREAMING'; payload: { jsonString: string } };

// 2. Initial State
const initialState: DeepDiveState = {
    selectedTech: null,
    analysisJsonString: '',
    deepDiveAnalysis: null,
    deepDiveSources: [],
    isStreaming: false,
    statusMessage: '',
    deepDiveError: null,
};

// 3. Reducer
const deepDiveReducer = (state: DeepDiveState, action: DeepDiveAction): DeepDiveState => {
    switch (action.type) {
        case 'RESET':
            return initialState;
        case 'START':
            return { ...initialState, selectedTech: action.payload.tech, isStreaming: true, statusMessage: action.payload.message };
        case 'RESTORE': {
            const { tech, analysisJsonString, sources } = action.payload;
            try {
                const parsed = parseJsonFromResponse(analysisJsonString, deepDiveAnalysisSchema);
                return {
                    ...initialState,
                    selectedTech: tech,
                    analysisJsonString: analysisJsonString,
                    deepDiveAnalysis: parsed,
                    deepDiveSources: sources,
                    isStreaming: false,
                    statusMessage: '分析完了',
                    deepDiveError: null,
                };
            } catch (e) {
                 const message = e instanceof Error ? e.message : '予期せぬエラー';
                 return {
                    ...initialState,
                    selectedTech: tech,
                    deepDiveError: `保存された分析データの解析に失敗しました: ${message}`
                };
            }
        }
        case 'ADD_ANALYSIS_CHUNK':
            return { ...state, analysisJsonString: state.analysisJsonString + action.payload };
        case 'SET_SOURCES':
            return { ...state, deepDiveSources: action.payload };
        case 'SET_STATUS_MESSAGE':
            return { ...state, statusMessage: action.payload };
        case 'SET_ERROR':
            return { ...state, deepDiveError: `詳細情報の取得に失敗しました: ${action.payload}`, isStreaming: false };
        case 'FINISH_STREAMING': {
            const jsonString = action.payload.jsonString;
            try {
                const parsed = parseJsonFromResponse(jsonString, deepDiveAnalysisSchema);
                return { ...state, isStreaming: false, statusMessage: '分析完了', deepDiveAnalysis: parsed, analysisJsonString: jsonString };
            } catch (e) {
                 const message = e instanceof Error ? e.message : '予期せぬエラー';
                 return { ...state, isStreaming: false, deepDiveError: `AIからの応答を解析できませんでした。${message}` };
            }
        }
        default:
            return state;
    }
};

/**
 * Manages the state and logic for the "Deep Dive" analysis feature.
 * This includes streaming the analysis from the AI, handling state updates,
 * and parsing the final structured data.
 * @param {GoogleGenAI | null} ai - The GoogleGenAI client instance.
 * @param {boolean} useDemoData - A flag to determine whether to use mock data or the live API.
 * @returns An object containing the deep dive state and functions to manage the deep dive process.
 */
export const useDeepDive = (ai: GoogleGenAI | null, useDemoData: boolean) => {
    const [state, dispatch] = useReducer(deepDiveReducer, initialState);

    const reset = useCallback(() => dispatch({ type: 'RESET' }), []);

    const restoreDeepDive = useCallback((tech: DeepTech, analysisJsonString: string, sources: Source[]) => {
        dispatch({ type: 'RESTORE', payload: { tech, analysisJsonString, sources } });
    }, []);

    const startDeepDive = useCallback(async (tech: DeepTech) => {
        if (!ai && !useDemoData) {
            dispatch({ type: 'SET_ERROR', payload: 'APIキーが設定されていません。' });
            return;
        }
        dispatch({ type: 'START', payload: { tech, message: '分析を開始...' } });

        let finalJsonString = '';
        try {
            const stream: AsyncGenerator<DeepDiveStreamEvent> = useDemoData
                ? mock.mockDeepDiveStream()
                : streamDeepDiveAnalysis(ai!, { techName: tech.techName, university: tech.university });

            for await (const event of stream) {
                switch(event.type) {
                    case 'status':
                        dispatch({ type: 'SET_STATUS_MESSAGE', payload: event.message });
                        break;
                    case 'sources':
                        dispatch({ type: 'SET_SOURCES', payload: event.sources });
                        break;
                    case 'analysisChunk':
                        finalJsonString += event.chunk;
                        dispatch({ type: 'ADD_ANALYSIS_CHUNK', payload: event.chunk });
                        break;
                }
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : '予期せぬエラー';
            dispatch({ type: 'SET_ERROR', payload: message });
            return;
        } 
        
        dispatch({ type: 'FINISH_STREAMING', payload: { jsonString: finalJsonString } });

    }, [ai, useDemoData]);

    return {
        state: {
            ...state,
            analysis: state.deepDiveAnalysis, // for compatibility in App.tsx
        },
        startDeepDive,
        restoreDeepDive,
        reset,
    };
};