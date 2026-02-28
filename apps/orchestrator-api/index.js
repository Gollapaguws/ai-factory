const http = require("http");
const server = http.createServer((req, res) => {
  res.end("Orchestrator API running");
});
server.listen(3000, () => {
  console.log("Orchestrator API running");
});
