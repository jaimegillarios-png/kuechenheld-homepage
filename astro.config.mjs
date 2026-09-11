// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";

// Coexists with the Next app during the migration: Next owns src/app, Astro
// owns src/pages, and both read the same components and stylesheets.
export default defineConfig({
  integrations: [mdx(), react()],
  markdown: {
    // Astro turns on SmartyPants by default; Next's MDX pipeline did not, and
    // it rewrites straight quotes as English curly quotes — wrong for German
    // prose, which uses „…". The corpus is authored with the punctuation it
    // wants, so leave it alone. GFM stays on: the prose layer needs tables.
    smartypants: false,
    gfm: true,
  },
  server: { port: 4321 },
  build: { assets: "_astro" },
});
