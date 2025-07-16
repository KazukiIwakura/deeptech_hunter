/**
 * 品質評価システムのベンチマークとパフォーマンステスト
 */

import { optimizedResponseValidator } from './optimizedValidator';
import { responseQualityValidator } from './responseValidator';
import { performanceMonitor, type BenchmarkResult } from './performance';
import { FAST_MODE_CONFIG, PRECISION_MODE_CONFIG, DEFAULT_QUALITY_CONFIG } from './config';
import type { Source } from '../../types';

// テスト用のサンプルデータ
const SAMPLE_ANALYSIS_CONTENT = `
セルロースナノファイバー（CNF）複合材料は、木材の主成分であるセルロースを、髪の毛の2万分の1という極細のナノレベルまで解きほぐした繊維状の材料です。
この超微細な繊維を樹脂と組み合わせることで、従来の材料では実現できない超軽量かつ超高強度の複合材料を作ることができます。

CNF複合材料は鋼鉄の5倍の強度を持ちながら重量は5分の1という驚異的な特性を実現します。
しかも原料は豊富な木材であり、カーボンニュートラルな材料として環境負荷も極めて低い。
自動車や航空機の軽量化により燃費向上・CO2削減に大きく貢献し、持続可能な社会の実現に不可欠な技術です。

技術的成熟度が高く、既に量産プロセスも確立されているため、投資リスクが相対的に低いのが最大の魅力。
投資判断の核心は「いかに早く大規模な生産体制を構築し、市場シェアを獲得するか」にある。

世界の複合材料市場は2030年までに1500億ドル規模に成長予測。
特に自動車軽量化材料市場（年率8%成長）と航空機複合材料市場（年率10%成長）での需要が急拡大している。
`;

const SAMPLE_SOURCES: Source[] = [
  { uri: 'https://www.kyoto-u.ac.jp/ja/research/research-results/2023/231215_1', title: 'セルロースナノファイバー複合材料の強度向上に成功 - 京都大学', domain: 'kyoto-u.ac.jp', snippet: '木材由来CNFを用いた複合材料で従来比3倍の強度向上を実現。' },
  { uri: 'https://www.jst.go.jp/pr/announce/20231201/index.html', title: 'CNF複合材料の実用化に向けた技術開発 - JST', domain: 'jst.go.jp', snippet: 'セルロースナノファイバーを用いた軽量高強度材料の産業応用プロジェクト。' },
  { uri: 'https://www.nedo.go.jp/news/press/AA5_101583.html', title: 'CNF複合材料の実用化に向けた技術開発 - NEDO', domain: 'nedo.go.jp', snippet: 'セルロースナノファイバーを用いた軽量高強度材料の産業応用プロジェクト。' },
  { uri: 'https://www.nature.com/articles/s41467-023-12345-6', title: 'Advanced cellulose nanofiber composites for automotive applications', domain: 'nature.com', snippet: 'High-strength CNF composites show promise for lightweight automotive components.' }
];

const SAMPLE_TECH_NAME = 'セルロースナノファイバー複合材料';

export class QualityBenchmark {
  
  /**
   * 標準評価システムと最適化システムの比較ベンチマーク
   */
  async runComparisonBenchmark(iterations: number = 10): Promise<{
    standard: BenchmarkResult;
    optimized: BenchmarkResult;
    improvement: {
      speedImprovement: number;
      cacheHitRate: number;
      earlyTerminationRate: number;
    };
  }> {
    console.log('🚀 品質評価システム比較ベンチマーク開始');
    
    // 標準システムのベンチマーク
    const standardBenchmark = await performanceMonitor.runBenchmark(
      'Standard Quality Assessment',
      async () => {
        return responseQualityValidator.assessTechAnalysisQuality(
          SAMPLE_ANALYSIS_CONTENT,
          SAMPLE_SOURCES,
          SAMPLE_TECH_NAME
        );
      },
      iterations
    );

    // 最適化システムのベンチマーク
    const optimizedBenchmark = await performanceMonitor.runBenchmark(
      'Optimized Quality Assessment',
      async () => {
        return optimizedResponseValidator.assessTechAnalysisQuality(
          SAMPLE_ANALYSIS_CONTENT,
          SAMPLE_SOURCES,
          SAMPLE_TECH_NAME
        );
      },
      iterations
    );

    // 改善度の計算
    const speedImprovement = ((standardBenchmark.averageTime - optimizedBenchmark.averageTime) / standardBenchmark.averageTime) * 100;
    const cacheHitRate = optimizedBenchmark.metrics.reduce((sum, m) => sum + m.cacheHitRate, 0) / optimizedBenchmark.metrics.length;
    const earlyTerminationRate = (optimizedBenchmark.metrics.filter(m => m.earlyTermination).length / optimizedBenchmark.metrics.length) * 100;

    console.log('📊 ベンチマーク結果:');
    console.log(`  標準システム: ${standardBenchmark.averageTime.toFixed(2)}ms`);
    console.log(`  最適化システム: ${optimizedBenchmark.averageTime.toFixed(2)}ms`);
    console.log(`  速度改善: ${speedImprovement.toFixed(1)}%`);
    console.log(`  キャッシュヒット率: ${cacheHitRate.toFixed(1)}%`);
    console.log(`  早期終了率: ${earlyTerminationRate.toFixed(1)}%`);

    return {
      standard: standardBenchmark,
      optimized: optimizedBenchmark,
      improvement: {
        speedImprovement,
        cacheHitRate,
        earlyTerminationRate
      }
    };
  }

