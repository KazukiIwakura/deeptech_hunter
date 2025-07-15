import { z } from 'zod';

// For DeepTech results from huntDeepTech
// The API doesn't return `id`, it's added client-side.
export const deepTechSchema = z.object({
  techName: z.string().min(1, { message: "techName is required" }),
  university: z.string().min(1, { message: "university is required" }),
  summary: z.string().min(1, { message: "summary is required" }),
  potentialApplications: z.array(z.string()),
  researchLab: z.string(),
  uniqueness: z.string(),
  potentialImpact: z.enum(['High', 'Medium', 'Low']),
  marketRisk: z.enum(['High', 'Medium', 'Low']),
  techRisk: z.enum(['High', 'Medium', 'Low']),
});
export const deepTechArraySchema = z.array(deepTechSchema);

// For TechExplanation
export const techExplanationSchema = z.object({
  what_is_it: z.string(),
  why_is_it_important: z.string(),
  what_future_it_creates: z.string(),
});

// For OverseasStartups
export const overseasStartupSchema = z.object({
  startupName: z.string(),
  country: z.string(),
  funding: z.string(),
  summary:z.string(),
  fundingSourceUrl: z.string().optional(),
  business_model: z.string(),
  technology_summary: z.string(),
  key_investors: z.array(z.string()),
  latest_milestone: z.string(),
});
export const overseasStartupArraySchema = z.array(overseasStartupSchema);

// For DeepDiveAnalysis
const scorecardDataSchema = z.object({
  potentialImpact: z.object({ score: z.number(), rationale: z.string() }),
  marketRisk: z.object({ score: z.number(), rationale: z.string() }),
  techRisk: z.object({ score: z.number(), rationale: z.string() }),
  overallGrade: z.enum(['S', 'A', 'B', 'C', 'D', 'E']),
  summary: z.string(),
});

const summarySectionDataSchema = z.object({
  content: z.string(),
});

const potentialImpactDataSchema = z.object({
  problemAndMarketSize: z.string(),
  monopolyPotential: z.string(),
  profitModel: z.string(),
});

const marketRiskDataSchema = z.object({
  customerPain: z.string(),
  competition: z.string(),
  businessBarriers: z.string(),
});

const techRiskDataSchema = z.object({
  technicalChallenge: z.string(),
  trlAndTrackRecord: z.string(),
  ipPortfolio: z.string(),
});

const keyFlagsDataSchema = z.object({
  positive: z.array(z.string()),
  concerns: z.array(z.string()),
});

export const deepDiveAnalysisSchema = z.object({
  scorecard: scorecardDataSchema,
  summary: summarySectionDataSchema,
  potentialImpact: potentialImpactDataSchema,
  marketRisk: marketRiskDataSchema,
  techRisk: techRiskDataSchema,
  keyFlags: keyFlagsDataSchema,
  killerQuestions: z.array(z.string()),
});

// For Suggestions from Discovery & Chat
export const suggestionsSchema = z.array(z.string());