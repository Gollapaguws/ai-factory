// AuthManager: Handles role-based access for generated apps
const fs = require("fs");
const path = require("path");

function setRoles(appPath, rolesConfig) {
  const rolesFile = path.join(appPath, "roles.json");
  fs.writeFileSync(rolesFile, JSON.stringify(rolesConfig, null, 2), "utf-8");
}

function getRoles(appPath) {
  const rolesFile = path.join(appPath, "roles.json");
  if (fs.existsSync(rolesFile)) {
    return JSON.parse(fs.readFileSync(rolesFile, "utf-8"));
  }
  return null;
}

module.exports = { setRoles, getRoles };
