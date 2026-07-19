// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      // Resolve imports that start with "src/" to the absolute src folder
      { find: /^src\//, replacement: `${path.resolve(__dirname, 'src')}/` },
      // Fallback alias for @ if used in code
      { find: '@', replacement: path.resolve(__dirname, 'src') }
    ]
  },
  optimizeDeps: {
    include: ['redux']
  }
});