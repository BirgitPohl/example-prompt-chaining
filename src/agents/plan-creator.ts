/**
 * Plan Creator Agent
 * Creates step-by-step plans to solve user problems
 */

import { BaseChatCompletion } from './base.js';
import type { Tool, PlanStep, ComplexityLevel } from '../types/index.js';

export class PlanCreatorAgent extends BaseChatCompletion {
  private availableTools: Tool[];

  constructor(tools: Tool[], apiKey?: string) {
    super(
      {
        name: 'PlanCreator',
        systemPrompt: `You are a specialized AI agent focused on creating actionable plans.
Your task is to analyze the user's problem and create a detailed, step-by-step plan to solve it.
You have access to a set of tools that can be used to execute the plan.

When creating a plan:
- Break down the solution into clear, sequential steps
- Identify which tools are needed for each step
- Estimate the complexity of each step (low, medium, high)
- Ensure steps are actionable and specific
- Consider dependencies between steps
- Prioritize efficiency and effectiveness

Format your response as a JSON array of steps with this structure:
{
  "step": number,
  "description": "step description",
  "toolsNeeded": ["tool1", "tool2"],
  "estimatedComplexity": "low|medium|high"
}`,
        temperature: 0.7,
        maxTokens: 1500,
      },
      apiKey
    );
    this.availableTools = tools;
  }

  async createPlan(painPoints: string[]): Promise<PlanStep[]> {
    const toolsList = this.availableTools
      .map((tool) => `- ${tool.name}: ${tool.description}`)
      .join('\n');

    const painPointsList = painPoints.map((point, idx) => `${idx + 1}. ${point}`).join('\n');

    const response = await this.execute(
      `Based on the user's pain points below, create a plan to solve them.

Pain Points:
${painPointsList}

Available Tools:
${toolsList}

Provide your response as a JSON array of plan steps.`
    );

    try {
      // Extract JSON from response (in case there's extra text)
      const jsonMatch = response.content.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('No JSON array found in response');
      }

      const plan: PlanStep[] = JSON.parse(jsonMatch[0]);
      return plan;
    } catch (error) {
      console.error('Error parsing plan:', error);
      console.error('Response:', response.content);
      throw new Error('Failed to parse plan from response');
    }
  }

  getAvailableTools(): Tool[] {
    return [...this.availableTools];
  }
}
