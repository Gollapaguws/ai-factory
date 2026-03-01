console.log("Web Console running");

const express = require("express");
const path = require("path");
const app = express();

const distDir = path.join(__dirname, "dist");

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "web-console" });
});

app.use(express.static(distDir));

app.get("/", (req, res) => {
  res.sendFile(path.join(distDir, "index.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(distDir, "index.html"));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Web Console running on http://localhost:${PORT}`);
});
