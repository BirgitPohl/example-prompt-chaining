/**
 * Search tool - simulates searching for information
 */

import type { Tool } from '../types/index.js';

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
