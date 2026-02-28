import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  root: "src",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      external: ["react", "react/jsx-runtime", "react-router-dom"]
    }
  },
  server: {
    port: 3002
  },
  resolve: {
    alias: {
      shared: resolve(__dirname, "../shared")
    }
  },
  optimizeDeps: {
    include: ["react/jsx-runtime", "shared/NavBar", "shared/Page", "shared/Card"]
  },
  plugins: [react()]
});
