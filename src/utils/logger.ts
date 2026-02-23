export type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  message: string;
  context?: string;
  data?: unknown;
}

class LoggerClass {
  private debugMode: boolean = false;
  private logs: LogEntry[] = [];
  private maxLogs: number = 1000;

  setDebugMode(enabled: boolean): void {
    this.debugMode = enabled;
  }

  private log(
    level: LogLevel,
    message: string,
    context?: string,
    data?: unknown,
  ): void {
    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      context,
      data,
    };

    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    if (level === "debug" && !this.debugMode) {
      return;
    }

    const prefix = context ? `[${context}]` : "";
    const timestamp = entry.timestamp.toISOString();

    // All logging must go to stderr for MCP servers (stdout is for JSON-RPC only)
    const logMessage = `${timestamp} ${level.toUpperCase()} ${prefix} ${message}`;

    if (level === "error" && data) {
      console.error(logMessage, data);
    } else {
      console.error(logMessage);
    }
  }

  debug(message: string, context?: string, data?: unknown): void {
    this.log("debug", message, context, data);
  }

  info(message: string, context?: string, data?: unknown): void {
    this.log("info", message, context, data);
  }

  warn(message: string, context?: string, data?: unknown): void {
    this.log("warn", message, context, data);
  }

  error(message: string, context?: string, data?: unknown): void {
    this.log("error", message, context, data);
  }

  getLogs(level?: LogLevel, limit: number = 100): LogEntry[] {
    let filtered = this.logs;
    if (level) {
      filtered = filtered.filter((l) => l.level === level);
    }
    return filtered.slice(-limit);
  }

  clear(): void {
    this.logs = [];
  }
}

export const logger = new LoggerClass();
export { LoggerClass as Logger };
