# Usage Guide

## Quick Start

### 1. Installation

```bash
cd example-prompt-chaining
npm install
```

### 2. Configuration

```bash
cp .env.example .env
# Edit .env and add your OpenAI API key
```

### 3. Run

```bash
npm run dev
```

## Example Use Cases

### 1. Customer Support Automation

Process queries about overwhelming customer support with repetitive questions. The system will:
- Identify pain points (repetitive work, slow responses)
- Create automation plan
- Provide comprehensive strategy

### 2. Data Analysis Request

Process queries about analyzing scattered data across multiple sources. The system will:
- Identify data consolidation needs
- Plan integration strategy
- Provide dashboard recommendations

### 3. Workflow Optimization

Process queries about manual, time-consuming workflows. The system will:
- Identify inefficiencies
- Plan automation approach
- Provide optimization recommendations

## Monitoring and Debugging

The orchestrator includes built-in logging showing each step:

- 📝 Summarization
- 🔍 Pain identification
- 📋 Plan creation
- 🤖 Agent spawning
- ⚡ Agent execution
- 💬 Response generation

## Best Practices for Queries

**Effective queries include:**
- Specific problems or goals
- Relevant context
- Constraints or requirements

**Example:**
```
I manage a team of 10 developers working on 3 concurrent projects.
We're struggling with task visibility and deadline tracking.
Currently using spreadsheets which are error-prone.
Need a solution that integrates with Slack and GitHub.
```

## Troubleshooting

### Common Issues

**"OPENAI_API_KEY not found"**
- Create `.env` file with valid API key

**"Failed to parse plan from response"**
- Model response format issue
- Try adjusting temperature or prompt

**Rate limit errors**
- Add delays between requests
- Implement retry logic

**Long execution times**
- Reduce max_tokens
- Optimize system prompts

## Advanced Topics

For detailed information about:
- Working with individual agents
- Creating custom tools
- Extending the chain
- Parallel agent execution

See the [Architecture Documentation](./ARCHITECTURE.md)
