


import React, { useCallback, useMemo } from 'react';
import { GoogleGenAI } from '@google/genai';
import { AppProvider, AppContextValue } from './contexts/AppContext';
import { DeepDivePage } from './pages/DeepDivePage';
import { ChatPage } from './pages/ChatPage';
import { ChatHistorySidebar } from './layout/ChatHistorySidebar';
import { HomePage } from './pages/HomePage';
import { ResultsPage } from './pages/ResultsPage';
import { HowItWorksModal } from './components/ui/HowItWorksModal';
import { Header } from './layout/Header';
import type { DeepTech, Source } from './types';

import { useAppShell } from './hooks/useAppShell';
import { useSearch } from './hooks/useSearch';
import { useDeepDive } from './hooks/useDeepDive';
import { useChat } from './hooks/useChat';


const AppContent: React.FC = () => {
  const {
    appShell,
    search,
    deepDive,
    chat,
    handleSearch,
  } = React.useContext(AppContextValue)!;

  const renderMainContent = () => {
    if (chat.activeSession) {
      return <ChatPage />;
    }
    if (deepDive.selectedTech) {
      return (
        <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 md:p-8">
          <DeepDivePage tech={deepDive.selectedTech} />
        </div>
      );
    }
    if (search.searchQuery) {
      return <ResultsPage />;
    }
    return (
      <HomePage
        onSearch={handleSearch}
        isSearching={search.isSearching || appShell.isDiscoveryLoading}
        onSuggestionClick={handleSearch}
      />
    );
  };

  return (
    <div className="flex h-screen bg-bg-secondary font-sans">
      <ChatHistorySidebar />
      <main className="flex-1 flex flex-col overflow-y-auto">
        <Header onSearch={handleSearch} />
        <div className="flex-grow">
          {renderMainContent()}
        </div>
      </main>
      <HowItWorksModal
        isOpen={appShell.isHowItWorksModalOpen}
        onClose={appShell.handleCloseHowItWorksModal}
        initialTab={appShell.initialModalTab}
      />
    </div>
  );
};

const App: React.FC = () => {
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
        // We want to go back to results, so reset chat and deep dive states.
        chat.reset();
        deepDive.reset();
        window.scrollTo(0, 0);
    }, [chat, deepDive]);

    const contextValue: AppContextValue = {
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

  return (
    <AppProvider value={contextValue}>
      <AppContent />
    </AppProvider>
  );
};

export default App;