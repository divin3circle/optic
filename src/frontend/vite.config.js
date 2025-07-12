import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import environment from "vite-plugin-environment";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  envDir: "../../",
  build: {
    emptyOutDir: true,
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:4943",
        changeOrigin: true,
      },
    },
    host: "127.0.0.1",
  },
  plugins: [
    tailwindcss(),
    react(),
    environment("all", { prefix: "CANISTER_" }),
    environment("all", { prefix: "DFX_" }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
