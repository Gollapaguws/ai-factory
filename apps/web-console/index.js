const http = require("http");

const port = process.env.PORT || 3000;
const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const server = http.createServer((req, res) => {
	if (req.url === "/health") {
		res.writeHead(200, { "Content-Type": "application/json" });
		res.end(JSON.stringify({ status: "ok", service: "web-console" }));
		return;
	}

	if (req.url === "/") {
		res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
		res.end(`<!doctype html>
<html>
	<head>
		<meta charset="utf-8" />
		<title>AI Factory Web Console</title>
	</head>
	<body style="font-family: sans-serif; padding: 24px;">
		<h1>AI Factory Web Console</h1>
		<p>Service is running.</p>
		<p>API URL: ${apiUrl}</p>
	</body>
</html>`);
		return;
	}

	res.writeHead(404, { "Content-Type": "application/json" });
	res.end(JSON.stringify({ error: "Not Found" }));
});

server.listen(port, () => {
	console.log(`Web Console listening on port ${port}`);
});
