import { useCallback, useMemo } from 'react';
import { GoogleGenAI } from '@google/genai';
import type { DeepTech } from '@/types/core';
import type { AppContextValue } from '@/types/context';
import { useAppShell } from './useAppShell';
import { useSearch } from './useSearch';
import { useDeepDive } from './useDeepDive';
import { useChat } from './useChat';

/**
 * アプリケーション全体のコンテキスト値を生成するカスタムフック
 * App.tsxの複雑性を軽減し、ロジックを分離
 */
export const useAppContext = (): AppContextValue => {
    const appShell = useAppShell();
    
    const aiClient = useMemo(() => {
        if (appShell.effectiveApiKey) {
            return new GoogleGenAI({ apiKey: appShell.effectiveApiKey });
        }
        return null;
    }, [appShell.effectiveApiKey]);
    
    const search = useSearch(aiClient, appShell.useDemoData);
    const deepDive = useDeepDive(aiClient, appShell.useDemoData);
    const chat = useChat(aiClient, appShell.useDemoData, deepDive.state.analysisJsonString);

    const handleNewChat = useCallback(() => {
        search.reset();
        deepDive.reset();
        chat.reset();
    }, [search, deepDive, chat]);
    
    const handleSearch = useCallback((query: string) => {
        handleNewChat();
        search.startSearch(query);
    }, [handleNewChat, search]);

    const handleNavigateToDeepDive = useCallback((tech: DeepTech) => {
        chat.reset();
        deepDive.startDeepDive(tech);
        window.scrollTo(0, 0);
    }, [chat, deepDive]);

    const handleBackToResults = useCallback(() => {
        deepDive.reset();
    }, [deepDive]);

    const handleStartChat = useCallback(() => {
        if (!deepDive.state.selectedTech) return;
        chat.startChat(deepDive.state.selectedTech, deepDive.state.deepDiveSources);
        deepDive.reset();
    }, [chat, deepDive]);

    const handleDeleteSession = useCallback((id: string) => {
        const isActive = chat.state.activeId === id;
        chat.deleteSession(id);
        if (isActive) {
            handleNewChat();
        }
    }, [chat, handleNewChat]);

    const handleSelectSession = useCallback((id: string) => {
        search.reset();
        deepDive.reset();
        chat.setActiveId(id);
    }, [search, deepDive, chat]);

    const handleNavigateFromChatToDeepDive = useCallback(() => {
        if (!chat.state.activeSession) return;
        const { tech, initialAnalysis, sources } = chat.state.activeSession;
        chat.setActiveId(null);
        deepDive.restoreDeepDive(tech, initialAnalysis, sources);
        window.scrollTo(0, 0);
    }, [chat, deepDive]);

    const handleNavigateFromChatToResults = useCallback(() => {
        chat.reset();
        deepDive.reset();
        window.scrollTo(0, 0);
    }, [chat, deepDive]);

    return {
        ai: aiClient,
        appShell,
        search: {
          ...search.state,
          startSearch: search.startSearch,
          handleSearchMore: search.handleSearchMore,
          reset: search.reset,
        },
        deepDive: {
          ...deepDive.state,
          startDeepDive: deepDive.startDeepDive,
          restoreDeepDive: deepDive.restoreDeepDive,
          reset: deepDive.reset,
        },
        chat: {
          ...chat.state,
          startChat: chat.startChat,
          handleSendMessage: chat.handleSendMessage,
          deleteSession: chat.deleteSession,
          setActiveId: chat.setActiveId,
          reset: chat.reset,
        },
        handleSearch,
        handleSearchMore: search.handleSearchMore,
        handleNavigateToDeepDive,
        handleBackToResults,
        handleNewChat,
        handleStartChat,
        handleNavigateFromChatToDeepDive,
        handleNavigateFromChatToResults,
        handleSendMessage: chat.handleSendMessage,
        handleSelectSession,
        handleDeleteSession,
        fetchDiscoverySuggestions: appShell.fetchDiscoverySuggestions,
    };
};