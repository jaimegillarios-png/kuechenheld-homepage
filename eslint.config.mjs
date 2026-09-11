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
  {
    rules: {
      // The static export sets images.unoptimized, so next/image was already
      // emitting a plain <img> with the raw src. The images are now plain
      // <img> directly, which Astro can render and next/image cannot.
      "@next/next/no-img-element": "off",
    },
  },
];

export default config;
