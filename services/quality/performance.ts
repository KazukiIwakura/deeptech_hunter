/**
 * 品質評価システムのパフォーマンス監視とベンチマーク
 */

export interface PerformanceMetrics {
  totalTime: number;
  cacheHitRate: number;
  parallelProcessingTime?: number;
  sequentialProcessingTime?: number;
  stageGatingEnabled: boolean;
  earlyTermination: boolean;
  memoryUsage?: number;
}

export interface BenchmarkResult {
  testName: string;
  iterations: number;
  averageTime: number;
  minTime: number;
  maxTime: number;
  successRate: number;
  metrics: PerformanceMetrics[];
}

export class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetrics[]> = new Map();
  private cacheHits = 0;
  private cacheMisses = 0;

  /**
   * パフォーマンス測定開始
   */
  startMeasurement(testId: string): (additionalData?: Partial<PerformanceMetrics>) => PerformanceMetrics {
    const startTime = performance.now();
    const startMemory = this.getMemoryUsage();

    return (additionalData: Partial<PerformanceMetrics> = {}): PerformanceMetrics => {
      const endTime = performance.now();
      const endMemory = this.getMemoryUsage();

      const metrics: PerformanceMetrics = {
        totalTime: endTime - startTime,
        cacheHitRate: this.getCacheHitRate(),
        memoryUsage: endMemory - startMemory,
        stageGatingEnabled: false,
        earlyTermination: false,
        ...additionalData
      };

      // メトリクスを保存
      if (!this.metrics.has(testId)) {
        this.metrics.set(testId, []);
      }
      this.metrics.get(testId)!.push(metrics);

      return metrics;
    };
  }

  /**
   * キャッシュヒット記録
   */
  recordCacheHit(): void {
    this.cacheHits++;
  }

  /**
   * キャッシュミス記録
   */
  recordCacheMiss(): void {
    this.cacheMisses++;
  }

  /**
   * キャッシュヒット率取得
   */
  getCacheHitRate(): number {
    const total = this.cacheHits + this.cacheMisses;
    return total > 0 ? (this.cacheHits / total) * 100 : 0;
  }

  /**
   * メモリ使用量取得（ブラウザ環境では概算）
   */
  private getMemoryUsage(): number {
    if (typeof performance !== 'undefined' && 'memory' in performance) {
      return (performance as any).memory.usedJSHeapSize;
    }
    return 0;
  }

  /**
   * 統計情報取得
   */
  getStats(testId?: string): { [key: string]: any } {
    if (testId) {
      const testMetrics = this.metrics.get(testId) || [];
      return this.calculateStats(testMetrics);
    }

    const allStats: { [key: string]: any } = {};
    for (const [id, metrics] of this.metrics.entries()) {
      allStats[id] = this.calculateStats(metrics);
    }
    return allStats;
  }

  /**
   * 統計計算
   */
  private calculateStats(metrics: PerformanceMetrics[]): any {
    if (metrics.length === 0) return {};

    const times = metrics.map(m => m.totalTime);
    const cacheHitRates = metrics.map(m => m.cacheHitRate);

    return {
      count: metrics.length,
      averageTime: times.reduce((a, b) => a + b, 0) / times.length,
      minTime: Math.min(...times),
      maxTime: Math.max(...times),
      averageCacheHitRate: cacheHitRates.reduce((a, b) => a + b, 0) / cacheHitRates.length,
      earlyTerminationRate: (metrics.filter(m => m.earlyTermination).length / metrics.length) * 100
    };
  }

  /**
   * ベンチマークテスト実行
   */
  async runBenchmark(
    testName: string,
    testFunction: () => Promise<any>,
    iterations: number = 10
  ): Promise<BenchmarkResult> {
    const results: PerformanceMetrics[] = [];
    let successCount = 0;

    console.log(`Starting benchmark: ${testName} (${iterations} iterations)`);

    for (let i = 0; i < iterations; i++) {
      try {
        const endMeasurement = this.startMeasurement(`benchmark-${testName}-${i}`);
        await testFunction();
        const metrics = endMeasurement();
        results.push(metrics);
        successCount++;
      } catch (error) {
        console.warn(`Benchmark iteration ${i + 1} failed:`, error);
      }
    }

    const times = results.map(r => r.totalTime);
    const benchmarkResult: BenchmarkResult = {
      testName,
      iterations,
      averageTime: times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0,
      minTime: times.length > 0 ? Math.min(...times) : 0,
      maxTime: times.length > 0 ? Math.max(...times) : 0,
      successRate: (successCount / iterations) * 100,
      metrics: results
    };

    console.log(`Benchmark completed: ${testName}`, {
      averageTime: `${benchmarkResult.averageTime.toFixed(2)}ms`,
      successRate: `${benchmarkResult.successRate.toFixed(1)}%`
    });

    return benchmarkResult;
  }

  /**
   * パフォーマンスレポート生成
   */
  generateReport(): string {
    const stats = this.getStats();
    let report = '# 品質評価システム パフォーマンスレポート\n\n';

    report += `## 全体統計\n`;
    report += `- キャッシュヒット率: ${this.getCacheHitRate().toFixed(1)}%\n`;
    report += `- 総キャッシュヒット数: ${this.cacheHits}\n`;
    report += `- 総キャッシュミス数: ${this.cacheMisses}\n\n`;

    for (const [testId, testStats] of Object.entries(stats)) {
      report += `## ${testId}\n`;
      report += `- 実行回数: ${testStats.count}\n`;
      report += `- 平均実行時間: ${testStats.averageTime?.toFixed(2)}ms\n`;
      report += `- 最短実行時間: ${testStats.minTime?.toFixed(2)}ms\n`;
      report += `- 最長実行時間: ${testStats.maxTime?.toFixed(2)}ms\n`;
      report += `- 平均キャッシュヒット率: ${testStats.averageCacheHitRate?.toFixed(1)}%\n`;
      report += `- 早期終了率: ${testStats.earlyTerminationRate?.toFixed(1)}%\n\n`;
    }

    return report;
  }

  /**
   * メトリクスリセット
   */
  reset(): void {
    this.metrics.clear();
    this.cacheHits = 0;
    this.cacheMisses = 0;
  }
}

// グローバルパフォーマンスモニター
export const performanceMonitor = new PerformanceMonitor();