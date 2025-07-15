

import React from 'react';

const cn = (...classes: (string | undefined | null | false | 0)[]) => classes.filter(Boolean).join(' ');

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 border-4 border-neutral-200 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-t-transparent border-primary rounded-full animate-spin"></div>
      </div>
      <p className={cn('text-lg leading-snug font-bold text-main', "tracking-wide text-main-light mt-6")}>ディープテックを探索中...</p>
      <p className="text-sm text-main-lighter leading-normal">AIが論文や研究データを解析しています</p>
    </div>
  );
};