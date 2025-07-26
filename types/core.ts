// Core business entities
export interface DeepTech {
  id: string;
  techName: string;
  university: string;
  summary: string;
  potentialApplications: string[];
  researchLab: string;
  uniqueness: string;
  potentialImpact: 'High' | 'Medium' | 'Low';
  marketRisk: 'High' | 'Medium' | 'Low';
  techRisk: 'High' | 'Medium' | 'Low';
}

export interface Source {
  uri: string;
  title: string;
  snippet?: string;
  domain: string;
}

export interface OverseasStartup {
  startupName: string;
  country: string;
  funding: string;
  summary: string;
  fundingSourceUrl?: string;
  business_model: string;
  technology_summary: string;
  key_investors: string[];
  latest_milestone: string;
}

export interface TechExplanationData {
  what_is_it: string;
  why_is_it_important: string;
  what_future_it_creates: string;
}

// Deep Dive Analysis Structured Data
export interface ScorecardData {
  potentialImpact: { score: number; rationale: string; };
  marketRisk: { score: number; rationale: string; };
  techRisk: { score: number; rationale: string; };
  overallGrade: 'S' | 'A' | 'B' | 'C' | 'D' | 'E';
  summary: string;
}

export interface SummarySectionData {
  content: string;
}

export interface PotentialImpactData {
  problemAndMarketSize: string;
  monopolyPotential: string;
  profitModel: string;
}

export interface MarketRiskData {
  customerPain: string;
  competition: string;
  businessBarriers: string;
}

export interface TechRiskData {
  technicalChallenge: string;
  trlAndTrackRecord: string;
  ipPortfolio: string;
}

export interface KeyFlagsData {
  positive: string[];
  concerns: string[];
}

export interface DeepDiveAnalysisData {
  scorecard: ScorecardData;
  summary: SummarySectionData;
  potentialImpact: PotentialImpactData;
  marketRisk: MarketRiskData;
  techRisk: TechRiskData;
  keyFlags: KeyFlagsData;
  killerQuestions: string[];
}

// Quality Assessment Types
export interface QualityDimension {
  name: string;
  score: number;
  description: string;
  issues: string[];
}

export interface QualityAssessment {
  overallScore: number; // 0-100
  dimensions: QualityDimension[];
  recommendations: string[];
  confidence: 'high' | 'medium' | 'low';
  needsVerification: boolean;
}

export interface ReliabilityFactor {
  type: 'domain_authority' | 'content_type' | 'recency' | 'academic_source';
  score: number;
  description: string;
}

export interface ReliabilityScore {
  score: number; // 0-100
  factors: ReliabilityFactor[];
  category: 'high' | 'medium' | 'low';
}

// Enhanced Source with reliability information
export interface EnhancedSource extends Source {
  reliability?: ReliabilityScore;
}

// Quality Metrics for API responses
export interface QualityMetrics {
  averageReliability: number;
  highQualityCount: number;
  recommendations: string[];
}

// Chat related types are now in types/ui.ts to avoid duplication