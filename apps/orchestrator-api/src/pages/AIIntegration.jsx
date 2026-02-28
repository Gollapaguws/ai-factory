import React, { useState } from "react";
import AIService from "../ai/AIService";
import Page from "../../../shared/Page";

// Plug-and-Play AI Integration Module
export default function AIIntegration() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLLM = async () => {
    setLoading(true);
    const res = await AIService.callLLM(prompt);
    setResponse(res);
    setLoading(false);
  };

  return (
    <Page title="AI Integration">
      <p>Integrate LLMs, vision models, and custom AI with prompt engineering.</p>
      <input
        type="text"
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
        placeholder="Enter prompt for LLM"
        style={{ width: 300 }}
      />
      <button onClick={handleLLM} disabled={loading || !prompt}>
        {loading ? "Calling LLM..." : "Call LLM"}
      </button>
      {response && (
        <div style={{ marginTop: 16 }}>
          <strong>Response:</strong>
          <pre>{response}</pre>
        </div>
      )}
      {/* TODO: Add vision and custom model integration UI */}
    </Page>
  );
}
