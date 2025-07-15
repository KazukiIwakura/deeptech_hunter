


import React from 'react';
import type { Source } from '../types';
import { LinkIcon } from './icons/LinkIcon';

const cn = (...classes: (string | undefined | null | false | 0)[]) => classes.filter(Boolean).join(' ');

interface SourcesListProps {
  sources: Source[];
}

export const SourcesList: React.FC<SourcesListProps> = ({ sources }) => {
  if (sources.length === 0) {
    return null;
  }

  return (
    <div className={cn('border-l-4 p-6 rounded-2xl', 'bg-neutral-100/70 border-neutral-300 backdrop-blur-sm', "mt-12 p-6")}>
      <h3 className={cn('text-[22px] leading-snug font-bold text-main', "mb-2")}>情報源</h3>
      <p className={cn('text-sm text-main-lighter leading-normal', "mb-6")}>この結果は以下の情報源に基づいています。正確性については各情報源をご確認ください。</p>
      <ul className="space-y-4">
        {sources.map((source, index) => (
          <li key={index} className="flex items-start group">
            <LinkIcon className="w-4 h-4 text-neutral-400 group-hover:text-primary mr-4 mt-1 flex-shrink-0 transition-colors" />
            <div>
              <a
                href={source.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base text-primary hover:text-primary-hover hover:underline transition-colors duration-200 font-bold"
              >
                {source.title || 'タイトルなし'}
              </a>
               <p className={cn('text-sm text-main-light leading-normal', "text-main-lighter break-all mt-0.5")}>{source.uri}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};