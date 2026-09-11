/**
 * Whether this deployment may be indexed by search engines.
 *
 * Off by default: review and staging deployments serve the same markup as the
 * real site, and an indexable duplicate of the Küchenheld homepage would
 * compete with kuechenheld.de. Set `SITE_INDEXABLE=true` only on the
 * deployment that genuinely serves the site.
 */
/** Canonical origin. Share links need an absolute URL, and so does metadata. */
export const siteUrl = "https://www.kuechenheld.de";

export const isIndexable = import.meta.env.SITE_INDEXABLE === "true";

/** Astro's `base`, without its trailing slash. "" when the site is at root. */
const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

/**
 * Prefixes a `/public` asset with the deployment's base path.
 *
 * Astro rewrites the URLs it generates itself, but an `src` written as a plain
 * string is passed through untouched — so on a subpath deployment (a GitHub
 * Pages project site) `/images/x.jpg` would 404. Remote URLs are returned
 * unchanged.
 */
export function asset(path: string): string {
  return path.startsWith("/") ? `${BASE}${path}` : path;
}
