/**
 * Pain Identifier Agent
 * Identifies user pain points from summarized queries
 */

import { BaseChatCompletion } from './base.js';

export class PainIdentifierAgent extends BaseChatCompletion {
  constructor(apiKey?: string) {
    super(
      {
        name: 'PainIdentifier',
        systemPrompt: `You are a specialized AI agent focused on identifying user pain points.
Your task is to analyze the summary of a user's query and identify their top pain points, challenges, or problems.
Look for:
- Frustrations or obstacles mentioned
- Inefficiencies or time-consuming tasks
- Missing features or capabilities
- Confusion or lack of clarity
- Technical blockers or limitations

Provide a numbered list of the top 3-5 pain points, ordered by severity and impact.
Be specific and actionable in your identification.`,
        temperature: 0.6,
        maxTokens: 600,
      },
      apiKey
    );
  }

  async identifyPainPoints(summary: string): Promise<string[]> {
    const response = await this.execute(
      `Using the summary below, identify the top pain points of the user:\n\n"${summary}"\n\nProvide your answer as a numbered list.`
    );

    // Parse the response into an array of pain points
    const painPoints = response.content
      .split('\n')
      .filter((line) => line.trim().match(/^\d+[\.\)]/))
      .map((line) => line.replace(/^\d+[\.\)]\s*/, '').trim());

    return painPoints;
  }
}
