/**
 * Whether this deployment may be indexed by search engines.
 *
 * Off by default: review and staging deployments serve the same markup as the
 * real site, and an indexable duplicate of the Küchenheld homepage would
 * compete with kuechenheld.de. Set `SITE_INDEXABLE=true` only on the
 * deployment that genuinely serves the site.
 */
export const isIndexable = process.env.SITE_INDEXABLE === "true";
