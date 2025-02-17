import { defineConfig } from "cypress";
import viteConfig from "./vite.config";

export default defineConfig({
  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
      // optionally pass in vite config
      viteConfig,
    },
  },

  e2e: {
    setupNodeEvents() {
      // implement node event listeners here
    },
  },
});
