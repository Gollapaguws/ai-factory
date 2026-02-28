const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const fs = require("fs");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;
const jwtSecret = process.env.JWT_SECRET || "change-me-in-production";
const tokenTtl = process.env.JWT_TTL || "12h";
const corsOrigin = process.env.CORS_ORIGIN || "*";
const jwtIssuer = process.env.JWT_ISSUER || "ai-factory";
const jwtAudience = process.env.JWT_AUDIENCE || "web-console";

if (process.env.NODE_ENV === "production" && jwtSecret === "change-me-in-production") {
  throw new Error("JWT_SECRET must be set in production");
}

app.disable("x-powered-by");
app.set("trust proxy", 1);

const allowedOrigins = corsOrigin
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
    crossOriginResourcePolicy: false,
    originAgentCluster: false,
    referrerPolicy: false,
    frameguard: false,
    hsts: false,
    noSniff: false,
    xDnsPrefetchControl: false,
    xDownloadOptions: false,
    xPermittedCrossDomainPolicies: false,
    xXssProtection: false
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(
  cors({
    origin: (origin, callback) => {
      if (allowedOrigins.includes("*") || !origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error("CORS origin not allowed"));
    }
  })
);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many auth attempts, try again later" }
});

const dataDir = path.join(__dirname, "data");
const usersFilePath = path.join(dataDir, "users.json");

function defaultUsers() {
  return [
    {
      id: 1,
      username: "alice",
      role: "admin",
      passwordHash: bcrypt.hashSync("changeme123", 10)
    },
    {
      id: 2,
      username: "bob",
      role: "engineer",
      passwordHash: bcrypt.hashSync("changeme123", 10)
    }
  ];
}

function ensureUsersStore() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(usersFilePath)) {
    fs.writeFileSync(usersFilePath, JSON.stringify(defaultUsers(), null, 2), "utf-8");
  }
}

function loadUsers() {
  ensureUsersStore();
  return JSON.parse(fs.readFileSync(usersFilePath, "utf-8"));
}

function saveUsers(users) {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), "utf-8");
}

let users = loadUsers();

function signToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      username: user.username,
      role: user.role
    },
    jwtSecret,
    {
      expiresIn: tokenTtl,
      issuer: jwtIssuer,
      audience: jwtAudience
    }
  );
}

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "Missing bearer token" });
  }

  try {
    const payload = jwt.verify(token, jwtSecret, {
      issuer: jwtIssuer,
      audience: jwtAudience
    });
    req.user = payload;
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

function isValidUsername(username) {
  return /^[a-zA-Z0-9_.-]{3,32}$/.test(username);
}

function isStrongPassword(password) {
  if (typeof password !== "string" || password.length < 10 || password.length > 128) {
    return false;
  }
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasDigit = /\d/.test(password);
  return hasUpper && hasLower && hasDigit;
}

app.get("/", (_req, res) => {
  res.json({ status: "ok", service: "orchestrator-api" });
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.post("/auth/login", authLimiter, (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ error: "username and password are required" });
  }

  users = loadUsers();
  const normalizedUsername = String(username).trim().toLowerCase();
  const user = users.find((entry) => entry.username.toLowerCase() === normalizedUsername);
  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = signToken(user);
  return res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      role: user.role
    }
  });
});

app.post("/auth/register", authLimiter, (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ error: "username and password are required" });
  }

  const cleanedUsername = String(username).trim();
  if (!isValidUsername(cleanedUsername)) {
    return res
      .status(400)
      .json({ error: "username must be 3-32 chars and contain only letters, numbers, _, ., -" });
  }

  if (!isStrongPassword(String(password))) {
    return res.status(400).json({ error: "password must be 10+ chars with upper, lower, and digit" });
  }

  users = loadUsers();
  const normalizedUsername = cleanedUsername.toLowerCase();
  const existingUser = users.find((entry) => entry.username.toLowerCase() === normalizedUsername);
  if (existingUser) {
    return res.status(409).json({ error: "username already exists" });
  }

  const nextId = users.length ? Math.max(...users.map((entry) => entry.id)) + 1 : 1;
  const newUser = {
    id: nextId,
    username: cleanedUsername,
    role: "viewer",
    passwordHash: bcrypt.hashSync(password, 10)
  };

  users.push(newUser);
  saveUsers(users);

  const token = signToken(newUser);
  return res.status(201).json({
    token,
    user: {
      id: newUser.id,
      username: newUser.username,
      role: newUser.role
    }
  });
});

