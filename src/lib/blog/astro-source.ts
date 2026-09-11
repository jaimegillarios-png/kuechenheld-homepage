import { getCollection, getEntry, render } from "astro:content";
import { asset } from "@/lib/site";
import type { Author, BlogSource, Category, Post, PostSummary } from "./types";

/**
 * The blog, read from Astro's content collections.
 *
 * This is the one file that knows where posts come from. Everything above it
 * — the template, the components — sees only `BlogSource`, so replacing this
 * with a CMS reader is a single binding change in `index.ts`. Nothing here
 * escapes: `getCollection` is not imported anywhere else.
 */

type PostEntry = Awaited<ReturnType<typeof getCollection<"posts">>>[number];

/** 200 words a minute, rounded up, floor of one. The CMS's own figure wins
 *  where it has one. */
function estimateReadingTime(body: string): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

async function resolveAuthor(entry: PostEntry): Promise<Author | null> {
  const ref = entry.data.author;
  if (!ref) return null;
  const found = await getEntry(ref);
  if (!found) throw new Error(`Unknown author reference: "${ref.id}"`);
  const author: Author = { name: found.data.name, role: found.data.role };
  return found.data.avatar ? { ...author, avatar: asset(found.data.avatar) } : author;
}

async function resolveCategories(entry: PostEntry): Promise<Category[]> {
  const out: Category[] = [];
  for (const ref of entry.data.categories) {
    const found = await getEntry(ref);
    if (!found) throw new Error(`Unknown category reference: "${ref.id}"`);
    out.push({ name: found.data.name, slug: found.data.slug });
  }
  return out;
}

async function toSummary(entry: PostEntry): Promise<PostSummary> {
  const d = entry.data;
  return {
    title: d.title,
    slug: d.slug,
    summary: d.summary,
    author: await resolveAuthor(entry),
    categories: await resolveCategories(entry),
    mainImage: { ...d.mainImage, src: asset(d.mainImage.src) },
    thumbnailImage: { ...d.thumbnailImage, src: asset(d.thumbnailImage.src) },
    date: d.date,
    dateUpdated: d.dateUpdated ?? undefined,
    readingTime: d.readingTime ?? estimateReadingTime(entry.body ?? ""),
    // Breadcrumb hrefs are authored absolute; a subpath deployment needs the
    // base path on them the same as on any other internal link.
    breadcrumbs: d.breadcrumbs.length
      ? d.breadcrumbs.map((c) => ({
          ...c,
          href: c.href ? asset(c.href) : c.href,
        }))
      : [
          { name: "Start", href: asset("/") },
          { name: "Blog", href: asset("/blog") },
          { name: d.title, href: null },
        ],
    seo: d.seo,
    featured: d.featured,
  };
}

const bySlug = async (slug: string) =>
  (await getCollection("posts")).find((e) => e.data.slug === slug) ?? null;

export const astroSource: BlogSource = {
  async getPost(slug) {
    const entry = await bySlug(slug);
    if (!entry) return null;
    const { Content } = await render(entry);
    return {
      ...(await toSummary(entry)),
      body: { Content: Content as Post["body"]["Content"] },
    };
  },

  async getAllPosts() {
    const entries = await getCollection("posts");
    const posts = await Promise.all(entries.map(toSummary));
    // Undated posts sort last rather than throwing off the order.
    return posts.sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
  },

  async getCategories() {
    const rows = await getCollection("categories");
    const posts = await this.getAllPosts();
    const count = new Map<string, number>();
    for (const post of posts) {
      for (const c of post.categories) {
        count.set(c.slug, (count.get(c.slug) ?? 0) + 1);
      }
    }
    // Busiest first, so the row opens with the category most readers want.
    // A category with no posts is not a page.
    return rows
      .map((r) => ({ name: r.data.name, slug: r.data.slug }))
      .filter((c) => count.has(c.slug))
      .sort((a, b) => count.get(b.slug)! - count.get(a.slug)!);
  },

  async getPostsByCategory(slug) {
    const posts = await this.getAllPosts();
    return posts.filter((p) => p.categories.some((c) => c.slug === slug));
  },

  async getRelatedPosts(slug, limit = 3) {
    const all = await this.getAllPosts();
    const current = all.find((p) => p.slug === slug);
    const shared = new Set(current?.categories.map((c) => c.slug) ?? []);
    // Posts sharing a category first, then the rest, newest already first.
    return all
      .filter((p) => p.slug !== slug)
      .sort((a, b) => {
        const score = (p: PostSummary) =>
          p.categories.some((c) => shared.has(c.slug)) ? 0 : 1;
        return score(a) - score(b);
      })
      .slice(0, limit);
  },
};

/** Every post's slug, for `getStaticPaths`. */
export async function allSlugs(): Promise<string[]> {
  return (await getCollection("posts")).map((e) => e.data.slug);
}
