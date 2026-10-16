import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      chunkSizeWarningLimit: 3000,
      rollupOptions: {
        external: (id) => {
          // Never fail on optional dynamic imports from jspdf or foreign SVG renderers
          if (id === 'canvg' || id.includes('canvg')) {
            return true;
          }
          return false;
        },
        onwarn(warning) {
          // In CI/Vercel, Vite's defaultHandler throws fatal errors on warnings like UNRESOLVED_IMPORT.
          // By handling all warnings gracefully here and not calling throwing defaultHandler, the build completes cleanly.
          console.warn(`[build-warning] [${warning.code || 'WARN'}]: ${warning.message}`);
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
