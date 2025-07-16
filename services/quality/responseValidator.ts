import type { Source } from '../../types';
import { sourceReliabilityAnalyzer } from './sourceReliability';

export interface QualityAssessment {
  overallScore: number; // 0-100
  dimensions: QualityDimension[];
  recommendations: string[];
  confidence: 'high' | 'medium' | 'low';
  needsVerification: boolean;
}

export interface QualityDimension {
  name: string;
  score: number;
  description: string;
  issues: string[];
}

export class ResponseQualityValidator {

  /**
   * 技術分析レスポンスの品質を総合評価
   */
  assessTechAnalysisQuality(
    analysisContent: string,
    sources: Source[],
    techName: string
  ): QualityAssessment {
    const dimensions: QualityDimension[] = [];

    // 1. ソース信頼性の評価
    const sourceReliability = this.assessSourceReliability(sources);
    dimensions.push(sourceReliability);

    // 2. コンテンツ完全性の評価
    const contentCompleteness = this.assessContentCompleteness(analysisContent, techName);
    dimensions.push(contentCompleteness);

    // 3. 論理的一貫性の評価
    const logicalConsistency = this.assessLogicalConsistency(analysisContent);
    dimensions.push(logicalConsistency);

    // 4. 具体性・詳細度の評価
    const specificity = this.assessSpecificity(analysisContent);
    dimensions.push(specificity);

    // 総合スコア計算（重み付き平均）
    const weights = [0.3, 0.25, 0.25, 0.2]; // ソース信頼性を最重視
    const overallScore = dimensions.reduce((sum, dim, index) =>
      sum + (dim.score * weights[index]), 0);

    const recommendations = this.generateRecommendations(dimensions, sources);

    return {
      overallScore,
      dimensions,
      recommendations,
      confidence: this.determineConfidence(overallScore, sources.length),
      needsVerification: overallScore < 70 || sources.length < 2
    };
  }

  private assessSourceReliability(sources: Source[]): QualityDimension {
    const sourceEval = sourceReliabilityAnalyzer.evaluateSourceSet(sources);
    const issues: string[] = [];

    if (sourceEval.overallReliability < 60) {
      issues.push('情報源の信頼性が低い');
    }

    if (sources.length < 3) {
      issues.push('情報源の数が不足');
    }

    if (sourceEval.highQualitySources === 0) {
      issues.push('高品質な学術・政府系ソースが不足');
    }

    return {
      name: 'ソース信頼性',
      score: sourceEval.overallReliability,
      description: `${sources.length}個のソースから情報を収集。高品質ソース: ${sourceEval.highQualitySources}個`,
      issues
    };
  }

  private assessContentCompleteness(content: string, techName: string): QualityDimension {
    const issues: string[] = [];
    let score = 70; // ベーススコア

    // 必須要素のチェック
    const requiredElements = [
      { keyword: ['技術', 'technology', techName.toLowerCase()], name: '技術説明', weight: 20 },
      { keyword: ['市場', 'market', '応用', 'application'], name: '市場分析', weight: 15 },
      { keyword: ['リスク', 'risk', '課題', 'challenge'], name: 'リスク分析', weight: 15 },
      { keyword: ['競合', 'competition', '比較', 'comparison'], name: '競合分析', weight: 10 },
      { keyword: ['投資', 'investment', '資金', 'funding'], name: '投資観点', weight: 10 }
    ];

    const lowerContent = content.toLowerCase();

    for (const element of requiredElements) {
      const hasElement = element.keyword.some(kw => lowerContent.includes(kw));
      if (!hasElement) {
        issues.push(`${element.name}が不足`);
        score -= element.weight;
      }
    }

    // コンテンツの長さチェック
    if (content.length < 500) {
      issues.push('分析内容が簡潔すぎる');
      score -= 15;
    }

    // 数値データの存在チェック
    const hasNumbers = /\d+/.test(content);
    if (!hasNumbers) {
      issues.push('具体的な数値データが不足');
      score -= 10;
    }

    return {
      name: 'コンテンツ完全性',
      score: Math.max(0, score),
      description: `分析内容の包括性と必須要素の網羅度`,
      issues
    };
  }

