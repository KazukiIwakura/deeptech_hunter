import React from 'react';
import type { Source } from '../../types';
import { sourceReliabilityAnalyzer } from '../../services/quality/sourceReliability';

interface SourceReliabilityBadgeProps {
  source: Source;
  showDetails?: boolean;
}

export const SourceReliabilityBadge: React.FC<SourceReliabilityBadgeProps> = ({ 
  source, 
  showDetails = false 
}) => {
  const reliability = sourceReliabilityAnalyzer.analyzeSource(source);
  
  const getBadgeColor = () => {
    switch (reliability.category) {
      case 'high': return 'bg-green-100 text-green-800 border-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };
  
  if (!showDetails) {
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getBadgeColor()}`}>
        {Math.round(reliability.score)}%
      </span>
    );
  }
  
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getBadgeColor()}`}>
          信頼度: {Math.round(reliability.score)}%
        </span>
        <span className="text-xs text-gray-500">
          {reliability.category === 'high' ? '高信頼性' : 
           reliability.category === 'medium' ? '中程度の信頼性' : '低信頼性'}
        </span>
      </div>
      
      <div className="text-xs space-y-1">
        {reliability.factors.map((factor, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-gray-600">
              {factor.type === 'domain_authority' ? 'ドメイン権威性' :
               factor.type === 'content_type' ? 'コンテンツタイプ' :
               factor.type === 'academic_source' ? '学術性' : 
               factor.type === 'recency' ? '最新性' : ''}
            </span>
            <span className="font-medium">{Math.round(factor.score)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};