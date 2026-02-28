// ObservabilityService.js
// Dashboards, logs, traces, alerts (stub)

export default class ObservabilityService {
  static logs = [
    { level: "info", message: "Workflow started", timestamp: Date.now() - 120000 },
    { level: "warn", message: "Slow response from AI module", timestamp: Date.now() - 60000 },
    { level: "error", message: "Failed to fetch data", timestamp: Date.now() - 30000 },
  ];

  static getLogs() {
    return this.logs;
  }

  static addLog(level, message) {
    this.logs.push({ level, message, timestamp: Date.now() });
  }
}