  /**
   * 異なる設定モードでのパフォーマンス比較
   */
  async runConfigurationBenchmark(iterations: number = 5): Promise<{
    default: BenchmarkResult;
    fast: BenchmarkResult;
    precision: BenchmarkResult;
  }> {
    console.log('⚙️ 設定モード別ベンチマーク開始');

    // デフォルト設定
    const defaultValidator = new (await import('./optimizedValidator')).OptimizedResponseValidator({}, DEFAULT_QUALITY_CONFIG);
    const defaultBenchmark = await performanceMonitor.runBenchmark(
      'Default Mode',
      async () => defaultValidator.assessTechAnalysisQuality(SAMPLE_ANALYSIS_CONTENT, SAMPLE_SOURCES, SAMPLE_TECH_NAME),
      iterations
    );

    // 高速モード
    const fastValidator = new (await import('./optimizedValidator')).OptimizedResponseValidator({}, FAST_MODE_CONFIG);
    const fastBenchmark = await performanceMonitor.runBenchmark(
      'Fast Mode',
      async () => fastValidator.assessTechAnalysisQuality(SAMPLE_ANALYSIS_CONTENT, SAMPLE_SOURCES, SAMPLE_TECH_NAME),
      iterations
    );

    // 高精度モード
    const precisionValidator = new (await import('./optimizedValidator')).OptimizedResponseValidator({}, PRECISION_MODE_CONFIG);
    const precisionBenchmark = await performanceMonitor.runBenchmark(
      'Precision Mode',
      async () => precisionValidator.assessTechAnalysisQuality(SAMPLE_ANALYSIS_CONTENT, SAMPLE_SOURCES, SAMPLE_TECH_NAME),
      iterations
    );

    console.log('📊 設定モード別結果:');
    console.log(`  デフォルト: ${defaultBenchmark.averageTime.toFixed(2)}ms`);
    console.log(`  高速モード: ${fastBenchmark.averageTime.toFixed(2)}ms`);
    console.log(`  高精度モード: ${precisionBenchmark.averageTime.toFixed(2)}ms`);

    return {
      default: defaultBenchmark,
      fast: fastBenchmark,
      precision: precisionBenchmark
    };
  }

  /**
   * キャッシュ効果のテスト
   */
  async runCacheEffectivenessTest(iterations: number = 20): Promise<{
    withCache: BenchmarkResult;
    withoutCache: BenchmarkResult;
    cacheEffectiveness: number;
  }> {
    console.log('💾 キャッシュ効果テスト開始');

    // キャッシュ有効
    const withCacheValidator = new (await import('./optimizedValidator')).OptimizedResponseValidator({ enableCaching: true });
    const withCacheBenchmark = await performanceMonitor.runBenchmark(
      'With Cache',
      async () => withCacheValidator.assessTechAnalysisQuality(SAMPLE_ANALYSIS_CONTENT, SAMPLE_SOURCES, SAMPLE_TECH_NAME),
      iterations
    );

    // キャッシュ無効
    const withoutCacheValidator = new (await import('./optimizedValidator')).OptimizedResponseValidator({ enableCaching: false });
    const withoutCacheBenchmark = await performanceMonitor.runBenchmark(
      'Without Cache',
      async () => withoutCacheValidator.assessTechAnalysisQuality(SAMPLE_ANALYSIS_CONTENT, SAMPLE_SOURCES, SAMPLE_TECH_NAME),
      iterations
    );

    const cacheEffectiveness = ((withoutCacheBenchmark.averageTime - withCacheBenchmark.averageTime) / withoutCacheBenchmark.averageTime) * 100;

    console.log('📊 キャッシュ効果:');
    console.log(`  キャッシュ有効: ${withCacheBenchmark.averageTime.toFixed(2)}ms`);
    console.log(`  キャッシュ無効: ${withoutCacheBenchmark.averageTime.toFixed(2)}ms`);
    console.log(`  効果: ${cacheEffectiveness.toFixed(1)}%の高速化`);

    return {
      withCache: withCacheBenchmark,
      withoutCache: withoutCacheBenchmark,
      cacheEffectiveness
    };
  }

