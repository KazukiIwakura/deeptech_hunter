import type { Chat } from "@google/genai";

// DeepTech represents a technology discovered through the hunt process
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

// Source represents a web source used in AI responses
export interface Source {
  uri: string;
  title: string;
  snippet?: string;
  domain: string;
}

// TechExplanationData represents the explanation of a technology
export interface TechExplanationData {
  what_is_it: string;
  why_is_it_important: string;
  what_future_it_creates: string;
}

// OverseasStartup represents a startup found in overseas markets
export interface OverseasStartup {
  startupName: string;
  country: string;
  funding: string;
  summary: string;
  fundingSourceUrl: string;
  business_model: string;
  technology_summary: string;
  key_investors: string[];
  latest_milestone: string;
}

// DeepDiveAnalysisData represents the full analysis of a technology
export interface DeepDiveAnalysisData {
  scorecard: {
    potentialImpact: { score: number; rationale: string };
    marketRisk: { score: number; rationale: string };
    techRisk: { score: number; rationale: string };
    overallGrade: 'S' | 'A' | 'B' | 'C' | 'D' | 'E';
    summary: string;
  };
  summary: {
    content: string;
  };
  potentialImpact: {
    problemAndMarketSize: string;
    monopolyPotential: string;
    profitModel: string;
  };
  marketRisk: {
    customerPain: string;
    competition: string;
    businessBarriers: string;
  };
  techRisk: {
    technicalChallenge: string;
    trlAndTrackRecord: string;
    ipPortfolio: string;
  };
  keyFlags: {
    positive: string[];
    concerns: string[];
  };
  killerQuestions: string[];
}

// ChatMessage represents a message in a chat session
export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
}

// ChatSession represents a chat session with the AI
export interface ChatSession {
  id: string;
  title: string;
  tech: DeepTech;
  messages: ChatMessage[];
  geminiChat: Chat;
  initialAnalysis: string;
  sources: Source[];
  suggestions: string[];
  suggestionsLoading: boolean;
}

// Quality assessment interfaces
export interface QualityDimension {
  name: string;
  score: number;
  description: string;
  issues: string[];
}

export interface QualityAssessment {
  overallScore: number;
  dimensions: QualityDimension[];
  recommendations: string[];
  confidence: 'high' | 'medium' | 'low';
  needsVerification: boolean;
}