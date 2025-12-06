/**
 * Format tool - formats data in various formats
 */

import type { Tool } from '../types/index.js';

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
