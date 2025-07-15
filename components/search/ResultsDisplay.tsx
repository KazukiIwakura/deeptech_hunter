

import React from 'react';
import type { DeepTech } from '../../types';
import { TechCard } from './TechCard';
import { LoadingSpinner } from '../common/LoadingSpinner';

const cn = (...classes: (string | undefined | null | false | 0)[]) => classes.filter(Boolean).join(' ');

interface ResultsDisplayProps {
  results: DeepTech[];
  isLoading: boolean;
  error: string | null;
  onDeepDive: (tech: DeepTech) => void;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, isLoading, error, onDeepDive }) => {
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-center text-danger-text bg-danger-light p-4 rounded-lg text-sm leading-normal">{error}</div>;
  }
  
  if (results.length === 0) {
    return (
      <div className={cn('border-l-4 p-6 rounded-2xl', 'bg-neutral-100/70 border-neutral-300 backdrop-blur-sm', "text-center py-16 px-6 border-none")}>
        <h3 className={cn('text-[22px] leading-snug font-bold text-main', "text-main-light")}>該当なし</h3>
        <p className={cn('text-base text-main/90 leading-relaxed', "mt-2 text-main-light")}>このキーワードに一致する国内大学の技術は見つかりませんでした。<br/>別のキーワードで再度お試しください。</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {results.map((tech) => (
          <TechCard 
            key={tech.id} 
            tech={tech}
            onDeepDive={onDeepDive}
          />
        ))}
      </div>
    </div>
  );
};