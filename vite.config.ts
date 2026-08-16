import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import { netlifyPlugin } from "@netlify/remix-adapter/plugin";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [tailwindcss(), remix(), netlifyPlugin()],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./app"),
    },
  },
  publicDir: "public",
  build: {
    chunkSizeWarningLimit: 1000,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Efficient code splitting
          if (id.includes('node_modules')) {
            if (id.includes('@remix-run')) {
              return 'remix';
            }
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react';
            }
            return 'vendor';
          }
        },
      },
    },
  },
});
