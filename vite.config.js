// Vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { URL, fileURLToPath } from "node:url";

const projectDirectory = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      // Resolve imports that start with "src/" to the absolute src folder
      {
        find: /^src\//u,
        replacement: `${path.resolve(projectDirectory, "src")}/`,
      },
      // Fallback alias for @ if used in code
      { find: "@", replacement: path.resolve(projectDirectory, "src") },
    ],
  },
});
