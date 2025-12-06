/**
 * Summarizer Agent
 * Extracts key findings from user queries
 */

import { BaseChatCompletion } from './base.js';

export class SummarizerAgent extends BaseChatCompletion {
  constructor(apiKey?: string) {
    super(
      {
        name: 'Summarizer',
        systemPrompt: `You are a specialized AI agent focused on summarizing user queries.
Your task is to extract and condense the key findings, main points, and important details from user input.
Provide a clear, concise summary that captures the essence of what the user is asking or describing.
Focus on:
- Main topics and themes
- Specific requirements or requests
- Important context or constraints
- Core objectives

Keep your summary brief but comprehensive.`,
        temperature: 0.5,
        maxTokens: 500,
      },
      apiKey
    );
  }

  async summarize(userQuery: string): Promise<string> {
    const response = await this.execute(
      `Summarize the key findings of the following user query:\n\n"${userQuery}"`
    );
    return response.content;
  }
}
