

import React from 'react';
import { MarkdownRenderer } from './MarkdownRenderer';
import { LightbulbIcon } from './icons/LightbulbIcon';
import { TrendingUpIcon } from './icons/TrendingUpIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { BrainIcon } from './icons/BrainIcon';
import type { TechExplanationData } from '../types';

const cn = (...classes: (string | undefined | null | false | 0)[]) => classes.filter(Boolean).join(' ');

interface TechExplanationProps {
  searchQuery: string;
  explanation: TechExplanationData | null;
  isLoading: boolean;
  error: string | null;
}

const ExplanationSection: React.FC<{ icon: React.ReactNode; title: string; content: string }> = ({ icon, title, content }) => (
    <div>
        <h3 className={cn('text-base leading-snug font-bold text-slate-800', "flex items-center text-blue-800 mb-2")}>
            {icon}
            {title}
        </h3>
        <div className="pl-8">
            <MarkdownRenderer content={content} className="text-base text-blue-900/90 leading-7" />
        </div>
    </div>
);

const SkeletonLoader: React.FC = () => (
    <div className="space-y-8">
        {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
                <div className="flex items-center">
                    <div className="w-6 h-6 bg-slate-200 rounded-full mr-2"></div>
                    <div className="h-5 bg-slate-200 rounded w-1/3"></div>
                </div>
                <div className="pl-8 mt-2 space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-full"></div>
                    <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                </div>
            </div>
        ))}
    </div>
);

export const TechExplanation: React.FC<TechExplanationProps> = ({ searchQuery, explanation, isLoading, error }) => {
  const renderContent = () => {
    if (isLoading) {
      return <SkeletonLoader />;
    }

    if (error) {
      return <p className={cn('text-center text-red-800 bg-red-100 p-4 rounded-lg text-sm leading-normal', "text-left")}>{error}</p>;
    }

    if (!explanation) {
        return (
            <p className="text-sm text-slate-500 leading-normal">
                この技術に関する解説を生成できませんでした。
            </p>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <ExplanationSection 
                icon={<LightbulbIcon className="w-6 h-6 mr-2 text-amber-400" />}
                title="これは何か？"
                content={explanation.what_is_it}
            />
            <ExplanationSection 
                icon={<TrendingUpIcon className="w-6 h-6 mr-2 text-emerald-500" />}
                title="なぜ重要か？"
                content={explanation.why_is_it_important}
            />
             <ExplanationSection 
                icon={<SparklesIcon className="w-6 h-6 mr-2 text-fuchsia-500" />}
                title="どんな未来を作るか？"
                content={explanation.what_future_it_creates}
            />
        </div>
    );
  };
  
  if (isLoading || error || explanation) {
      return (
        <div className={cn('border-l-4 p-6 rounded-2xl', 'bg-blue-50/70 border-blue-400 backdrop-blur-sm', "mb-8 p-6")}>
            <h2 className={cn('text-[28px] leading-snug font-bold text-slate-800 flex items-center', "text-blue-900 mb-6")}>
                <BrainIcon className="w-6 h-6 mr-4 text-blue-500 flex-shrink-0" />
                <span>「{searchQuery}」の解説</span>
            </h2>
            <div className="pl-10">
                {renderContent()}
            </div>
        </div>
      );
  }

  return null;
};