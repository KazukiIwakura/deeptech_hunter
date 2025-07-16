# 品質評価システム - パフォーマンス最適化

## 概要

このモジュールは、AI応答の品質評価システムのパフォーマンスを最適化するための実装です。キャッシュ機構、並列処理、段階的評価、軽量アルゴリズムを組み合わせて、品質評価の処理速度と効率性を大幅に向上させています。

## ファイル構成

```
services/quality/
├── sourceReliability.ts    # ソース信頼性評価
├── responseValidator.ts    # 標準品質評価システム
├── optimizedValidator.ts   # 最適化された品質評価システム
├── cache.ts               # キャッシュ機構
├── config.ts              # 設定管理
├── performance.ts         # パフォーマンス監視
├── benchmark.ts           # ベンチマークツール
└── README.md              # このファイル
```

## 主要機能

### 1. キャッシュ機構 (`cache.ts`)

ドメイン信頼性スコアやコンテンツ分析結果をメモリにキャッシュし、重複計算を回避します。

```typescript
// 使用例
import { domainReliabilityCache } from './cache';

// キャッシュ確認
const cachedScore = domainReliabilityCache.get('example.com');
if (cachedScore !== undefined) {
  return cachedScore;
}

// 新しい値をキャッシュ
domainReliabilityCache.set('example.com', 85);
```

### 2. 最適化された品質評価 (`optimizedValidator.ts`)

並列処理、段階的評価、軽量アルゴリズムを組み合わせた高速な品質評価システムです。

```typescript
// 使用例
import { optimizedResponseValidator } from './optimizedValidator';

const assessment = await optimizedResponseValidator.assessTechAnalysisQuality(
  analysisContent,
  sources,
  techName
);
```

### 3. 設定管理 (`config.ts`)

異なる用途に合わせた設定プリセットを提供します。

```typescript
// 使用例
import { OptimizedResponseValidator } from './optimizedValidator';
import { FAST_MODE_CONFIG } from './config';

// 高速モードで初期化
const validator = new OptimizedResponseValidator({}, FAST_MODE_CONFIG);
```

### 4. パフォーマンス監視 (`performance.ts`)

処理時間、キャッシュヒット率、メモリ使用量などのメトリクスを収集・分析します。

```typescript
// 使用例
import { performanceMonitor } from './performance';

// 測定開始
const endMeasurement = performanceMonitor.startMeasurement('my-test');

// 処理実行
doSomething();

// 測定終了と結果取得
const metrics = endMeasurement();
console.log(`処理時間: ${metrics.totalTime}ms`);
```

### 5. ベンチマーク (`benchmark.ts`)

異なる設定や実装間のパフォーマンス比較を行います。

```typescript
// 使用例
import { qualityBenchmark } from './benchmark';

// 標準システムと最適化システムの比較
const results = await qualityBenchmark.runComparisonBenchmark();
console.log(`速度改善: ${results.improvement.speedImprovement}%`);
```

## 使用方法

### 基本的な使用

```typescript
import { optimizedResponseValidator } from './services/quality/optimizedValidator';

// 品質評価の実行
const assessment = await optimizedResponseValidator.assessTechAnalysisQuality(
  analysisContent,
  sources,
  techName
);

console.log(`総合スコア: ${assessment.overallScore}`);
console.log(`信頼度: ${assessment.confidence}`);
console.log(`検証推奨: ${assessment.needsVerification ? 'はい' : 'いいえ'}`);
```

### カスタム設定

```typescript
import { OptimizedResponseValidator } from './services/quality/optimizedValidator';

// カスタム設定でインスタンス化
const validator = new OptimizedResponseValidator({
  enableParallelProcessing: true,
  enableStageGating: true,
  stageGateThreshold: 50,  // 閾値を調整
  enableCaching: true,
  maxProcessingTime: 3000  // タイムアウトを延長
});

const assessment = await validator.assessTechAnalysisQuality(content, sources, name);
```

### 環境変数による設定

`QUALITY_MODE` 環境変数を設定することで、アプリケーション全体の品質評価モードを切り替えられます。

```bash
# 高速モード（速度優先）
QUALITY_MODE=fast npm run dev

# 高精度モード（精度優先）
QUALITY_MODE=precision npm run dev

# デフォルトモード
QUALITY_MODE=default npm run dev
```

## テストとベンチマーク

### パフォーマンステスト実行

```bash
npm run test:performance
```

### ベンチマーク実行

```bash
npm run benchmark:quality
```

## パフォーマンス指標

最適化システムは以下のパフォーマンス改善を実現します：

- **処理速度**: 標準システム比で30-60%の高速化
- **キャッシュ効果**: キャッシュヒット時は最大80%の高速化
- **早期終了**: 低品質ソースの場合、最大70%の処理時間削減
- **メモリ効率**: 重複計算の回避によるメモリ使用量の削減

## 注意事項

- キャッシュはメモリ内に保持されるため、アプリケーション再起動時にクリアされます
- 並列処理はブラウザ環境では制限される場合があります
- 高速モードでは精度が若干低下する可能性があります

## 今後の拡張予定

- 分散キャッシュ（Redis等）の導入
- WebWorkerによる並列処理の強化
- 機械学習による動的閾値調整
- リアルタイム品質監視ダッシュボード