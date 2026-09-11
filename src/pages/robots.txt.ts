import type { APIRoute } from "astro";
import { isIndexable } from "../lib/site";

/**
 * Port of `src/app/robots.ts`. Next's Metadata API emitted this file from a
 * route handler under `output: export`; Astro emits it from a static endpoint.
 * Byte-for-byte the same body Next produced.
 */
export const GET: APIRoute = () =>
  new Response(
    isIndexable
      ? "User-Agent: *\nAllow: /\n"
      : "User-Agent: *\nDisallow: /\n",
    { headers: { "Content-Type": "text/plain" } },
  );
