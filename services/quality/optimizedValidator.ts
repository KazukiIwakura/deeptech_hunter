import type { Source, QualityAssessment, QualityDimension } from '../../types';
import { sourceReliabilityAnalyzer } from './sourceReliability';
import { domainReliabilityCache, contentAnalysisCache } from './cache';
import { CURRENT_QUALITY_CONFIG, type QualitySystemConfig } from './config';
import { performanceMonitor } from './performance';

export interface OptimizedValidationOptions {
  enableParallelProcessing?: boolean;
  enableStageGating?: boolean;
  stageGateThreshold?: number;
  enableCaching?: boolean;
  maxProcessingTime?: number; // ms
}

export class OptimizedResponseValidator {
  private options: Required<OptimizedValidationOptions>;
  private config: QualitySystemConfig;

  constructor(options: OptimizedValidationOptions = {}, config?: QualitySystemConfig) {
    this.config = config || CURRENT_QUALITY_CONFIG;

    // 設定ファイルの値を優先し、オプションで上書き
    this.options = {
      enableParallelProcessing: this.config.parallelProcessing.enabled,
      enableStageGating: this.config.stageGating.enabled,
      stageGateThreshold: this.config.stageGating.criticalThreshold,
      enableCaching: this.config.cache.enabled,
      maxProcessingTime: this.config.parallelProcessing.timeoutMs,
      ...options // 明示的に渡されたオプションで上書き
    };

    if (this.config.logging.enableDetailedLogging) {
      console.log('OptimizedResponseValidator initialized with config:', this.options);
    }
  }

  /**
   * 最適化された技術分析品質評価
   */
  async assessTechAnalysisQuality(
    analysisContent: string,
    sources: Source[],
    techName: string
  ): Promise<QualityAssessment> {
    // パフォーマンス測定開始
    const endMeasurement = performanceMonitor.startMeasurement(`quality-assessment-${techName}`);
    let cacheHit = false;
    let earlyTermination = false;

    try {
      // キャッシュキーの生成
      const cacheKey = this.generateCacheKey(analysisContent, sources, techName);

      // キャッシュチェック
      if (this.options.enableCaching) {
        const cached = contentAnalysisCache.get(cacheKey);
        if (cached) {
          performanceMonitor.recordCacheHit();
          cacheHit = true;

          if (this.config.logging.enablePerformanceLogging) {
            console.log('Quality assessment cache hit for:', techName);
          }

          // パフォーマンス測定終了
          const metrics = endMeasurement({
            cacheHitRate: performanceMonitor.getCacheHitRate(),
            stageGatingEnabled: this.options.enableStageGating,
            earlyTermination: false
          });

          return cached;
        } else {
          performanceMonitor.recordCacheMiss();
        }
      }

      let dimensions: QualityDimension[];

      if (this.options.enableParallelProcessing) {
        dimensions = await this.assessInParallel(analysisContent, sources, techName);
      } else {
        dimensions = await this.assessSequentially(analysisContent, sources, techName);
      }

      // 段階的評価による早期終了チェック
      if (this.options.enableStageGating) {
        const criticalScore = dimensions[0]?.score || 0; // ソース信頼性が最重要
        if (criticalScore < this.options.stageGateThreshold) {
          earlyTermination = true;

          if (this.config.logging.enablePerformanceLogging) {
            console.log(`Early termination: critical score ${criticalScore} below threshold ${this.options.stageGateThreshold}`);
          }

          const earlyResult = this.createLowQualityAssessment(dimensions, 'ソース信頼性が低いため詳細評価を省略');

          // パフォーマンス測定終了（早期終了）
          const earlyMetrics = endMeasurement({
            cacheHitRate: performanceMonitor.getCacheHitRate(),
            stageGatingEnabled: this.options.enableStageGating,
            earlyTermination: true
          });

          return earlyResult;
        }
      }

      const result = this.compileAssessment(dimensions, sources);

      // 結果をキャッシュ
      if (this.options.enableCaching) {
        contentAnalysisCache.set(cacheKey, result);
      }

      // パフォーマンス測定終了
      const metrics = endMeasurement({
        cacheHitRate: performanceMonitor.getCacheHitRate(),
        stageGatingEnabled: this.options.enableStageGating,
        earlyTermination
      });

      if (this.config.logging.enablePerformanceLogging) {
        console.log(`Quality assessment completed for ${techName}:`, {
          totalTime: `${metrics.totalTime.toFixed(2)}ms`,
          cacheHit,
          earlyTermination,
          overallScore: result.overallScore
        });
      }

      return result;

    } catch (error) {
      console.error('Optimized quality assessment failed:', error);

      // パフォーマンス測定終了（エラー時）
      endMeasurement({
        cacheHitRate: performanceMonitor.getCacheHitRate(),
        stageGatingEnabled: this.options.enableStageGating,
        earlyTermination: false
      });

      // フォールバック: 基本的な評価を返す
      return this.createFallbackAssessment(sources);
    }
  }