app.get("/auth/me", authMiddleware, (req, res) => {
  return res.json({
    user: {
      id: req.user.sub,
      username: req.user.username,
      role: req.user.role
    }
  });
});

const featureState = {
  modules: [
    { name: "HTTP Request", version: "1.0.0", description: "Send HTTP requests." },
    { name: "Data Transform", version: "1.0.0", description: "Transform data with JS code." },
    { name: "AI Task", version: "1.0.0", description: "Run an AI model or prompt." }
  ],
  comments: [
    { user: "alice", text: "Initial workflow draft.", timestamp: Date.now() - 60000 },
    { user: "bob", text: "Looks good!", timestamp: Date.now() - 30000 }
  ],
  logs: [
    { level: "info", message: "Workflow started", timestamp: Date.now() - 120000 },
    { level: "warn", message: "Slow response from AI module", timestamp: Date.now() - 60000 },
    { level: "error", message: "Failed to fetch data", timestamp: Date.now() - 30000 }
  ],
  users: [
    { username: "alice", role: "admin" },
    { username: "bob", role: "engineer" },
    { username: "carol", role: "viewer" }
  ],
  auditTrail: [
    { user: "alice", action: "created workflow", timestamp: Date.now() - 120000 },
    { user: "bob", action: "ran AI module", timestamp: Date.now() - 60000 },
    { user: "carol", action: "viewed dashboard", timestamp: Date.now() - 30000 }
  ],
  plugins: [
    { name: "CSV Exporter", enabled: true },
    { name: "Webhook Notifier", enabled: false },
    { name: "Custom API Handler", enabled: true }
  ],
  webhooks: [
    { url: "https://hooks.example.com/notify", active: true },
    { url: "https://hooks.example.com/audit", active: false }
  ],
  secrets: [],
  experiments: [],
  backups: [],
  usageEvents: [],
  lastImport: null,
  marketplaceItems: [
    { name: "Slack Integration", type: "Integration", author: "Alice" },
    { name: "Data Cleanse Template", type: "Template", author: "Bob" },
    { name: "Sentiment AI Model", type: "AI Model", author: "Carol" }
  ]
};

app.get("/features/overview", authMiddleware, (_req, res) => {
  return res.json({
    modules: featureState.modules,
    comments: featureState.comments,
    logs: featureState.logs,
    users: featureState.users,
    auditTrail: featureState.auditTrail,
    plugins: featureState.plugins,
    webhooks: featureState.webhooks,
    secrets: featureState.secrets,
    experiments: featureState.experiments,
    backups: featureState.backups,
    usageEvents: featureState.usageEvents,
    marketplaceItems: featureState.marketplaceItems,
    lastImport: featureState.lastImport
  });
});

app.post("/features/ai/llm", authMiddleware, (req, res) => {
  const { prompt, model } = req.body || {};
  if (!prompt) {
    return res.status(400).json({ error: "prompt is required" });
  }
  return res.json({
    response: `[${model || "OpenAI"}] LLM response for: ${prompt}`,
    provider: model || "OpenAI",
    generatedAt: new Date().toISOString()
  });
});

app.get("/features/modules", authMiddleware, (_req, res) => {
  return res.json({ modules: featureState.modules });
});

app.post("/features/modules", authMiddleware, (req, res) => {
  const { name, description } = req.body || {};
  if (!name) {
    return res.status(400).json({ error: "name is required" });
  }
  const module = {
    name: String(name).trim(),
    version: "1.0.0",
    description: String(description || "").trim() || "Custom module"
  };
  featureState.modules.push(module);
  return res.status(201).json({ module, modules: featureState.modules });
});

app.get("/features/collab/comments", authMiddleware, (_req, res) => {
  return res.json({ comments: featureState.comments });
});

app.post("/features/collab/comments", authMiddleware, (req, res) => {
  const { user, text } = req.body || {};
  if (!user || !text) {
    return res.status(400).json({ error: "user and text are required" });
  }
  const comment = {
    user: String(user).trim(),
    text: String(text).trim(),
    timestamp: Date.now()
  };
  featureState.comments.push(comment);
  return res.status(201).json({ comment, comments: featureState.comments });
});

app.get("/features/observability/logs", authMiddleware, (_req, res) => {
  return res.json({ logs: featureState.logs });
});

