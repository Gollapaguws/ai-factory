// APIConnectorManager: Handles API and database connector setup for generated apps
const fs = require("fs");
const path = require("path");

function addAPIConnector(appPath, connectorConfig) {
  const connectorsDir = path.join(appPath, "connectors");
  if (!fs.existsSync(connectorsDir)) {
    fs.mkdirSync(connectorsDir);
  }
  const fileName = `${connectorConfig.name || "api"}-connector.json`;
  fs.writeFileSync(
    path.join(connectorsDir, fileName),
    JSON.stringify(connectorConfig, null, 2),
    "utf-8"
  );
}

module.exports = { addAPIConnector };
