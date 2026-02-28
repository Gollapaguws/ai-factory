import React from "react";

export default function LiveOutputsSection({
  generatedOutput,
  docsOutput,
  selectedProject,
  connectorList,
  workflowSteps,
  secrets,
  webhookLog,
  collabNotes,
  abExperiments
}) {
  return (
    <section className="capabilities">
      <h2 className="section-title">Live Outputs</h2>
      <div className="two-col">
        <article className="capability-card">
          <h3>Generated Output</h3>
          <pre className="log-box">{generatedOutput || "No output yet"}</pre>
          {docsOutput ? <pre className="log-box">{docsOutput}</pre> : null}
        </article>

        <article className="capability-card">
          <h3>Activity Feeds</h3>
          <p className="hero-subtitle">Selected Project: {selectedProject?.name || "none"}</p>
          <pre className="log-box">Connectors: {connectorList.join(", ") || "none"}</pre>
          <pre className="log-box">Workflow: {workflowSteps.join(" -> ") || "none"}</pre>
          <pre className="log-box">Secrets: {secrets.map((item) => `${item.name}:${item.masked}`).join(", ") || "none"}</pre>
          <pre className="log-box">Webhooks: {webhookLog.join("\n") || "none"}</pre>
          <pre className="log-box">Collab: {collabNotes.join("\n") || "none"}</pre>
          <pre className="log-box">A/B: {abExperiments.map((item) => item.name).join(", ") || "none"}</pre>
        </article>
      </div>
    </section>
  );
}
