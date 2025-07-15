

import React from 'react';
import { MarkdownRenderer } from '../common/MarkdownRenderer';
import { LightbulbIcon } from '../icons/LightbulbIcon';
import { TrendingUpIcon } from '../icons/TrendingUpIcon';
import { SparklesIcon } from '../icons/SparklesIcon';
import { BrainIcon } from '../icons/BrainIcon';
import type { TechExplanationData } from '../../types';

const cn = (...classes: (string | undefined | null | false | 0)[]) => classes.filter(Boolean).join(' ');

interface TechExplanationProps {
  searchQuery: string;
  explanation: TechExplanationData | null;
  isLoading: boolean;
  error: string | null;
}

const ExplanationSection: React.FC<{ icon: React.ReactNode; title: string; content: string }> = ({ icon, title, content }) => (
    <div>
        <h3 className={cn('text-base leading-snug font-bold text-main', "flex items-center text-primary-text mb-2")}>
            {icon}
            {title}
        </h3>
        <div className="pl-8">
            <MarkdownRenderer content={content} className="text-base text-primary-text/90 leading-7" />
        </div>
    </div>
);

const SkeletonLoader: React.FC = () => (
    <div className="space-y-8">
        {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
                <div className="flex items-center">
                    <div className="w-6 h-6 bg-neutral-200 rounded-full mr-2"></div>
                    <div className="h-5 bg-neutral-200 rounded w-1/3"></div>
                </div>
                <div className="pl-8 mt-2 space-y-2">
                    <div className="h-4 bg-neutral-200 rounded w-full"></div>
                    <div className="h-4 bg-neutral-200 rounded w-5/6"></div>
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
      return <p className={cn('text-center text-danger-text bg-danger-light p-4 rounded-lg text-sm leading-normal', "text-left")}>{error}</p>;
    }

    if (!explanation) {
        return (
            <p className="text-sm text-main-lighter leading-normal">
                この技術に関する解説を生成できませんでした。
            </p>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <ExplanationSection 
                icon={<LightbulbIcon className="w-6 h-6 mr-2 text-warning" />}
                title="これは何か？"
                content={explanation.what_is_it}
            />
            <ExplanationSection 
                icon={<TrendingUpIcon className="w-6 h-6 mr-2 text-success" />}
                title="なぜ重要か？"
                content={explanation.why_is_it_important}
            />
             <ExplanationSection 
                icon={<SparklesIcon className="w-6 h-6 mr-2 text-accent" />}
                title="どんな未来を作るか？"
                content={explanation.what_future_it_creates}
            />
        </div>
    );
  };
  
  if (isLoading || error || explanation) {
      return (
        <div className={cn('border-l-4 p-6', 'bg-primary-lighter/70 border-primary backdrop-blur-sm', "mb-8 p-6")}>
            <h2 className={cn('text-[28px] leading-snug font-bold text-main flex items-center', "text-primary-text mb-6")}>
                <BrainIcon className="w-6 h-6 mr-4 text-primary flex-shrink-0" />
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
