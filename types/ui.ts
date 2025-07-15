import type { Chat } from '@google/genai';
import type { DeepTech, Source } from './core';

// UI and Chat related types
export type ChatRole = 'user' | 'model';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
}

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

export type ResearchMode = 'balanced' | 'deep';