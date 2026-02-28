// TemplateManager: Loads and lists available app templates
const fs = require("fs");
const path = require("path");

const TEMPLATES_DIR = path.join(__dirname, "../../templates");

function listTemplates() {
  return fs.readdirSync(TEMPLATES_DIR)
    .filter(file => file.endsWith(".json"))
    .map(file => {
      const template = JSON.parse(fs.readFileSync(path.join(TEMPLATES_DIR, file), "utf-8"));
      return { name: template.name, description: template.description, file };
    });
}

function loadTemplate(templateFile) {
  const filePath = path.join(TEMPLATES_DIR, templateFile);
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

module.exports = { listTemplates, loadTemplate };
