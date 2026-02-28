// DeploymentManager: Handles one-click deployment using Docker Compose
const { exec } = require("child_process");
const path = require("path");

function deployApp(callback) {
  const composePath = path.join(__dirname, "../../deployment/docker-compose.yml");
  exec(`docker-compose -f "${composePath}" up -d`, (error, stdout, stderr) => {
    if (error) {
      callback(stderr || error.message, null);
    } else {
      callback(null, stdout);
    }
  });
}

module.exports = { deployApp };
