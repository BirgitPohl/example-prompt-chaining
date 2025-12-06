/**
 * AI Provider types and interfaces
 */

import type { Message, ChatCompletionResponse } from './index.js';

export enum AIProvider {
  OPENAI = 'openai',
  ANTHROPIC = 'anthropic',
}

export interface AIProviderConfig {
  provider: AIProvider;
  model: string;
  apiKey?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface IAIProvider {
  execute(userMessage: string): Promise<ChatCompletionResponse>;
  getName(): string;
  getModel(): string;
  reset(): void;
  getHistory(): Message[];
}
