// ExtensibilityService.js
// Plugins, Webhooks, APIs (stub)

export default class ExtensibilityService {
  static plugins = [
    { name: "CSV Exporter", enabled: true },
    { name: "Webhook Notifier", enabled: false },
    { name: "Custom API Handler", enabled: true },
  ];

  static listPlugins() {
    return this.plugins;
  }

  static togglePlugin(name) {
    const plugin = this.plugins.find(p => p.name === name);
    if (plugin) plugin.enabled = !plugin.enabled;
  }

  static webhooks = [
    { url: "https://hooks.example.com/notify", active: true },
    { url: "https://hooks.example.com/audit", active: false },
  ];

  static listWebhooks() {
    return this.webhooks;
  }

  static toggleWebhook(url) {
    const webhook = this.webhooks.find(w => w.url === url);
    if (webhook) webhook.active = !webhook.active;
  }
}
