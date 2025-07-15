

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
    <div className="w-full max-w-6xl mx-auto px-6 md:px-8 py-12 md:py-16 flex flex-col items-center justify-center min-h-full">
      <div className="w-full text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-6 tracking-tight">
          ディープテックハンター
        </h1>
        <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-12 leading-relaxed">
          未来を創る可能性を秘めた、日本の大学発ディープテックを発掘します。<br />
          AIの提案から、あるいは気になるキーワードで、新たな金脈を探してみましょう。
        </p>
        <div className="max-w-xl mx-auto">
            <SearchForm onSearch={onSearch} isLoading={isSearching} />
        </div>
        <div className="mt-8 p-4 bg-warning-light rounded-lg border border-warning/20 max-w-2xl mx-auto">
          <p className="text-sm text-warning-text flex items-center justify-center">
            <LightbulbIcon className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>AIは大学の公式DBやJST等の公的情報源を参考に、信頼性の高い情報を優先的に探索します。</span>
          </p>
        </div>
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