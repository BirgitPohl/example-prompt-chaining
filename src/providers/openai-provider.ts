/**
 * OpenAI Provider Implementation
 */

import OpenAI from 'openai';
import { MessageRole, type Message, type ChatCompletionResponse } from '../types/index.js';
import type { IAIProvider } from '../types/providers.js';

export class OpenAIProvider implements IAIProvider {
  private openai: OpenAI;
  private model: string;
  private name: string;
  private systemPrompt: string;
  private temperature: number;
  private maxTokens: number;
  private conversationHistory: Message[] = [];

  constructor(
    name: string,
    systemPrompt: string,
    model: string = 'gpt-4o',
    temperature: number = 0.7,
    maxTokens: number = 2000,
    apiKey?: string
  ) {
    this.name = name;
    this.systemPrompt = systemPrompt;
    this.model = model;
    this.temperature = temperature;
    this.maxTokens = maxTokens;

    this.openai = new OpenAI({
      apiKey: apiKey || process.env.OPENAI_API_KEY,
    });

    // Initialize with system prompt
    this.conversationHistory.push({
      role: MessageRole.SYSTEM,
      content: this.systemPrompt,
    });
  }

  async execute(userMessage: string): Promise<ChatCompletionResponse> {
    this.conversationHistory.push({
      role: MessageRole.USER,
      content: userMessage,
    });

    try {
      const requestParams: any = {
        model: this.model,
        messages: this.conversationHistory,
        temperature: this.temperature,
      };

      // Use max_completion_tokens for gpt-4o and newer
      if (this.model.startsWith('gpt-4o')) {
        requestParams.max_completion_tokens = this.maxTokens;
      } else {
        requestParams.max_tokens = this.maxTokens;
      }

      const response = await this.openai.chat.completions.create(requestParams);
      const assistantMessage = response.choices[0].message;

      this.conversationHistory.push({
        role: MessageRole.ASSISTANT,
        content: assistantMessage.content || '',
      });

      return {
        content: assistantMessage.content || '',
        role: MessageRole.ASSISTANT,
        metadata: {
          model: response.model,
          usage: response.usage,
          finishReason: response.choices[0].finish_reason,
          provider: 'openai',
        },
      };
    } catch (error) {
      console.error(`Error in ${this.name}:`, error);
      throw error;
    }
  }

  getName(): string {
    return this.name;
  }

  getModel(): string {
    return this.model;
  }

  reset(): void {
    this.conversationHistory = [this.conversationHistory[0]];
  }

  getHistory(): Message[] {
    return [...this.conversationHistory];
  }
}
