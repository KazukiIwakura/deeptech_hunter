

import React from 'react';
import type { DeepTech } from '../../types';
import { MicroscopeIcon } from '../icons/MicroscopeIcon';
import { GlobeIcon } from '../icons/GlobeIcon';
import { TargetIcon } from '../icons/TargetIcon';
import { MountainIcon } from '../icons/MountainIcon';
import { LinkIcon } from '../icons/LinkIcon';
import { Card } from '../common/Card';
import { Button } from '../common/Button';

const cn = (...classes: (string | undefined | null | false | 0)[]) => classes.filter(Boolean).join(' ');

interface TechCardProps {
  tech: DeepTech;
  onDeepDive: (tech: DeepTech) => void;
}

const Tag: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-block bg-primary-lighter text-primary-text text-sm font-bold px-2 py-1 rounded-full leading-none">
    {children}
  </span>
);

const RiskIndicator: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: 'High' | 'Medium' | 'Low';
}> = ({ icon, label, value }) => {
  const valueClasses = {
    High: cn('text-danger-text', 'bg-danger-light'),
    Medium: cn('text-warning-text', 'bg-warning-light'),
    Low: cn('text-success-text', 'bg-success-light'),
  };
  const impactValueClasses = {
    High: cn('text-success-text', 'bg-success-light'),
    Medium: cn('text-warning-text', 'bg-warning-light'),
    Low: cn('text-danger-text', 'bg-danger-light'),
  };
  const isImpact = label === 'インパクト';
  const selectedClass = isImpact ? impactValueClasses[value] : valueClasses[value];

  return (
    <div className="flex items-center justify-between text-sm">
        <div className={cn("flex items-center text-main-light", 'text-sm text-main-light leading-normal')}>
            {icon}
            <span className="font-normal mr-2">{label}</span>
        </div>
        <span className={cn('px-2 py-0.5 rounded-full font-bold', selectedClass, 'text-sm text-main-light leading-normal')}>
            {value}
        </span>
    </div>
  );
};


export const TechCard: React.FC<TechCardProps> = ({ tech, onDeepDive }) => {

  const handleGoogleSearch = (e: React.MouseEvent) => {
    e.stopPropagation();
    const query = `${tech.university} ${tech.techName}`;
    const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className="p-6 flex flex-col h-full hover:border-primary/80 hover:shadow-lg hover:-translate-y-1 animate-fade-in">
      <div className="flex-grow">
        <p className={cn('text-sm text-main-light leading-normal', "text-primary font-bold")}>{tech.university}</p>
        <h3 className={cn('text-[22px] leading-snug font-bold text-main', "text-main mt-1 mb-4")}>{tech.techName}</h3>
        
        <p className={cn('text-base text-main-light/90 leading-relaxed', "mb-8")}>{tech.summary}</p>

        <div className="mb-8 p-4 bg-neutral-50/70 rounded-2xl border border-neutral-200/60 space-y-4">
            <h4 className={cn('text-base leading-snug font-bold text-main', "text-main-light")}>AI初期評価</h4>
            <RiskIndicator icon={<GlobeIcon className="w-4 h-4 mr-2 text-neutral-500"/>} label="インパクト" value={tech.potentialImpact} />
            <RiskIndicator icon={<TargetIcon className="w-4 h-4 mr-2 text-neutral-500"/>} label="市場リスク" value={tech.marketRisk} />
            <RiskIndicator icon={<MountainIcon className="w-4 h-4 mr-2 text-neutral-500"/>} label="技術リスク" value={tech.techRisk} />
        </div>

        <div className="mb-8">
            <h4 className={cn('text-base leading-snug font-bold text-main', "text-main-light mb-2")}>想定される応用分野</h4>
            <div className="flex flex-wrap gap-2">
            {tech.potentialApplications.slice(0, 4).map((app, index) => (
                <Tag key={index}>{app}</Tag>
            ))}
            {tech.potentialApplications.length > 4 && (
              <span className="inline-block bg-primary-lighter text-primary-text text-sm font-bold px-2 py-1 rounded-full leading-none">+{tech.potentialApplications.length - 4}</span>
            )}
            </div>
        </div>
      </div>
      
      <div className="mt-auto pt-4 border-t border-neutral-200/60">
        <div className="space-y-2">
          <Button
              onClick={() => onDeepDive(tech)}
              variant="secondary"
              size="small"
              fullWidth
              aria-label={`${tech.techName}をAIで詳細分析する`}
          >
              <MicroscopeIcon className="w-4 h-4 mr-2" />
              詳細分析する
          </Button>
          <Button
            onClick={handleGoogleSearch}
            variant="tertiary"
            size="small"
            fullWidth
            aria-label={`${tech.university} ${tech.techName} をGoogle検索する`}
          >
            <LinkIcon className="w-4 h-4 mr-2" />
            Googleで検索する
          </Button>
        </div>
      </div>
    </Card>
  );
};