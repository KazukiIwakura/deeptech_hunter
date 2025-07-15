// AI and API related types
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