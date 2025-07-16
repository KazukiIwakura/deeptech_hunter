/**
 * 品質評価システム用のキャッシュ機構
 * ドメイン信頼性スコアや評価結果をメモリにキャッシュして高速化
 */

export interface CacheEntry<T> {
  value: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

export class QualityCache<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private defaultTTL: number;

  constructor(defaultTTL: number = 5 * 60 * 1000) { // 5分デフォルト
    this.defaultTTL = defaultTTL;
  }

  set(key: string, value: T, ttl?: number): void {
    const entry: CacheEntry<T> = {
      value,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL
    };
    this.cache.set(key, entry);
  }

  get(key: string): T | undefined {
    const entry = this.cache.get(key);
    if (!entry) return undefined;

    // TTL チェック
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return undefined;
    }

    return entry.value;
  }

  has(key: string): boolean {
    return this.get(key) !== undefined;
  }

  clear(): void {
    this.cache.clear();
  }

  // 期限切れエントリの定期クリーンアップ
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }

  // キャッシュ統計情報
  getStats(): { size: number; hitRate: number } {
    return {
      size: this.cache.size,
      hitRate: 0 // 実装を簡略化、必要に応じて追加
    };
  }
}

// グローバルキャッシュインスタンス
export const domainReliabilityCache = new QualityCache<number>(30 * 60 * 1000); // 30分
export const contentAnalysisCache = new QualityCache<any>(10 * 60 * 1000); // 10分

// 定期的なクリーンアップ（5分ごと）
if (typeof window !== 'undefined') {
  setInterval(() => {
    domainReliabilityCache.cleanup();
    contentAnalysisCache.cleanup();
  }, 5 * 60 * 1000);
}