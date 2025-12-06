# Interactive CLI Guide

## Starting the Interactive Mode

```bash
npm run dev
# or
npm start
```

## Interface Overview

When you start the interactive mode, you'll see a welcome screen followed by a prompt where you can type your questions.

```
💭 You: [type your question here]
```

## Available Commands

### help
Shows all available commands and usage tips.

```
💭 You: help
```

### clear
Clears the terminal screen and shows the welcome message again.

```
💭 You: clear
```

### reset
Resets the system by clearing the conversation history of all agents. Use this to start fresh with a new query.

```
💭 You: reset
```

### history
Displays the execution history of the last query, showing each agent's input and output.

```
💭 You: history
```

### exit (or quit)
Exits the interactive mode.

```
💭 You: exit
```

## How to Use

### 1. Ask Your Question

Simply type your question or describe your problem at the prompt:

```
💭 You: I'm managing a team of 10 developers working on 3 concurrent projects.
We're struggling with task visibility and deadline tracking. Currently using
spreadsheets but they're error-prone. Need integration with Slack and GitHub.
```

### 2. Watch the Processing

The system will process your query through multiple specialized agents:

```
═══════════════════════════════════════════════════════════════
🤖 Processing your query through the agent chain...
═══════════════════════════════════════════════════════════════

📝 Step 1: Summarizing query...
✓ Summary generated: The user manages a development team...

🔍 Step 2: Identifying pain points...
✓ Identified 3 pain points:
   1. Lack of task visibility across projects
   2. Difficulty tracking deadlines
   3. Error-prone spreadsheet-based workflow

📋 Step 3: Creating execution plan...
✓ Created plan with 4 steps:
   1. Analyze current workflow (low)
   2. Evaluate project management tools (medium)
   ...

🤖 Step 4: Spawning specialized agents...
✓ Spawned 4 specialized agents

⚡ Step 5: Executing specialized agents...
   Executing Agent-Step-1: Analyze current workflow
   ✓ Agent-Step-1 completed
   ...

💬 Step 6: Generating final response...
✓ Final response generated
```

### 3. Read the Response

The system provides a comprehensive response addressing your query:

```
═══════════════════════════════════════════════════════════════
📬 RESPONSE:
═══════════════════════════════════════════════════════════════

Based on your team's needs, here's a comprehensive solution...

[Detailed response with recommendations]

═══════════════════════════════════════════════════════════════
```

### 4. Continue the Conversation

After receiving a response, you can:
- Ask a follow-up question
- Ask about a different topic (use `reset` first)
- View execution history with `history`
- Exit with `exit`

## Tips for Effective Queries

### Be Specific
Include concrete details about your situation:

❌ **Too vague:**
```
💭 You: I need help with my team
```

✅ **Better:**
```
💭 You: I manage a team of 10 developers across 3 projects. We're struggling
with task tracking and deadline management. Currently using spreadsheets but
they're error-prone.
```

### Provide Context
Mention what you're currently using and what's not working:

✅ **Good:**
```
💭 You: Our customer support gets 200+ emails daily with repetitive questions.
We're using a shared inbox but response times are 24+ hours. Team is burning out.
```

### Mention Constraints
Include any requirements or limitations:

✅ **Good:**
```
💭 You: Need a solution that integrates with our existing Slack and GitHub setup.
Budget is limited, prefer open-source tools.
```

## Example Sessions

### Example 1: Project Management

```
💭 You: We have 5 remote teams working on different features. Communication
is chaotic with messages spread across email, Slack, and GitHub. Nobody knows
who's working on what.

[System processes...]

📬 RESPONSE:
Based on your multi-team coordination challenges, I recommend...
[detailed response]

💭 You: history

📊 CHAIN EXECUTION HISTORY
═══════════════════════════════════════════════════════════════
1. Summarizer (2025-12-06T...)
   Input: We have 5 remote teams...
   Output: User managing 5 distributed teams...
[...]
```

### Example 2: Customer Support

```
💭 You: Our support team drowning in tickets. 300+ daily emails, most asking
about password resets, shipping status, and returns. Team of 5 can't keep up.

[System processes...]

📬 RESPONSE:
To address your customer support overflow, here's a multi-layered approach...
[detailed response]

💭 You: reset
✅ System reset. Starting fresh!

💭 You: [ask about something else]
```

## Troubleshooting

### "Please wait for the current query to finish processing"
The system is still processing your previous query. Wait for it to complete before submitting a new one.

### Long Processing Time
Complex queries may take 30-60 seconds to process as they go through multiple agents. This is normal.

### API Errors
If you see API errors:
1. Check your `.env` file has a valid `OPENAI_API_KEY`
2. Ensure you have API credits available
3. Check your internet connection

### Unexpected Responses
If responses seem off-topic:
1. Use `reset` to clear conversation history
2. Make your query more specific
3. Include more context about your situation

## Keyboard Shortcuts

- `Ctrl+C` - Exit the program (same as `exit` command)
- `Ctrl+L` - Clear screen (most terminals)
- `Up/Down Arrow` - Navigate command history

## System Architecture

The interactive CLI coordinates these agents:

1. **Summarizer** - Extracts key information from your query
2. **Pain Identifier** - Identifies your main challenges
3. **Plan Creator** - Develops a solution strategy
4. **AI Spawner** - Creates specialized agents for specific tasks
5. **Responder** - Synthesizes everything into a comprehensive answer

Each step is logged so you can see exactly how your query is being processed.
