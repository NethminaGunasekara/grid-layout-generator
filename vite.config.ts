import { defineConfig } from "vite";
import Sitemap from "vite-plugin-sitemap";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    Sitemap({
      hostname: "https://gridlayoutgenerator.com",
    }),
  ],

  css: {
    preprocessorOptions: {
      scss: {
        api: "modern",
      },
    },
  },

  server: {
    host: "0.0.0.0",
    fs: {
      // Restrict file serving outside of working directory
      strict: true,
      // Deny access to these directories
      deny: [".env", ".env.*", "node_modules"],
    },
  },
});
