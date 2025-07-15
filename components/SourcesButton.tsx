
import React from 'react';
import type { Source } from '../types';
import { Favicon } from './Favicon';

const cn = (...classes: (string | undefined | null | false | 0)[]) => classes.filter(Boolean).join(' ');

interface SourcesButtonProps {
  sources: Source[];
  onClick: () => void;
}

export const SourcesButton: React.FC<SourcesButtonProps> = ({ sources, onClick }) => {
  const count = sources.length;
  if (count === 0) return null;

  const visibleFavicons = sources.slice(0, 4);

  return (
    <button
      onClick={onClick}
      className={cn("inline-flex items-center gap-2 pl-2 pr-4 py-2 bg-white border border-slate-200/80 rounded-full shadow-sm font-medium text-slate-700 hover:bg-slate-100/70 hover:border-slate-300 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500", 'text-sm text-slate-600 leading-normal')}
      aria-label={`${count}件の情報源を表示`}
    >
      <div className="flex items-center -space-x-4">
        {visibleFavicons.map((source, index) => (
            <Favicon 
              key={`${source.uri}-${index}`} 
              domain={source.domain} 
              className="w-8 h-8 rounded-full ring-2 ring-white"
            />
        ))}
      </div>
      <span className="font-semibold">{`${count}件の情報源`}</span>
    </button>
  );
};