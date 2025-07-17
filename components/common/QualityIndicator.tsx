import React from 'react';
import type { QualityAssessment, QualityMetrics } from '../../types';

interface QualityIndicatorProps {
  assessment?: QualityAssessment;
  metrics?: QualityMetrics;
  compact?: boolean;
}

export const QualityIndicator: React.FC<QualityIndicatorProps> = ({
  assessment,
  metrics,
  compact = false
}) => {
  if (!assessment && !metrics) return null;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-sm">
        {assessment && (
          <>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(assessment.overallScore)}`}>
              品質: {Math.round(assessment.overallScore)}%
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(assessment.confidence)}`}>
              信頼度: {assessment.confidence === 'high' ? '高' : assessment.confidence === 'medium' ? '中' : '低'}
            </span>
          </>
        )}
        {metrics && (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(metrics.averageReliability)}`}>
            ソース: {Math.round(metrics.averageReliability)}%
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">品質評価</h3>
        {assessment && (
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(assessment.overallScore)}`}>
              総合スコア: {Math.round(assessment.overallScore)}%
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getConfidenceColor(assessment.confidence)}`}>
              信頼度: {assessment.confidence === 'high' ? '高' : assessment.confidence === 'medium' ? '中' : '低'}
            </span>
          </div>
        )}
      </div>

      {assessment && (
        <>
          {/* Quality Dimensions */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-700">評価項目</h4>
            {assessment.dimensions.map((dimension, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">{dimension.name}</span>
                  <span className={`text-sm font-medium ${getScoreColor(dimension.score).split(' ')[0]}`}>
                    {Math.round(dimension.score)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      dimension.score >= 80 ? 'bg-green-500' :
                      dimension.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${dimension.score}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500">{dimension.description}</p>
                {dimension.issues.length > 0 && (
                  <div className="text-xs text-red-600">
                    課題: {dimension.issues.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Recommendations */}
          {assessment.recommendations.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-gray-700">改善提案</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {assessment.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Verification Warning */}
          {assessment.needsVerification && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <span className="text-yellow-600">⚠️</span>
                <span className="text-sm font-medium text-yellow-800">追加検証が推奨されます</span>
              </div>
              <p className="text-xs text-yellow-700 mt-1">
                この分析結果は追加の情報源による検証を推奨します。
              </p>
            </div>
          )}
        </>
      )}

      {/* Source Quality Metrics */}
      {metrics && (
        <div className="border-t pt-4 space-y-2">
          <h4 className="font-medium text-gray-700">情報源品質</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">平均信頼度:</span>
              <span className={`ml-2 font-medium ${getScoreColor(metrics.averageReliability).split(' ')[0]}`}>
                {Math.round(metrics.averageReliability)}%
              </span>
            </div>
            <div>
              <span className="text-gray-600">高品質ソース:</span>
              <span className="ml-2 font-medium text-gray-900">{metrics.highQualityCount}個</span>
            </div>
          </div>
          {metrics.recommendations.length > 0 && (
            <div className="text-xs text-gray-500">
              <strong>推奨:</strong> {metrics.recommendations.join(', ')}
            </div>
          )}
        </div>
      )}
    </div>
  );
};