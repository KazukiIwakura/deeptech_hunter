/**
 * Performance monitoring for quality assessment system
 */

interface PerformanceMetrics {
  totalTime: number;
  cacheHitRate: number;
  stageGatingEnabled: boolean;
  earlyTermination: boolean;
}

class PerformanceMonitor {
  private measurements: Map<string, { startTime: number, metrics?: PerformanceMetrics }> = new Map();
  private cacheHits = 0;
  private cacheMisses = 0;
  
  /**
   * Start measuring performance for a named operation
   * @param operationName Unique identifier for the operation
   * @returns Function to call when operation completes
   */
  startMeasurement(operationName: string) {
    const startTime = performance.now();
    this.measurements.set(operationName, { startTime });
    
    return (additionalMetrics: Omit<PerformanceMetrics, 'totalTime'>) => {
      const endTime = performance.now();
      const totalTime = endTime - startTime;
      
      const metrics: PerformanceMetrics = {
        totalTime,
        ...additionalMetrics
      };
      
      this.measurements.set(operationName, { 
        startTime, 
        metrics 
      });
      
      return metrics;
    };
  }
  
  /**
   * Record a cache hit
   */
  recordCacheHit() {
    this.cacheHits++;
  }
  
  /**
   * Record a cache miss
   */
  recordCacheMiss() {
    this.cacheMisses++;
  }
  
  /**
   * Get the current cache hit rate
   * @returns Cache hit rate as a percentage
   */
  getCacheHitRate(): number {
    const total = this.cacheHits + this.cacheMisses;
    if (total === 0) return 0;
    return (this.cacheHits / total) * 100;
  }
  
  /**
   * Get metrics for a specific operation
   * @param operationName The operation name
   * @returns Performance metrics or undefined if not found
   */
  getMetrics(operationName: string): PerformanceMetrics | undefined {
    return this.measurements.get(operationName)?.metrics;
  }
  
  /**
   * Get summary of all performance metrics
   */
  getSummary() {
    const summary = {
      operations: {} as Record<string, PerformanceMetrics>,
      cacheHitRate: this.getCacheHitRate(),
      totalOperations: this.measurements.size
    };
    
    for (const [name, data] of this.measurements.entries()) {
      if (data.metrics) {
        summary.operations[name] = data.metrics;
      }
    }
    
    return summary;
  }
  
  /**
   * Reset all performance metrics
   */
  reset() {
    this.measurements.clear();
    this.cacheHits = 0;
    this.cacheMisses = 0;
  }
}

export const performanceMonitor = new PerformanceMonitor();