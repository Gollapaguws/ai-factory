import React from "react";

export default function CoreBuilderSection({
  selectedModel,
  setSelectedModel,
  prompt,
  setPrompt,
  generateFromPrompt,
  profile,
  oauthAllowedUsers,
  setOauthAllowedUsers,
  oauthCandidate,
  setOauthCandidate,
  runOAuthCheck,
  oauthResult
}) {
  return (
    <section className="capabilities">
      <h2 className="section-title">Core Builder</h2>
      <div className="two-col">
        <article className="capability-card">
          <h3>Natural Language + AI Models</h3>
          <p>Generate project scaffold and backend plan with OpenAI/Anthropic model selection.</p>
          <label className="inline-field">
            Model
            <select value={selectedModel} onChange={(event) => setSelectedModel(event.target.value)}>
              <option>OpenAI</option>
              <option>Anthropic</option>
            </select>
          </label>
          <textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} rows={4} />
          <button type="button" className="capability-action" onClick={generateFromPrompt}>
            Generate App + Backend Plan
          </button>
        </article>

        <article className="capability-card">
          <h3>OAuth + Role Access</h3>
          <p>Allowlist validation for the two-engineer OAuth policy plus current role view.</p>
          <p className="hero-subtitle">Current role: {profile?.role || "viewer"}</p>
          <input value={oauthAllowedUsers} onChange={(event) => setOauthAllowedUsers(event.target.value)} />
          <input value={oauthCandidate} onChange={(event) => setOauthCandidate(event.target.value)} />
          <button type="button" className="capability-action" onClick={runOAuthCheck}>
            Validate OAuth Access
          </button>
          <p className="hero-subtitle">Result: {oauthResult}</p>
        </article>
      </div>
    </section>
  );
}
