/**
 * Base ChatCompletion class that all specialized agents extend
 */

import OpenAI from 'openai';
import { MessageRole, type Message, type ChatCompletionResponse, type AgentConfig } from '../types/index.js';

export class BaseChatCompletion {
  protected openai: OpenAI;
  protected config: AgentConfig;
  protected conversationHistory: Message[] = [];

  constructor(config: AgentConfig, apiKey?: string) {
    this.config = {
      temperature: 0.7,
      maxTokens: 1000,
      ...config,
    };

    this.openai = new OpenAI({
      apiKey: apiKey || process.env.OPENAI_API_KEY,
    });

    // Initialize with system prompt
    this.conversationHistory.push({
      role: MessageRole.SYSTEM,
      content: this.config.systemPrompt,
    });
  }

  /**
   * Execute a chat completion with the given user message
   */
  async execute(userMessage: string): Promise<ChatCompletionResponse> {
    // Add user message to history
    this.conversationHistory.push({
      role: MessageRole.USER,
      content: userMessage,
    });

    try {
      const response = await this.openai.chat.completions.create({
        model: this.config.model!,
        messages: this.conversationHistory,
        temperature: this.config.temperature,
        max_tokens: this.config.maxTokens,
      });

      const assistantMessage = response.choices[0].message;

      // Add assistant response to history
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
        },
      };
    } catch (error) {
      console.error(`Error in ${this.config.name}:`, error);
      throw error;
    }
  }

  /**
   * Get the conversation history
   */
  getHistory(): Message[] {
    return [...this.conversationHistory];
  }

  /**
   * Clear conversation history (keeping system prompt)
   */
  reset(): void {
    this.conversationHistory = [this.conversationHistory[0]];
  }

  /**
   * Get agent name
   */
  getName(): string {
    return this.config.name;
  }
}
