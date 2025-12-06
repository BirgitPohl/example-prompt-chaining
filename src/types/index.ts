/**
 * Core types for the prompt chaining system
 */

export enum MessageRole {
  SYSTEM = 'system',
  USER = 'user',
  ASSISTANT = 'assistant',
}

export enum ComplexityLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export interface Message {
  role: MessageRole;
  content: string;
}

export interface ChatCompletionResponse {
  content: string;
  role: MessageRole.ASSISTANT;
  metadata?: Record<string, any>;
}

export interface Tool {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: Record<string, any>;
    required?: string[];
  };
  execute: (args: any) => Promise<any>;
}

export interface AgentContext {
  userQuery: string;
  summary?: string;
  painPoints?: string[];
  plan?: string;
  toolResults?: Record<string, any>;
  intermediateResults: Record<string, any>;
}

export interface AgentConfig {
  name: string;
  systemPrompt: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface ChainStep {
  agentName: string;
  input: string;
  output: string;
  timestamp: Date;
}

export interface PlanStep {
  step: number;
  description: string;
  toolsNeeded: string[];
  estimatedComplexity: ComplexityLevel;
}

export interface SpawnedAgent {
  id: string;
  name: string;
  purpose: string;
  tools: Tool[];
  execute: (input: string) => Promise<any>;
}
