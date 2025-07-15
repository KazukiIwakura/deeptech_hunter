

import React from 'react';
import { useApp } from '../contexts/AppContext';
import { SearchForm } from '../components/search/SearchForm';
import { DiscoveryZone } from '../components/search/DiscoveryZone';
import { LightbulbIcon } from '../components/icons/LightbulbIcon';

const cn = (...classes: (string | undefined | null | false | 0)[]) => classes.filter(Boolean).join(' ');

interface HomePageProps {
  onSearch: (query: string) => void;
  isSearching: boolean;
  onSuggestionClick: (query: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onSearch,
  isSearching,
  onSuggestionClick,
}) => {
  const { appShell, fetchDiscoverySuggestions } = useApp();
  const { discoverySuggestions, isDiscoveryLoading, discoveryError } = appShell;

  return (
    <div className={cn('w-full max-w-6xl mx-auto p-4 sm:p-6 md:p-8', "flex flex-col items-center justify-center min-h-full py-12 md:py-16")}>
      <div className="w-full text-center">
        <h1 className={cn('text-[40px] leading-tight md:text-[48px] md:leading-tight font-bold tracking-tight text-main', "mb-4")}>ディープテックハンター</h1>
        <p className={cn('text-lg leading-snug font-bold text-main', "font-normal text-main-light max-w-2xl mx-auto mb-12", 'text-base text-main-light/90 leading-relaxed')}>
            未来を創る可能性を秘めた、日本の大学発ディープテックを発掘します。
            AIの提案から、あるいは気になるキーワードで、新たな金脈を探してみましょう。
        </p>
        <div className="max-w-xl mx-auto">
            <SearchForm onSearch={onSearch} isLoading={isSearching} />
        </div>
        <p className={cn('text-sm text-main-lighter leading-normal', "text-center mt-6 flex items-center justify-center")}>
          <LightbulbIcon className="w-4 h-4 mr-2 text-warning" />
          <span>AIは大学の公式DBやJST等の公的情報源を参考に、信頼性の高い情報を優先的に探索します。</span>
        </p>
      </div>

      <DiscoveryZone 
          suggestions={discoverySuggestions}
          isLoading={isDiscoveryLoading}
          error={discoveryError}
          onSuggestionClick={onSuggestionClick}
          onRefresh={fetchDiscoverySuggestions}
      />
    </div>
  );
};