  /**
   * 段階的評価（早期終了）の効果テスト
   */
  async runStageGatingEffectivenessTest(): Promise<{
    withStageGating: BenchmarkResult;
    withoutStageGating: BenchmarkResult;
    earlyTerminationRate: number;
  }> {
    console.log('🚪 段階的評価効果テスト開始');

    // 低品質ソースを使用して早期終了をトリガー
    const lowQualitySources: Source[] = [
      { uri: 'https://blog.example.com/cnf-article', title: 'CNFについて思うこと', domain: 'blog.example.com', snippet: '個人的な意見です' },
      { uri: 'https://forum.example.com/discussion/123', title: 'CNF議論スレッド', domain: 'forum.example.com', snippet: 'みんなで議論しましょう' }
    ];

    // 段階的評価有効
    const withStageGatingValidator = new (await import('./optimizedValidator')).OptimizedResponseValidator({ enableStageGating: true, stageGateThreshold: 50 });
    const withStageGatingBenchmark = await performanceMonitor.runBenchmark(
      'With Stage Gating',
      async () => withStageGatingValidator.assessTechAnalysisQuality(SAMPLE_ANALYSIS_CONTENT, lowQualitySources, SAMPLE_TECH_NAME),
      10
    );

    // 段階的評価無効
    const withoutStageGatingValidator = new (await import('./optimizedValidator')).OptimizedResponseValidator({ enableStageGating: false });
    const withoutStageGatingBenchmark = await performanceMonitor.runBenchmark(
      'Without Stage Gating',
      async () => withoutStageGatingValidator.assessTechAnalysisQuality(SAMPLE_ANALYSIS_CONTENT, lowQualitySources, SAMPLE_TECH_NAME),
      10
    );

    const earlyTerminationRate = (withStageGatingBenchmark.metrics.filter(m => m.earlyTermination).length / withStageGatingBenchmark.metrics.length) * 100;

    console.log('📊 段階的評価効果:');
    console.log(`  段階的評価有効: ${withStageGatingBenchmark.averageTime.toFixed(2)}ms`);
    console.log(`  段階的評価無効: ${withoutStageGatingBenchmark.averageTime.toFixed(2)}ms`);
    console.log(`  早期終了率: ${earlyTerminationRate.toFixed(1)}%`);

    return {
      withStageGating: withStageGatingBenchmark,
      withoutStageGating: withoutStageGatingBenchmark,
      earlyTerminationRate
    };
  }

  /**
   * 総合パフォーマンステストの実行
   */
  async runComprehensiveTest(): Promise<void> {
    console.log('🧪 総合パフォーマンステスト開始\n');

    try {
      // 1. 比較ベンチマーク
      const comparison = await this.runComparisonBenchmark(10);
      
      // 2. 設定モード比較
      const configComparison = await this.runConfigurationBenchmark(5);
      
      // 3. キャッシュ効果テスト
      const cacheTest = await this.runCacheEffectivenessTest(15);
      
      // 4. 段階的評価効果テスト
      const stageGatingTest = await this.runStageGatingEffectivenessTest();

      // 結果サマリー
      console.log('\n🎯 総合テスト結果サマリー:');
      console.log('================================');
      console.log(`✅ 最適化による速度改善: ${comparison.improvement.speedImprovement.toFixed(1)}%`);
      console.log(`✅ キャッシュによる高速化: ${cacheTest.cacheEffectiveness.toFixed(1)}%`);
      console.log(`✅ 早期終了による効率化: ${stageGatingTest.earlyTerminationRate.toFixed(1)}%`);
      console.log(`✅ 高速モードの速度向上: ${((configComparison.default.averageTime - configComparison.fast.averageTime) / configComparison.default.averageTime * 100).toFixed(1)}%`);
      
      // パフォーマンスレポート生成
      const report = performanceMonitor.generateReport();
      console.log('\n📋 詳細パフォーマンスレポート:');
      console.log(report);

    } catch (error) {
      console.error('❌ テスト実行中にエラーが発生:', error);
    }
  }
}

// エクスポート
export const qualityBenchmark = new QualityBenchmark();