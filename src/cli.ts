/**
 * Interactive CLI for the Prompt Chaining System
 * Allows users to chat with the system in the terminal
 */

import readline from 'readline';
import { PromptChainOrchestrator } from './orchestrator/prompt-chain.js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

class InteractiveCLI {
  private orchestrator: PromptChainOrchestrator;
  private rl: readline.Interface;
  private isProcessing: boolean = false;

  constructor(apiKey: string) {
    this.orchestrator = new PromptChainOrchestrator(apiKey);

    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: '\n💭 You: ',
    });

    this.setupReadline();
  }

  private setupReadline(): void {
    this.rl.on('line', async (input: string) => {
      const query = input.trim();

      if (!query) {
        this.rl.prompt();
        return;
      }

      // Handle commands
      if (query.toLowerCase() === 'exit' || query.toLowerCase() === 'quit') {
        this.exit();
        return;
      }

      if (query.toLowerCase() === 'help') {
        this.showHelp();
        this.rl.prompt();
        return;
      }

      if (query.toLowerCase() === 'clear') {
        console.clear();
        this.showWelcome();
        this.rl.prompt();
        return;
      }

      if (query.toLowerCase() === 'reset') {
        this.orchestrator.reset();
        console.log('\n✅ System reset. Starting fresh!\n');
        this.rl.prompt();
        return;
      }

      if (query.toLowerCase() === 'history') {
        this.showHistory();
        this.rl.prompt();
        return;
      }

      // Process user query
      await this.processQuery(query);
    });

    this.rl.on('close', () => {
      this.exit();
    });
  }

  private async processQuery(query: string): Promise<void> {
    if (this.isProcessing) {
      console.log('\n⚠️  Please wait for the current query to finish processing.\n');
      this.rl.prompt();
      return;
    }

    this.isProcessing = true;

    try {
      console.log('\n' + '═'.repeat(80));
      console.log('🤖 Processing your query through the agent chain...');
      console.log('═'.repeat(80) + '\n');

      const response = await this.orchestrator.processQuery(query);

      console.log('\n' + '═'.repeat(80));
      console.log('📬 RESPONSE:');
      console.log('═'.repeat(80));
      console.log('\n' + response + '\n');
      console.log('═'.repeat(80));
    } catch (error) {
      console.error('\n❌ Error processing query:', error);
      console.log('\nPlease try again or type "help" for assistance.\n');
    } finally {
      this.isProcessing = false;
      this.rl.prompt();
    }
  }

  private showWelcome(): void {
    console.log('\n' + '═'.repeat(80));
    console.log('           🚀 PROMPT CHAINING SYSTEM - INTERACTIVE MODE 🚀');
    console.log('═'.repeat(80));
    console.log('\nWelcome! I\'m a multi-agent AI system that uses prompt chaining to solve');
    console.log('complex problems. I\'ll analyze your query through several specialized agents:');
    console.log('\n  📝 Summarizer      → Extracts key information');
    console.log('  🔍 Pain Identifier → Identifies your challenges');
    console.log('  📋 Plan Creator    → Creates a solution plan');
    console.log('  🤖 AI Spawner      → Spawns specialized agents');
    console.log('  💬 Responder       → Provides final answer');
    console.log('\n' + '─'.repeat(80));
    console.log('Commands:');
    console.log('  help    → Show available commands');
    console.log('  clear   → Clear screen');
    console.log('  reset   → Reset the system');
    console.log('  history → Show chain execution history');
    console.log('  exit    → Exit the program');
    console.log('─'.repeat(80) + '\n');
    console.log('Type your question or problem, and I\'ll help you solve it!\n');
  }

  private showHelp(): void {
    console.log('\n' + '─'.repeat(80));
    console.log('📚 HELP - Available Commands');
    console.log('─'.repeat(80));
    console.log('\n  help    → Show this help message');
    console.log('  clear   → Clear the terminal screen');
    console.log('  reset   → Reset the system (clear conversation history)');
    console.log('  history → Show the execution history of the last query');
    console.log('  exit    → Exit the interactive mode');
    console.log('\n' + '─'.repeat(80));
    console.log('💡 Tips for Better Results:');
    console.log('─'.repeat(80));
    console.log('\n  • Be specific about your problem or goal');
    console.log('  • Include relevant context and constraints');
    console.log('  • Mention any tools or systems you currently use');
    console.log('  • Describe what you\'ve already tried');
    console.log('\n' + '─'.repeat(80));
    console.log('📝 Example Queries:');
    console.log('─'.repeat(80));
    console.log('\n  "I manage a team of 10 developers across 3 projects. We\'re struggling');
    console.log('   with task tracking and deadline management. Currently using spreadsheets');
    console.log('   but they\'re error-prone. Need integration with Slack and GitHub."');
    console.log('\n  "Our customer support gets 200+ emails daily with repetitive questions');
    console.log('   about password resets and shipping. Team is overwhelmed and response');
    console.log('   times are slow. Need to automate common queries."');
    console.log('\n' + '─'.repeat(80) + '\n');
  }

  private showHistory(): void {
    const history = this.orchestrator.getChainHistory();

    if (history.length === 0) {
      console.log('\n📊 No execution history yet. Process a query first!\n');
      return;
    }

    console.log('\n' + '═'.repeat(80));
    console.log('📊 CHAIN EXECUTION HISTORY');
    console.log('═'.repeat(80) + '\n');

    history.forEach((step, idx) => {
      console.log(`${idx + 1}. ${step.agentName}`);
      console.log(`   Time: ${step.timestamp.toISOString()}`);
      console.log(`   Input: ${step.input.substring(0, 100)}${step.input.length > 100 ? '...' : ''}`);
      console.log(`   Output: ${step.output.substring(0, 100)}${step.output.length > 100 ? '...' : ''}`);
      console.log('');
    });

    console.log('═'.repeat(80) + '\n');
  }

  private exit(): void {
    console.log('\n👋 Thank you for using the Prompt Chaining System. Goodbye!\n');
    process.exit(0);
  }

  start(): void {
    console.clear();
    this.showWelcome();
    this.rl.prompt();
  }
}

// Main function
async function main() {
  // Check for API key
  if (!process.env.OPENAI_API_KEY) {
    console.error('\n❌ Error: OPENAI_API_KEY not found in environment variables\n');
    console.log('Please create a .env file with your OpenAI API key:');
    console.log('OPENAI_API_KEY=your_api_key_here\n');
    process.exit(1);
  }

  const cli = new InteractiveCLI(process.env.OPENAI_API_KEY);
  cli.start();
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('\n❌ Uncaught Error:', error.message);
  console.log('\nThe system encountered an error. Please try again.\n');
});

process.on('unhandledRejection', (reason) => {
  console.error('\n❌ Unhandled Promise Rejection:', reason);
  console.log('\nThe system encountered an error. Please try again.\n');
});

// Run
main().catch((error) => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
