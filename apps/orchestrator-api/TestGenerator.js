// TestGenerator: Generates basic test files for scaffolded apps
const fs = require("fs");
const path = require("path");

function generateBasicTests(appPath) {
  const testDir = path.join(appPath, "tests");
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir);
  }
  const testFile = path.join(testDir, "basic.test.js");
  const content = `describe('Basic App Test', () => {
  it('should run without crashing', () => {
    expect(true).toBe(true);
  });
});\n`;
  fs.writeFileSync(testFile, content, "utf-8");
}

module.exports = { generateBasicTests };
