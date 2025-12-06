/**
 * Search tool - uses OpenAI web search
 */

import type { Tool } from '../types/index.js';

export const searchTool: Tool = {
  name: 'search',
  description: 'Search the web for real-time information on a given topic using OpenAI web search',
  parameters: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'The search query',
      },
    },
    required: ['query'],
  },
  execute: async (args: { query: string }) => {
    // This tool is now a marker that indicates web search capability is needed
    // The actual search is performed by the agent using OpenAI's web_search feature
    return {
      query: args.query,
      message: 'Web search capability available - agent will use OpenAI web search',
      requiresWebSearch: true,
    };
  },
};
