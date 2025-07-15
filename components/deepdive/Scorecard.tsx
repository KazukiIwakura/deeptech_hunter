
import React, { useState } from 'react';
import { ClipboardListIcon } from '../icons/ClipboardListIcon';
import { BrainIcon } from '../icons/BrainIcon';
import { ChevronDownIcon } from '../icons/ChevronDownIcon';
import { MarkdownRenderer } from '../common/MarkdownRenderer';
import type { ScorecardData } from '../../types';
import { Card } from '../common/Card';

const cn = (...classes: (string | undefined | null | false | 0)[]) => classes.filter(Boolean).join(' ');

const ScoreBar: React.FC<{ score: number; label: string }> = ({ score, label }) => {
    const percentage = score * 10;
    const isRisk = label.includes('リスク');
    const getColor = (s: number, isRiskBar: boolean) => {
        if (isRiskBar) { // Lower score is higher risk, so we want to show red for low scores. A score of 10 means low risk.
            if (s > 7) return 'bg-success'; // Low risk
            if (s > 4) return 'bg-warning'; // Medium risk
            return 'bg-danger'; // High risk
        } else { // Higher is better
            if (s > 7) return 'bg-success';
            if (s > 4) return 'bg-warning';
            return 'bg-danger';
        }
    };
    const color = getColor(score, isRisk);

    return (
        <div>
            <div className="flex justify-between items-end mb-1">
                <span className={cn('text-sm text-main-light leading-normal', "font-normal text-main-light")}>{label}</span>
                <span className={cn('text-lg leading-snug font-bold text-main')}>{score}<span className={cn('text-sm text-main-light leading-normal', "font-normal text-main-lighter")}>/10</span></span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-2">
                <div className={cn(color, 'h-2 rounded-full transition-all duration-500')} style={{ width: `${percentage}%` }}></div>
            </div>
        </div>
    );
};

interface ScorecardProps {
    data: ScorecardData;
}

export const Scorecard: React.FC<ScorecardProps> = ({ data }) => {
    const [isLogicVisible, setIsLogicVisible] = useState(false);

    const { overallGrade, summary } = data;

    const fullLogic = "この技術は、エネルギー問題を根底から覆す可能性があるためポテンシャルインパクトは「10/10」と非常に高い評価です。 市場リスクについては、既存の電力網との連携や価格競争が課題ため「6/10」となります。 技術リスクは長期耐久性の実証が最大のハードルことから「4/10」と評価しました。 総括すると、技術的ハードルは高いものの、成功すれば市場を独占できるゲームチェンジャー。耐久性の証明が投資の鍵。";

    const overallGradeTextColor = {
        'S': 'text-accent',
        'A': 'text-success',
        'B': 'text-primary',
        'C': 'text-warning',
        'D': 'text-danger',
        'E': 'text-danger',
    }[overallGrade] || 'text-main-lighter';

    return (
        <Card variant="opaque" className="mb-12 p-6">
            <h2 className={cn('text-[22px] leading-snug font-bold text-main', "mb-6 flex items-center")}>
                <ClipboardListIcon className="w-6 h-6 mr-4 text-primary flex-shrink-0" />
                <span>投資評価スコアカード</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="md:col-span-1 space-y-6">
                    <ScoreBar score={data.potentialImpact.score} label="ポテンシャルインパクト" />
                    <ScoreBar score={data.marketRisk.score} label="市場リスク (10=低)" />
                    <ScoreBar score={data.techRisk.score} label="技術リスク (10=低)" />
                </div>
                <div className="md:col-span-1 flex flex-col items-center justify-center bg-neutral-50/70 rounded-2xl p-4 border border-neutral-200/60">
                    <p className={cn('text-sm text-main-light leading-normal', "font-bold text-main-light")}>総合評価</p>
                    <p className={cn('text-7xl font-bold leading-none', 'my-1', overallGradeTextColor)}>{overallGrade}</p>
                    <p className={cn('text-sm text-main-light leading-normal', "text-center px-2 mt-2")}>{summary}</p>
                </div>
            </div>
            
            {fullLogic && (
              <div className="mt-6 border-t border-neutral-200 pt-6">
                  <button
                      onClick={() => setIsLogicVisible(!isLogicVisible)}
                      className={cn("flex items-center justify-between w-full text-left font-bold text-main-light hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary rounded-lg p-2 -m-2", 'text-sm text-main-light leading-normal')}
                      aria-expanded={isLogicVisible}
                      aria-controls="ai-logic-explanation"
                  >
                      <span className="flex items-center">
                          <BrainIcon className="w-5 h-5 mr-2 text-primary"/>
                          AIの評価ロジック
                      </span>
                      <ChevronDownIcon className={cn("w-5 h-5 text-main-lighter transition-transform duration-200", isLogicVisible && 'rotate-180')} />
                  </button>
                  
                  {isLogicVisible && (
                      <div 
                          id="ai-logic-explanation"
                          className="mt-4 animate-fade-in"
                      >
                          <div className={cn('border-l-4 p-4', 'bg-primary-lighter/70 border-primary backdrop-blur-sm')}>
                             <MarkdownRenderer content={fullLogic} className="text-base text-primary-text/90 leading-7"/>
                          </div>
                      </div>
                  )}
              </div>
            )}

        </Card>
    );
};
