import React, { useState, useEffect, useMemo } from 'react';
import { parseJsonFromResponse } from '../../services/gemini/shared';
import { deepDiveAnalysisSchema } from '../../services/zodSchemas';
import type { DeepDiveAnalysisData } from '../../types';
import { Scorecard } from './Scorecard';
import { AnalysisSection } from './AnalysisSection';
import { KeyFlags } from './KeyFlags';
import { KillerQuestions } from './KillerQuestions';

interface StreamingAnalysisDisplayProps {
    jsonString: string;
    isComplete: boolean;
}

interface ParsedSection {
    key: string;
    title: string;
    data: any;
    isComplete: boolean;
}

const cn = (...classes: (string | undefined | null | false | 0)[]) => classes.filter(Boolean).join(' ');

export const StreamingAnalysisDisplay: React.FC<StreamingAnalysisDisplayProps> = ({
    jsonString,
    isComplete
}) => {
    const [displayedSections, setDisplayedSections] = useState<ParsedSection[]>([]);
    const [currentThought, setCurrentThought] = useState<string>('');

    // Parse the streaming JSON and extract completed sections
    const parsedData = useMemo(() => {
        if (!jsonString.trim()) return null;

        try {
            // Try to parse the current JSON string
            const parsed = parseJsonFromResponse(jsonString, deepDiveAnalysisSchema);
            return parsed;
        } catch (error) {
            // If parsing fails, try to extract partial data
            return extractPartialData(jsonString);
        }
    }, [jsonString]);

    // Update displayed sections when parsed data changes
    useEffect(() => {
        if (!parsedData) return;

        const sections: ParsedSection[] = [];

        // Check each section and add if complete
        if (parsedData.scorecard) {
            sections.push({
                key: 'scorecard',
                title: 'スコアカード',
                data: parsedData.scorecard,
                isComplete: true
            });
        }

        if (parsedData.summary) {
            sections.push({
                key: 'summary',
                title: '1. 総論：投資仮説のサマリー',
                data: parsedData.summary,
                isComplete: true
            });
        }

        if (parsedData.potentialImpact) {
            sections.push({
                key: 'potentialImpact',
                title: '2. ポテンシャルインパクトの評価（想定利益）',
                data: parsedData.potentialImpact,
                isComplete: true
            });
        }

        if (parsedData.marketRisk) {
            sections.push({
                key: 'marketRisk',
                title: '3. 市場リスクの評価（P(事業成功|製品供給成功)）',
                data: parsedData.marketRisk,
                isComplete: true
            });
        }

        if (parsedData.techRisk) {
            sections.push({
                key: 'techRisk',
                title: '4. 技術リスクの評価（P(製品供給成功)）',
                data: parsedData.techRisk,
                isComplete: true
            });
        }

        if (parsedData.keyFlags) {
            sections.push({
                key: 'keyFlags',
                title: 'キーフラグ',
                data: parsedData.keyFlags,
                isComplete: true
            });
        }

        if (parsedData.killerQuestions) {
            sections.push({
                key: 'killerQuestions',
                title: 'キラークエスチョン',
                data: parsedData.killerQuestions,
                isComplete: true
            });
        }

        setDisplayedSections(sections);

        // Extract current "thought" from the streaming JSON
        if (!isComplete) {
            const thought = extractCurrentThought(jsonString);
            setCurrentThought(thought);
        } else {
            setCurrentThought('');
        }
    }, [parsedData, jsonString, isComplete]);

    if (!jsonString.trim()) {
        return (
            <div className="text-center text-gray-500 py-8">
                <div className="animate-pulse">分析を準備中...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Show current AI thinking process */}
            {!isComplete && currentThought && (
                <div className="thought-bubble p-4 animate-stream-in">
                    <div className="flex items-center space-x-2 mb-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse-subtle"></div>
                        <span className="text-sm font-medium text-gray-700">AIの思考プロセス</span>
                    </div>
                    <p className="text-sm text-gray-600 animate-typing">{currentThought}</p>
                </div>
            )}

            {/* Render completed sections */}
            {displayedSections.map((section, index) => (
                <div
                    key={section.key}
                    className={cn(
                        "streaming-content animate-stream-in",
                        !section.isComplete && "incomplete opacity-70"
                    )}
                    style={{ animationDelay: `${index * 0.2}s` }}
                >
                    {section.key === 'scorecard' && (
                        <Scorecard data={section.data} />
                    )}

                    {['summary', 'potentialImpact', 'marketRisk', 'techRisk'].includes(section.key) && (
                        <AnalysisSection
                            data={section.data}
                            titleOverride={section.title}
                            isPrimary={section.key === 'summary'}
                        />
                    )}

                    {section.key === 'keyFlags' && (
                        <KeyFlags data={section.data} />
                    )}

                    {section.key === 'killerQuestions' && (
                        <KillerQuestions data={section.data} />
                    )}
                </div>
            ))}

            {/* Show loading indicator for incomplete sections */}
            {!isComplete && displayedSections.length > 0 && (
                <div className="streaming-status p-4 animate-stream-in">
                    <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 border-2 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
                        <span className="text-sm font-medium text-blue-900">さらに詳細な分析を生成中...</span>
                    </div>
                </div>
            )}
        </div>
    );
};

// Helper function to extract partial data from incomplete JSON
function extractPartialData(jsonString: string): Partial<DeepDiveAnalysisData> | null {
    try {
        // Try to find complete JSON objects within the string
        const matches = jsonString.match(/\{[^{}]*\}/g);
        if (!matches) return null;

        // Try to parse the largest complete object
        const largestMatch = matches.reduce((a, b) => a.length > b.length ? a : b);
        return JSON.parse(largestMatch);
    } catch {
        return null;
    }
}

// Helper function to extract current "thought" from streaming JSON
function extractCurrentThought(jsonString: string): string {
    // Look for incomplete sentences or partial content that shows AI's current focus
    const lines = jsonString.split('\n');
    const lastLine = lines[lines.length - 1]?.trim();

    if (lastLine && lastLine.length > 10 && !lastLine.endsWith('}')) {
        // Extract meaningful partial content
        const thoughtMatch = lastLine.match(/"([^"]{20,})/);
        if (thoughtMatch) {
            return `"${thoughtMatch[1]}..." を分析中`;
        }
    }

    // Fallback to generic messages based on content
    if (jsonString.includes('scorecard')) {
        return 'スコアカード評価を完了、詳細分析を開始中...';
    } else if (jsonString.includes('summary')) {
        return '投資仮説サマリーを生成中...';
    } else if (jsonString.includes('potentialImpact')) {
        return 'ポテンシャルインパクトを評価中...';
    } else if (jsonString.includes('marketRisk')) {
        return '市場リスクを分析中...';
    } else if (jsonString.includes('techRisk')) {
        return '技術リスクを評価中...';
    }

    return '詳細な分析を生成中...';
}