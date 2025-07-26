


import React from 'react';
import { AppProvider } from './contexts/AppContext';
import { AppContent } from './components/app/AppContent';
import { useAppContext } from './hooks/useAppContext';

/**
 * アプリケーションのルートコンポーネント
 * コンテキストプロバイダーとメインコンテンツを管理
 */
const App: React.FC = () => {
  const contextValue = useAppContext();

  return (
    <AppProvider value={contextValue}>
      <AppContent />
    </AppProvider>
  );
};

export default App;