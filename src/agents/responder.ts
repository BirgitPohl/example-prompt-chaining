import { BaseChatCompletion } from './base.js';
import type { AgentContext, ChainStep } from '../types/index.js';

/**
 * Responder Agent
 * Aggregates all intermediate results and creates final response to user
 */
export class ResponderAgent extends BaseChatCompletion {
  private chainSteps: ChainStep[] = [];

  constructor(apiKey?: string) {
    super(
      {
        name: 'Responder',
        systemPrompt: `You are the final response agent in a multi-agent system.
Your role is to synthesize all the work done by previous agents and provide a clear, comprehensive, and helpful response to the user.

You will receive:
- The original user query
- A summary of the query
- Identified pain points
- The execution plan
- Results from specialized agents

Your task is to:
1. Review all the information gathered and processed
2. Synthesize the results into a coherent narrative
3. Provide actionable insights or solutions
4. Address the user's original query directly
5. Be clear, concise, and helpful

Format your response in a user-friendly way with:
- A brief acknowledgment of their query
- Key findings or results
- Specific recommendations or next steps
- Any relevant caveats or considerations`,
        temperature: 0.7,
        maxTokens: 2000,
      },
      apiKey
    );
  }

  /**
   * Record a step in the chain for later synthesis
   */
  recordStep(step: ChainStep): void {
    this.chainSteps.push(step);
  }

  /**
   * Generate final response based on all chain steps and context
   */
  async generateResponse(context: AgentContext, agentResults: any[]): Promise<string> {
    const stepsOverview = this.chainSteps
      .map((step) => `${step.agentName}: ${step.output.substring(0, 200)}...`)
      .join('\n\n');

    const agentResultsSummary = agentResults
      .map((result, idx) => `Agent ${idx + 1} Result: ${JSON.stringify(result, null, 2)}`)
      .join('\n\n');

    const prompt = `Please provide a comprehensive response to the user based on the following information:

ORIGINAL USER QUERY:
${context.userQuery}

SUMMARY:
${context.summary || 'N/A'}

PAIN POINTS IDENTIFIED:
${context.painPoints?.join('\n') || 'N/A'}

EXECUTION PLAN:
${context.plan || 'N/A'}

AGENT EXECUTION RESULTS:
${agentResultsSummary}

PROCESSING CHAIN:
${stepsOverview}

Now, create a final response that directly addresses the user's original query with actionable insights and clear recommendations.`;

    const response = await this.execute(prompt);
    return response.content;
  }

  /**
   * Get all recorded chain steps
   */
  getChainSteps(): ChainStep[] {
    return [...this.chainSteps];
  }

  /**
   * Clear chain steps history
   */
  clearSteps(): void {
    this.chainSteps = [];
  }
}