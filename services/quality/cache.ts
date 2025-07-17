/**
 * Simple in-memory cache implementation for quality assessment
 */

// Cache for domain reliability scores
export const domainReliabilityCache = new Map<string, number>();

// Cache for content analysis results
export const contentAnalysisCache = new Map<string, any>();

// Cache management functions
export const clearCaches = () => {
  domainReliabilityCache.clear();
  contentAnalysisCache.clear();
};

export const getCacheStats = () => {
  return {
    domainReliabilitySize: domainReliabilityCache.size,
    contentAnalysisSize: contentAnalysisCache.size
  };
};