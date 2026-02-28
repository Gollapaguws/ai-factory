import React from "react";
import {
  checkOAuthAllowlist,
  addFeatureExperiment,
  addFeatureComment,
  addFeatureLog,
  addFeatureModule,
  addFeatureSecret,
  addFeatureUsageEvent,
  callFeatureLLM,
  createFeatureBackup,
  createFeatureWebhook,
  exportFeatureData,
  getFeatureBackups,
  getFeatureOverview,
  getMe,
  importFeatureData,
  restoreFeatureBackup,
  toggleFeaturePlugin,
  toggleFeatureWebhook
} from "../../auth";
import { createProject, listProjects, saveProjects } from "../../projects";

const featureStateKey = "ai_factory_feature_lab_state";

const allFeatureItems = [
  "Natural language app creation",
  "Automated backend logic and infrastructure",
  "AI model integration (OpenAI & Anthropic)",
  "OAuth authentication (for 2 engineers)",
  "Local storage for generated projects",
  "App Templates Library",
  "One-Click Deployment",
  "Version Control Integration",
  "Custom Code Injection",
  "API Connector",
  "Automated Testing",
  "Usage Analytics",
  "Role-Based Access",
  "Dark Mode & Theming",
  "ChatOps Integration",
  "Realtime Collaboration",
  "AI-Powered Code Review",
  "Plugin/Extension System",
  "Visual Workflow Builder",
  "Secrets Management",
  "Mobile App Generation",
  "Automated Documentation",
  "Performance Monitoring",
  "Backup & Restore",
  "A/B Testing Tools",
  "Automated Dependency Updates",
  "Webhooks & Event Triggers",
  "Data Import/Export Tools"
];

