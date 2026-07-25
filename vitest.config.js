import path from "node:path";
import { URL, fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const projectDirectory = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      src: path.resolve(projectDirectory, "src"),
    },
  },
  test: {
    include: ["src/**/*.test.ts"],
    exclude: ["build/**", "dist/**", "node_modules/**"],
  },
});
