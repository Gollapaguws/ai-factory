import React, { useState } from "react";
import ModuleService from "../modules/ModuleService";
import Page from "../../../shared/Page";

// Composable, Reusable Workflow Modules
export default function ModuleLibrary() {
  const [modules, setModules] = useState(ModuleService.listModules());
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  const addModule = () => {
    if (!name) return;
    ModuleService.addModule({ name, version: "1.0.0", description: desc });
    setModules([...ModuleService.listModules()]);
    setName("");
    setDesc("");
  };

  return (
    <Page title="Module Library">
      <p>Create, version, and share workflow and AI components.</p>
      <ul>
        {modules.map((m, i) => (
          <li key={i}>
            <strong>{m.name}</strong> (v{m.version}): {m.description}
          </li>
        ))}
      </ul>
      <div style={{ marginTop: 16 }}>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Module name"
        />
        <input
          type="text"
          value={desc}
          onChange={e => setDesc(e.target.value)}
          placeholder="Description"
        />
        <button onClick={addModule} disabled={!name}>Add Module</button>
      </div>
    </Page>
  );
}
