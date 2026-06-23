type LogLevel = 'INFO' | 'WARN' | 'ERROR';

class Logger {
  private format(level: LogLevel, message: string, meta?: unknown): string {
    const timestamp = new Date().toISOString();
    const metaStr = meta ? ` | Meta: ${JSON.stringify(meta, this.replaceErrors)}` : '';
    return `[${timestamp}] [${level}] ${message}${metaStr}`;
  }

  private replaceErrors(_key: string, value: unknown) {
    if (value instanceof Error) {
      return {
        name: value.name,
        message: value.message,
        stack: value.stack,
      };
    }
    return value;
  }

  info(message: string, meta?: unknown) {
    console.log(this.format('INFO', message, meta));
  }

  warn(message: string, meta?: unknown) {
    console.warn(this.format('WARN', message, meta));
  }

  error(message: string, error?: unknown, meta?: unknown) {
    const combinedMeta = {
      ...(meta && typeof meta === 'object' ? meta : {}),
      error: error instanceof Error ? error : new Error(String(error || 'Unknown Error')),
    };
    console.error(this.format('ERROR', message, combinedMeta));
  }
}

export const logger = new Logger();
