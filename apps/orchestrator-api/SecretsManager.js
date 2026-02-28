// SecretsManager: Handles secrets management for generated apps
const fs = require("fs");
const path = require("path");

function storeSecret(appPath, key, value) {
  const secretsFile = path.join(appPath, "secrets.json");
  let secrets = {};
  if (fs.existsSync(secretsFile)) {
    secrets = JSON.parse(fs.readFileSync(secretsFile, "utf-8"));
  }
  secrets[key] = value;
  fs.writeFileSync(secretsFile, JSON.stringify(secrets, null, 2), "utf-8");
}

function getSecret(appPath, key) {
  const secretsFile = path.join(appPath, "secrets.json");
  if (fs.existsSync(secretsFile)) {
    const secrets = JSON.parse(fs.readFileSync(secretsFile, "utf-8"));
    return secrets[key];
  }
  return undefined;
}

module.exports = { storeSecret, getSecret };
