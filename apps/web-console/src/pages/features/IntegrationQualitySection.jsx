import React from "react";

export default function IntegrationQualitySection({
  codeSnippet,
  setCodeSnippet,
  saveCodeInjection,
  runCodeReview,
  generateDocs,
  reviewOutput,
  apiConnector,
  setApiConnector,
  addConnector,
  chatCommand,
  setChatCommand,
  webhookUrl,
  setWebhookUrl,
  triggerWebhook
}) {
  return (
    <section className="capabilities">
      <h2 className="section-title">Integration + Quality</h2>
      <div className="two-col">
        <article className="capability-card">
          <h3>Code Injection + Review + Docs</h3>
          <textarea value={codeSnippet} onChange={(event) => setCodeSnippet(event.target.value)} rows={5} />
          <div className="action-row">
            <button type="button" className="capability-action" onClick={saveCodeInjection}>
              Save Custom Code
            </button>
            <button type="button" className="capability-action" onClick={runCodeReview}>
              AI Code Review
            </button>
            <button type="button" className="capability-action" onClick={generateDocs}>
              Generate Docs
            </button>
          </div>
          {reviewOutput ? <pre className="log-box">{reviewOutput}</pre> : null}
        </article>

        <article className="capability-card">
          <h3>API Connector + ChatOps + Webhooks</h3>
          <input value={apiConnector} onChange={(event) => setApiConnector(event.target.value)} />
          <div className="action-row">
            <button type="button" className="capability-action" onClick={addConnector}>
              Add Connector
            </button>
          </div>
          <input value={chatCommand} onChange={(event) => setChatCommand(event.target.value)} />
          <p className="hero-subtitle">ChatOps Preview: {chatCommand}</p>
          <input value={webhookUrl} onChange={(event) => setWebhookUrl(event.target.value)} />
          <button type="button" className="capability-action" onClick={triggerWebhook}>
            Trigger Event
          </button>
        </article>
      </div>
    </section>
  );
}