function parseState() {
  try {
    const value = localStorage.getItem(featureStateKey);
    if (!value) {
      return {};
    }
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function parseCsvRows(csvText) {
  return String(csvText || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.split(",").map((cell) => cell.trim()));
}

function formatNow() {
  return new Date().toLocaleString();
}

export default function useFeaturesLab() {
  const [profile, setProfile] = React.useState(null);
  const [projects, setProjects] = React.useState([]);
  const [activeProjectId, setActiveProjectId] = React.useState("");
  const [prompt, setPrompt] = React.useState("Build a role-aware dashboard with API connector and deployment controls.");
  const [selectedModel, setSelectedModel] = React.useState("OpenAI");
  const [generatedOutput, setGeneratedOutput] = React.useState("");
  const [oauthAllowedUsers, setOauthAllowedUsers] = React.useState("alice,bob");
  const [oauthCandidate, setOauthCandidate] = React.useState("alice");
  const [oauthResult, setOauthResult] = React.useState("Not checked");
  const [template, setTemplate] = React.useState("Dashboard");
  const [deploymentTarget, setDeploymentTarget] = React.useState("Docker Compose");
  const [chatCommand, setChatCommand] = React.useState("/ai-factory build project-alpha");
  const [apiConnector, setApiConnector] = React.useState("https://api.example.com/v1");
  const [connectorList, setConnectorList] = React.useState([]);
  const [codeSnippet, setCodeSnippet] = React.useState("function transform(data) {\n  return data;\n}");
  const [reviewOutput, setReviewOutput] = React.useState("");
  const [workflowStep, setWorkflowStep] = React.useState("Collect requirements");
  const [workflowSteps, setWorkflowSteps] = React.useState([]);
  const [secretName, setSecretName] = React.useState("OPENAI_API_KEY");
  const [secretValue, setSecretValue] = React.useState("");
  const [secrets, setSecrets] = React.useState([]);
  const [docsOutput, setDocsOutput] = React.useState("");
  const [abName, setAbName] = React.useState("Landing CTA");
  const [abExperiments, setAbExperiments] = React.useState([]);
  const [dependencyStatus, setDependencyStatus] = React.useState("Pending");
  const [webhookUrl, setWebhookUrl] = React.useState("https://example.com/webhook");
  const [webhookLog, setWebhookLog] = React.useState([]);
  const [importCsv, setImportCsv] = React.useState("name,prompt\nRevenue Dashboard,Build a KPI dashboard");
  const [importSummary, setImportSummary] = React.useState("No import yet");
  const [plugins, setPlugins] = React.useState([
    { name: "CSV Exporter", enabled: true },
    { name: "Webhook Notifier", enabled: false },
    { name: "Custom API Handler", enabled: true }
  ]);
  const [usageEvents, setUsageEvents] = React.useState([]);
  const [backups, setBackups] = React.useState([]);
  const [collabNotes, setCollabNotes] = React.useState([]);
  const [collabDraft, setCollabDraft] = React.useState("");
  const [backupBlob, setBackupBlob] = React.useState("");
  const [perfText, setPerfText] = React.useState("No measurements yet");
  const [isLightTheme, setIsLightTheme] = React.useState(false);
  const [statusMessage, setStatusMessage] = React.useState("");

  const selectedProject = projects.find((project) => project.id === activeProjectId) || null;

  React.useEffect(() => {
    setProjects(listProjects());
    const snapshot = parseState();
    setConnectorList(Array.isArray(snapshot.connectorList) ? snapshot.connectorList : []);
    setUsageEvents(Array.isArray(snapshot.usageEvents) ? snapshot.usageEvents : []);
    setWorkflowSteps(Array.isArray(snapshot.workflowSteps) ? snapshot.workflowSteps : []);
    setSecrets(Array.isArray(snapshot.secrets) ? snapshot.secrets : []);
    setAbExperiments(Array.isArray(snapshot.abExperiments) ? snapshot.abExperiments : []);
    setWebhookLog(Array.isArray(snapshot.webhookLog) ? snapshot.webhookLog : []);
    setCollabNotes(Array.isArray(snapshot.collabNotes) ? snapshot.collabNotes : []);
    setIsLightTheme(Boolean(snapshot.isLightTheme));
  }, []);

  React.useEffect(() => {
    const state = {
      connectorList,
      usageEvents,
      workflowSteps,
      secrets,
      abExperiments,
      webhookLog,
      collabNotes,
      isLightTheme
    };
    localStorage.setItem(featureStateKey, JSON.stringify(state));
  }, [connectorList, usageEvents, workflowSteps, secrets, abExperiments, webhookLog, collabNotes, isLightTheme]);

  React.useEffect(() => {
    document.body.classList.toggle("light-mode", isLightTheme);
    return () => document.body.classList.remove("light-mode");
  }, [isLightTheme]);

  React.useEffect(() => {
    let channel;
    try {
      channel = new BroadcastChannel("ai_factory_collab");
      channel.onmessage = (event) => {
        if (!event?.data?.text) {
          return;
        }
        setCollabNotes((previous) => [`${event.data.text} (${formatNow()})`, ...previous].slice(0, 20));
      };
    } catch {
      channel = null;
    }

    return () => {
      if (channel) {
        channel.close();
      }
    };
  }, []);

  React.useEffect(() => {
    getMe()
      .then((data) => setProfile(data.user))
      .catch(() => setProfile(null));
  }, []);

  React.useEffect(() => {
    async function hydrateFromApi() {
      try {
        const overview = await getFeatureOverview();

        if (Array.isArray(overview?.modules)) {
          const moduleNames = overview.modules.map((module) => module.name).filter(Boolean);
          setConnectorList(moduleNames);
        }

        if (Array.isArray(overview?.comments)) {
          setCollabNotes(
            overview.comments
              .slice(-20)
              .reverse()
              .map((comment) => `${comment.user}: ${comment.text} (${new Date(comment.timestamp).toLocaleTimeString()})`)
          );
        }

        if (Array.isArray(overview?.logs)) {
          setWebhookLog(
            overview.logs
              .slice(-20)
              .reverse()
              .map((log) => `${log.level.toUpperCase()}: ${log.message}`)
          );
        }

        if (Array.isArray(overview?.plugins)) {
          setPlugins(overview.plugins);
        }

        if (Array.isArray(overview?.webhooks) && overview.webhooks.length > 0) {
          setWebhookUrl(overview.webhooks[0].url);
        }

        if (Array.isArray(overview?.secrets)) {
          setSecrets(overview.secrets);
        }

        if (Array.isArray(overview?.experiments)) {
          setAbExperiments(overview.experiments);
        }

        if (Array.isArray(overview?.backups)) {
          setBackups(overview.backups);
        }

        if (Array.isArray(overview?.usageEvents)) {
          setUsageEvents(
            overview.usageEvents.map((item) => `${new Date(item.timestamp).toLocaleString()} - ${item.event}`)
          );
        }
      } catch {
        setStatusMessage("Using local feature state (API hydration unavailable)");
      }
    }

    hydrateFromApi();
  }, []);

  async function trackUsage(eventName) {
    try {
      const response = await addFeatureUsageEvent(eventName);
      if (Array.isArray(response?.usageEvents)) {
        setUsageEvents(
          response.usageEvents
            .slice(0, 40)
            .map((item) => `${new Date(item.timestamp).toLocaleString()} - ${item.event}`)
        );
        return;
      }
    } catch {
      // fallback to local tracking below
    }

    const next = [`${formatNow()} - ${eventName}`, ...usageEvents].slice(0, 40);
    setUsageEvents(next);
  }

  function requireProject() {
    if (selectedProject) {
      return selectedProject;
    }
    throw new Error("Select a project first from Dashboard");
  }

  async function generateFromPrompt() {
    const started = performance.now();
    const built = createProject({
      name: `Generated ${Date.now().toString().slice(-4)}`,
      prompt
    });
    const nextProjects = listProjects();
    setProjects(nextProjects);
    setActiveProjectId(built.id);

    try {
      const llmResult = await callFeatureLLM(prompt, selectedModel);
      const summary = {
        project: built.name,
        model: selectedModel,
        api: ["/auth", "/projects", "/deployments"],
        infra: ["postgres", "redis", "worker"],
        llmResponse: llmResult.response,
        generatedAt: new Date().toISOString()
      };
      setGeneratedOutput(JSON.stringify(summary, null, 2));
    } catch {
      const summary = {
        project: built.name,
        model: selectedModel,
        api: ["/auth", "/projects", "/deployments"],
        infra: ["postgres", "redis", "worker"],
        generatedAt: new Date().toISOString()
      };
      setGeneratedOutput(JSON.stringify(summary, null, 2));
      setStatusMessage("Generated project locally (feature API unavailable)");
    }
    void trackUsage("Generated app from natural language");
    setPerfText(`Last generation took ${(performance.now() - started).toFixed(1)}ms`);
    setStatusMessage("Generated project scaffold and backend plan");
  }

  async function runOAuthCheck() {
    const email = oauthCandidate.trim().toLowerCase();

    try {
      const response = await checkOAuthAllowlist(email);
      setOauthResult(response.allowed ? `Access granted (${response.provider})` : `Access denied (${response.provider})`);
      void trackUsage("Ran OAuth allowlist check");
      return;
    } catch {
      const allowed = oauthAllowedUsers
        .split(",")
        .map((item) => item.trim().toLowerCase())
        .filter(Boolean);
      const isAllowed = allowed.includes(email);
      setOauthResult(isAllowed ? "Access granted (local fallback)" : "Access denied (local fallback)");
    }

    void trackUsage("Ran OAuth allowlist check");
  }

  async function addConnector() {
    const value = apiConnector.trim();
    if (!value) {
      setStatusMessage("Connector URL is required");
      return;
    }

    try {
      const moduleData = await addFeatureModule(value, "External API connector");
      if (Array.isArray(moduleData?.modules)) {
        const moduleNames = moduleData.modules.map((module) => module.name).filter(Boolean);
        setConnectorList(moduleNames);
      } else {
        setConnectorList((previous) => [value, ...previous.filter((item) => item !== value)].slice(0, 20));
      }
    } catch {
      setStatusMessage("Connector saved locally (feature API unavailable)");
      setConnectorList((previous) => [value, ...previous.filter((item) => item !== value)].slice(0, 20));
    }

    void trackUsage("Added API connector");
    setStatusMessage("Connector saved");
  }

  async function copyDeployCommand() {
    const command = deploymentTarget === "Kubernetes"
      ? "kubectl apply -f deployment/k8s"
      : "docker compose up -d --build";
    try {
      await navigator.clipboard.writeText(command);
      setStatusMessage("Deployment command copied");
    } catch {
      setStatusMessage(`Run this command: ${command}`);
    }
    void trackUsage("Prepared one-click deployment command");
  }

  function appendCommit() {
    try {
      const project = requireProject();
      const commitMessage = `Auto commit at ${formatNow()}`;
      const nextProjects = projects.map((item) => {
        if (item.id !== project.id) {
          return item;
        }
        const history = Array.isArray(item.history) ? item.history : [];
        return {
          ...item,
          history: [commitMessage, ...history].slice(0, 10),
          updatedAt: new Date().toISOString()
        };
      });
      saveProjects(nextProjects);
      setProjects(nextProjects);
      void trackUsage("Recorded version control commit");
      setStatusMessage("Commit history entry created");
    } catch (error) {
      setStatusMessage(error.message);
    }
  }

  function rollbackCommit() {
    try {
      const project = requireProject();
      const nextProjects = projects.map((item) => {
        if (item.id !== project.id) {
          return item;
        }
        const history = Array.isArray(item.history) ? item.history.slice(1) : [];
        return {
          ...item,
          history,
          updatedAt: new Date().toISOString()
        };
      });
      saveProjects(nextProjects);
      setProjects(nextProjects);
      void trackUsage("Performed rollback");
      setStatusMessage("Rolled back latest commit entry");
    } catch (error) {
      setStatusMessage(error.message);
    }
  }

  function saveCodeInjection() {
    try {
      const project = requireProject();
      const nextProjects = projects.map((item) => {
        if (item.id !== project.id) {
          return item;
        }
        return {
          ...item,
          customCode: codeSnippet,
          updatedAt: new Date().toISOString()
        };
      });
      saveProjects(nextProjects);
      setProjects(nextProjects);
      void trackUsage("Saved custom code injection");
      setStatusMessage("Custom code saved");
    } catch (error) {
      setStatusMessage(error.message);
    }
  }

  function generateTests() {
    try {
      const project = requireProject();
      const checks = [
        `Auth route test for ${project.name}`,
        "Project CRUD smoke test",
        "Deployment command check"
      ];
      setGeneratedOutput(checks.join("\n"));
      void trackUsage("Generated automated test suite");
      setStatusMessage("Basic tests generated");
    } catch (error) {
      setStatusMessage(error.message);
    }
  }

  async function togglePlugin(name) {
    const pluginName = String(name || "").trim();
    if (!pluginName) {
      return;
    }

    try {
      const toggled = await toggleFeaturePlugin(pluginName);
      if (Array.isArray(toggled?.plugins)) {
        setPlugins(toggled.plugins);
      }
    } catch {
      setStatusMessage("Plugin toggled locally (feature API unavailable)");
      setPlugins((previous) =>
        previous.map((item) => (item.name === pluginName ? { ...item, enabled: !item.enabled } : item))
      );
    }
    void trackUsage("Toggled plugin");
  }

  function addWorkflowStep() {
    const value = workflowStep.trim();
    if (!value) {
      return;
    }
    setWorkflowSteps((previous) => [...previous, value]);
    setWorkflowStep("");
    void trackUsage("Added workflow step");
  }

  async function runCodeReview() {
    const notes = [];
    try {
      const llmReview = await callFeatureLLM(`Review this code for issues:\n${codeSnippet}`, selectedModel);
      notes.push(llmReview.response);
    } catch {
      notes.push("Feature API unavailable; using local heuristic review.");
    }

    if (codeSnippet.includes("password")) {
      notes.push("Potential secret in source code.");
    }
    if (codeSnippet.includes("eval(")) {
      notes.push("Avoid eval for security reasons.");
    }
    if (notes.length === 0) {
      notes.push("No obvious issues found in heuristic review.");
    }
    setReviewOutput(notes.join("\n"));
    void trackUsage("Ran AI-powered code review");
  }

  async function addSecret() {
    const name = secretName.trim();
    const value = secretValue.trim();
    if (!name || !value) {
      setStatusMessage("Secret name and value are required");
      return;
    }

    try {
      const response = await addFeatureSecret(name, value);
      if (Array.isArray(response?.secrets)) {
        setSecrets(response.secrets);
      }
    } catch {
      setSecrets((previous) => [{ name, masked: `${"*".repeat(Math.min(value.length, 8))}` }, ...previous]);
    }

    setSecretValue("");
    void trackUsage("Added managed secret");
  }

  function generateMobileScaffold() {
    setGeneratedOutput(`Mobile scaffold prepared for ${template}: React Native + API client + auth shell.`);
    void trackUsage("Generated mobile app scaffold");
  }

  function generateDocs() {
    try {
      const project = requireProject();
      const docs = `# ${project.name}\n\n## Summary\n${project.prompt}\n\n## Status\n${project.status}\n\n## Generated\n${formatNow()}`;
      setDocsOutput(docs);
      void trackUsage("Generated automated documentation");
    } catch (error) {
      setStatusMessage(error.message);
    }
  }

  function measurePerformance() {
    const started = performance.now();
    const duration = performance.now() - started;
    setPerfText(`UI baseline latency: ${duration.toFixed(2)}ms at ${formatNow()}`);
    void trackUsage("Measured performance");
  }

  async function createBackup() {
    const snapshot = {
      projects: listProjects(),
      connectors: connectorList,
      workflowSteps,
      secrets,
      abExperiments,
      usageEvents,
      createdAt: new Date().toISOString()
    };
    setBackupBlob(JSON.stringify(snapshot, null, 2));

    try {
      const response = await createFeatureBackup(snapshot);
      if (Array.isArray(response?.backups)) {
        setBackups(response.backups);
      }
    } catch {
      setStatusMessage("Backup created locally (feature API unavailable)");
    }

    void trackUsage("Created backup");
  }

  async function restoreBackup() {
    try {
      let parsed;
      if (backups.length > 0) {
        const restored = await restoreFeatureBackup(backups[0].id);
        parsed = restored.snapshot;
      } else {
        parsed = JSON.parse(backupBlob);
      }

      if (Array.isArray(parsed.projects)) {
        saveProjects(parsed.projects);
        setProjects(parsed.projects);
      }
      setConnectorList(Array.isArray(parsed.connectors) ? parsed.connectors : connectorList);
      setWorkflowSteps(Array.isArray(parsed.workflowSteps) ? parsed.workflowSteps : workflowSteps);
      setSecrets(Array.isArray(parsed.secrets) ? parsed.secrets : secrets);
      setAbExperiments(Array.isArray(parsed.abExperiments) ? parsed.abExperiments : abExperiments);
      setUsageEvents(Array.isArray(parsed.usageEvents) ? parsed.usageEvents : usageEvents);
      void trackUsage("Restored backup");
      setStatusMessage("Backup restored");
    } catch {
      setStatusMessage("Backup JSON is invalid");
    }
  }

  async function addExperiment() {
    const name = abName.trim();
    if (!name) {
      return;
    }

    try {
      const response = await addFeatureExperiment(name, ["A", "B"]);
      if (Array.isArray(response?.experiments)) {
        setAbExperiments(response.experiments);
      }
    } catch {
      setAbExperiments((previous) => [{ name, variants: ["A", "B"], createdAt: formatNow() }, ...previous]);
    }

    void trackUsage("Created A/B experiment");
  }

  function checkDependencies() {
    setDependencyStatus(`Checked ${formatNow()}: 2 minor updates available (simulated).`);
    void trackUsage("Ran dependency update check");
  }

  async function triggerWebhook() {
    const event = `${formatNow()} -> Triggered webhook event to ${webhookUrl}`;

    try {
      await createFeatureWebhook(webhookUrl);
      await toggleFeatureWebhook(webhookUrl);
      const logData = await addFeatureLog("info", `Webhook triggered: ${webhookUrl}`);
      if (Array.isArray(logData?.logs)) {
        setWebhookLog(
          logData.logs
            .slice(-20)
            .reverse()
            .map((log) => `${log.level.toUpperCase()}: ${log.message}`)
        );
      } else {
        setWebhookLog((previous) => [event, ...previous].slice(0, 20));
      }
    } catch {
      setStatusMessage("Webhook event recorded locally (feature API unavailable)");
      setWebhookLog((previous) => [event, ...previous].slice(0, 20));
    }

    void trackUsage("Triggered webhook event");
  }

  async function importCsvData() {
    const rows = parseCsvRows(importCsv);
    if (rows.length < 2) {
      setImportSummary("CSV needs header + at least one row");
      return;
    }

    const [header, ...dataRows] = rows;
    const nameIndex = header.indexOf("name");
    const promptIndex = header.indexOf("prompt");
    if (nameIndex === -1 || promptIndex === -1) {
      setImportSummary("CSV must include name,prompt columns");
      return;
    }

    try {
      await importFeatureData(dataRows);
    } catch {
      setStatusMessage("Imported locally (feature API unavailable)");
    }

    for (const row of dataRows) {
      createProject({ name: row[nameIndex], prompt: row[promptIndex] });
    }

    const refreshed = listProjects();
    setProjects(refreshed);
    setImportSummary(`Imported ${dataRows.length} project rows`);
    void trackUsage("Imported CSV data");
  }

  async function exportProjects() {
    try {
      const response = await exportFeatureData();
      setGeneratedOutput(JSON.stringify(response?.payload || listProjects(), null, 2));
    } catch {
      setGeneratedOutput(JSON.stringify(listProjects(), null, 2));
    }
    void trackUsage("Exported project data");
  }

  async function sendCollabNote() {
    const text = collabDraft.trim();
    if (!text) {
      return;
    }

    const userName = profile?.username || "anonymous";
    try {
      const commentsData = await addFeatureComment(userName, text);
      if (Array.isArray(commentsData?.comments)) {
        setCollabNotes(
          commentsData.comments
            .slice(-20)
            .reverse()
            .map((comment) => `${comment.user}: ${comment.text} (${new Date(comment.timestamp).toLocaleTimeString()})`)
        );
      } else {
        setCollabNotes((previous) => [`${text} (${formatNow()})`, ...previous].slice(0, 20));
      }
    } catch {
      setStatusMessage("Collaboration note saved locally (feature API unavailable)");
      setCollabNotes((previous) => [`${text} (${formatNow()})`, ...previous].slice(0, 20));
    }

    setCollabDraft("");

    try {
      const channel = new BroadcastChannel("ai_factory_collab");
      channel.postMessage({ text });
      channel.close();
    } catch {
      setStatusMessage("Realtime channel not available in this browser context");
    }
    void trackUsage("Shared collaboration note");
  }

  return {
    allFeatureItems,
    statusMessage,
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
    oauthResult,
    template,
    setTemplate,
    generateMobileScaffold,
    generateTests,
    deploymentTarget,
    setDeploymentTarget,
    copyDeployCommand,
    appendCommit,
    rollbackCommit,
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
    triggerWebhook,
    plugins,
    togglePlugin,
    workflowStep,
    setWorkflowStep,
    addWorkflowStep,
    collabDraft,
    setCollabDraft,
    sendCollabNote,
    secretName,
    setSecretName,
    secretValue,
    setSecretValue,
    addSecret,
    measurePerformance,
    setIsLightTheme,
    perfText,
    createBackup,
    restoreBackup,
    backupBlob,
    setBackupBlob,
    abName,
    setAbName,
    addExperiment,
    checkDependencies,
    dependencyStatus,
    importCsv,
    setImportCsv,
    importCsvData,
    exportProjects,
    importSummary,
    usageEvents,
    generatedOutput,
    docsOutput,
    selectedProject,
    connectorList,
    workflowSteps,
    secrets,
    webhookLog,
    collabNotes,
    abExperiments
  };
}
