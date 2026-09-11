// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";

// A GitHub Pages project site is served from /<repo>; BASE_PATH sets that at
// build time and is empty everywhere else, so `import.meta.env.BASE_URL` is
// the one place the subpath is known.
const base = process.env.BASE_PATH || undefined;

export default defineConfig({
  base,
  site: "https://www.kuechenheld.de",
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
  // `SITE_INDEXABLE` decides whether the build carries a noindex tag, and it
  // is read from components as well as from pages, so it has to survive into
  // the client bundle the way a PUBLIC_ variable would.
  vite: { envPrefix: ["PUBLIC_", "SITE_"] },
});
