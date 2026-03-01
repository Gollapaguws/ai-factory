import React, { useState } from "react";
import Page from "../../../shared/Page";

// Hybrid Workflow Builder: visual + code-first (YAML/SDK)
export default function WorkflowBuilder() {
  const [mode, setMode] = useState("visual");
  const [workflowName, setWorkflowName] = useState("My Workflow");
  const [steps, setSteps] = useState(["Ingest", "Analyze", "Respond"]);
  const [yamlCode, setYamlCode] = useState(
    `name: my-workflow\nsteps:\n  - id: ingest\n  - id: analyze\n  - id: respond`
  );
  const [sdkCode, setSdkCode] = useState(
    `const workflow = createWorkflow("my-workflow")\n  .step("ingest")\n  .step("analyze")\n  .step("respond");`
  );

  const addStep = () => {
    setSteps(previous => [...previous, `Step ${previous.length + 1}`]);
  };

  return (
    <Page title="Workflow Builder">
      <p>Build workflows visually or use YAML/SDK definitions.</p>

      <div style={{ marginTop: 12 }}>
        <button onClick={() => setMode("visual")} disabled={mode === "visual"}>
          Visual
        </button>
        <button onClick={() => setMode("yaml")} disabled={mode === "yaml"}>
          YAML
        </button>
        <button onClick={() => setMode("sdk")} disabled={mode === "sdk"}>
          SDK
        </button>
      </div>

      {mode === "visual" && (
        <div style={{ marginTop: 16 }}>
          <label htmlFor="workflowName">Workflow name</label>
          <div>
            <input
              id="workflowName"
              value={workflowName}
              onChange={event => setWorkflowName(event.target.value)}
              style={{ width: 320 }}
            />
          </div>

          <div style={{ marginTop: 12 }}>
            <strong>Steps</strong>
            <ul>
              {steps.map((step, index) => (
                <li key={`${step}-${index}`}>{step}</li>
              ))}
            </ul>
            <button onClick={addStep}>Add Step</button>
          </div>
        </div>
      )}

      {mode === "yaml" && (
        <div style={{ marginTop: 16 }}>
          <label htmlFor="yamlCode">YAML</label>
          <div>
            <textarea
              id="yamlCode"
              value={yamlCode}
              onChange={event => setYamlCode(event.target.value)}
              rows={10}
              style={{ width: "100%", maxWidth: 640 }}
            />
          </div>
        </div>
      )}

      {mode === "sdk" && (
        <div style={{ marginTop: 16 }}>
          <label htmlFor="sdkCode">SDK</label>
          <div>
            <textarea
              id="sdkCode"
              value={sdkCode}
              onChange={event => setSdkCode(event.target.value)}
              rows={10}
              style={{ width: "100%", maxWidth: 640 }}
            />
          </div>
        </div>
      )}
    </Page>
  );
}
