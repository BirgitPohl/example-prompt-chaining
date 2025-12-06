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
      model: 'gpt-4o',
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
      // Check if this model supports web search (all gpt-5 variants)
      const isGpt5Model = this.config.model?.startsWith('gpt-5');

      if (isGpt5Model) {
        // Use Responses API for gpt-5 variants with web search
        // Reference: https://platform.openai.com/docs/guides/tools-web-search
        const requestParams: any = {
          model: this.config.model!,
          tools: [{ type: 'web_search' }],
          input: userMessage,
        };

        const response = await (this.openai as any).responses.create(requestParams);

        const content = response.output_text || '';

        // Add assistant response to history
        this.conversationHistory.push({
          role: MessageRole.ASSISTANT,
          content,
        });

        return {
          content,
          role: MessageRole.ASSISTANT,
          metadata: {
            model: this.config.model!,
            webSearchUsed: true,
          },
        };
      } else {
        // Use ChatCompletions API for other models
        const requestParams: any = {
          model: this.config.model!,
          messages: this.conversationHistory,
          temperature: this.config.temperature,
        };

        // Use max_completion_tokens for gpt-4o and newer, max_tokens for older models
        if (this.config.model?.startsWith('gpt-4o')) {
          requestParams.max_completion_tokens = this.config.maxTokens;
        } else {
          requestParams.max_tokens = this.config.maxTokens;
        }

        const response = await this.openai.chat.completions.create(requestParams);

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
            webSearchUsed: false,
          },
        };
      }
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

  /**
   * Get agent name
   */
  getModel(): string {
    return this.config.model!;
  }
}
