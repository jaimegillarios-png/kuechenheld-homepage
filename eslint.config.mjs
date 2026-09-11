import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

const config = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "_handoff/**",
      // Astro build output and generated types — neither is ours to lint.
      "dist/**",
      ".astro/**",
      // Verification harness, served from public/ and never shipped.
      "public/*.js",
    ],
  },
  ...coreWebVitals,
  ...typescript,
];

export default config;
