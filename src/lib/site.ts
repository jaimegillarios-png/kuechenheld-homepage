/**
 * Whether this deployment may be indexed by search engines.
 *
 * Off by default: review and staging deployments serve the same markup as the
 * real site, and an indexable duplicate of the Küchenheld homepage would
 * compete with kuechenheld.de. Set `SITE_INDEXABLE=true` only on the
 * deployment that genuinely serves the site.
 */
export const isIndexable = process.env.SITE_INDEXABLE === "true";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

/**
 * Prefixes a `/public` asset with the deployment's basePath.
 *
 * Next rewrites its own build output for `basePath`, but an `unoptimized`
 * `next/image` src is passed through untouched — so on a subpath deployment
 * (a GitHub Pages project site) `/images/x.jpg` would 404. Remote URLs are
 * returned unchanged.
 */
export function asset(path: string): string {
  return path.startsWith("/") ? `${BASE_PATH}${path}` : path;
}
