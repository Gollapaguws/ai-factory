const heartbeatMs = Number(process.env.WORKER_HEARTBEAT_MS || 30000);

console.log(`Worker running (heartbeat every ${heartbeatMs}ms)`);

const heartbeat = setInterval(() => {
	console.log("Worker heartbeat");
}, heartbeatMs);

function shutdown(signal) {
	console.log(`Worker received ${signal}, shutting down`);
	clearInterval(heartbeat);
	process.exit(0);
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
