
import React from 'react';
import type { OverseasStartup } from '../types';
import { StartupCard } from './StartupCard';

const cn = (...classes: (string | undefined | null | false | 0)[]) => classes.filter(Boolean).join(' ');

interface OverseasStartupsProps {
  startups: OverseasStartup[];
  isLoading: boolean;
  error: string | null;
}

const SkeletonLoader: React.FC = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
            <div key={i} className={cn('bg-white/70 backdrop-blur-md border border-slate-200/80 rounded-4xl shadow-sm transition-all duration-300', "p-6 flex flex-col h-full animate-pulse")}>
                <div className="flex-grow">
                    <div className="h-4 bg-slate-200 rounded w-1/3 mb-2"></div>
                    <div className="h-6 bg-slate-200 rounded w-3/4 mb-4"></div>
                    
                    <div className="h-8 bg-slate-200 rounded-full w-2/5 mb-5"></div>
                    
                    <div className="space-y-2 mb-5">
                        <div className="h-3 bg-slate-200 rounded w-full"></div>
                        <div className="h-3 bg-slate-200 rounded w-full"></div>
                        <div className="h-3 bg-slate-200 rounded w-5/6"></div>
                    </div>
                    
                    <div className="mb-5 p-4 bg-slate-50/70 rounded-xl border border-slate-200/60 space-y-3">
                        <div className="h-4 bg-slate-200 rounded w-1/3 mb-3"></div>
                        <div className="h-5 bg-slate-200 rounded w-full"></div>
                        <div className="h-5 bg-slate-200 rounded w-full"></div>
                    </div>

                    <div>
                        <div className="h-4 bg-slate-200 rounded w-1/3 mb-2"></div>
                        <div className="flex flex-wrap gap-2">
                            <div className="h-6 bg-slate-200 rounded-full w-20"></div>
                            <div className="h-6 bg-slate-200 rounded-full w-24"></div>
                            <div className="h-6 bg-slate-200 rounded-full w-16"></div>
                        </div>
                    </div>
                </div>
            </div>
        ))}
    </div>
);


export const OverseasStartups: React.FC<OverseasStartupsProps> = ({ startups, isLoading, error }) => {
    if (isLoading) {
        return <SkeletonLoader />;
    }
    if (error) {
        return <p className={cn('text-center text-red-800 bg-red-100 p-4 rounded-lg text-sm leading-normal', "text-left")}>{error}</p>;
    }
    if (startups.length > 0) {
        return (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                {startups.map((startup) => (
                    <StartupCard key={startup.startupName} startup={startup} />
                ))}
            </div>
        );
    }
    // Case when !isLoading, !error, and no data
    return (
        <div className={cn('border-l-4 p-6 rounded-2xl', 'bg-slate-100/70 border-slate-300 backdrop-blur-sm', "text-center p-8 border-none")}>
            <p className="font-bold text-slate-700">関連する海外スタートアップは見つかりませんでした。</p>
            <p className={cn('text-sm text-slate-500 leading-normal', "mt-1")}>まだ市場が形成されていない、非常に新しい分野の可能性があります。</p>
        </div>
    );
};