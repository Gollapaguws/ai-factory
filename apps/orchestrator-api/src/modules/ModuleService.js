// ModuleService.js
// Composable, Reusable Workflow Modules

export default class ModuleService {
  static modules = [
    { name: "HTTP Request", version: "1.0.0", description: "Send HTTP requests." },
    { name: "Data Transform", version: "1.0.0", description: "Transform data with JS code." },
    { name: "AI Task", version: "1.0.0", description: "Run an AI model or prompt." },
  ];

  static listModules() {
    return this.modules;
  }

  static addModule(module) {
    this.modules.push(module);
  }
}
