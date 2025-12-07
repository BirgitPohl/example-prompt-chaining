import { SummarizerAgent } from '../agents/summarizer.js';
import { PainIdentifierAgent } from '../agents/pain-identifier.js';
import { PlanCreatorAgent } from '../agents/plan-creator.js';
import { AISpawnerAgent } from '../agents/ai-spawner.js';
import { ResponderAgent } from '../agents/responder.js';
import { toolRegistry } from '../tools/index.js';
import type { AgentContext, ChainStep } from '../types/index.js';
import { awesomeDebugger, ChalkColors } from '../utils/debug.js';

/**
 * Prompt Chain Orchestrator
 * Coordinates the entire multi-agent prompt chaining system
 */
export class PromptChainOrchestrator {
  private summarizer: SummarizerAgent;
  private painIdentifier: PainIdentifierAgent;
  private planCreator: PlanCreatorAgent;
  private aiSpawner: AISpawnerAgent;
  private responder: ResponderAgent;
  private apiKey?: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey;
    this.summarizer = new SummarizerAgent(apiKey);
    this.painIdentifier = new PainIdentifierAgent(apiKey);
    this.planCreator = new PlanCreatorAgent(toolRegistry, apiKey);
    this.aiSpawner = new AISpawnerAgent(toolRegistry, apiKey);
    this.responder = new ResponderAgent(apiKey);
  }

  /**
   * Process a user query through the entire prompt chain
   */
  async processQuery(userQuery: string): Promise<string> {
    awesomeDebugger('\n🚀 Starting Prompt Chain Processing...\n', ChalkColors.Cyan, 'bold');

    // Initialize context
    const context: AgentContext = {
      userQuery,
      intermediateResults: {},
    };

    try {
      // Step 1: Summarize the query
      awesomeDebugger('📝 Step 1: Summarizing query...', ChalkColors.Blue);
      const summary = await this.summarizer.summarize(userQuery);
      context.summary = summary;
      this.recordStep('Summarizer', userQuery, summary);
      awesomeDebugger(`✓ Summary generated: ${summary.substring(0, 100)}...\n`, ChalkColors.Green);

      // Step 2: Identify pain points
      awesomeDebugger('🔍 Step 2: Identifying pain points...', ChalkColors.Blue);
      const painPoints = await this.painIdentifier.identifyPainPoints(summary);
      context.painPoints = painPoints;
      this.recordStep('PainIdentifier', summary, painPoints.join('\n'));
      awesomeDebugger(`✓ Identified ${painPoints.length} pain points:\n`, ChalkColors.Green);
      painPoints.forEach((point, idx) => awesomeDebugger(`   ${idx + 1}. ${point}`, ChalkColors.Yellow));
      awesomeDebugger('');

      // Step 3: Create execution plan
      awesomeDebugger('📋 Step 3: Creating execution plan...', ChalkColors.Blue);
      const planSteps = await this.planCreator.createPlan(painPoints);
      context.plan = JSON.stringify(planSteps, null, 2);
      this.recordStep('PlanCreator', painPoints.join('\n'), context.plan);
      awesomeDebugger(`✓ Created plan with ${planSteps.length} steps:\n`, ChalkColors.Green);
      planSteps.forEach((step) => {
        awesomeDebugger(`   ${step.step}. ${step.description} (${step.estimatedComplexity})`, ChalkColors.Cyan);
      });
      awesomeDebugger('');

      // Step 4: Spawn specialized agents
      awesomeDebugger('🤖 Step 4: Spawning specialized agents...', ChalkColors.Blue);
      const spawnedAgents = await this.aiSpawner.spawnAgents(planSteps);
      awesomeDebugger(`✓ Spawned ${spawnedAgents.length} specialized agents\n`, ChalkColors.Green);

      // Step 5: Execute spawned agents
      awesomeDebugger('⚡ Step 5: Executing specialized agents...', ChalkColors.Blue);
      const agentResults = [];
      for (let i = 0; i < spawnedAgents.length; i++) {
        const agent = spawnedAgents[i];
        awesomeDebugger(`   Executing ${agent.name}: ${agent.purpose}`, ChalkColors.Magenta);

        try {
          const result = await agent.execute(
            `Task: ${agent.purpose}\nContext: ${JSON.stringify(context, null, 2)}`
          );
          agentResults.push(result);
          this.recordStep(agent.name, agent.purpose, JSON.stringify(result, null, 2));
          awesomeDebugger(`   ✓ ${agent.name} completed`, ChalkColors.Green);
        } catch (error) {
          awesomeDebugger(`   ✗ ${agent.name} failed: ${error}`, ChalkColors.Red);
          agentResults.push({ error: String(error) });
        }
      }
      awesomeDebugger('');

      // Step 6: Generate final response
      awesomeDebugger('💬 Step 6: Generating final response...', ChalkColors.Blue);
      const finalResponse = await this.responder.generateResponse(context, agentResults);
      this.recordStep('Responder', 'All agent results', finalResponse);
      awesomeDebugger('✓ Final response generated\n', ChalkColors.Green);

      awesomeDebugger('✅ Prompt Chain Processing Complete!\n', ChalkColors.Green, 'bold');

      return finalResponse;
    } catch (error) {
      awesomeDebugger(`❌ Error in prompt chain: ${error}`, ChalkColors.Red, 'bold');
      throw error;
    }
  }

  /**
   * Record a step in the chain
   */
  private recordStep(agentName: string, input: string, output: string): void {
    const step: ChainStep = {
      agentName,
      input,
      output,
      timestamp: new Date(),
    };
    this.responder.recordStep(step);
  }

  /**
   * Get the chain execution history
   */
  getChainHistory(): ChainStep[] {
    return this.responder.getChainSteps();
  }

  /**
   * Reset the orchestrator for a new query
   */
  reset(): void {
    this.summarizer.reset();
    this.painIdentifier.reset();
    this.planCreator.reset();
    this.aiSpawner.clearAgents();
    this.responder.reset();
    this.responder.clearSteps();
  }
}