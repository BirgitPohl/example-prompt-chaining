/**
 * Calculate tool - performs mathematical calculations
 */

import type { Tool } from '../types/index.js';

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
