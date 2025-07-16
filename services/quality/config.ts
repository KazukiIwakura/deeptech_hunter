/**
 * 品質評価システムの設定とパフォーマンス最適化オプション
 */

export interface QualitySystemConfig {
  // キャッシュ設定
  cache: {
    enabled: boolean;
    domainReliabilityTTL: number; // ドメイン信頼性キャッシュの有効期限（ms）
    contentAnalysisTTL: number;   // コンテンツ分析キャッシュの有効期限（ms）
    maxCacheSize: number;         // 最大キャッシュサイズ
    cleanupInterval: number;      // クリーンアップ間隔（ms）
  };

  // 並列処理設定
  parallelProcessing: {
    enabled: boolean;
    maxConcurrency: number;       // 最大同時実行数
    timeoutMs: number;           // タイムアウト時間（ms）
  };

  // 段階的評価設定
  stageGating: {
    enabled: boolean;
    criticalThreshold: number;    // 重要評価の閾値（この値以下で早期終了）
    skipNonCritical: boolean;     // 非重要評価をスキップするか
  };

  // 軽量化設定
  optimization: {
    enableFastMode: boolean;      // 高速モード（精度を犠牲にして速度優先）
    maxContentLength: number;     // 分析対象コンテンツの最大長
    maxSourceCount: number;       // 分析対象ソースの最大数
    enableEarlyTermination: boolean; // 早期終了を有効にするか
  };

  // ログ設定
  logging: {
    enablePerformanceLogging: boolean;
    enableDetailedLogging: boolean;
    logCacheHitRate: boolean;
  };
}

// デフォルト設定
export const DEFAULT_QUALITY_CONFIG: QualitySystemConfig = {
  cache: {
    enabled: true,
    domainReliabilityTTL: 30 * 60 * 1000, // 30分
    contentAnalysisTTL: 10 * 60 * 1000,   // 10分
    maxCacheSize: 1000,
    cleanupInterval: 5 * 60 * 1000        // 5分
  },

  parallelProcessing: {
    enabled: true,
    maxConcurrency: 4,
    timeoutMs: 2000 // 2秒
  },

  stageGating: {
    enabled: true,
    criticalThreshold: 40,
    skipNonCritical: false
  },

  optimization: {
    enableFastMode: false,
    maxContentLength: 5000,  // 5000文字まで
    maxSourceCount: 10,      // 最大10ソース
    enableEarlyTermination: true
  },

  logging: {
    enablePerformanceLogging: true,
    enableDetailedLogging: false,
    logCacheHitRate: true
  }
};

// 高速モード設定（速度優先）
export const FAST_MODE_CONFIG: QualitySystemConfig = {
  ...DEFAULT_QUALITY_CONFIG,
  parallelProcessing: {
    enabled: true,
    maxConcurrency: 6,
    timeoutMs: 1000 // 1秒
  },
  stageGating: {
    enabled: true,
    criticalThreshold: 50, // より緩い閾値
    skipNonCritical: true  // 非重要評価をスキップ
  },
  optimization: {
    enableFastMode: true,
    maxContentLength: 2000,  // より短い分析対象
    maxSourceCount: 5,       // より少ないソース
    enableEarlyTermination: true
  }
};

// 高精度モード設定（精度優先）
export const PRECISION_MODE_CONFIG: QualitySystemConfig = {
  ...DEFAULT_QUALITY_CONFIG,
  parallelProcessing: {
    enabled: true,
    maxConcurrency: 2,
    timeoutMs: 5000 // 5秒
  },
  stageGating: {
    enabled: false,          // 段階的評価を無効化
    criticalThreshold: 0,
    skipNonCritical: false
  },
  optimization: {
    enableFastMode: false,
    maxContentLength: 10000, // より長い分析対象
    maxSourceCount: 20,      // より多くのソース
    enableEarlyTermination: false
  }
};

// 環境変数から設定を読み込む関数
export function loadQualityConfig(): QualitySystemConfig {
  // 本番環境では環境変数から設定を読み込み
  const mode = process.env.QUALITY_MODE || 'default';
  
  switch (mode.toLowerCase()) {
    case 'fast':
      return FAST_MODE_CONFIG;
    case 'precision':
      return PRECISION_MODE_CONFIG;
    default:
      return DEFAULT_QUALITY_CONFIG;
  }
}

// 現在の設定
export const CURRENT_QUALITY_CONFIG = loadQualityConfig();