/**
 * The blog's content source. Swap this one binding for a CMS adapter and the
 * template does not change — it only ever imports from here.
 */
export { astroSource as blog, allSlugs } from "./astro-source";
export type * from "./types";
