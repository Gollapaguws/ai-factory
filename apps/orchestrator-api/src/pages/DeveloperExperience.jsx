import React from "react";
import DevToolsService from "../devtools/DevToolsService";
import Page from "../../../shared/Page";

// Developer Experience: CLI, SDK, Git integration
export default function DeveloperExperience() {
  const cli = DevToolsService.getCLICommands();
  const sdk = DevToolsService.getSDKExamples();
  const git = DevToolsService.getGitStatus();

  return (
    <Page title="Developer Experience">
      <h2>CLI Tools</h2>
      <ul>
        {cli.map((c, i) => (
          <li key={i}>
            <code>{c.command}</code>: {c.description}
          </li>
        ))}
      </ul>
      <h2>SDK Examples</h2>
      {sdk.map((s, i) => (
        <div key={i}>
          <strong>{s.lang}</strong>
          <pre>{s.code}</pre>
        </div>
      ))}
      <h2>Git Integration</h2>
      <p>Branch: <strong>{git.branch}</strong></p>
      <p>Last Commit: <em>{git.lastCommit}</em></p>
      <p>Status: {git.dirty ? "Uncommitted changes" : "Clean"}</p>
    </Page>
  );
}
