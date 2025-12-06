/**
 * Example Prompt Chaining System
 * Main entry point
 */

import { PromptChainOrchestrator } from './orchestrator/prompt-chain.js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function main() {
  // Check for API key
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ Error: OPENAI_API_KEY not found in environment variables');
    console.log('Please create a .env file with your OpenAI API key:');
    console.log('OPENAI_API_KEY=your_api_key_here');
    process.exit(1);
  }

  // Example user queries to demonstrate the system
  const exampleQueries = [
    `I'm struggling to manage my team's tasks effectively. We have multiple projects running
simultaneously, and I keep losing track of who's working on what. Deadlines are being missed,
and communication is chaotic. I need a better way to organize everything and keep everyone
aligned. We're currently using spreadsheets but they're becoming unmanageable.`,

    `Our customer support team is drowning in tickets. We're getting hundreds of emails daily,
many asking similar questions. Response times are slow, customers are frustrated, and our
team is burning out. We need to automate some of this work and get better at prioritizing
urgent issues.`,

    `I'm trying to analyze sales data to understand which products are performing well, but
the data is scattered across multiple systems. I need to pull reports from our CRM,
e-commerce platform, and accounting software, then combine them somehow. This takes me
hours every week and I'm sure there's a better way.`,
  ];

  // Create orchestrator
  const orchestrator = new PromptChainOrchestrator(process.env.OPENAI_API_KEY);

  // Process the first example query
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('           PROMPT CHAINING SYSTEM DEMONSTRATION');
  console.log('═══════════════════════════════════════════════════════════════\n');

  const userQuery = exampleQueries[0];

  console.log('📨 USER QUERY:');
  console.log('─'.repeat(60));
  console.log(userQuery);
  console.log('─'.repeat(60));

  try {
    const response = await orchestrator.processQuery(userQuery);

    console.log('\n📬 FINAL RESPONSE TO USER:');
    console.log('═'.repeat(60));
    console.log(response);
    console.log('═'.repeat(60));

    // Show chain history
    console.log('\n📊 CHAIN EXECUTION HISTORY:');
    console.log('─'.repeat(60));
    const history = orchestrator.getChainHistory();
    history.forEach((step, idx) => {
      console.log(`\n${idx + 1}. ${step.agentName} (${step.timestamp.toISOString()})`);
      console.log(`   Input: ${step.input.substring(0, 80)}...`);
      console.log(`   Output: ${step.output.substring(0, 80)}...`);
    });
    console.log('─'.repeat(60));
  } catch (error) {
    console.error('\n❌ Error processing query:', error);
    process.exit(1);
  }
}

// Run if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { PromptChainOrchestrator } from './orchestrator/prompt-chain.js';
export * from './types/index.js';
export * from './agents/base.js';
export * from './tools/index.js';
