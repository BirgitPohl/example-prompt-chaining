import chalk from 'chalk';
import dotenv from 'dotenv';
dotenv.config();

const isDebugMode = process.env.AWESOME_DEBUG === 'true';

export enum ChalkColors {
  Black = 'black',
  Red = 'red',
  Green = 'green',
  Yellow = 'yellow',
  Blue = 'blue',
  Magenta = 'magenta',
  Cyan = 'cyan',
  White = 'white',
  Gray = 'gray',
  Grey = 'grey',
}

/**
 * DON'T USE IT FOR ACTUALLY THROWING ERRORS!
 *
 * Just for debugging, not for logging. If you want to log something on production, use the console object.
 *
 * awesomeDebugger is turned on with AWESOME_DEBUG=true in the .env file.
 */
export const awesomeDebugger = (
  message: string,
  color: ChalkColors = ChalkColors.White,
  style?: keyof typeof chalk
) => {
  if (isDebugMode) {
    let styledMessage =
      typeof chalk[color as keyof typeof chalk] === 'function'
        ? (chalk[color as keyof typeof chalk] as (msg: string) => string)(message)
        : message;

    if (style && chalk[style as keyof typeof chalk] instanceof Function) {
      styledMessage = (chalk[style as keyof typeof chalk] as (msg: string) => string)(
        styledMessage
      );
    }
    console.log(styledMessage);
  }
};

/**
 * Debug table logger - equivalent to console.table with customizable output
 *
 * @param data - Array of objects or object to display in table format
 * @param useTable - Whether to use console.table (true) or console.log (false). Default: false
 * @param color - Color for console.log output. Default: ChalkColors.White
 * @param title - Optional title to display above the table
 */
export const awesomeTableDebugger = (
  data: Record<string, unknown>[] | Record<string, unknown>,
  useTable: boolean = false,
  color: ChalkColors = ChalkColors.White,
  title?: string
) => {
  if (isDebugMode) {
    if (title) {
      const titleMessage =
        typeof chalk[color as keyof typeof chalk] === 'function'
          ? (chalk[color as keyof typeof chalk] as (msg: string) => string)(title)
          : title;
      console.log(titleMessage);
    }

    if (useTable) {
      console.table(data);
    } else {
      // Convert to readable log format
      const logData = Array.isArray(data) ? data : [data];
      logData.forEach((item, index) => {
        const itemStr = Array.isArray(data) ? `[${index}] ` : '';
        const entries = Object.entries(item);
        const logMessage = `${itemStr}${entries.map(([key, value]) => `${key}: ${value}`).join(', ')}`;

        const styledMessage =
          typeof chalk[color as keyof typeof chalk] === 'function'
            ? (chalk[color as keyof typeof chalk] as (msg: string) => string)(logMessage)
            : logMessage;

        console.log(styledMessage);
      });
    }
  }
};

export default isDebugMode;
