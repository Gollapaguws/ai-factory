// GitManager: Handles version control for generated apps
const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

function initRepo(appPath) {
  if (!fs.existsSync(path.join(appPath, ".git"))) {
    execSync("git init", { cwd: appPath });
    execSync("git add .", { cwd: appPath });
    execSync("git commit -m \"Initial commit\"", { cwd: appPath });
  }
}

function commitAll(appPath, message) {
  execSync("git add .", { cwd: appPath });
  execSync(`git commit -m "${message}"`, { cwd: appPath });
}

function getHistory(appPath) {
  return execSync("git log --oneline", { cwd: appPath }).toString();
}

module.exports = { initRepo, commitAll, getHistory };
