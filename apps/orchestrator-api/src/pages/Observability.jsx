import React, { useState } from "react";
import ObservabilityService from "../observability/ObservabilityService";
import Page from "../../../shared/Page";

// Deep Observability: dashboards, logs, traces, alerts
export default function Observability() {
  const [logs, setLogs] = useState(ObservabilityService.getLogs());
  const [level, setLevel] = useState("info");
  const [message, setMessage] = useState("");

  const addLog = () => {
    if (!message) return;
    ObservabilityService.addLog(level, message);
    setLogs([...ObservabilityService.getLogs()]);
    setMessage("");
  };

  return (
    <Page title="Observability">
      <p>Dashboards, logs, traces, and alerts for workflow health and performance.</p>
      <table border="1" cellPadding="4" style={{ marginTop: 16 }}>
        <thead>
          <tr>
            <th>Level</th>
            <th>Message</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, i) => (
            <tr key={i}>
              <td>{log.level}</td>
              <td>{log.message}</td>
              <td>{new Date(log.timestamp).toLocaleTimeString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: 16 }}>
        <select value={level} onChange={e => setLevel(e.target.value)}>
          <option value="info">info</option>
          <option value="warn">warn</option>
          <option value="error">error</option>
        </select>
        <input
          type="text"
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Log message"
        />
        <button onClick={addLog} disabled={!message}>Add Log</button>
      </div>
    </Page>
  );
}
