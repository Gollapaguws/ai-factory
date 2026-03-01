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
          <textarea
            aria-label="Custom code snippet"
            value={codeSnippet}
            onChange={(event) => setCodeSnippet(event.target.value)}
            rows={5}
          />
          <div className="action-row">
            <button type="button" className="btn btn-primary" onClick={saveCodeInjection}>
              Save Custom Code
            </button>
            <button type="button" className="btn btn-secondary" onClick={runCodeReview}>
              AI Code Review
            </button>
            <button type="button" className="btn btn-secondary" onClick={generateDocs}>
              Generate Docs
            </button>
          </div>
          {reviewOutput ? <pre className="log-box">{reviewOutput}</pre> : null}
        </article>

        <article className="capability-card">
          <h3>API Connector + ChatOps + Webhooks</h3>
          <input
            aria-label="API connector name"
            placeholder="connector name"
            value={apiConnector}
            onChange={(event) => setApiConnector(event.target.value)}
          />
          <div className="action-row">
            <button type="button" className="btn btn-primary" onClick={addConnector}>
              Add Connector
            </button>
          </div>
          <input
            aria-label="ChatOps command"
            placeholder="/deploy my-app"
            value={chatCommand}
            onChange={(event) => setChatCommand(event.target.value)}
          />
          <p className="hero-subtitle">ChatOps Preview: {chatCommand}</p>
          <input
            aria-label="Webhook URL"
            placeholder="https://example.com/webhook"
            value={webhookUrl}
            onChange={(event) => setWebhookUrl(event.target.value)}
          />
          <button type="button" className="btn btn-primary" onClick={triggerWebhook}>
            Trigger Event
          </button>
        </article>
      </div>
    </section>
  );
}