  /**
   * 並列処理による評価
   */
  private async assessInParallel(
    content: string,
    sources: Source[],
    techName: string
  ): Promise<QualityDimension[]> {
    const assessmentPromises = [
      this.assessSourceReliabilityOptimized(sources),
      this.assessContentCompletenessOptimized(content, techName),
      this.assessLogicalConsistencyOptimized(content),
      this.assessSpecificityOptimized(content)
    ];

    // タイムアウト付き並列実行
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Assessment timeout')), this.options.maxProcessingTime);
    });

    try {
      const results = await Promise.race([
        Promise.all(assessmentPromises),
        timeoutPromise
      ]);
      return results;
    } catch (error) {
      console.warn('Parallel assessment failed, falling back to sequential');
      return this.assessSequentially(content, sources, techName);
    }
  }

  /**
   * 順次処理による評価（フォールバック）
   */
  private async assessSequentially(
    content: string,
    sources: Source[],
    techName: string
  ): Promise<QualityDimension[]> {
    const dimensions: QualityDimension[] = [];

    // 重要度順に評価
    dimensions.push(await this.assessSourceReliabilityOptimized(sources));

    // 段階的評価: ソース信頼性が低すぎる場合は早期終了
    if (this.options.enableStageGating && dimensions[0].score < this.options.stageGateThreshold) {
      return dimensions;
    }

    dimensions.push(await this.assessContentCompletenessOptimized(content, techName));
    dimensions.push(await this.assessLogicalConsistencyOptimized(content));
    dimensions.push(await this.assessSpecificityOptimized(content));

    return dimensions;
  }

  /**
   * 最適化されたソース信頼性評価（キャッシュ活用）
   */
  private async assessSourceReliabilityOptimized(sources: Source[]): Promise<QualityDimension> {
    const issues: string[] = [];
    let totalReliability = 0;
    let highQualityCount = 0;

    for (const source of sources) {
      let reliability: number;

      // キャッシュチェック
      if (this.options.enableCaching) {
        const cached = domainReliabilityCache.get(source.domain);
        if (cached !== undefined) {
          reliability = cached;
        } else {
          const analysis = sourceReliabilityAnalyzer.analyzeSource(source);
          reliability = analysis.score;
          domainReliabilityCache.set(source.domain, reliability);
        }
      } else {
        const analysis = sourceReliabilityAnalyzer.analyzeSource(source);
        reliability = analysis.score;
      }

      totalReliability += reliability;
      if (reliability >= 75) highQualityCount++;
    }

    const averageReliability = sources.length > 0 ? totalReliability / sources.length : 0;

    if (averageReliability < 60) issues.push('情報源の信頼性が低い');
    if (sources.length < 3) issues.push('情報源の数が不足');
    if (highQualityCount === 0) issues.push('高品質な学術・政府系ソースが不足');

    return {
      name: 'ソース信頼性',
      score: averageReliability,
      description: `${sources.length}個のソースから情報を収集。高品質ソース: ${highQualityCount}個`,
      issues
    };
  }

  /**
   * 軽量化されたコンテンツ完全性評価
   */
  private async assessContentCompletenessOptimized(content: string, techName: string): Promise<QualityDimension> {
    const issues: string[] = [];
    let score = 70;

    const lowerContent = content.toLowerCase();
    const techNameLower = techName.toLowerCase();

    // 必須要素の簡易チェック（軽量化）
    const essentialChecks = [
      { keywords: ['技術', 'technology', techNameLower], weight: 20, name: '技術説明' },
      { keywords: ['市場', 'market'], weight: 15, name: '市場分析' },
      { keywords: ['リスク', 'risk'], weight: 15, name: 'リスク分析' }
    ];

    for (const check of essentialChecks) {
      const hasElement = check.keywords.some(kw => lowerContent.includes(kw));
      if (!hasElement) {
        issues.push(`${check.name}が不足`);
        score -= check.weight;
      }
    }

    // 基本的な長さチェック
    if (content.length < 500) {
      issues.push('分析内容が簡潔すぎる');
      score -= 15;
    }

    return {
      name: 'コンテンツ完全性',
      score: Math.max(0, score),
      description: '分析内容の包括性と必須要素の網羅度',
      issues
    };
  }

  /**
   * 軽量化された論理的一貫性評価
   */
  private async assessLogicalConsistencyOptimized(content: string): Promise<QualityDimension> {
    const issues: string[] = [];
    let score = 80;

    const lowerContent = content.toLowerCase();

    // 簡易的な矛盾チェック
    const contradictionPairs = [
      { positive: ['高い', '優れた'], negative: ['低い', '劣る'] },
      { positive: ['有望', '期待'], negative: ['困難', '課題'] }
    ];

    for (const pair of contradictionPairs) {
      const hasPositive = pair.positive.some(p => lowerContent.includes(p));
      const hasNegative = pair.negative.some(n => lowerContent.includes(n));

      if (hasPositive && hasNegative) {
        issues.push('表現に矛盾の可能性');
        score -= 10;
        break; // 1つ見つかれば十分
      }
    }

    // 結論の存在チェック
    const hasConclusion = ['結論', 'まとめ', 'conclusion'].some(term => lowerContent.includes(term));
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

  /**
   * 軽量化された具体性評価
   */
  private async assessSpecificityOptimized(content: string): Promise<QualityDimension> {
    const issues: string[] = [];
    let score = 60;

    // 高速な正規表現チェック
    const specificityPatterns = [
      /\d+年/g,        // 年号
      /\d+億/g,        // 金額
      /\d+%/g,         // パーセンテージ
      /[A-Z][a-z]+\s+[A-Z][a-z]+/g // 英語固有名詞
    ];

    let specificityCount = 0;
    for (const pattern of specificityPatterns) {
      const matches = content.match(pattern);
      if (matches && matches.length > 0) {
        specificityCount++;
      }
    }

    score += specificityCount * 8;

    if (specificityCount < 2) {
      issues.push('具体的な固有名詞・数値が不足');
    }

    // 曖昧表現の簡易チェック
    const vagueTerms = ['かもしれない', 'と思われる', '一般的に'];
    const vagueCount = vagueTerms.filter(term => content.includes(term)).length;

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

  /**
   * 評価結果の統合
   */
  private compileAssessment(dimensions: QualityDimension[], sources: Source[]): QualityAssessment {
    const weights = [0.3, 0.25, 0.25, 0.2]; // ソース信頼性を最重視
    const overallScore = dimensions.reduce((sum, dim, index) =>
      sum + (dim.score * (weights[index] || 0)), 0);

    const recommendations = this.generateOptimizedRecommendations(dimensions, sources);

    return {
      overallScore,
      dimensions,
      recommendations,
      confidence: this.determineConfidence(overallScore, sources.length),
      needsVerification: overallScore < 70 || sources.length < 2
    };
  }

  /**
   * 最適化された推奨事項生成
   */
  private generateOptimizedRecommendations(dimensions: QualityDimension[], sources: Source[]): string[] {
    const recommendations: string[] = [];

    // 最も重要な問題のみを抽出（最大3つ）
    const criticalIssues = dimensions
      .filter(dim => dim.score < 60)
      .slice(0, 2) // 最大2つの次元
      .map(dim => `${dim.name}の改善が必要`);

    recommendations.push(...criticalIssues);

    if (sources.length < 3) {
      recommendations.push('追加の情報源からの検証を推奨');
    }

    return recommendations.slice(0, 3); // 最大3つの推奨事項
  }

  /**
   * 低品質評価の作成（早期終了用）
   */
  private createLowQualityAssessment(dimensions: QualityDimension[], reason: string): QualityAssessment {
    return {
      overallScore: dimensions[0]?.score || 0,
      dimensions,
      recommendations: [reason, '追加の信頼できる情報源が必要'],
      confidence: 'low',
      needsVerification: true
    };
  }

  /**
   * フォールバック評価の作成
   */
  private createFallbackAssessment(sources: Source[]): QualityAssessment {
    return {
      overallScore: 50,
      dimensions: [{
        name: 'ソース信頼性',
        score: sources.length > 0 ? 50 : 0,
        description: '評価処理中にエラーが発生',
        issues: ['評価処理が完了しませんでした']
      }],
      recommendations: ['品質評価を再実行することを推奨'],
      confidence: 'low',
      needsVerification: true
    };
  }

  /**
   * 信頼度の判定
   */
  private determineConfidence(score: number, sourceCount: number): 'high' | 'medium' | 'low' {
    if (score >= 80 && sourceCount >= 3) return 'high';
    if (score >= 60 && sourceCount >= 2) return 'medium';
    return 'low';
  }

  /**
   * キャッシュキーの生成
   */
  private generateCacheKey(content: string, sources: Source[], techName: string): string {
    const contentHash = this.simpleHash(content.substring(0, 200)); // 最初の200文字のハッシュ
    const sourcesHash = this.simpleHash(sources.map(s => s.domain).join(','));
    const techHash = this.simpleHash(techName);
    return `${contentHash}-${sourcesHash}-${techHash}`;
  }

  /**
   * 簡易ハッシュ関数
   */
  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // 32bit整数に変換
    }
    return Math.abs(hash).toString(36);
  }
}

// シングルトンインスタンス
export const optimizedResponseValidator = new OptimizedResponseValidator();