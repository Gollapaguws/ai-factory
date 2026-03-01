import React from "react";

export default function AdvancedControlsSection({
  plugins,
  togglePlugin,
  workflowStep,
  setWorkflowStep,
  addWorkflowStep,
  collabDraft,
  setCollabDraft,
  sendCollabNote,
  secretName,
  setSecretName,
  secretValue,
  setSecretValue,
  addSecret,
  measurePerformance,
  setIsLightTheme,
  perfText
}) {
  return (
    <section className="capabilities">
      <h2 className="section-title">Advanced Controls</h2>
      <div className="two-col">
        <article className="capability-card">
          <h3>Plugins + Workflow + Collaboration</h3>
          <div className="feature-list">
            {plugins.map((plugin) => (
              <button
                key={plugin.key || plugin.name}
                type="button"
                className="btn btn-secondary"
                aria-pressed={plugin.enabled}
                onClick={() => togglePlugin(plugin.name || plugin.label || plugin.key)}
              >
                {plugin.label || plugin.name}: {plugin.enabled ? "ON" : "OFF"}
              </button>
            ))}
          </div>
          <div className="action-row">
            <input
              aria-label="Workflow step name"
              placeholder="Step name"
              value={workflowStep}
              onChange={(event) => setWorkflowStep(event.target.value)}
            />
            <button type="button" className="btn btn-primary" onClick={addWorkflowStep}>
              Add Workflow Step
            </button>
          </div>
          <div className="action-row">
            <input
              aria-label="Collaboration note"
              placeholder="Write a note"
              value={collabDraft}
              onChange={(event) => setCollabDraft(event.target.value)}
            />
            <button type="button" className="btn btn-primary" onClick={sendCollabNote}>
              Share Realtime Note
            </button>
          </div>
        </article>

        <article className="capability-card">
          <h3>Secrets + Perf + Theming</h3>
          <input
            aria-label="Secret name"
            placeholder="SECRET_KEY"
            value={secretName}
            onChange={(event) => setSecretName(event.target.value)}
          />
          <input
            type="password"
            aria-label="Secret value"
            value={secretValue}
            onChange={(event) => setSecretValue(event.target.value)}
            placeholder="secret value"
          />
          <div className="action-row">
            <button type="button" className="btn btn-primary" onClick={addSecret}>
              Save Secret
            </button>
            <button type="button" className="btn btn-secondary" onClick={measurePerformance}>
              Measure Performance
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => setIsLightTheme((value) => !value)}>
              Toggle Theme
            </button>
          </div>
          <p className="hero-subtitle">{perfText}</p>
        </article>
      </div>
    </section>
  );
}
