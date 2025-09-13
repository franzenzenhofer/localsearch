export class DebugLogger {
  private static instance: DebugLogger;
  private logs: string[] = [];

  static getInstance(): DebugLogger {
    if (!DebugLogger.instance) {
      DebugLogger.instance = new DebugLogger();
    }
    return DebugLogger.instance;
  }

  private formatTimestamp(): string {
    return new Date().toISOString().split("T")[1].replace("Z", "");
  }

  private createLogEntry(
    level: string,
    category: string,
    message: string,
    data?: any,
  ): string {
    const timestamp = this.formatTimestamp();
    const logEntry = `[${timestamp}] ${level.toUpperCase()} [${category}] ${message}`;

    if (data !== undefined) {
      return `${logEntry} | DATA: ${JSON.stringify(data, null, 2)}`;
    }
    return logEntry;
  }

  info(category: string, message: string, data?: any): void {
    const logEntry = this.createLogEntry("info", category, message, data);
    console.log(`%c${logEntry}`, "color: #2196F3; font-weight: bold;");
    this.logs.push(logEntry);
  }

  success(category: string, message: string, data?: any): void {
    const logEntry = this.createLogEntry("success", category, message, data);
    console.log(`%c${logEntry}`, "color: #4CAF50; font-weight: bold;");
    this.logs.push(logEntry);
  }

  warn(category: string, message: string, data?: any): void {
    const logEntry = this.createLogEntry("warn", category, message, data);
    console.warn(`%c${logEntry}`, "color: #FF9800; font-weight: bold;");
    this.logs.push(logEntry);
  }

  error(category: string, message: string, data?: any): void {
    const logEntry = this.createLogEntry("error", category, message, data);
    console.error(`%c${logEntry}`, "color: #F44336; font-weight: bold;");
    this.logs.push(logEntry);
  }

  event(category: string, event: string, target?: any, data?: any): void {
    const eventData = {
      event,
      target: target?.constructor?.name || target?.tagName || "unknown",
      targetId: target?.id || "no-id",
      targetClass: target?.className || "no-class",
      data,
    };
    const logEntry = this.createLogEntry(
      "event",
      category,
      `EVENT: ${event}`,
      eventData,
    );
    console.log(`%c${logEntry}`, "color: #9C27B0; font-weight: bold;");
    this.logs.push(logEntry);
  }

  copyLogs(): string {
    const allLogs = this.logs.join("\n");
    navigator.clipboard?.writeText(allLogs);
    console.log(
      "%cDEBUG LOGS COPIED TO CLIPBOARD!",
      "color: #FFD700; font-size: 16px; font-weight: bold; background: black; padding: 4px;",
    );
    return allLogs;
  }

  clearLogs(): void {
    this.logs = [];
    console.clear();
    console.log(
      "%cDEBUG LOGS CLEARED",
      "color: #FFD700; font-size: 16px; font-weight: bold; background: black; padding: 4px;",
    );
  }

  showSummary(): void {
    console.group(
      "%cDEBUG LOG SUMMARY",
      "color: #FFD700; font-size: 16px; font-weight: bold;",
    );
    console.log(`Total logs: ${this.logs.length}`);
    console.log("Recent logs:");
    this.logs.slice(-10).forEach((log) => console.log(log));
    console.groupEnd();
  }
}
