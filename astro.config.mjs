// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import { satteri } from "@astrojs/markdown-satteri";
import { hastBasePath } from "./src/plugins/hast-base-path.mjs";

// A GitHub Pages project site is served from /<repo>; BASE_PATH sets that at
// build time and is empty everywhere else, so `import.meta.env.BASE_URL` is
// the one place the subpath is known.
const base = process.env.BASE_PATH || undefined;

const processor = satteri({
  features: {
    // Sätteri turns smart punctuation on by default; Next's MDX pipeline did
    // not, and it rewrites straight quotes as English curly quotes — wrong for
    // German prose, which uses „…". The corpus is authored with the
    // punctuation it wants, so leave it alone. GFM stays on: the prose layer
    // needs tables.
    smartPunctuation: false,
    gfm: true,
  },
  // A post body is authored markdown, so its links never pass through
  // `asset()` the way a template's do. No base path, nothing to rewrite.
  hastPlugins: base ? [hastBasePath({ base })] : [],
});

export default defineConfig({
  base,
  site: "https://www.kuechenheld.de",
  integrations: [mdx({ processor }), react()],
  markdown: { processor },
  server: { port: 4321 },
  build: { assets: "_astro" },
  // `SITE_INDEXABLE` decides whether the build carries a noindex tag, and it
  // is read from components as well as from pages, so it has to survive into
  // the client bundle the way a PUBLIC_ variable would.
  vite: { envPrefix: ["PUBLIC_", "SITE_"] },
});
