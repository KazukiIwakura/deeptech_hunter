#!/usr/bin/env tsx

/**
 * パフォーマンス最適化システムのテストスクリプト
 * 使用方法: npm run test:performance
 */

import { qualityBenchmark } from '../services/quality/benchmark';
import { performanceMonitor } from '../services/quality/performance';
import { optimizedResponseValidator } from '../services/quality/optimizedValidator';

async function main() {
  console.log('🚀 品質評価システム パフォーマンステスト開始\n');
  
  try {
    // 1. 簡単な動作確認
    console.log('1️⃣ 基本動作確認...');
    const testContent = 'これはテスト用の分析コンテンツです。技術的な内容を含み、市場分析とリスク評価も記載されています。';
    const testSources = [
      { uri: 'https://example.com/test', title: 'テスト記事', domain: 'example.com', snippet: 'テスト用のスニペット' }
    ];
    
    const startTime = Date.now();
    const result = await optimizedResponseValidator.assessTechAnalysisQuality(
      testContent,
      testSources,
      'テスト技術'
    );
    const endTime = Date.now();
    
    console.log(`✅ 基本動作確認完了: ${endTime - startTime}ms`);
    console.log(`   総合スコア: ${result.overallScore.toFixed(1)}`);
    console.log(`   信頼度: ${result.confidence}`);
    console.log('');

    // 2. キャッシュ効果の確認
    console.log('2️⃣ キャッシュ効果確認...');
    const cacheTest = await qualityBenchmark.runCacheEffectivenessTest(5);
    console.log(`✅ キャッシュ効果: ${cacheTest.cacheEffectiveness.toFixed(1)}%の高速化\n`);

    // 3. 段階的評価の確認
    console.log('3️⃣ 段階的評価確認...');
    const stageGatingTest = await qualityBenchmark.runStageGatingEffectivenessTest();
    console.log(`✅ 早期終了率: ${stageGatingTest.earlyTerminationRate.toFixed(1)}%\n`);

    // 4. 設定モード比較
    console.log('4️⃣ 設定モード比較...');
    const configTest = await qualityBenchmark.runConfigurationBenchmark(3);
    console.log(`✅ デフォルト: ${configTest.default.averageTime.toFixed(2)}ms`);
    console.log(`✅ 高速モード: ${configTest.fast.averageTime.toFixed(2)}ms`);
    console.log(`✅ 高精度モード: ${configTest.precision.averageTime.toFixed(2)}ms\n`);

    // 5. 総合統計
    console.log('5️⃣ 総合統計情報...');
    const stats = performanceMonitor.getStats();
    console.log(`✅ キャッシュヒット率: ${performanceMonitor.getCacheHitRate().toFixed(1)}%`);
    console.log(`✅ 実行されたテスト数: ${Object.keys(stats).length}`);
    
    // パフォーマンスレポート生成
    const report = performanceMonitor.generateReport();
    console.log('\n📋 詳細レポート:');
    console.log('================');
    console.log(report);

    console.log('🎉 すべてのテストが正常に完了しました！');

  } catch (error) {
    console.error('❌ テスト実行中にエラーが発生しました:', error);
    process.exit(1);
  }
}

// スクリプト実行
if (require.main === module) {
  main().catch(console.error);
}

export { main as testPerformance };