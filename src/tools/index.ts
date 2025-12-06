/**
 * Tool registry - exports all available tools
 */

import type { Tool } from '../types/index.js';
import { searchTool } from './search.js';
import { calculateTool } from './calculate.js';
import { analyzeDataTool } from './analyze-data.js';
import { formatTool } from './format.js';
import { validateTool } from './validate.js';
import { dateTimeTool } from './date-time.js';

/**
 * Export individual tools
 */
export { searchTool } from './search.js';
export { calculateTool } from './calculate.js';
export { analyzeDataTool } from './analyze-data.js';
export { formatTool } from './format.js';
export { validateTool } from './validate.js';
export { dateTimeTool } from './date-time.js';

/**
 * Tool registry containing all available tools
 */
export const toolRegistry: Tool[] = [
  searchTool,
  calculateTool,
  analyzeDataTool,
  formatTool,
  validateTool,
  dateTimeTool,
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
