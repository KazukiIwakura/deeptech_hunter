

import React, { useState, useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { TechExplanation } from '../components/search/TechExplanation';
import { OverseasStartups } from '../components/search/OverseasStartups';
import { ResultsDisplay } from '../components/search/ResultsDisplay';
import type { Source } from '../types';
import { ArrowUpIcon } from '../components/icons/ArrowUpIcon';
import { ArrowDownIcon } from '../components/icons/ArrowDownIcon';
import { SourcesPanel } from '../components/ui/SourcesPanel';
import { SourcesButton } from '../components/ui/SourcesButton';
import { Button } from '../components/common/Button';

const cn = (...classes: (string | undefined | null | false | 0)[]) => classes.filter(Boolean).join(' ');

type DomesticSortKey = 'potentialImpact' | 'marketRisk' | 'techRisk';
type OverseasSortKey = 'startupName' | 'funding';
type SortDirection = 'asc' | 'desc';

const impactScore: Record<'High' | 'Medium' | 'Low', number> = { High: 3, Medium: 2, Low: 1 };
const riskScore: Record<'High' | 'Medium' | 'Low', number> = { High: 1, Medium: 2, Low: 3 }; // Lower risk = higher score

const parseFunding = (fundingStr: string): number => {
    if (!fundingStr || fundingStr.toLowerCase().includes('不明') || fundingStr.toLowerCase().includes('非公開')) {
        return 0;
    }

    let normalizedStr = fundingStr.replace(/[約,]/g, '');

    let currencyMultiplier = 1;
    if (normalizedStr.includes('ユーロ')) currencyMultiplier = 1.1;
    else if (normalizedStr.includes('ポンド')) currencyMultiplier = 1.25;
    normalizedStr = normalizedStr.replace(/ドル|ユーロ|ポンド|円/g, '');

    let totalValue = 0;
    const okuMatch = normalizedStr.match(/([\d.]+)\s*億/);
    if (okuMatch) {
        totalValue += parseFloat(okuMatch[1]) * 1e8;
        normalizedStr = normalizedStr.replace(okuMatch[0], '');
    }

    const manMatch = normalizedStr.match(/([\d.]+)\s*万/);
    if (manMatch) {
        totalValue += parseFloat(manMatch[1]) * 1e4;
        normalizedStr = normalizedStr.replace(manMatch[0], '');
    }
    
    const remainingValue = parseFloat(normalizedStr);
    if (!isNaN(remainingValue)) {
        totalValue += remainingValue;
    }
    
    return totalValue * currencyMultiplier;
};


export const ResultsPage: React.FC = () => {
  const { search, handleNavigateToDeepDive } = useApp();
  const {
    searchQuery,
    techExplanation,
    isExplanationLoading,
    explanationError,
    overseasStartups,
    overseasStartupsSources,
    isOverseasStartupsLoading,
    overseasStartupsError,
    results,
    sources,
    isSearching,
    searchError,
    isSearchingMore,
    canLoadMore,
    noMoreResultsMessage,
    handleSearchMore,
  } = search;

  const [activeTab, setActiveTab] = useState<'domestic' | 'overseas'>('domestic');
  const [domesticSortConfig, setDomesticSortConfig] = useState<{ key: DomesticSortKey; direction: SortDirection }>({ key: 'potentialImpact', direction: 'desc' });
  const [overseasSortConfig, setOverseasSortConfig] = useState<{ key: OverseasSortKey; direction: SortDirection }>({ key: 'funding', direction: 'desc' });

  const [sourcesToShow, setSourcesToShow] = useState<Source[]>([]);
  const [isSourcesPanelOpen, setIsSourcesPanelOpen] = useState(false);

  const handleShowSources = (sourcesToDisplay: Source[]) => {
    setSourcesToShow(sourcesToDisplay);
    setIsSourcesPanelOpen(true);
  };

  const sortedResults = useMemo(() => {
    const sorted = [...results];
    const { key, direction } = domesticSortConfig;
    
    sorted.sort((a, b) => {
        let valA: number;
        let valB: number;

        if (key === 'potentialImpact') {
            valA = impactScore[a.potentialImpact];
            valB = impactScore[b.potentialImpact];
        } else { // marketRisk or techRisk
            valA = riskScore[a[key]];
            valB = riskScore[b[key]];
        }

        if (valA < valB) return direction === 'asc' ? -1 : 1;
        if (valA > valB) return direction === 'asc' ? 1 : -1;
        return 0;
    });

    return sorted;
  }, [results, domesticSortConfig]);
  
  const sortedOverseasStartups = useMemo(() => {
    const sorted = [...overseasStartups];
    const { key, direction } = overseasSortConfig;
    
    sorted.sort((a, b) => {
        if (key === 'funding') {
            const valA = parseFunding(a.funding);
            const valB = parseFunding(b.funding);
            if (valA !== valB) {
                return direction === 'asc' ? valA - valB : valB - valA;
            }
            return a.startupName.localeCompare(b.startupName);
        }
        
        const valA = a.startupName || '';
        const valB = b.startupName || '';
        
        const comparison = valA.localeCompare(valB);
        return direction === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [overseasStartups, overseasSortConfig]);

  const handleDomesticSort = (key: DomesticSortKey) => {
    setDomesticSortConfig(prev => {
        if (prev.key === key) {
            return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
        }
        // Impact defaults to desc, risks default to asc (best first)
        return { key, direction: key === 'potentialImpact' ? 'desc' : 'asc' };
    });
  };
  
  const handleOverseasSort = (key: OverseasSortKey) => {
    setOverseasSortConfig(prev => {
      if (prev.key === key) {
          return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: key === 'funding' ? 'desc' : 'asc' };
    });
  };

  const SortButton: React.FC<{
    sortKey: string;
    label: string;
    config: { key: string; direction: SortDirection };
    onSort: (key: any) => void;
  }> = ({ sortKey, label, config, onSort }) => {
    const isActive = config.key === sortKey;
    const direction = isActive ? config.direction : 'asc';
    const Icon = direction === 'asc' ? ArrowUpIcon : ArrowDownIcon;

    return (
        <button
            onClick={() => onSort(sortKey)}
            className={cn('flex items-center space-x-2 px-4 py-2 text-sm rounded-lg transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-main leading-none', isActive ? 'bg-main text-white font-bold shadow-sm' : 'bg-transparent text-main-light hover:bg-neutral-200/80 font-normal')}
        >
            <span>{label}</span>
            {isActive && <Icon className="w-4 h-4 ml-1" />}
        </button>
    );
  };


  const TabButton: React.FC<{
    isActive: boolean;
    onClick: () => void;
    title: string;
    count: number;
    isLoading: boolean;
  }> = ({ isActive, onClick, title, count, isLoading }) => (
    <button
      onClick={onClick}
      className={cn('group inline-flex items-center py-4 px-1 border-b-2 font-bold text-base transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary leading-none', isActive ? 'border-primary text-primary' : 'border-transparent text-main-lighter hover:text-main hover:border-neutral-300')}
      aria-current={isActive ? 'page' : undefined}
      role="tab"
      aria-selected={isActive}
    >
      {title}
      {(!isLoading || count > 0) && (
        <span className={cn('ml-2 text-sm font-bold py-0.5 px-2 rounded-full transition-colors duration-200', isActive ? 'bg-primary-lighter text-primary' : 'bg-neutral-200 text-main-light group-hover:bg-neutral-300')}>
          {count}
        </span>
      )}
      {isLoading && count === 0 && (
         <div className={cn('ml-2 text-sm font-bold py-0.5 px-2 rounded-full transition-colors duration-200', 'bg-neutral-200 text-main-light group-hover:bg-neutral-300', "relative flex justify-center items-center w-5 h-5 p-0")}>
            <div className="w-3 h-3 border-2 border-neutral-500 border-t-transparent rounded-full animate-spin"></div>
         </div>
      )}
    </button>
  );

  return (
    <>
      <div className={cn('w-full max-w-6xl mx-auto p-4 sm:p-6 md:p-8', "animate-fade-in")}>
          <div className="border-b border-neutral-200 pb-6 mb-12">
              <p className={cn('text-sm text-main-lighter leading-normal', "mb-1")}>検索キーワード</p>
              <h1 className={cn('text-[40px] leading-tight md:text-[48px] md:leading-tight font-bold tracking-tight text-main', "mt-1")}>{searchQuery}</h1>
          </div>
          <TechExplanation
              searchQuery={searchQuery}
              explanation={techExplanation}
              isLoading={isExplanationLoading}
              error={explanationError}
          />
          
          <div className="mt-16">
            <div className={cn('border-b border-neutral-200')}>
                <nav className={cn('-mb-px flex flex-wrap gap-x-6 gap-y-2')} aria-label="探索結果種別">
                    <TabButton
                    isActive={activeTab === 'domestic'}
                    onClick={() => setActiveTab('domestic')}
                    title="国内大学の技術シーズ"
                    count={results.length}
                    isLoading={isSearching && results.length === 0}
                    />
                    <TabButton
                    isActive={activeTab === 'overseas'}
                    onClick={() => setActiveTab('overseas')}
                    title="海外注目スタートアップ"
                    count={overseasStartups.length}
                    isLoading={isOverseasStartupsLoading}
                    />
              </nav>
            </div>
            <div className="pt-10">
                {activeTab === 'domestic' && (
                    <div className="animate-fade-in" role="tabpanel">
                        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                            <div className="flex items-center space-x-2 p-1 bg-neutral-100 rounded-lg">
                                <SortButton sortKey="potentialImpact" label="インパクト" config={domesticSortConfig} onSort={handleDomesticSort} />
                                <SortButton sortKey="marketRisk" label="市場リスク" config={domesticSortConfig} onSort={handleDomesticSort} />
                                <SortButton sortKey="techRisk" label="技術リスク" config={domesticSortConfig} onSort={handleDomesticSort} />
                            </div>
                            <div className="flex items-center gap-2">
                                <SourcesButton sources={sources} onClick={() => handleShowSources(sources)} />
                            </div>
                        </div>
                        <ResultsDisplay 
                            results={sortedResults}
                            isLoading={isSearching && results.length === 0}
                            error={searchError} 
                            onDeepDive={handleNavigateToDeepDive}
                        />
                    </div>
                )}
                {activeTab === 'overseas' && (
                    <div className="animate-fade-in" role="tabpanel">
                        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                             <div className="flex items-center space-x-2 p-1 bg-neutral-100 rounded-lg">
                                <SortButton sortKey="startupName" label="企業名" config={overseasSortConfig} onSort={handleOverseasSort} />
                                <SortButton sortKey="funding" label="資金調達額" config={overseasSortConfig} onSort={handleOverseasSort} />
                            </div>
                            <div className="flex items-center gap-2">
                                <SourcesButton sources={overseasStartupsSources} onClick={() => handleShowSources(overseasStartupsSources)} />
                            </div>
                        </div>
                        <OverseasStartups
                            startups={sortedOverseasStartups}
                            isLoading={isOverseasStartupsLoading}
                            error={overseasStartupsError}
                        />
                    </div>
                )}
            </div>
          </div>


          <div className="mt-16 text-center">
            {canLoadMore ? (
              <Button
                  onClick={handleSearchMore}
                  disabled={isSearchingMore || isSearching}
                  variant="primary"
                  size="medium"
                  className="w-full max-w-xs mx-auto"
              >
                  {isSearchingMore ? (
                  <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      追加調査中...
                  </>
                  ) : (
                  results.length === 0 ? '別の方法で調査する' : 'さらに調査する'
                  )}
              </Button>
            ) : (
              noMoreResultsMessage && (
                  <div className={cn('border-l-4 p-6 rounded-2xl', 'bg-neutral-100/70 border-neutral-300 backdrop-blur-sm', "inline-block p-4 border-none")}>
                      <p>{noMoreResultsMessage}</p>
                  </div>
              )
            )}
          </div>
      </div>
      <SourcesPanel 
        sources={sourcesToShow}
        isOpen={isSourcesPanelOpen}
        onClose={() => setIsSourcesPanelOpen(false)}
      />
    </>
  );
};