import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  root: "src",
  resolve: {
    alias: {
      react: path.resolve(__dirname, "node_modules/react"),
      "react/jsx-runtime": path.resolve(__dirname, "node_modules/react/jsx-runtime.js"),
      "react/jsx-dev-runtime": path.resolve(__dirname, "node_modules/react/jsx-dev-runtime.js"),
      "react-router-dom": path.resolve(__dirname, "node_modules/react-router-dom")
    }
  },
  build: {
    outDir: "../dist",
    emptyOutDir: true
  },
  server: {
    port: 3000
  },
  plugins: [react()]
});
