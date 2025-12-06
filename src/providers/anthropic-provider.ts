/**
 * Anthropic (Claude) Provider Implementation with Web Search
 */

import Anthropic from '@anthropic-ai/sdk';
import { MessageRole, type Message, type ChatCompletionResponse } from '../types/index.js';
import type { IAIProvider } from '../types/providers.js';

export class AnthropicProvider implements IAIProvider {
  private client: Anthropic;
  private model: string;
  private name: string;
  private systemPrompt: string;
  private maxTokens: number;
  private conversationHistory: Message[] = [];
  private webSearchEnabled: boolean;

  constructor(
    name: string,
    systemPrompt: string,
    model: string = 'claude-3-7-sonnet-20250219',
    maxTokens: number = 2000,
    webSearchEnabled: boolean = false,
    apiKey?: string
  ) {
    this.name = name;
    this.systemPrompt = systemPrompt;
    this.model = model;
    this.maxTokens = maxTokens;
    this.webSearchEnabled = webSearchEnabled;

    this.client = new Anthropic({
      apiKey: apiKey || process.env.ANTHROPIC_API_KEY,
    });
  }

  async execute(userMessage: string): Promise<ChatCompletionResponse> {
    this.conversationHistory.push({
      role: MessageRole.USER,
      content: userMessage,
    });

    try {
      // Convert conversation history to Claude format
      const messages = this.conversationHistory
        .filter(msg => msg.role !== MessageRole.SYSTEM)
        .map(msg => ({
          role: msg.role === MessageRole.USER ? 'user' as const : 'assistant' as const,
          content: msg.content,
        }));

      const requestParams: any = {
        model: this.model,
        max_tokens: this.maxTokens,
        system: this.systemPrompt,
        messages,
      };

      // Add web search tool if enabled
      if (this.webSearchEnabled) {
        requestParams.tools = [{
          type: 'web_search_20250305',
          name: 'web_search',
          max_uses: 5
        }];
      }

      const response = await this.client.messages.create(requestParams);

      const content = response.content
        .filter((block: any) => block.type === 'text')
        .map((block: any) => block.text)
        .join('\n');

      this.conversationHistory.push({
        role: MessageRole.ASSISTANT,
        content,
      });

      return {
        content,
        role: MessageRole.ASSISTANT,
        metadata: {
          model: this.model,
          stopReason: response.stop_reason,
          webSearchUsed: this.webSearchEnabled,
          provider: 'anthropic',
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
    this.conversationHistory = [];
  }

  getHistory(): Message[] {
    return [...this.conversationHistory];
  }
}
