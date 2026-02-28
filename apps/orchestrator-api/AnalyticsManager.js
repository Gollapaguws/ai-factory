// AnalyticsManager: Tracks usage events for generated apps
const fs = require("fs");
const path = require("path");

function logUsageEvent(appPath, event) {
  const analyticsDir = path.join(appPath, "analytics");
  if (!fs.existsSync(analyticsDir)) {
    fs.mkdirSync(analyticsDir);
  }
  const logFile = path.join(analyticsDir, "usage.log");
  const entry = `${new Date().toISOString()} - ${event}\n`;
  fs.appendFileSync(logFile, entry, "utf-8");
}

module.exports = { logUsageEvent };
