const tokenKey = "ai_factory_auth_token";

function resolveApiBase() {
  const configured = import.meta.env.VITE_API_BASE_URL;
  if (configured) {
    return configured;
  }

  const host = window.location.hostname;
  if (host === "localhost" || host === "127.0.0.1") {
    return `${window.location.protocol}//${host}:3000`;
  }

  return "https://ai.infinitecraftmedia.com";
}

const apiBase = resolveApiBase();

export function getApiBase() {
  return apiBase;
}

export function getToken() {
  return localStorage.getItem(tokenKey);
}

export function setToken(token) {
  localStorage.setItem(tokenKey, token);
}

export function clearToken() {
  localStorage.removeItem(tokenKey);
}

export function isAuthenticated() {
  return Boolean(getToken());
}

export async function login(username, password) {
  const response = await fetch(`${apiBase}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, password })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Login failed");
  }

  setToken(data.token);
  return data;
}

export async function register(username, password) {
  const response = await fetch(`${apiBase}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, password })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Registration failed");
  }

  setToken(data.token);
  return data;
}

export async function getMe() {
  const token = getToken();
  if (!token) {
    throw new Error("No auth token");
  }

  const response = await fetch(`${apiBase}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to load profile");
  }

  return data;
}

export async function getApiStatus() {
  const response = await fetch(`${apiBase}/`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to reach API");
  }
  return data;
}

async function featureRequest(path, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${apiBase}${path}`, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Feature API request failed");
  }

  return data;
}

export function callFeatureLLM(prompt, model) {
  return featureRequest("/features/ai/llm", {
    method: "POST",
    body: { prompt, model }
  });
}

export function getFeatureModules() {
  return featureRequest("/features/modules");
}

export function getFeatureOverview() {
  return featureRequest("/features/overview");
}

export function addFeatureModule(name, description) {
  return featureRequest("/features/modules", {
    method: "POST",
    body: { name, description }
  });
}

export function getFeatureComments() {
  return featureRequest("/features/collab/comments");
}

export function addFeatureComment(user, text) {
  return featureRequest("/features/collab/comments", {
    method: "POST",
    body: { user, text }
  });
}

export function getFeatureLogs() {
  return featureRequest("/features/observability/logs");
}

export function addFeatureLog(level, message) {
  return featureRequest("/features/observability/logs", {
    method: "POST",
    body: { level, message }
  });
}

export function getFeaturePlugins() {
  return featureRequest("/features/extensibility/plugins");
}

export function toggleFeaturePlugin(name) {
  return featureRequest(`/features/extensibility/plugins/${encodeURIComponent(name)}/toggle`, {
    method: "POST"
  });
}

export function getFeatureWebhooks() {
  return featureRequest("/features/extensibility/webhooks");
}

export function createFeatureWebhook(url) {
  return featureRequest("/features/extensibility/webhooks", {
    method: "POST",
    body: { url }
  });
}

export function toggleFeatureWebhook(url) {
  return featureRequest(`/features/extensibility/webhooks/${encodeURIComponent(url)}/toggle`, {
    method: "POST"
  });
}

export function getFeatureSecrets() {
  return featureRequest("/features/secrets");
}

export function addFeatureSecret(name, value) {
  return featureRequest("/features/secrets", {
    method: "POST",
    body: { name, value }
  });
}

export function getFeatureExperiments() {
  return featureRequest("/features/experiments");
}

export function addFeatureExperiment(name, variants = ["A", "B"]) {
  return featureRequest("/features/experiments", {
    method: "POST",
    body: { name, variants }
  });
}

export function createFeatureBackup(snapshot) {
  return featureRequest("/features/backups", {
    method: "POST",
    body: { snapshot }
  });
}

export function getFeatureBackups() {
  return featureRequest("/features/backups");
}

export function restoreFeatureBackup(backupId) {
  return featureRequest("/features/backups/restore", {
    method: "POST",
    body: { backupId }
  });
}

export function importFeatureData(rows) {
  return featureRequest("/features/data/import", {
    method: "POST",
    body: { rows }
  });
}

export function exportFeatureData() {
  return featureRequest("/features/data/export");
}

export function addFeatureUsageEvent(event) {
  return featureRequest("/features/usage/events", {
    method: "POST",
    body: { event }
  });
}