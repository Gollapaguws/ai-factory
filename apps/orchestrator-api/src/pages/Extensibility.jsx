import React, { useState } from "react";
import ExtensibilityService from "../extensibility/ExtensibilityService";
import Page from "../../../shared/Page";

// Extensible Architecture: plugins, webhooks, APIs
export default function Extensibility() {
  const [plugins, setPlugins] = useState(ExtensibilityService.listPlugins());
  const [webhooks, setWebhooks] = useState(ExtensibilityService.listWebhooks());

  const togglePlugin = name => {
    ExtensibilityService.togglePlugin(name);
    setPlugins([...ExtensibilityService.listPlugins()]);
  };
  const toggleWebhook = url => {
    ExtensibilityService.toggleWebhook(url);
    setWebhooks([...ExtensibilityService.listWebhooks()]);
  };

  return (
    <Page title="Extensibility">
      <h2>Plugins</h2>
      <ul>
        {plugins.map((p, i) => (
          <li key={i}>
            <strong>{p.name}</strong> -
            <button onClick={() => togglePlugin(p.name)}>
              {p.enabled ? "Disable" : "Enable"}
            </button>
          </li>
        ))}
      </ul>
      <h2>Webhooks</h2>
      <ul>
        {webhooks.map((w, i) => (
          <li key={i}>
            <span>{w.url}</span> -
            <button onClick={() => toggleWebhook(w.url)}>
              {w.active ? "Deactivate" : "Activate"}
            </button>
          </li>
        ))}
      </ul>
      <p style={{ marginTop: 16 }}><em>API support coming soon.</em></p>
    </Page>
  );
}
