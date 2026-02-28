// ThemeManager: Handles dark mode and theming for generated apps
const fs = require("fs");
const path = require("path");

function setTheme(appPath, theme) {
  const themeFile = path.join(appPath, "theme.json");
  fs.writeFileSync(themeFile, JSON.stringify({ theme }, null, 2), "utf-8");
}

function getTheme(appPath) {
  const themeFile = path.join(appPath, "theme.json");
  if (fs.existsSync(themeFile)) {
    return JSON.parse(fs.readFileSync(themeFile, "utf-8")).theme;
  }
  return "light";
}

module.exports = { setTheme, getTheme };
