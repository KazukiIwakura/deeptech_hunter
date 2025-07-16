/**
 * Quality system configuration
 */

export interface QualitySystemConfig {
  parallelProcessing: {
    enabled: boolean;
    timeoutMs: number;
  };
  stageGating: {
    enabled: boolean;
    criticalThreshold: number;
  };
  cache: {
    enabled: boolean;
    maxSize: number;
    ttlMs: number;
  };
  logging: {
    enableDetailedLogging: boolean;
    enablePerformanceLogging: boolean;
  };
}

// Default configuration
export const CURRENT_QUALITY_CONFIG: QualitySystemConfig = {
  parallelProcessing: {
    enabled: true,
    timeoutMs: 5000, // 5 seconds timeout for parallel processing
  },
  stageGating: {
    enabled: true,
    criticalThreshold: 40, // If source reliability is below 40, skip detailed analysis
  },
  cache: {
    enabled: true,
    maxSize: 100, // Maximum number of cached items
    ttlMs: 3600000, // 1 hour cache TTL
  },
  logging: {
    enableDetailedLogging: false,
    enablePerformanceLogging: true,
  }
};