


import React from 'react';
import { MarkdownRenderer } from '../common/MarkdownRenderer';
import { BrainIcon } from '../icons/BrainIcon';
import { GlobeIcon } from '../icons/GlobeIcon';
import { TargetIcon } from '../icons/TargetIcon';
import { MountainIcon } from '../icons/MountainIcon';
import type { SummarySectionData, PotentialImpactData, MarketRiskData, TechRiskData } from '../../types';

const cn = (...classes: (string | undefined | null | false | 0)[]) => classes.filter(Boolean).join(' ');

const getIconForTitle = (title: string): React.ReactNode => {
    const className = "w-6 h-6 mr-4 text-primary flex-shrink-0";
    if (title.includes('総論')) return <BrainIcon className={className} />;
    if (title.includes('ポテンシャルインパクト')) return <GlobeIcon className={className} />;
    if (title.includes('市場リスク')) return <TargetIcon className={className} />;
    if (title.includes('技術リスク')) return <MountainIcon className={className} />;
    return <BrainIcon className={className} />; // Fallback
};

const sectionConfig = {
    '2. ポテンシャルインパクトの評価（想定利益）': [
        { title: '解決する課題と市場規模', key: 'problemAndMarketSize' as keyof PotentialImpactData },
        { title: '独占的可能性', key: 'monopolyPotential' as keyof PotentialImpactData },
        { title: '利益創出モデル', key: 'profitModel' as keyof PotentialImpactData },
    ],
    '3. 市場リスクの評価（P(事業成功|製品供給成功)）': [
        { title: '顧客のペインの深さ', key: 'customerPain' as keyof MarketRiskData },
        { title: '競合・代替品との比較', key: 'competition' as keyof MarketRiskData },
        { title: '事業化の障壁', key: 'businessBarriers' as keyof MarketRiskData },
    ],
    '4. 技術リスクの評価（P(製品供給成功)）': [
        { title: '技術的挑戦度', key: 'technicalChallenge' as keyof TechRiskData },
        { title: 'TRLと実績', key: 'trlAndTrackRecord' as keyof TechRiskData },
        { title: '知的財産（IP）', key: 'ipPortfolio' as keyof TechRiskData },
    ],
};
type SectionTitle = keyof typeof sectionConfig;

const SubSection: React.FC<{ title: string; content: string }> = ({ title, content }) => (
    <div className="mb-6 last:mb-0">
        <h3 className={cn('text-base leading-snug font-bold text-main', 'mb-2')}>{title}</h3>
        <MarkdownRenderer content={content} className="text-base text-main-light/90 leading-7" />
    </div>
);


interface AnalysisSectionProps {
    data?: SummarySectionData | PotentialImpactData | MarketRiskData | TechRiskData | null;
    titleOverride: string;
    isPrimary?: boolean;
}

export const AnalysisSection: React.FC<AnalysisSectionProps> = ({ data, titleOverride, isPrimary = false }) => {
    if (!data) {
        return null;
    }

    if (isPrimary) {
        const content = (data as SummarySectionData).content;
        if (!content) return null;

        return (
            <div className={cn('border-l-4 p-6', 'bg-primary-lighter/70 border-primary backdrop-blur-sm', "mb-12")}>
                <h2 className={cn('text-[22px] leading-snug font-bold text-main', "mb-4 flex items-center")}>
                    {getIconForTitle(titleOverride)}
                    <span>{titleOverride}</span>
                </h2>
                <div className="pl-10">
                    <MarkdownRenderer content={content} className="text-base text-primary-text/90 leading-7"/>
                </div>
            </div>
        );
    }
    
    const config = sectionConfig[titleOverride as SectionTitle];
    if (!config) return null;

    return (
        <div>
            <h2 className={cn('text-[22px] leading-snug font-bold text-main', "mb-4 flex items-center border-b border-neutral-200 pb-5")}>
                {getIconForTitle(titleOverride)}
                <span>{titleOverride}</span>
            </h2>
            <div className="pl-10 pt-8">
                {config.map(item => {
                    const content = (data as any)[item.key];
                    return content ? <SubSection key={item.key} title={item.title} content={content} /> : null;
                })}
            </div>
        </div>
    );
};