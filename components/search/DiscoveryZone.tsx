
import React from 'react';
import { LightbulbIcon } from '../icons/LightbulbIcon';
import { RefreshIcon } from '../icons/RefreshIcon';
import { Card } from '../common/Card';
import { Button } from '../common/Button';

const cn = (...classes: (string | undefined | null | false | 0)[]) => classes.filter(Boolean).join(' ');

interface DiscoveryZoneProps {
  suggestions: string[];
  isLoading: boolean;
  error: string | null;
  onSuggestionClick: (query: string) => void;
  onRefresh: () => void;
}

export const DiscoveryZone: React.FC<DiscoveryZoneProps> = ({ suggestions, isLoading, error, onSuggestionClick, onRefresh }) => {
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-wrap gap-4 pt-2">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-9 bg-neutral-200 rounded-lg w-36 animate-pulse"></div>
          ))}
        </div>
      );
    }

    if (error) {
        return <p className="text-left text-danger-text bg-danger-light p-4 rounded-md text-sm border border-danger/20">{error}</p>
    }

    if (suggestions.length === 0) {
      return <p className="text-sm text-text-tertiary">提案が見つかりませんでした。更新ボタンで再試行してください。</p>;
    }

    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => onSuggestionClick(suggestion)}
              className="group relative bg-bg-primary border border-border-secondary rounded-lg p-4 text-left transition-all duration-200 hover:border-primary hover:shadow-md hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label={`${suggestion}で検索する`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-text-primary group-hover:text-primary transition-colors">
                  {suggestion}
                </span>
                <svg 
                  className="w-4 h-4 text-text-tertiary group-hover:text-primary transition-colors transform group-hover:translate-x-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <div className="mt-2">
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary-light text-primary">
                  🔍 探索する
                </span>
              </div>
            </button>
          ))}
        </div>
        <div className="mt-8 p-4 bg-bg-secondary rounded-lg border border-border-secondary">
          <p className="text-sm text-text-secondary text-center flex items-center justify-center">
            <svg className="w-4 h-4 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            AIが注目するトレンド分野です。カードをクリックして関連技術を探索してみましょう。
          </p>
        </div>
      </>
    );
  };
  
  if (!isLoading && suggestions.length === 0 && !error) {
      return null;
  }

  return (
    <Card className="w-full mt-16 p-6 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-text-primary flex items-center">
          <LightbulbIcon className="w-6 h-6 mr-3 text-warning" />
          AIが提案する未来の金脈
        </h2>
        <Button
          onClick={onRefresh}
          disabled={isLoading}
          variant="ghost"
          size="medium"
          isIconOnly
          aria-label="提案を再読み込み"
        >
          <RefreshIcon className={cn("w-5 h-5", isLoading && 'animate-spin')} />
        </Button>
      </div>
      <div className="pt-2">
        {renderContent()}
      </div>
    </Card>
  );
};