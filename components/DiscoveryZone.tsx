
import React from 'react';
import { LightbulbIcon } from './icons/LightbulbIcon';
import { RefreshIcon } from './icons/RefreshIcon';
import { Card } from './common/Card';
import { Button } from './common/Button';

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
            <div key={i} className="h-9 bg-slate-200 rounded-lg w-36 animate-pulse"></div>
          ))}
        </div>
      );
    }

    if (error) {
        return <p className={cn('text-center text-red-800 bg-red-100 p-4 rounded-lg text-sm leading-normal', "text-left")}>{error}</p>
    }

    if (suggestions.length === 0) {
      return <p className="text-sm text-slate-500 leading-normal">提案が見つかりませんでした。更新ボタンで再試行してください。</p>;
    }

    return (
      <>
        <div className="flex flex-wrap gap-3">
          {suggestions.map((suggestion, index) => (
            <Button
              key={index}
              onClick={() => onSuggestionClick(suggestion)}
              variant="discovery"
              size="small"
              aria-label={`${suggestion}で検索する`}
            >
              {suggestion}
            </Button>
          ))}
        </div>
        <p className={cn('text-sm text-slate-600 leading-normal', "text-slate-500 mt-6 text-center")}>
          AIが注目するトレンド分野です。クリックして関連技術を探索してみましょう。
        </p>
      </>
    );
  };
  
  if (!isLoading && suggestions.length === 0 && !error) {
      return null;
  }

  return (
    <Card className="w-full mt-16 p-6 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className={cn('text-[22px] leading-snug font-bold text-slate-800', "flex items-center")}>
          <LightbulbIcon className="w-6 h-6 mr-4 text-amber-400" />
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