import React from "react";
import Page from "../shared/Page";
import { getApiStatus, getMe } from "../auth";

export default function Home() {
  const [profile, setProfile] = React.useState(null);
  const [profileError, setProfileError] = React.useState("");
  const [apiStatus, setApiStatus] = React.useState("checking");
  const [apiMessage, setApiMessage] = React.useState("Checking API status...");
  const [selectedCapability, setSelectedCapability] = React.useState("Workflow Builder");

  const capabilities = [
    {
      title: "Workflow Builder",
      detail: "Visual + code-first workflow orchestration with reusable steps.",
      action: "Map process steps"
    },
    {
      title: "Module Library",
      detail: "Versioned building blocks for prompts, automations, and connectors.",
      action: "Browse reusable modules"
    },
    {
      title: "Security & Compliance",
      detail: "Role-based controls, audit trails, and safer production operations.",
      action: "Review session security"
    },
    {
      title: "Observability",
      detail: "Execution visibility, status tracking, and failure diagnostics.",
      action: "Inspect runtime status"
    }
  ];

  const currentCapability =
    capabilities.find((capability) => capability.title === selectedCapability) || capabilities[0];

  async function refreshProfile() {
    setProfileError("");
    try {
      const data = await getMe();
      setProfile(data.user);
    } catch (error) {
      setProfile(null);
      setProfileError(error.message);
    }
  }

  async function refreshApiStatus() {
    setApiStatus("checking");
    setApiMessage("Checking API status...");
    try {
      const data = await getApiStatus();
      setApiStatus("online");
      setApiMessage(`${data.service} is ${data.status}`);
    } catch (error) {
      setApiStatus("offline");
      setApiMessage(error.message || "API status check failed");
    }
  }

  React.useEffect(() => {
    refreshProfile();
    refreshApiStatus();
  }, []);

  return (
    <Page>
      <h1 className="hero-title">Lovable-style Builder Console</h1>
      <p className="hero-subtitle">
        Design, prompt, preview, and ship with a polished Base44-inspired workspace.
      </p>

      <div className="grid">
        <section className="metric">
          <h4>Projects</h4>
          <p>{capabilities.length} Modules</p>
        </section>
        <section className="metric">
          <h4>API Connectivity</h4>
          <p>{apiStatus === "online" ? "Online" : apiStatus === "offline" ? "Offline" : "Checking"}</p>
        </section>
        <section className="metric">
          <h4>Current User</h4>
          <p>{profile ? profile.username : "Unknown"}</p>
        </section>
      </div>

      <div className="action-row">
        <button type="button" className="logout-btn" onClick={refreshProfile}>
          Refresh Session
        </button>
        <button type="button" className="logout-btn" onClick={refreshApiStatus}>
          Test API
        </button>
      </div>

      <p className={`hero-subtitle ${apiStatus === "offline" ? "status-bad" : "status-good"}`}>{apiMessage}</p>
      {profileError ? <p className="error-text">{profileError}</p> : null}

      <div className="pill-row">
        <span className="pill">Prompt-first UX</span>
        <span className="pill">Realtime previews</span>
        <span className="pill">Production deploys</span>
        <span className="pill">Reusable modules</span>
      </div>

      <section className="capabilities">
        <h2 className="section-title">Core Capabilities</h2>
        <div className="capability-grid">
          {capabilities.map(capability => (
            <article key={capability.title} className="capability-card">
              <h3>{capability.title}</h3>
              <p>{capability.detail}</p>
              <button
                type="button"
                className="capability-action"
                onClick={() => setSelectedCapability(capability.title)}
              >
                {capability.action}
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="capabilities">
        <h2 className="section-title">Selected Capability</h2>
        <article className="capability-card">
          <h3>{currentCapability.title}</h3>
          <p>{currentCapability.detail}</p>
          <p className="hero-subtitle">Action ready: {currentCapability.action}</p>
        </article>
      </section>
    </Page>
  );
}
