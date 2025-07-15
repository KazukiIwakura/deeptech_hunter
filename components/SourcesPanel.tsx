



import React, { useState, useEffect } from 'react';
import type { Source } from '../types';
import { XCircleIcon } from './icons/XCircleIcon';
import { Favicon } from './Favicon';
import { Button } from './common/Button';

const cn = (...classes: (string | undefined | null | false | 0)[]) => classes.filter(Boolean).join(' ');

interface SourcesPanelProps {
  sources: Source[];
  isOpen: boolean;
  onClose: () => void;
}

export const SourcesPanel: React.FC<SourcesPanelProps> = ({ sources, isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 bg-black/30 z-50 animate-fade-in"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sources-panel-title"
    >
      <div 
        className="absolute top-0 right-0 h-full w-full max-w-lg bg-slate-50 shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'slideInFromRight 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards' }}
      >
        <header className="flex items-center justify-between p-4 border-b border-slate-200 bg-white/70 backdrop-blur-sm sticky top-0">
          <h2 id="sources-panel-title" className={cn('text-[22px] leading-snug font-bold text-slate-800', "text-slate-800")}>{`${sources.length}件の情報源`}</h2>
          <Button onClick={onClose} variant="ghost" size="medium" isIconOnly aria-label="閉じる">
            <XCircleIcon className="w-6 h-6" />
          </Button>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <ul className="space-y-4">
            {sources.map((source, index) => {
              const hasRealTitle = source.title && source.domain && source.title.toLowerCase() !== source.domain.toLowerCase();

              return (
                <li key={index} className="bg-white rounded-2xl border border-slate-200/80 transition-all duration-200 overflow-hidden shadow-sm hover:shadow-md hover:border-blue-300">
                  <a href={source.uri} target="_blank" rel="noopener noreferrer" className="block p-4 hover:bg-slate-50/50 transition-colors" title={source.uri}>
                     <div className="flex items-start gap-4">
                        <span className={cn('text-sm text-slate-600 leading-normal', "font-bold text-slate-400 mt-0.5")}>{index + 1}.</span>
                        <div className="flex-grow">
                          <div className="flex items-start gap-4">
                            <Favicon domain={source.domain} className="w-4 h-4 rounded-sm flex-shrink-0 mt-0.5" alt={`${source.domain} favicon`} />
                            <div className="flex-grow">
                                <p className={cn('text-sm text-slate-600 leading-normal', "font-semibold text-slate-800 group-hover:text-blue-600 break-words")}>
                                  {hasRealTitle ? source.title : source.domain}
                                </p>
                                {hasRealTitle && (
                                  <p className={cn('text-sm text-slate-600 leading-normal', "text-slate-500 truncate mt-1")}>
                                    {source.domain}
                                  </p>
                                )}
                            </div>
                          </div>
                          {source.snippet && (
                              <div className="mt-2">
                                <blockquote className={cn('text-sm text-slate-600 leading-relaxed', "border-l-4 border-slate-200 pl-4 ml-8")}>
                                    "{source.snippet}"
                                </blockquote>
                              </div>
                          )}
                        </div>
                     </div>
                  </a>
                </li>
              );
            })}
          </ul>
        </main>
      </div>
      <style>{`
        @keyframes slideInFromRight {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};