import { vitePlugin as remix } from "@remix-run/dev";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { netlifyPlugin } from "@netlify/remix-adapter/plugin";

export default defineConfig({
  plugins: [remix(), tailwindcss(), netlifyPlugin()],
  resolve: {
    tsconfigPaths: true,
  },
  publicDir: "public",
});
