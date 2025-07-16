import React from 'react';
import type { QualityAssessment, QualityMetrics } from '../../types';

interface QualitySummaryProps {
  assessment?: QualityAssessment;
  metrics?: QualityMetrics;
}

export const QualitySummary: React.FC<QualitySummaryProps> = ({ assessment, metrics }) => {
  if (!assessment && !metrics) return null;
  
  const getConfidenceLabel = (confidence: string): string => {
    switch (confidence) {
      case 'high': return '高';
      case 'medium': return '中';
      case 'low': return '低';
      default: return '不明';
    }
  };
  
  const getConfidenceColor = (confidence: string): string => {
    switch (confidence) {
      case 'high': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };
  
  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  const getRecommendationIcon = (score: number): string => {
    if (score >= 80) return '✓';
    if (score >= 60) return '⚠️';
    return '⚠️';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">分析品質サマリー</h3>
      
      <div className="space-y-4">
        {assessment && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">総合品質:</span>
            <div className="flex items-center">
              <span className={`text-sm font-medium ${getScoreColor(assessment.overallScore)}`}>
                {Math.round(assessment.overallScore)}%
              </span>
              <span className="mx-2 text-gray-400">|</span>
              <span className={`text-sm font-medium ${getConfidenceColor(assessment.confidence)}`}>
                信頼度: {getConfidenceLabel(assessment.confidence)}
              </span>
            </div>
          </div>
        )}
        
        {metrics && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">情報源品質:</span>
            <div className="flex items-center">
              <span className={`text-sm font-medium ${getScoreColor(metrics.averageReliability)}`}>
                {Math.round(metrics.averageReliability)}%
              </span>
              <span className="mx-2 text-gray-400">|</span>
              <span className="text-sm text-gray-600">
                高品質ソース: {metrics.highQualityCount}件
              </span>
            </div>
          </div>
        )}
        
        {assessment?.needsVerification && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-yellow-400">⚠️</span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  この分析結果は追加の検証が推奨されます
                </p>
              </div>
            </div>
          </div>
        )}
        
        {assessment?.recommendations && assessment.recommendations.length > 0 && (
          <div className="mt-3">
            <h4 className="text-sm font-medium text-gray-700 mb-2">改善提案:</h4>
            <ul className="space-y-1">
              {assessment.recommendations.slice(0, 2).map((rec, index) => (
                <li key={index} className="flex items-start text-xs text-gray-600">
                  <span className="mr-2">{getRecommendationIcon(assessment.overallScore)}</span>
                  <span>{rec}</span>
                </li>
              ))}
              {assessment.recommendations.length > 2 && (
                <li className="text-xs text-gray-500 italic">
                  他 {assessment.recommendations.length - 2} 件の提案があります
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};