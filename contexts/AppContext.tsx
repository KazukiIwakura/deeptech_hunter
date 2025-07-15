
import React, { createContext, useContext } from 'react';
import type { GoogleGenAI } from '@google/genai';
import type { useAppShell } from '../hooks/useAppShell';
import type { useSearch } from '../hooks/useSearch';
import type { useDeepDive } from '../hooks/useDeepDive';
import type { useChat } from '../hooks/useChat';
import type { DeepTech, Source } from '../types';

// The shape of the value provided by the AppContext
export type AppContextValue = {
    ai: GoogleGenAI | null;
    appShell: ReturnType<typeof useAppShell>;
    search: ReturnType<typeof useSearch>['state'] & {
      startSearch: ReturnType<typeof useSearch>['startSearch'];
      handleSearchMore: ReturnType<typeof useSearch>['handleSearchMore'];
      reset: ReturnType<typeof useSearch>['reset'];
    };
    deepDive: ReturnType<typeof useDeepDive>['state'] & {
      startDeepDive: ReturnType<typeof useDeepDive>['startDeepDive'];
      restoreDeepDive: ReturnType<typeof useDeepDive>['restoreDeepDive'];
      reset: ReturnType<typeof useDeepDive>['reset'];
    };
    chat: ReturnType<typeof useChat>['state'] & {
      startChat: (tech: DeepTech, sources: Source[]) => void;
      handleSendMessage: ReturnType<typeof useChat>['handleSendMessage'];
      deleteSession: ReturnType<typeof useChat>['deleteSession'];
      setActiveId: ReturnType<typeof useChat>['setActiveId'];
      reset: ReturnType<typeof useChat>['reset'];
    };
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
};


export const AppContextValue = createContext<AppContextValue | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode, value: AppContextValue }> = ({ children, value }) => {
    return (
        <AppContextValue.Provider value={value}>
            {children}
        </AppContextValue.Provider>
    );
};

export const useApp = (): AppContextValue => {
    const context = useContext(AppContextValue);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};