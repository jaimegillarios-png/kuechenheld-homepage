import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import astro from "eslint-plugin-astro";

export default [
  {
    ignores: [
      "node_modules/**",
      "_handoff/**",
      // Build output and generated types — neither is ours to lint.
      "dist/**",
      ".astro/**",
    ],
  },
  js.configs.recommended,
  {
    // Config and build scripts run in Node, not the browser.
    files: ["**/*.mjs", "scripts/**/*.js"],
    languageOptions: { globals: globals.node },
  },
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    plugins: { react, "react-hooks": reactHooks, "jsx-a11y": jsxA11y },
    settings: { react: { version: "detect" } },
    rules: {
      ...react.configs.flat.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.flatConfigs.recommended.rules,
      // Astro compiles JSX itself; React is never in scope as a name.
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
    },
  },
];
