// Vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { URL, fileURLToPath } from "node:url";

const projectDirectory = fileURLToPath(new URL(".", import.meta.url));
const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1];
const githubPagesBase =
  repositoryName && !repositoryName.endsWith(".github.io")
    ? `/${repositoryName}/`
    : "/";

export default defineConfig({
  base: githubPagesBase,
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
