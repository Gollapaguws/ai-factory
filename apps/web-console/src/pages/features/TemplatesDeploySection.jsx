import React from "react";

export default function TemplatesDeploySection({
  template,
  setTemplate,
  generateMobileScaffold,
  generateTests,
  deploymentTarget,
  setDeploymentTarget,
  copyDeployCommand,
  appendCommit,
  rollbackCommit
}) {
  return (
    <section className="capabilities">
      <h2 className="section-title">Templates, Deploy, Versioning</h2>
      <div className="two-col">
        <article className="capability-card">
          <h3>Templates + Mobile Scaffold</h3>
          <select aria-label="Template type" value={template} onChange={(event) => setTemplate(event.target.value)}>
            <option>Dashboard</option>
            <option>CRUD App</option>
            <option>Data Visualizer</option>
            <option>Mobile App</option>
          </select>
          <div className="action-row">
            <button type="button" className="btn btn-primary" onClick={generateMobileScaffold}>
              Generate Template Scaffold
            </button>
            <button type="button" className="btn btn-secondary" onClick={generateTests}>
              Generate Tests
            </button>
          </div>
        </article>

        <article className="capability-card">
          <h3>Deployment + Version Control</h3>
          <select aria-label="Deployment target" value={deploymentTarget} onChange={(event) => setDeploymentTarget(event.target.value)}>
            <option>Docker Compose</option>
            <option>Kubernetes</option>
          </select>
          <div className="action-row">
            <button type="button" className="btn btn-primary" onClick={copyDeployCommand}>
              One-Click Deploy Command
            </button>
            <button type="button" className="btn btn-secondary" onClick={appendCommit}>
              Add Commit
            </button>
            <button type="button" className="btn btn-danger" onClick={rollbackCommit}>
              Rollback
            </button>
          </div>
        </article>
      </div>
    </section>
  );
}
