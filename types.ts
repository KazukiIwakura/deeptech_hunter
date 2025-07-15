import type { Chat } from '@google/genai';

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
  summary:string;
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

export type ChatRole = 'user' | 'model';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
}

export interface ChatSession {
  id:string;
  title: string;
  tech: DeepTech;
  messages: ChatMessage[];
  geminiChat: Chat;
  initialAnalysis: string;
  sources: Source[];
  suggestions: string[];
  suggestionsLoading: boolean;
}

export type AiStepStatus = 'pending' | 'in-progress' | 'completed' | 'error';
export type AiStepType =
  | 'explanation'
  | 'domestic'
  | 'overseas'
  | 'synthesis'
  | 'more-domestic'
  | 'more-overseas'
  | 'deep-dive';

export interface AiStep {
  id: string;
  type: AiStepType;
  title: string;
  status: AiStepStatus;
  description: string;
  startTime?: number;
  endTime?: number;
  error?: string;
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

export type ResearchMode = 'balanced' | 'deep';