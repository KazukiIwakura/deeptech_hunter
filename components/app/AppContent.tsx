import React from 'react';
import { DeepDivePage, ChatPage, HomePage, ResultsPage } from '@/pages';
import { ChatHistorySidebar, Header } from '@/layout';
import { HowItWorksModal } from '@/components/ui/HowItWorksModal';
import { OGPDebugger } from '@/components/common/OGPDebugger';
import { useApp } from '@/contexts/AppContext';

/**
 * アプリケーションのメインコンテンツコンポーネント
 * ルーティングロジックとレイアウトを管理
 */
export const AppContent: React.FC = () => {
  const {
    appShell,
    search,
    deepDive,
    chat,
    handleSearch,
  } = useApp();

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
      <OGPDebugger />
    </div>
  );
};