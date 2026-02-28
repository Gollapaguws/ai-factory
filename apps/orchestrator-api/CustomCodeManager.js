// CustomCodeManager: Handles injection of custom code into generated apps
const fs = require("fs");
const path = require("path");

function injectCustomCode(appPath, filePath, code) {
  const targetPath = path.join(appPath, filePath);
  fs.writeFileSync(targetPath, code, "utf-8");
}

module.exports = { injectCustomCode };
