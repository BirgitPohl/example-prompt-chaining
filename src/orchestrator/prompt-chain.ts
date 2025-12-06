import { SummarizerAgent } from '../agents/summarizer.js';
import { PainIdentifierAgent } from '../agents/pain-identifier.js';
import { PlanCreatorAgent } from '../agents/plan-creator.js';
import { AISpawnerAgent } from '../agents/ai-spawner.js';
import { ResponderAgent } from '../agents/responder.js';
import { toolRegistry } from '../tools/index.js';
import type { AgentContext, ChainStep } from '../types/index.js';

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
    console.log('\n🚀 Starting Prompt Chain Processing...\n');

    // Initialize context
    const context: AgentContext = {
      userQuery,
      intermediateResults: {},
    };

    try {
      // Step 1: Summarize the query
      console.log('📝 Step 1: Summarizing query...');
      const summary = await this.summarizer.summarize(userQuery);
      context.summary = summary;
      this.recordStep('Summarizer', userQuery, summary);
      console.log(`✓ Summary generated: ${summary.substring(0, 100)}...\n`);

      // Step 2: Identify pain points
      console.log('🔍 Step 2: Identifying pain points...');
      const painPoints = await this.painIdentifier.identifyPainPoints(summary);
      context.painPoints = painPoints;
      this.recordStep('PainIdentifier', summary, painPoints.join('\n'));
      console.log(`✓ Identified ${painPoints.length} pain points:\n`);
      painPoints.forEach((point, idx) => console.log(`   ${idx + 1}. ${point}`));
      console.log('');

      // Step 3: Create execution plan
      console.log('📋 Step 3: Creating execution plan...');
      const planSteps = await this.planCreator.createPlan(painPoints);
      context.plan = JSON.stringify(planSteps, null, 2);
      this.recordStep('PlanCreator', painPoints.join('\n'), context.plan);
      console.log(`✓ Created plan with ${planSteps.length} steps:\n`);
      planSteps.forEach((step) => {
        console.log(`   ${step.step}. ${step.description} (${step.estimatedComplexity})`);
      });
      console.log('');

      // Step 4: Spawn specialized agents
      console.log('🤖 Step 4: Spawning specialized agents...');
      const spawnedAgents = await this.aiSpawner.spawnAgents(planSteps);
      console.log(`✓ Spawned ${spawnedAgents.length} specialized agents\n`);

      // Step 5: Execute spawned agents
      console.log('⚡ Step 5: Executing specialized agents...');
      const agentResults = [];
      for (let i = 0; i < spawnedAgents.length; i++) {
        const agent = spawnedAgents[i];
        console.log(`   Executing ${agent.name}: ${agent.purpose}`);

        try {
          const result = await agent.execute(
            `Task: ${agent.purpose}\nContext: ${JSON.stringify(context, null, 2)}`
          );
          agentResults.push(result);
          this.recordStep(agent.name, agent.purpose, JSON.stringify(result, null, 2));
          console.log(`   ✓ ${agent.name} completed`);
        } catch (error) {
          console.error(`   ✗ ${agent.name} failed:`, error);
          agentResults.push({ error: String(error) });
        }
      }
      console.log('');

      // Step 6: Generate final response
      console.log('💬 Step 6: Generating final response...');
      const finalResponse = await this.responder.generateResponse(context, agentResults);
      this.recordStep('Responder', 'All agent results', finalResponse);
      console.log('✓ Final response generated\n');

      console.log('✅ Prompt Chain Processing Complete!\n');

      return finalResponse;
    } catch (error) {
      console.error('❌ Error in prompt chain:', error);
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