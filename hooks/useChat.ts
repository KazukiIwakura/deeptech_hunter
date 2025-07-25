
import { useReducer, useCallback, useMemo } from 'react';
import { createDeepDiveChat, getChatSuggestions, withRetry } from '../services/geminiService';
import type { DeepTech, ChatSession, ChatMessage, Source } from '../types';
import type { GoogleGenAI, GenerateContentResponse } from '@google/genai';
import { useApiUsageMonitor } from '@/hooks/useApiUsageMonitor';

// 1. State and Action Types
interface ChatState {
    sessions: ChatSession[];
    activeId: string | null;
    isResponding: boolean;
    error: string | null;
}

type ChatAction =
    | { type: 'RESET_ACTIVE' }
    | { type: 'START_CHAT'; payload: ChatSession }
    | { type: 'SET_ACTIVE_ID'; payload: string | null }
    | { type: 'DELETE_SESSION'; payload: string }
    | { type: 'SET_SUGGESTIONS'; payload: { sessionId: string; suggestions: string[]; isLoading: boolean } }
    | { type: 'SEND_MESSAGE_START'; payload: { sessionId: string; userMessage: ChatMessage; modelPlaceholder: ChatMessage; newTitle: string } }
    | { type: 'STREAM_MESSAGE_CHUNK'; payload: { sessionId: string; modelMessage: ChatMessage } }
    | { type: 'SEND_MESSAGE_ERROR'; payload: { sessionId: string; error: string, modelPlaceholderId: string } }
    | { type: 'SEND_MESSAGE_END' };

// 2. Initial State
const initialState: ChatState = {
    sessions: [],
    activeId: null,
    isResponding: false,
    error: null,
};

// 3. Reducer
const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
    switch (action.type) {
        case 'RESET_ACTIVE':
            return { ...state, activeId: null, isResponding: false, error: null };
        case 'START_CHAT':
            return {
                ...state,
                sessions: [action.payload, ...state.sessions],
                activeId: action.payload.id,
                isResponding: false,
                error: null,
            };
        case 'SET_ACTIVE_ID':
            return { ...state, activeId: action.payload, isResponding: false, error: null };
        case 'DELETE_SESSION':
            return { ...state, sessions: state.sessions.filter(s => s.id !== action.payload) };
        case 'SET_SUGGESTIONS':
            return {
                ...state,
                sessions: state.sessions.map(s => s.id === action.payload.sessionId ? { ...s, suggestions: action.payload.suggestions, suggestionsLoading: action.payload.isLoading } : s),
            };
        case 'SEND_MESSAGE_START': {
            const { sessionId, userMessage, modelPlaceholder, newTitle } = action.payload;
            return {
                ...state,
                isResponding: true,
                error: null,
                sessions: state.sessions.map(s => s.id === sessionId ? { ...s, title: newTitle, messages: [...s.messages, userMessage, modelPlaceholder] } : s),
            };
        }
        case 'STREAM_MESSAGE_CHUNK': {
            const { sessionId, modelMessage } = action.payload;
            return {
                ...state,
                sessions: state.sessions.map(s => {
                    if (s.id !== sessionId) return s;
                    // Replace placeholder with the real message content
                    const newMessages = s.messages.filter(m => m.id !== modelMessage.id);
                    newMessages.push(modelMessage);
                    return { ...s, messages: newMessages };
                }),
            };
        }
        case 'SEND_MESSAGE_ERROR': {
            const { sessionId, error, modelPlaceholderId } = action.payload;
            return {
                ...state,
                isResponding: false,
                error,
                sessions: state.sessions.map(s =>
                    s.id === sessionId ? { ...s, messages: s.messages.filter(m => m.id !== modelPlaceholderId) } : s
                ),
            };
        }
        case 'SEND_MESSAGE_END':
            return { ...state, isResponding: false };
        default:
            return state;
    }
};

/**
 * Manages the state and logic for the chat functionality, including session handling
 * and message streaming.
 * @param {GoogleGenAI | null} ai - The GoogleGenAI client instance.
 * @param {boolean} useDemoData - A flag to determine whether to use mock data or the live API.
 * @param {string} deepDiveAnalysis - The JSON string of the deep dive analysis to be used as context for the chat.
 * @returns An object containing the chat state and functions to manage chat actions.
 */