app.post("/features/observability/logs", authMiddleware, (req, res) => {
  const { level, message } = req.body || {};
  if (!message) {
    return res.status(400).json({ error: "message is required" });
  }
  const log = {
    level: ["info", "warn", "error"].includes(level) ? level : "info",
    message: String(message).trim(),
    timestamp: Date.now()
  };
  featureState.logs.push(log);
  return res.status(201).json({ log, logs: featureState.logs });
});

app.get("/features/security/users", authMiddleware, (_req, res) => {
  return res.json({ users: featureState.users });
});

app.get("/features/security/audit", authMiddleware, (_req, res) => {
  return res.json({ auditTrail: featureState.auditTrail });
});

app.put("/features/security/users/:username/role", authMiddleware, (req, res) => {
  const { role } = req.body || {};
  const { username } = req.params;
  if (!["admin", "engineer", "viewer"].includes(role)) {
    return res.status(400).json({ error: "invalid role" });
  }
  const user = featureState.users.find((entry) => entry.username === username);
  if (!user) {
    return res.status(404).json({ error: "user not found" });
  }
  user.role = role;
  featureState.auditTrail.push({ user: req.user.username, action: `set ${username} role to ${role}`, timestamp: Date.now() });
  return res.json({ user, users: featureState.users });
});

app.get("/features/extensibility/plugins", authMiddleware, (_req, res) => {
  return res.json({ plugins: featureState.plugins });
});

app.post("/features/extensibility/plugins", authMiddleware, (req, res) => {
  const { name } = req.body || {};
  if (!name) {
    return res.status(400).json({ error: "name is required" });
  }
  const cleanedName = String(name).trim();
  const existing = featureState.plugins.find((entry) => entry.name === cleanedName);
  if (!existing) {
    featureState.plugins.push({ name: cleanedName, enabled: true });
  }
  return res.status(201).json({ plugins: featureState.plugins });
});

app.post("/features/extensibility/plugins/:name/toggle", authMiddleware, (req, res) => {
  const name = decodeURIComponent(req.params.name);
  const plugin = featureState.plugins.find((entry) => entry.name === name);
  if (!plugin) {
    return res.status(404).json({ error: "plugin not found" });
  }
  plugin.enabled = !plugin.enabled;
  return res.json({ plugin, plugins: featureState.plugins });
});

app.get("/features/extensibility/webhooks", authMiddleware, (_req, res) => {
  return res.json({ webhooks: featureState.webhooks });
});

app.post("/features/extensibility/webhooks", authMiddleware, (req, res) => {
  const { url } = req.body || {};
  if (!url) {
    return res.status(400).json({ error: "url is required" });
  }
  const cleanedUrl = String(url).trim();
  let webhook = featureState.webhooks.find((entry) => entry.url === cleanedUrl);
  if (!webhook) {
    webhook = { url: cleanedUrl, active: true };
    featureState.webhooks.push(webhook);
  } else {
    webhook.active = true;
  }
  return res.status(201).json({ webhook, webhooks: featureState.webhooks });
});

app.post("/features/extensibility/webhooks/:url/toggle", authMiddleware, (req, res) => {
  const url = decodeURIComponent(req.params.url);
  const webhook = featureState.webhooks.find((entry) => entry.url === url);
  if (!webhook) {
    return res.status(404).json({ error: "webhook not found" });
  }
  webhook.active = !webhook.active;
  return res.json({ webhook, webhooks: featureState.webhooks });
});

app.get("/features/devtools/cli", authMiddleware, (_req, res) => {
  return res.json({
    cliCommands: [
      { command: "orchestrator-cli init", description: "Initialize a new project" },
      { command: "orchestrator-cli run", description: "Run a workflow from the CLI" },
      { command: "orchestrator-cli deploy", description: "Deploy workflows to production" }
    ]
  });
});

app.get("/features/devtools/sdk", authMiddleware, (_req, res) => {
  return res.json({
    sdkExamples: [
      { lang: "JavaScript", code: "import { runWorkflow } from 'orchestrator-sdk';\\nrunWorkflow('my-workflow', { input: 42 });" },
      { lang: "Python", code: "from orchestrator_sdk import run_workflow\\nrun_workflow('my-workflow', input=42)" }
    ]
  });
});

app.get("/features/devtools/git", authMiddleware, (_req, res) => {
  return res.json({ gitStatus: { branch: "main", lastCommit: "Add AI integration module", dirty: false } });
});

