


import React, { useEffect } from 'react';
import { AppProvider } from './contexts/AppContext';
import { AppContent } from './components/app/AppContent';
import { useAppContext } from './hooks/useAppContext';
import { updateOGPTags, preloadOGPImage, checkOGPImageExists } from './utils/ogp';

/**
 * アプリケーションのルートコンポーネント
 * コンテキストプロバイダーとメインコンテンツを管理
 */
const App: React.FC = () => {
  const contextValue = useAppContext();

  useEffect(() => {
    // OGPタグを初期化
    updateOGPTags({});
    
    // OGP画像をプリロード
    preloadOGPImage();
    
    // OGP画像の存在確認（開発時のデバッグ用）
    if (process.env.NODE_ENV === 'development') {
      checkOGPImageExists().then(exists => {
        if (!exists) {
          console.warn('OGP画像が見つかりません: /ogp.png');
        } else {
          console.log('OGP画像が正常に読み込まれました');
        }
      });
    }
  }, []);

  return (
    <AppProvider value={contextValue}>
      <AppContent />
    </AppProvider>
  );
};

export default App;