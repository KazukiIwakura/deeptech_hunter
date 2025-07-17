


import React, { useState } from 'react';
import type { DeepTech } from '../types';
import { useApp } from '../contexts/AppContext';
import { SourcesButton } from '../components/ui/SourcesButton';
import { SourcesPanel } from '../components/ui/SourcesPanel';
import { BrainIcon } from '../components/icons/BrainIcon';
import { ChatIcon } from '../components/icons/ChatIcon';
import { Scorecard } from '../components/deepdive/Scorecard';
import { KeyFlags } from '../components/deepdive/KeyFlags';
import { KillerQuestions } from '../components/deepdive/KillerQuestions';
import { AnalysisSection } from '../components/deepdive/AnalysisSection';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { QualityIndicator } from '../components/common/QualityIndicator';

const cn = (...classes: (string | undefined | null | false | 0)[]) => classes.filter(Boolean).join(' ');

interface DeepDivePageProps {
  tech: DeepTech;
}


export const DeepDivePage: React.FC<DeepDivePageProps> = ({ tech }) => {
    const { deepDive, handleStartChat } = useApp();
    const { deepDiveAnalysis: analysis, isStreaming, statusMessage, deepDiveSources: sources, deepDiveError: error } = deepDive;
    const [isSourcesPanelOpen, setIsSourcesPanelOpen] = useState(false);
    
    const renderBody = () => {
        if (isStreaming && !analysis) {
             return (
                <div className="flex flex-col items-center justify-center text-center py-16">
                    <div className="relative w-20 h-20">
                        <div className="absolute inset-0 border-neutral-200 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-t-transparent border-primary rounded-full animate-spin"></div>
                    </div>
                    <p className={cn('text-lg leading-snug font-bold text-main', "tracking-wide text-main-light mt-6")}>{statusMessage || 'AIが分析中...'}</p>
                    <p className="text-sm text-main-lighter leading-normal">VCの視点でビジネス評価レポートを生成しています</p>
                </div>
             );
        }

        if (error) {
            return <div className="text-center text-danger-text bg-danger-light p-4 rounded-lg text-sm leading-normal">{error}</div>;
        }
        
        if (!analysis) {
            return (
                <div className="text-center text-main-light py-16 px-6 bg-neutral-100/70 rounded-2xl border border-neutral-200/80 animate-fade-in">
                    <BrainIcon className="w-12 h-12 mx-auto text-neutral-400 mb-4" />
                    <h3 className={cn('text-lg leading-snug font-bold text-main', "text-main-light")}>分析情報なし</h3>
                    <p className={cn('text-sm text-main-light leading-normal', "mt-2 max-w-md mx-auto")}>
                        AIは、この技術に関する有効な分析情報を生成できませんでした。
                        <br />
                        参照できる公開情報が不足しているか、まだ評価が難しい非常に新しい技術の可能性があります。
                    </p>
                </div>
            );
        }

        return (
            <div className="animate-fade-in">
                {analysis.scorecard && <Scorecard data={analysis.scorecard} />}
                
                <AnalysisSection data={analysis.summary} titleOverride="1. 総論：投資仮説のサマリー" isPrimary={true} />
                
                <div className="space-y-12">
                    <AnalysisSection data={analysis.potentialImpact} titleOverride="2. ポテンシャルインパクトの評価（想定利益）" />
                    <AnalysisSection data={analysis.marketRisk} titleOverride="3. 市場リスクの評価（P(事業成功|製品供給成功)）" />
                    <AnalysisSection data={analysis.techRisk} titleOverride="4. 技術リスクの評価（P(製品供給成功)）" />
                </div>

                {analysis.keyFlags && <KeyFlags data={analysis.keyFlags} />}
                
                {analysis.killerQuestions && <KillerQuestions data={analysis.killerQuestions} />}
                
                {/* Detailed Quality Assessment Section */}
                {deepDive.qualityAssessment && (
                    <div className="mt-12 border-t border-neutral-200 pt-8">
                        <h2 className="text-xl font-bold text-main mb-4">分析品質評価</h2>
                        <QualityIndicator 
                            assessment={deepDive.qualityAssessment} 
                            compact={false} 
                        />
                    </div>
                )}
            </div>
        );
    };

    return (
        <>
            <div className="animate-fade-in w-full pt-8 pb-12">
                <div className="flex justify-end items-center mb-6">
                     <Button
                        onClick={handleStartChat}
                        disabled={isStreaming || !!error || !analysis}
                        variant="primary"
                        size="medium"
                        className="rounded-full"
                        aria-label="AIとチャットで深掘りする"
                        title={isStreaming ? "AIによる分析が完了するまでお待ちください" : "AIとチャットで深掘りする"}
                    >
                        <ChatIcon className="w-5 h-5 mr-2" />
                        チャットで深掘り
                    </Button>
                </div>

                <Card className="shadow-lg">
                    <div className="p-6 md:p-8 border-b border-neutral-200/80 bg-neutral-50/50 rounded-t-4xl">
                        {/* Title Section */}
                        <div className="mb-4">
                            <p className={cn('text-base text-main-light/90 leading-relaxed', "text-primary font-bold")}>{tech.university}</p>
                            <h1 className={cn('text-[40px] leading-tight md:text-[48px] md:leading-tight font-bold tracking-tight text-main', "mt-1")}>{tech.techName}</h1>
                        </div>
                        
                        {/* Sub-header with Lab and Sources */}
                        <div className="flex justify-between items-center flex-wrap gap-x-4 gap-y-2">
                            <p className={cn('text-sm text-main-lighter leading-normal')}>
                                <span className="font-bold text-main-light">関連研究室:</span> {tech.researchLab}
                            </p>
                            <div className="flex-shrink-0">
                                <SourcesButton sources={sources} onClick={() => setIsSourcesPanelOpen(true)} />
                            </div>
                        </div>
                        
                        {/* Quality Indicator (compact mode) */}
                        {deepDive.qualityAssessment && !isStreaming && (
                            <div className="mt-4">
                                <QualityIndicator 
                                    assessment={deepDive.qualityAssessment} 
                                    compact={true} 
                                />
                            </div>
                        )}
                    </div>
                    
                    <div className="p-6 md:p-8">
                        {renderBody()}
                    </div>
                </Card>
            </div>
            <SourcesPanel
                sources={sources}
                isOpen={isSourcesPanelOpen}
                onClose={() => setIsSourcesPanelOpen(false)}
            />
        </>
    );
};