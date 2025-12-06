/**
 * AI Spawner Agent
 * Dynamically spawns specialized agents based on plan requirements
 */

import { OpenAIProvider } from '../providers/openai-provider.js';
import { AnthropicProvider } from '../providers/anthropic-provider.js';
import type { Tool, PlanStep, SpawnedAgent } from '../types/index.js';
import type { IAIProvider } from '../types/providers.js';
import crypto from 'crypto';

export class AISpawnerAgent {
  private apiKey?: string;
  private spawnedAgents: Map<string, SpawnedAgent> = new Map();
  private toolRegistry: Map<string, Tool>;

  constructor(tools: Tool[], apiKey?: string) {
    this.apiKey = apiKey;
    this.toolRegistry = new Map(tools.map((tool) => [tool.name, tool]));
  }

  /**
   * Spawn specialized agents based on the plan steps
   */
  async spawnAgents(planSteps: PlanStep[]): Promise<SpawnedAgent[]> {
    const agents: SpawnedAgent[] = [];

    for (const step of planSteps) {
      const agent = await this.createSpecializedAgent(step);
      agents.push(agent);
      this.spawnedAgents.set(agent.id, agent);
    }

    return agents;
  }

  /**
   * Create a specialized agent for a specific plan step
   */
  private async createSpecializedAgent(planStep: PlanStep): Promise<SpawnedAgent> {
    const agentId = crypto.randomUUID();
    const tools = planStep.toolsNeeded
      .map((toolName) => this.toolRegistry.get(toolName))
      .filter((tool): tool is Tool => tool !== undefined);

    // Check if this agent needs web search capability
    const needsWebSearch = tools.some((tool) => tool.name === 'search');

    // Create the system prompt for this specialized agent
    const systemPrompt = this.generateSystemPrompt(planStep, tools);

    // Create the appropriate provider-based agent
    // Use Claude with web search for search tasks, OpenAI for everything else
    let agent: IAIProvider;

    if (needsWebSearch) {
      // Use Anthropic Claude with web search enabled
      // Note: Uses ANTHROPIC_API_KEY from environment (not this.apiKey which is OpenAI)
      agent = new AnthropicProvider(
        `SpecializedAgent-${planStep.step}`,
        systemPrompt,
        'claude-sonnet-4-5',
        2000,
        true, // web search enabled
        process.env.ANTHROPIC_API_KEY
      );
      console.log(`Creating Claude agent with web search for: ${planStep.description}`);
    } else {
      // Use OpenAI for non-search tasks
      agent = new OpenAIProvider(
        `SpecializedAgent-${planStep.step}`,
        systemPrompt,
        'gpt-4o',
        0.7,
        2000,
        this.apiKey
      );
    }

    // Return the spawned agent with its execution function
    return {
      id: agentId,
      name: `Agent-Step-${planStep.step}`,
      purpose: planStep.description,
      tools,
      execute: async (input: string) => {
        return await this.executeAgentWithTools(agent, input, tools);
      },
    };
  }

  /**
   * Generate a specialized system prompt for an agent
   */
  private generateSystemPrompt(planStep: PlanStep, tools: Tool[]): string {
    const toolDescriptions = tools
      .map((tool) => `- ${tool.name}: ${tool.description}`)
      .join('\n');

    return `You are a specialized AI agent created to accomplish the following task:

TASK: ${planStep.description}

You have access to the following tools:
${toolDescriptions}

Your role is to:
1. Analyze the input provided to you
2. Determine which tools would be helpful (if any)
3. Think through the task step by step
4. Provide clear, actionable recommendations and insights

Focus on providing strategic guidance and actionable recommendations for completing the task.`;
  }

  /**
   * Execute an agent (simplified - tools available but not auto-executed)
   */
  private async executeAgentWithTools(
    agent: IAIProvider,
    input: string,
    tools: Tool[]
  ): Promise<any> {
    console.log(`Executing agent: ${agent.getName()} with model: ${agent.getModel()} and tools: ${tools.map((t) => t.name).join(', ')}`);
    const result = await agent.execute(input);

    return {
      agentResponse: result.content,
      toolsAvailable: tools.map((t) => t.name),
      finalResponse: result.content,
      metadata: result.metadata,
    };
  }

  /**
   * Get all spawned agents
   */
  getSpawnedAgents(): SpawnedAgent[] {
    return Array.from(this.spawnedAgents.values());
  }

  /**
   * Get a specific spawned agent by ID
   */
  getAgent(agentId: string): SpawnedAgent | undefined {
    return this.spawnedAgents.get(agentId);
  }

  /**
   * Clear all spawned agents
   */
  clearAgents(): void {
    this.spawnedAgents.clear();
  }
}
