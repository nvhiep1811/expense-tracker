/**
 * Error logging utility for production-ready error handling
 * Replaces console.log/error statements with structured logging
 */

type LogLevel = "info" | "warn" | "error" | "debug";

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === "development";

  /**
   * Log informational messages
   */
  info(message: string, context?: LogContext): void {
    this.log("info", message, context);
  }

  /**
   * Log warning messages
   */
  warn(message: string, context?: LogContext): void {
    this.log("warn", message, context);
  }

  /**
   * Log error messages
   */
  error(message: string, error?: Error | unknown, context?: LogContext): void {
    const errorContext = {
      ...context,
      ...(error instanceof Error
        ? {
            errorName: error.name,
            errorMessage: error.message,
            errorStack: error.stack,
          }
        : { error }),
    };
    this.log("error", message, errorContext);
  }

  /**
   * Log debug messages (only in development)
   */
  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      this.log("debug", message, context);
    }
  }

  /**
   * Internal logging method
   */
  private log(level: LogLevel, message: string, context?: LogContext): void {
    const timestamp = new Date().toISOString();
    const logData = {
      timestamp,
      level,
      message,
      ...context,
    };

    // In development, use console for readable output
    if (this.isDevelopment) {
      const consoleMethod =
        level === "error"
          ? console.error
          : level === "warn"
            ? console.warn
            : console.log;
      consoleMethod(`[${level.toUpperCase()}] ${message}`, context || "");
      return;
    }

    // In production, you can integrate with services like:
    // - Sentry: Sentry.captureException(error)
    // - LogRocket: LogRocket.error(message)
    // - CloudWatch: cloudwatch.log(logData)
    // - Custom API endpoint for log aggregation

    // For now, structured JSON logging to console
    console.log(JSON.stringify(logData));
  }
}

// Export singleton instance
export const logger = new Logger();