  private assessLogicalConsistency(content: string): QualityDimension {
    const issues: string[] = [];
    let score = 80; // ベーススコア

    // 矛盾する表現のチェック
    const contradictions = [
      { positive: ['高い', 'strong', '優れた'], negative: ['低い', 'weak', '劣る'], context: '同一要素' },
      { positive: ['有望', 'promising', '期待'], negative: ['困難', 'difficult', '課題'], context: '総合評価' }
    ];

    const lowerContent = content.toLowerCase();

    for (const contradiction of contradictions) {
      const hasPositive = contradiction.positive.some(p => lowerContent.includes(p));
      const hasNegative = contradiction.negative.some(n => lowerContent.includes(n));

      if (hasPositive && hasNegative) {
        // より詳細な文脈分析が必要だが、簡易版として警告
        issues.push(`${contradiction.context}に関する表現に矛盾の可能性`);
        score -= 10;
      }
    }

    // 論理的構造のチェック
    const hasConclusion = lowerContent.includes('結論') || lowerContent.includes('まとめ') ||
      lowerContent.includes('conclusion') || lowerContent.includes('summary');
    if (!hasConclusion) {
      issues.push('明確な結論・まとめが不足');
      score -= 15;
    }

    return {
      name: '論理的一貫性',
      score: Math.max(0, score),
      description: '分析内容の論理的整合性と構造',
      issues
    };
  }

  private assessSpecificity(content: string): QualityDimension {
    const issues: string[] = [];
    let score = 60; // ベーススコア

    // 具体的な固有名詞の存在
    const specificTerms = [
      /[A-Z][a-z]+\s+[A-Z][a-z]+/, // 英語固有名詞
      /\d+年/, // 年号
      /\d+億/, // 金額
      /\d+%/, // パーセンテージ
      /[株式会社|Corporation|Inc\.|Ltd\.]/, // 企業名
    ];

    let specificityCount = 0;
    for (const pattern of specificTerms) {
      if (pattern.test(content)) {
        specificityCount++;
      }
    }

    score += specificityCount * 8;

    if (specificityCount < 2) {
      issues.push('具体的な固有名詞・数値が不足');
    }

    // 曖昧な表現のチェック
    const vagueTerms = ['かもしれない', 'と思われる', 'possibly', 'might be', '一般的に'];
    const vagueCount = vagueTerms.filter(term => content.toLowerCase().includes(term)).length;

    if (vagueCount > 3) {
      issues.push('曖昧な表現が多い');
      score -= vagueCount * 5;
    }

    return {
      name: '具体性・詳細度',
      score: Math.min(100, Math.max(0, score)),
      description: '分析内容の具体性と詳細度',
      issues
    };
  }

  private generateRecommendations(dimensions: QualityDimension[], sources: Source[]): string[] {
    const recommendations: string[] = [];

    // 各次元の問題に基づく推奨事項
    for (const dimension of dimensions) {
      if (dimension.score < 60) {
        recommendations.push(`${dimension.name}の改善が必要: ${dimension.issues.join(', ')}`);
      }
    }

    // ソース関連の推奨事項
    if (sources.length < 3) {
      recommendations.push('追加の情報源からの検証を推奨');
    }

    const academicSources = sources.filter(s =>
      s.domain.includes('ac.jp') || s.domain.includes('edu') || s.domain.includes('research')
    );

    if (academicSources.length === 0) {
      recommendations.push('学術機関からの情報源を追加することを推奨');
    }

    return recommendations;
  }

  private determineConfidence(score: number, sourceCount: number): 'high' | 'medium' | 'low' {
    if (score >= 80 && sourceCount >= 3) return 'high';
    if (score >= 60 && sourceCount >= 2) return 'medium';
    return 'low';
  }
}

export const responseQualityValidator = new ResponseQualityValidator();