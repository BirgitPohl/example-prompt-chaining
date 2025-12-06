/**
 * Example tools that can be used by spawned agents
 */

import type { Tool } from '../types/index.js';

/**
 * Search tool - simulates searching for information
 */
export const searchTool: Tool = {
  name: 'search',
  description: 'Search for information on a given topic',
  parameters: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'The search query',
      },
      maxResults: {
        type: 'number',
        description: 'Maximum number of results to return',
        default: 5,
      },
    },
    required: ['query'],
  },
  execute: async (args: { query: string; maxResults?: number }) => {
    // Simulate search delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      query: args.query,
      results: [
        {
          title: `Result 1 for "${args.query}"`,
          snippet: 'This is a simulated search result with relevant information...',
          url: 'https://example.com/result1',
        },
        {
          title: `Result 2 for "${args.query}"`,
          snippet: 'Another relevant piece of information about the topic...',
          url: 'https://example.com/result2',
        },
      ].slice(0, args.maxResults || 5),
    };
  },
};

/**
 * Calculate tool - performs mathematical calculations
 */
export const calculateTool: Tool = {
  name: 'calculate',
  description: 'Perform mathematical calculations',
  parameters: {
    type: 'object',
    properties: {
      expression: {
        type: 'string',
        description: 'Mathematical expression to evaluate',
      },
    },
    required: ['expression'],
  },
  execute: async (args: { expression: string }) => {
    try {
      // Simple eval (in production, use a proper math parser)
      // This is just for demonstration
      const result = eval(args.expression);
      return {
        expression: args.expression,
        result,
      };
    } catch (error) {
      return {
        expression: args.expression,
        error: 'Invalid mathematical expression',
      };
    }
  },
};

/**
 * Data analysis tool - analyzes data patterns
 */
export const analyzeDataTool: Tool = {
  name: 'analyzeData',
  description: 'Analyze data patterns and provide insights',
  parameters: {
    type: 'object',
    properties: {
      data: {
        type: 'array',
        description: 'Array of data points to analyze',
      },
      analysisType: {
        type: 'string',
        description: 'Type of analysis: "statistics", "trends", or "patterns"',
        enum: ['statistics', 'trends', 'patterns'],
      },
    },
    required: ['data', 'analysisType'],
  },
  execute: async (args: { data: number[]; analysisType: string }) => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const { data, analysisType } = args;

    if (analysisType === 'statistics') {
      const sum = data.reduce((a, b) => a + b, 0);
      const avg = sum / data.length;
      const min = Math.min(...data);
      const max = Math.max(...data);

      return {
        type: 'statistics',
        count: data.length,
        sum,
        average: avg,
        min,
        max,
      };
    } else if (analysisType === 'trends') {
      const increasing = data.every((val, idx) => idx === 0 || val >= data[idx - 1]);
      const decreasing = data.every((val, idx) => idx === 0 || val <= data[idx - 1]);

      return {
        type: 'trends',
        trend: increasing ? 'increasing' : decreasing ? 'decreasing' : 'mixed',
        dataPoints: data.length,
      };
    } else {
      return {
        type: 'patterns',
        uniqueValues: new Set(data).size,
        duplicates: data.length - new Set(data).size,
      };
    }
  },
};

/**
 * Format tool - formats data in various formats
 */
export const formatTool: Tool = {
  name: 'format',
  description: 'Format data into various output formats',
  parameters: {
    type: 'object',
    properties: {
      data: {
        type: 'object',
        description: 'Data to format',
      },
      format: {
        type: 'string',
        description: 'Output format: "json", "markdown", or "plain"',
        enum: ['json', 'markdown', 'plain'],
      },
    },
    required: ['data', 'format'],
  },
  execute: async (args: { data: any; format: string }) => {
    const { data, format } = args;

    if (format === 'json') {
      return {
        formatted: JSON.stringify(data, null, 2),
        format: 'json',
      };
    } else if (format === 'markdown') {
      const markdown = Object.entries(data)
        .map(([key, value]) => `**${key}**: ${value}`)
        .join('\n\n');
      return {
        formatted: markdown,
        format: 'markdown',
      };
    } else {
      const plain = Object.entries(data)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n');
      return {
        formatted: plain,
        format: 'plain',
      };
    }
  },
};

/**
 * Validation tool - validates data against criteria
 */
export const validateTool: Tool = {
  name: 'validate',
  description: 'Validate data against specified criteria',
  parameters: {
    type: 'object',
    properties: {
      data: {
        type: 'any',
        description: 'Data to validate',
      },
      criteria: {
        type: 'object',
        description: 'Validation criteria',
      },
    },
    required: ['data', 'criteria'],
  },
  execute: async (args: { data: any; criteria: any }) => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    return {
      valid: true,
      data: args.data,
      criteria: args.criteria,
      message: 'Validation successful (simulated)',
    };
  },
};

/**
 * Tool registry containing all available tools
 */
export const toolRegistry: Tool[] = [
  searchTool,
  calculateTool,
  analyzeDataTool,
  formatTool,
  validateTool,
];

/**
 * Get tool by name
 */
export function getToolByName(name: string): Tool | undefined {
  return toolRegistry.find((tool) => tool.name === name);
}

/**
 * Get all tool names
 */
export function getToolNames(): string[] {
  return toolRegistry.map((tool) => tool.name);
}
