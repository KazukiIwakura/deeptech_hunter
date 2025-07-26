import type { GoogleGenAI } from '@google/genai';
import type { useAppShell } from '@/hooks/useAppShell';
import type { useSearch } from '@/hooks/useSearch';
import type { useDeepDive } from '@/hooks/useDeepDive';
import type { useChat } from '@/hooks/useChat';
import type { DeepTech, Source } from './core';

/**
 * アプリケーションコンテキストの型定義
 * 各フックの状態と操作を統合
 */
export interface AppContextValue {
    ai: GoogleGenAI | null;
    appShell: ReturnType<typeof useAppShell>;
    
    // Search state and actions
    search: ReturnType<typeof useSearch>['state'] & {
      startSearch: ReturnType<typeof useSearch>['startSearch'];
      handleSearchMore: ReturnType<typeof useSearch>['handleSearchMore'];
      reset: ReturnType<typeof useSearch>['reset'];
    };
    
    // Deep dive state and actions
    deepDive: ReturnType<typeof useDeepDive>['state'] & {
      startDeepDive: ReturnType<typeof useDeepDive>['startDeepDive'];
      restoreDeepDive: ReturnType<typeof useDeepDive>['restoreDeepDive'];
      reset: ReturnType<typeof useDeepDive>['reset'];
    };
    
    // Chat state and actions
    chat: ReturnType<typeof useChat>['state'] & {
      startChat: (tech: DeepTech, sources: Source[]) => void;
      handleSendMessage: ReturnType<typeof useChat>['handleSendMessage'];
      deleteSession: ReturnType<typeof useChat>['deleteSession'];
      setActiveId: ReturnType<typeof useChat>['setActiveId'];
      reset: ReturnType<typeof useChat>['reset'];
    };
    
    // Navigation handlers
    handleSearch: (query: string) => void;
    handleSearchMore: () => void;
    handleNavigateToDeepDive: (tech: DeepTech) => void;
    handleBackToResults: () => void;
    handleNewChat: () => void;
    handleStartChat: () => void;
    handleNavigateFromChatToDeepDive: () => void;
    handleNavigateFromChatToResults: () => void;
    handleSendMessage: (message: string) => void;
    handleSelectSession: (id: string) => void;
    handleDeleteSession: (id: string) => void;
    fetchDiscoverySuggestions: () => void;
}