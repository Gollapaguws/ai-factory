import React, { useState } from "react";
import AIService from "../ai/AIService";
import Page from "../../../shared/Page";

// Plug-and-Play AI Integration Module
export default function AIIntegration() {
  const [prompt, setPrompt] = useState("");
  const [imageData, setImageData] = useState("");
  const [customInput, setCustomInput] = useState("");
  const [llmResponse, setLlmResponse] = useState("");
  const [visionResponse, setVisionResponse] = useState("");
  const [customResponse, setCustomResponse] = useState("");
  const [activeCall, setActiveCall] = useState("");
  const [error, setError] = useState("");

  const isLoading = (call) => activeCall === call;

  const handleLLM = async () => {
    try {
      setError("");
      setActiveCall("llm");
      const res = await AIService.callLLM(prompt);
      setLlmResponse(res);
    } catch (callError) {
      setError(callError.message || "LLM call failed");
    } finally {
      setActiveCall("");
    }
  };

  const handleVision = async () => {
    try {
      setError("");
      setActiveCall("vision");
      const res = await AIService.callVisionAPI(imageData);
      setVisionResponse(res);
    } catch (callError) {
      setError(callError.message || "Vision call failed");
    } finally {
      setActiveCall("");
    }
  };

  const handleCustomModel = async () => {
    try {
      setError("");
      setActiveCall("custom");
      const res = await AIService.customModel(customInput);
      setCustomResponse(res);
    } catch (callError) {
      setError(callError.message || "Custom model call failed");
    } finally {
      setActiveCall("");
    }
  };

  return (
    <Page title="AI Integration">
      <p>Integrate LLMs, vision models, and custom AI with prompt engineering.</p>
      <div style={{ marginTop: 12 }}>
        <strong>LLM</strong>
        <div style={{ marginTop: 8 }}>
          <input
            type="text"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="Enter prompt for LLM"
            style={{ width: 300 }}
          />
          <button onClick={handleLLM} disabled={isLoading("llm") || !prompt}>
            {isLoading("llm") ? "Calling LLM..." : "Call LLM"}
          </button>
        </div>
        {llmResponse && (
          <div style={{ marginTop: 8 }}>
            <pre>{llmResponse}</pre>
          </div>
        )}
      </div>

      <div style={{ marginTop: 16 }}>
        <strong>Vision Model</strong>
        <div style={{ marginTop: 8 }}>
          <textarea
            value={imageData}
            onChange={e => setImageData(e.target.value)}
            placeholder="Paste image payload, URL, or base64"
            rows={4}
            style={{ width: 300 }}
          />
          <div>
            <button onClick={handleVision} disabled={isLoading("vision") || !imageData}>
              {isLoading("vision") ? "Calling Vision..." : "Call Vision"}
            </button>
          </div>
        </div>
        {visionResponse && (
          <div style={{ marginTop: 8 }}>
            <pre>{visionResponse}</pre>
          </div>
        )}
      </div>

      <div style={{ marginTop: 16 }}>
        <strong>Custom Model</strong>
        <div style={{ marginTop: 8 }}>
          <input
            type="text"
            value={customInput}
            onChange={e => setCustomInput(e.target.value)}
            placeholder="Enter custom model input"
            style={{ width: 300 }}
          />
          <button onClick={handleCustomModel} disabled={isLoading("custom") || !customInput}>
            {isLoading("custom") ? "Calling Custom Model..." : "Call Custom Model"}
          </button>
        </div>
        {customResponse && (
          <div style={{ marginTop: 8 }}>
            <pre>{customResponse}</pre>
          </div>
        )}
      </div>

      {error && (
        <div style={{ marginTop: 16 }}>
          <strong>Error:</strong> {error}
        </div>
      )}
    </Page>
  );
}
