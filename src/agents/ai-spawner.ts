/**
 * AI Spawner Agent
 * Dynamically spawns specialized agents based on plan requirements
 */

import { BaseChatCompletion } from './base.js';
import { MessageRole, type Tool, type PlanStep, type SpawnedAgent } from '../types/index.js';
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

    // Create the system prompt for this specialized agent
    const systemPrompt = this.generateSystemPrompt(planStep, tools);

    // Create the base agent
    const baseAgent = new BaseChatCompletion(
      {
        name: `SpecializedAgent-${planStep.step}`,
        systemPrompt,
        temperature: 0.7,
        maxTokens: 2000,
      },
      this.apiKey
    );

    // Return the spawned agent with its execution function
    return {
      id: agentId,
      name: `Agent-Step-${planStep.step}`,
      purpose: planStep.description,
      tools,
      execute: async (input: string) => {
        return await this.executeAgentWithTools(baseAgent, input, tools);
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
2. Determine which tools to use and in what order
3. Execute the tools with appropriate parameters
4. Synthesize the results into a coherent response

When you need to use a tool, specify it in your response using this format:
TOOL: <tool_name>
PARAMS: <JSON parameters>

Provide clear, actionable results based on your tool usage.`;
  }

  /**
   * Execute an agent with tool-calling capabilities
   */
  private async executeAgentWithTools(
    agent: BaseChatCompletion,
    input: string,
    tools: Tool[]
  ): Promise<any> {
    const result = await agent.execute(input);
    let content = result.content;
    const toolResults: Record<string, any> = {};

    // Parse and execute any tool calls from the agent's response
    const toolCallRegex = /TOOL:\s*(\w+)\s+PARAMS:\s*(\{[\s\S]*?\})/g;
    let match;

    while ((match = toolCallRegex.exec(content)) !== null) {
      const [, toolName, paramsJson] = match;
      const tool = tools.find((t) => t.name === toolName);

      if (tool) {
        try {
          const params = JSON.parse(paramsJson);
          const toolResult = await tool.execute(params);
          toolResults[toolName] = toolResult;

          // Update the agent with the tool result
          await agent.execute(
            `Tool ${toolName} executed successfully. Result: ${JSON.stringify(toolResult)}`
          );
        } catch (error) {
          console.error(`Error executing tool ${toolName}:`, error);
          toolResults[toolName] = { error: String(error) };
        }
      }
    }

    return {
      agentResponse: content,
      toolResults,
      finalResponse: agent.getHistory()[agent.getHistory().length - 1].content,
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