export const useChat = (ai: GoogleGenAI | null, useDemoData: boolean, deepDiveAnalysis: string) => {
    const [state, dispatch] = useReducer(chatReducer, initialState);
    const { trackApiCall } = useApiUsageMonitor();

    const activeSession = useMemo(() => state.sessions.find(s => s.id === state.activeId), [state.sessions, state.activeId]);

    const reset = useCallback(() => dispatch({ type: 'RESET_ACTIVE' }), []);
    const setActiveId = useCallback((id: string | null) => dispatch({ type: 'SET_ACTIVE_ID', payload: id }), []);
    const deleteSession = useCallback((id: string) => dispatch({ type: 'DELETE_SESSION', payload: id }), []);

    const startChat = useCallback((tech: DeepTech, sources: Source[]) => {
        if ((!ai && !useDemoData) || !deepDiveAnalysis) return;

        const geminiChat = createDeepDiveChat(ai, tech.techName, deepDiveAnalysis, useDemoData);
        if (!geminiChat) return;

        const newSession: ChatSession = {
            id: crypto.randomUUID(),
            title: `${tech.techName} の分析`,
            tech,
            messages: [],
            geminiChat,
            initialAnalysis: deepDiveAnalysis,
            sources,
            suggestions: [],
            suggestionsLoading: true,
        };
        dispatch({ type: 'START_CHAT', payload: newSession });

        (async () => {
            try {
                // 使用量制限チェック（デモモードでない場合のみ）
                if (!useDemoData && !trackApiCall()) {
                    dispatch({ type: 'SET_SUGGESTIONS', payload: { sessionId: newSession.id, suggestions: [], isLoading: false } });
                    return;
                }
                
                const suggestions = await getChatSuggestions(ai, newSession.tech.techName, newSession.tech.university, newSession.initialAnalysis, useDemoData);
                dispatch({ type: 'SET_SUGGESTIONS', payload: { sessionId: newSession.id, suggestions, isLoading: false } });
            } catch (err) {
                console.error("Failed to fetch chat suggestions:", err);
                dispatch({ type: 'SET_SUGGESTIONS', payload: { sessionId: newSession.id, suggestions: [], isLoading: false } });
            }
        })();
    }, [ai, useDemoData, deepDiveAnalysis]);

    const handleSendMessage = useCallback(async (userInput: string) => {
        if (!activeSession || !state.activeId || state.isResponding) return;

        const sessionId = state.activeId;
        const userMessage: ChatMessage = { id: crypto.randomUUID(), role: 'user', content: userInput };
        const isFirstUserMessage = activeSession.messages.filter(m => m.role === 'user').length === 0;
        const newTitle = isFirstUserMessage ? (userInput.length > 30 ? userInput.substring(0, 27) + '...' : userInput) : activeSession.title;
        const modelPlaceholder: ChatMessage = { id: crypto.randomUUID(), role: 'model', content: '' };

        dispatch({ type: 'SEND_MESSAGE_START', payload: { sessionId, userMessage, modelPlaceholder, newTitle } });

        // 使用量制限チェック（デモモードでない場合のみ）
        if (!useDemoData && !trackApiCall()) {
            dispatch({ type: 'SEND_MESSAGE_ERROR', payload: { sessionId, error: 'API使用制限に達しています。', modelPlaceholderId: modelPlaceholder.id } });
            return;
        }

        try {
            const stream: AsyncGenerator<GenerateContentResponse> = await withRetry(() => activeSession.geminiChat.sendMessageStream({ message: userInput }));
            let fullResponse = '';
            for await (const chunk of stream) {
                fullResponse += chunk.text;
                dispatch({
                    type: 'STREAM_MESSAGE_CHUNK',
                    payload: {
                        sessionId,
                        modelMessage: { ...modelPlaceholder, content: fullResponse },
                    },
                });
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : '予期せぬエラー';
            dispatch({ type: 'SEND_MESSAGE_ERROR', payload: { sessionId, error: `AI応答エラー: ${errorMessage}`, modelPlaceholderId: modelPlaceholder.id } });
        } finally {
            dispatch({ type: 'SEND_MESSAGE_END' });
        }
    }, [activeSession, state.activeId, state.isResponding]);

    return {
        state: {
            sessions: state.sessions,
            activeId: state.activeId,
            activeSession,
            isResponding: state.isResponding,
            error: state.error,
        },
        reset,
        startChat,
        handleSendMessage,
        setActiveId,
        deleteSession
    };
};