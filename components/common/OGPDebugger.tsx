import React, { useState, useEffect } from 'react';
import { getBaseUrl, checkOGPImageExists } from '../../utils/ogp';

/**
 * OGP設定のデバッグ用コンポーネント（開発環境でのみ表示）
 */
export const OGPDebugger: React.FC = () => {
  const [imageExists, setImageExists] = useState<boolean | null>(null);
  const [baseUrl, setBaseUrl] = useState<string>('');
  const [ogpTags, setOgpTags] = useState<Record<string, string>>({});

  useEffect(() => {
    // 開発環境でのみ実行
    if (process.env.NODE_ENV !== 'development') return;

    const url = getBaseUrl();
    setBaseUrl(url);

    // OGP画像の存在確認
    checkOGPImageExists().then(setImageExists);

    // 現在のOGPタグを取得
    const tags: Record<string, string> = {};
    const metaTags = document.querySelectorAll('meta[property^="og:"], meta[name^="twitter:"]');
    metaTags.forEach(tag => {
      const property = tag.getAttribute('property') || tag.getAttribute('name') || '';
      const content = tag.getAttribute('content') || '';
      tags[property] = content;
    });
    setOgpTags(tags);
  }, []);

  // 本番環境では何も表示しない
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg p-4 shadow-lg max-w-md text-sm z-50">
      <h3 className="font-bold mb-2 text-gray-800">OGP Debug Info</h3>
      
      <div className="space-y-2">
        <div>
          <strong>Base URL:</strong> {baseUrl || 'Loading...'}
        </div>
        
        <div>
          <strong>OGP Image Status:</strong>{' '}
          {imageExists === null ? (
            'Checking...'
          ) : imageExists ? (
            <span className="text-green-600">✓ Found</span>
          ) : (
            <span className="text-red-600">✗ Not Found</span>
          )}
        </div>

        <div>
          <strong>Image URL:</strong>{' '}
          <a 
            href={`${baseUrl}/ogp.png`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            {baseUrl}/ogp.png
          </a>
        </div>

        <details className="mt-2">
          <summary className="cursor-pointer font-medium">OGP Tags</summary>
          <div className="mt-2 space-y-1 text-xs">
            {Object.entries(ogpTags).map(([key, value]) => (
              <div key={key}>
                <strong>{key}:</strong> {value}
              </div>
            ))}
          </div>
        </details>

        <div className="mt-2 pt-2 border-t">
          <button
            onClick={() => {
              const url = `https://developers.facebook.com/tools/debug/?q=${encodeURIComponent(window.location.href)}`;
              window.open(url, '_blank');
            }}
            className="text-blue-600 underline text-xs"
          >
            Facebook OGP Debugger で確認
          </button>
        </div>
      </div>
    </div>
  );
};