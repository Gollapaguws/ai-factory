import React from "react";
import Page from "../shared/Page";
import { getApiBase, getApiStatus, getMe } from "../auth";

export default function About() {
  const [checks, setChecks] = React.useState({
    api: "idle",
    auth: "idle"
  });

  async function runApiCheck() {
    setChecks((previous) => ({ ...previous, api: "running" }));
    try {
      await getApiStatus();
      setChecks((previous) => ({ ...previous, api: "pass" }));
    } catch {
      setChecks((previous) => ({ ...previous, api: "fail" }));
    }
  }

  async function runAuthCheck() {
    setChecks((previous) => ({ ...previous, auth: "running" }));
    try {
      await getMe();
      setChecks((previous) => ({ ...previous, auth: "pass" }));
    } catch {
      setChecks((previous) => ({ ...previous, auth: "fail" }));
    }
  }

  function getCheckLabel(status) {
    if (status === "running") {
      return "Running";
    }
    if (status === "pass") {
      return "Pass";
    }
    if (status === "fail") {
      return "Fail";
    }
    return "Not run";
  }

  return (
    <Page>
      <h1 className="hero-title">About This Console</h1>
      <p className="hero-subtitle">
        This UI is tuned for a modern, app-builder aesthetic: dark glass surfaces, compact
        navigation, and metrics-first cards.
      </p>

      <div className="grid">
        <section className="metric">
          <h4>Look & Feel</h4>
          <p>Lovable + Base44 vibe</p>
        </section>
        <section className="metric">
          <h4>Stack</h4>
          <p>React + Vite + Nginx</p>
        </section>
        <section className="metric">
          <h4>API Base</h4>
          <p>{getApiBase()}</p>
        </section>
      </div>

      <section className="capabilities">
        <h2 className="section-title">Runtime Checks</h2>
        <div className="capability-grid">
          <article className="capability-card">
            <h3>API Reachability</h3>
            <p>Calls the API root endpoint and checks for a successful status response.</p>
            <button type="button" className="capability-action" onClick={runApiCheck}>
              Run API Check
            </button>
            <p className="hero-subtitle">Result: {getCheckLabel(checks.api)}</p>
          </article>

          <article className="capability-card">
            <h3>Session Validation</h3>
            <p>Calls the authenticated profile endpoint and validates the current token.</p>
            <button type="button" className="capability-action" onClick={runAuthCheck}>
              Run Auth Check
            </button>
            <p className="hero-subtitle">Result: {getCheckLabel(checks.auth)}</p>
          </article>
        </div>
      </section>
    </Page>
  );
}
