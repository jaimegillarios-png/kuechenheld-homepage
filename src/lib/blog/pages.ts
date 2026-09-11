import { asset } from "../site";
import { blog } from "./index";
import type { PostSummary } from "./types";

/**
 * Eight rows of three. At 99 grid posts that lands on five pages whose last
 * is exactly one full row, which is why it is 24 and not 18 or 30.
 */
export const PAGE_SIZE = 24;

/**
 * The lead story.
 *
 * The import had nothing to derive `featured` from, so all 100 posts carry
 * `false` and the newest post stands in until an editor sets one. Keeping the
 * rule here means that editorial pass is the only change needed.
 */
export function pickFeatured(posts: PostSummary[]): PostSummary | null {
  return posts.find((p) => p.featured) ?? posts.find((p) => p.date) ?? null;
}

export const pageCount = (total: number) =>
  Math.max(1, Math.ceil(total / PAGE_SIZE));

export const pageSlice = (posts: PostSummary[], page: number) =>
  posts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

/** Page 1 is the bare route; the rest hang off `/seite/<n>`. */
export const pageHref = (base: string) => (page: number) =>
  asset(page === 1 ? base : `${base}/seite/${page}`);

/** Every extra page a route needs, as `getStaticPaths` params. */
export const extraPages = (total: number) =>
  Array.from({ length: pageCount(total) - 1 }, (_, i) => String(i + 2));

/** Slug to display name, for anything that has only a slug to work from. */
export async function categoryNames(): Promise<Record<string, string>> {
  const categories = await blog.getCategories();
  return Object.fromEntries(categories.map((c) => [c.slug, c.name]));
}

/** The chip row, with `current` resolved against the page being rendered. */
export async function categoryLinks(currentSlug: string | null) {
  const categories = await blog.getCategories();
  return [
    { name: "Alle", href: asset("/blog"), current: currentSlug === null },
    ...categories.map((c) => ({
      name: c.name,
      href: asset(`/blog-categories/${c.slug}`),
      current: currentSlug === c.slug,
    })),
  ];
}

export const HEADING = "Tipps & Inspiration rund um den Küchenkauf";
export const LEDE =
  "Entdecken Sie nützliche Tipps, innovative Gestaltungsideen und wertvolle Empfehlungen, um Ihren Küchenkauf zu einem erfolgreichen und inspirierenden Erlebnis zu machen.";
