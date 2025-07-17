#!/usr/bin/env tsx

/**
 * 品質評価システム ベンチマーク実行スクリプト
 * 使用方法: npm run benchmark:quality
 */

import { qualityBenchmark } from './benchmark';
import { performanceMonitor } from './performance';
import { CURRENT_QUALITY_CONFIG } from './config';

async function main() {
  console.log('🚀 品質評価システム ベンチマーク開始\n');
  console.log(`📊 現在の設定モード: ${process.env.QUALITY_MODE || 'default'}`);
  console.log('==================================\n');
  
  try {
    // 1. 標準システムと最適化システムの比較
    console.log('🔍 標準システム vs 最適化システム 比較テスト');
    console.log('------------------------------------------');
    const comparison = await qualityBenchmark.runComparisonBenchmark(5);
    console.log(`✅ 速度改善: ${comparison.improvement.speedImprovement.toFixed(1)}%`);
    console.log(`✅ キャッシュヒット率: ${comparison.improvement.cacheHitRate.toFixed(1)}%`);
    console.log(`✅ 早期終了率: ${comparison.improvement.earlyTerminationRate.toFixed(1)}%\n`);

    // 2. 設定モード比較
    console.log('🔍 設定モード比較テスト');
    console.log('------------------');
    const configComparison = await qualityBenchmark.runConfigurationBenchmark(3);
    const fastImprovement = ((configComparison.default.averageTime - configComparison.fast.averageTime) / configComparison.default.averageTime * 100);
    console.log(`✅ 高速モードの速度向上: ${fastImprovement.toFixed(1)}%`);
    console.log(`✅ 高精度モードの処理時間: ${(configComparison.precision.averageTime / configComparison.default.averageTime).toFixed(2)}倍\n`);

    // 3. キャッシュ効果テスト
    console.log('🔍 キャッシュ効果テスト');
    console.log('------------------');
    const cacheTest = await qualityBenchmark.runCacheEffectivenessTest(10);
    console.log(`✅ キャッシュによる高速化: ${cacheTest.cacheEffectiveness.toFixed(1)}%\n`);

    // 4. 段階的評価効果テスト
    console.log('🔍 段階的評価効果テスト');
    console.log('------------------');
    const stageGatingTest = await qualityBenchmark.runStageGatingEffectivenessTest();
    console.log(`✅ 早期終了による効率化: ${stageGatingTest.earlyTerminationRate.toFixed(1)}%`);
    console.log(`✅ 処理時間削減: ${((stageGatingTest.withoutStageGating.averageTime - stageGatingTest.withStageGating.averageTime) / stageGatingTest.withoutStageGating.averageTime * 100).toFixed(1)}%\n`);

    // 5. 総合結果
    console.log('📈 総合ベンチマーク結果');
    console.log('====================');
    console.log(`✅ 標準システム平均処理時間: ${comparison.standard.averageTime.toFixed(2)}ms`);
    console.log(`✅ 最適化システム平均処理時間: ${comparison.optimized.averageTime.toFixed(2)}ms`);
    console.log(`✅ 総合速度改善: ${comparison.improvement.speedImprovement.toFixed(1)}%`);
    console.log(`✅ キャッシュ効果: ${cacheTest.cacheEffectiveness.toFixed(1)}%`);
    console.log(`✅ 早期終了効果: ${stageGatingTest.earlyTerminationRate.toFixed(1)}%\n`);

    // 6. 設定情報
    console.log('⚙️ 現在の設定情報');
    console.log('----------------');
    console.log(`✅ 並列処理: ${CURRENT_QUALITY_CONFIG.parallelProcessing.enabled ? '有効' : '無効'}`);
    console.log(`✅ キャッシュ: ${CURRENT_QUALITY_CONFIG.cache.enabled ? '有効' : '無効'}`);
    console.log(`✅ 段階的評価: ${CURRENT_QUALITY_CONFIG.stageGating.enabled ? '有効' : '無効'}`);
    console.log(`✅ 高速モード: ${CURRENT_QUALITY_CONFIG.optimization.enableFastMode ? '有効' : '無効'}\n`);

    // 7. パフォーマンスレポート
    console.log('📋 詳細パフォーマンスレポート');
    console.log('========================');
    const report = performanceMonitor.generateReport();
    console.log(report);

    console.log('\n🎉 ベンチマーク完了!');
    console.log('最適化システムは標準システムと比較して、平均で');
    console.log(`${comparison.improvement.speedImprovement.toFixed(1)}%の速度向上を実現しています。`);

  } catch (error) {
    console.error('❌ ベンチマーク実行中にエラーが発生しました:', error);
    process.exit(1);
  }
}

// スクリプト実行
if (require.main === module) {
  main().catch(console.error);
}

export { main as runBenchmark };