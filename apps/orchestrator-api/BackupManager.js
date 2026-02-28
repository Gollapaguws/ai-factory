// BackupManager: Handles backup and restore for generated apps
const fs = require("fs");
const path = require("path");

function backupApp(appPath, backupDir) {
  // Simple backup: copy app directory to backupDir
  const appName = path.basename(appPath);
  const dest = path.join(backupDir, `${appName}_backup_${Date.now()}`);
  fs.cpSync(appPath, dest, { recursive: true });
  return dest;
}

function restoreApp(backupPath, restorePath) {
  fs.cpSync(backupPath, restorePath, { recursive: true });
}

module.exports = { backupApp, restoreApp };
