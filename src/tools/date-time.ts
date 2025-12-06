/**
 * Date and time tool - gets current date and time information
 */

import type { Tool } from '../types/index.js';

export const dateTimeTool: Tool = {
  name: 'getDateTime',
  description: 'Get current date and time information in various formats',
  parameters: {
    type: 'object',
    properties: {
      timezone: {
        type: 'string',
        description: 'Timezone identifier (e.g., "America/New_York", "Europe/London", "UTC")',
      },
      format: {
        type: 'string',
        description: 'Output format: "iso", "local", "timestamp", or "detailed"',
        enum: ['iso', 'local', 'timestamp', 'detailed'],
      },
    },
    required: [],
  },
  execute: async (args: { timezone?: string; format?: string }) => {
    const now = new Date();
    const format = args.format || 'detailed';

    // Get timezone offset if specified
    let timezoneDate = now;
    if (args.timezone) {
      try {
        const timezoneString = now.toLocaleString('en-US', { timeZone: args.timezone });
        timezoneDate = new Date(timezoneString);
      } catch (error) {
        // If timezone is invalid, use local time
        console.warn(`Invalid timezone: ${args.timezone}, using local time`);
      }
    }

    const result: Record<string, any> = {
      timezone: args.timezone || 'local',
      requestedFormat: format,
    };

    if (format === 'iso') {
      result.dateTime = timezoneDate.toISOString();
    } else if (format === 'local') {
      result.dateTime = timezoneDate.toLocaleString();
    } else if (format === 'timestamp') {
      result.dateTime = timezoneDate.getTime();
      result.timestampSeconds = Math.floor(timezoneDate.getTime() / 1000);
    } else {
      // detailed format
      result.iso = timezoneDate.toISOString();
      result.local = timezoneDate.toLocaleString();
      result.date = timezoneDate.toLocaleDateString();
      result.time = timezoneDate.toLocaleTimeString();
      result.timestamp = timezoneDate.getTime();
      result.year = timezoneDate.getFullYear();
      result.month = timezoneDate.getMonth() + 1;
      result.day = timezoneDate.getDate();
      result.dayOfWeek = timezoneDate.toLocaleDateString('en-US', { weekday: 'long' });
      result.hours = timezoneDate.getHours();
      result.minutes = timezoneDate.getMinutes();
      result.seconds = timezoneDate.getSeconds();
    }

    return result;
  },
};
