// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";

// Coexists with the Next app during the migration: Next owns src/app, Astro
// owns src/pages, and both read the same components and stylesheets.
export default defineConfig({
  integrations: [react()],
  server: { port: 4321 },
  build: { assets: "_astro" },
});
