/**
 * Data analysis tool - analyzes data patterns
 */

import type { Tool } from '../types/index.js';

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