app.get("/features/marketplace/items", authMiddleware, (_req, res) => {
  return res.json({ items: featureState.marketplaceItems });
});

app.post("/features/marketplace/items", authMiddleware, (req, res) => {
  const { name, type } = req.body || {};
  if (!name || !type) {
    return res.status(400).json({ error: "name and type are required" });
  }
  const item = {
    name: String(name).trim(),
    type: String(type).trim(),
    author: req.user.username
  };
  featureState.marketplaceItems.push(item);
  return res.status(201).json({ item, items: featureState.marketplaceItems });
});

app.get("/features/secrets", authMiddleware, (_req, res) => {
  return res.json({ secrets: featureState.secrets });
});

app.post("/features/secrets", authMiddleware, (req, res) => {
  const { name, value } = req.body || {};
  if (!name || !value) {
    return res.status(400).json({ error: "name and value are required" });
  }
  const secret = {
    name: String(name).trim(),
    masked: `${"*".repeat(Math.min(String(value).trim().length, 8))}`,
    createdBy: req.user.username,
    createdAt: Date.now()
  };
  featureState.secrets = [secret, ...featureState.secrets].slice(0, 50);
  return res.status(201).json({ secret, secrets: featureState.secrets });
});

app.get("/features/experiments", authMiddleware, (_req, res) => {
  return res.json({ experiments: featureState.experiments });
});

app.post("/features/experiments", authMiddleware, (req, res) => {
  const { name, variants } = req.body || {};
  if (!name) {
    return res.status(400).json({ error: "name is required" });
  }
  const experiment = {
    id: `exp_${Date.now()}`,
    name: String(name).trim(),
    variants: Array.isArray(variants) && variants.length ? variants : ["A", "B"],
    createdBy: req.user.username,
    createdAt: Date.now()
  };
  featureState.experiments = [experiment, ...featureState.experiments].slice(0, 100);
  return res.status(201).json({ experiment, experiments: featureState.experiments });
});

app.get("/features/backups", authMiddleware, (_req, res) => {
  return res.json({ backups: featureState.backups });
});

app.post("/features/backups", authMiddleware, (req, res) => {
  const { snapshot } = req.body || {};
  if (!snapshot || typeof snapshot !== "object") {
    return res.status(400).json({ error: "snapshot object is required" });
  }
  const backup = {
    id: `backup_${Date.now()}`,
    snapshot,
    createdBy: req.user.username,
    createdAt: Date.now()
  };
  featureState.backups = [backup, ...featureState.backups].slice(0, 30);
  return res.status(201).json({ backup, backups: featureState.backups });
});

app.post("/features/backups/restore", authMiddleware, (req, res) => {
  const { backupId } = req.body || {};
  const backup = featureState.backups.find((entry) => entry.id === backupId);
  if (!backup) {
    return res.status(404).json({ error: "backup not found" });
  }
  return res.json({ restored: true, snapshot: backup.snapshot });
});

app.post("/features/data/import", authMiddleware, (req, res) => {
  const { rows } = req.body || {};
  if (!Array.isArray(rows) || rows.length === 0) {
    return res.status(400).json({ error: "rows array is required" });
  }
  featureState.lastImport = {
    rowsCount: rows.length,
    importedBy: req.user.username,
    importedAt: Date.now()
  };
  return res.json({ imported: rows.length, lastImport: featureState.lastImport });
});

app.get("/features/data/export", authMiddleware, (_req, res) => {
  return res.json({
    exportedAt: Date.now(),
    payload: {
      modules: featureState.modules,
      comments: featureState.comments,
      logs: featureState.logs,
      plugins: featureState.plugins,
      webhooks: featureState.webhooks,
      secrets: featureState.secrets,
      experiments: featureState.experiments,
      usageEvents: featureState.usageEvents,
      marketplaceItems: featureState.marketplaceItems
    }
  });
});

app.post("/features/usage/events", authMiddleware, (req, res) => {
  const { event } = req.body || {};
  if (!event) {
    return res.status(400).json({ error: "event is required" });
  }
  const entry = {
    event: String(event).trim(),
    user: req.user.username,
    timestamp: Date.now()
  };
  featureState.usageEvents = [entry, ...featureState.usageEvents].slice(0, 200);
  return res.status(201).json({ usageEvents: featureState.usageEvents });
});

app.listen(port, () => {
  console.log(`Orchestrator API listening on ${port}`);
});
