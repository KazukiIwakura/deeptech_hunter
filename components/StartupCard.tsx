



import React from 'react';
import type { OverseasStartup } from '../types';
import { DollarSignIcon } from './icons/DollarSignIcon';
import { LinkIcon } from './icons/LinkIcon';
import { BriefcaseIcon } from './icons/BriefcaseIcon';
import { VialIcon } from './icons/VialIcon';
import { TrendingUpIcon } from './icons/TrendingUpIcon';
import { UsersIcon } from './icons/UsersIcon';
import { Card } from './common/Card';
import { Button } from './common/Button';

const cn = (...classes: (string | undefined | null | false | 0)[]) => classes.filter(Boolean).join(' ');

interface StartupCardProps {
  startup: OverseasStartup;
}

const Tag: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className={cn('inline-block bg-blue-100 text-blue-800 text-sm font-bold px-2 py-1 rounded-full leading-none', 'bg-slate-200/70 text-slate-700 font-normal')}>
    {children}
  </span>
);

const InfoItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  value?: string | null;
}> = ({ icon, label, value }) => {
  if (!value || value === '不明') return null;

  return (
    <div className={cn("flex items-start justify-between", 'text-sm text-slate-600 leading-normal')}>
        <div className="flex items-center text-slate-600 flex-shrink-0 pr-4">
            {icon}
            <span className="font-normal">{label}</span>
        </div>
        <span className="text-right text-slate-800 font-normal break-words">{value}</span>
    </div>
  );
};

export const StartupCard: React.FC<StartupCardProps> = ({ startup }) => {
  
  const handleGoogleSearch = (e: React.MouseEvent) => {
    e.stopPropagation();
    const query = startup.startupName;
    const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className="p-6 flex flex-col h-full hover:border-blue-400/80 hover:shadow-lg hover:-translate-y-1 animate-fade-in">
      <div className="flex-grow">
        <p className={cn('text-sm text-slate-600 leading-normal', "text-blue-600 font-bold")}>{startup.country}</p>
        <h3 className={cn('text-[22px] leading-snug font-bold text-slate-800', "text-slate-900 mt-1 mb-4")}>{startup.startupName}</h3>
        
        <div className="flex items-center gap-2 self-start mb-4">
            {startup.funding && startup.funding.toLowerCase() !== '非公開' && startup.funding.toLowerCase() !== '不明' && (
                <div className="flex items-center text-base font-bold text-emerald-800 bg-emerald-100 px-4 py-2 rounded-lg leading-none">
                    <DollarSignIcon className="w-4 h-4 mr-2" />
                    <span>{startup.funding}</span>
                </div>
            )}
            {startup.fundingSourceUrl && (
                <a
                    href={startup.fundingSourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn('p-2 rounded-full text-slate-500 hover:bg-slate-200/70 hover:text-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 disabled:opacity-50 disabled:cursor-not-allowed', "bg-white border border-slate-200/80 shadow-sm w-8 h-8")}
                    aria-label="資金調達の情報源"
                    title="資金調達の情報源"
                    onClick={(e) => e.stopPropagation()}
                >
                    <LinkIcon className="w-4 h-4" />
                </a>
            )}
        </div>

        <p className={cn('text-base text-slate-700/90 leading-relaxed', "mb-8")}>{startup.summary}</p>

        <div className="mb-8 p-4 bg-slate-50/70 rounded-2xl border border-slate-200/60 space-y-4">
            <h4 className={cn('text-base leading-snug font-bold text-slate-800', "text-slate-700")}>VC's Eye View</h4>
            <InfoItem icon={<BriefcaseIcon className="w-4 h-4 mr-2 text-slate-500"/>} label="Business Model" value={startup.business_model} />
            <InfoItem icon={<VialIcon className="w-4 h-4 mr-2 text-slate-500"/>} label="Core Technology" value={startup.technology_summary} />
            <InfoItem icon={<TrendingUpIcon className="w-4 h-4 mr-2 text-slate-500"/>} label="Latest Milestone" value={startup.latest_milestone} />
        </div>

        {startup.key_investors && startup.key_investors.length > 0 && (
          <div className="mb-8">
              <h4 className={cn('text-base leading-snug font-bold text-slate-800', "text-slate-700 mb-2 flex items-center")}>
                <UsersIcon className="w-4 h-4 mr-2 text-slate-500"/>
                Key Investors
              </h4>
              <div className="flex flex-wrap gap-2 pt-1">
                  {startup.key_investors.map((investor, i) => (
                      <Tag key={i}>{investor}</Tag>
                  ))}
              </div>
          </div>
        )}
      </div>
      <div className="mt-auto pt-4 border-t border-slate-200/60">
        <div className="space-y-2">
          <Button
            onClick={handleGoogleSearch}
            variant="tertiary"
            size="small"
            fullWidth
            aria-label={`${startup.startupName} をGoogle検索する`}
          >
            <LinkIcon className="w-4 h-4 mr-2" />
            Googleで検索する
          </Button>
        </div>
      </div>
    </Card>
  );
};
