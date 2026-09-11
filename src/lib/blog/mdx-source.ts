import "server-only";

import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { asset } from "@/lib/site";
import authorsJson from "@/content/authors.json";
import categoriesJson from "@/content/categories.json";
import { mdxComponents } from "@/components/article/mdxComponents";
import type {
  Author,
  BlogSource,
  Category,
  Post,
  PostSource,
  PostSummary,
} from "./types";

const POSTS_DIR = path.join(process.cwd(), "src/content/posts");

type AuthorRecord = Author & { id: string };
type CategoryRecord = Category & { id: string };

const authors = authorsJson as AuthorRecord[];
const categories = categoriesJson as CategoryRecord[];

const byId = <T extends { id: string }>(rows: T[]) =>
  new Map(rows.map((r) => [r.id, r]));

const authorsById = byId(authors);
const categoriesById = byId(categories);

/** 200 words a minute, rounded up, floor of one. Replaced by the CMS's own
 *  figure the moment there is one. */
function estimateReadingTime(body: string): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** An absent reference is a gap in the source; an unknown one is a broken
 *  reference and still throws. */
function resolveAuthor(id: string | null): Author | null {
  if (!id) return null;
  const found = authorsById.get(id);
  if (!found) throw new Error(`Unknown author reference: "${id}"`);
  const author: Author = { name: found.name, role: found.role };
  return found.avatar ? { ...author, avatar: asset(found.avatar) } : author;
}

function resolveCategories(ids: string[]): Category[] {
  return ids.map((id) => {
    const found = categoriesById.get(id);
    if (!found) throw new Error(`Unknown category reference: "${id}"`);
    return { name: found.name, slug: found.slug };
  });
}

async function readSource(slug: string): Promise<PostSource | null> {
  let raw: string;
  try {
    raw = await readFile(path.join(POSTS_DIR, `${slug}.mdx`), "utf8");
  } catch {
    return null;
  }
  const { data, content } = matter(raw);
  return { ...(data as Omit<PostSource, "body">), body: content };
}

/** The join: references in, resolved objects out. */
function toSummary(source: PostSource): PostSummary {
  return {
    title: source.title,
    slug: source.slug,
    summary: source.summary,
    author: resolveAuthor(source.author),
    categories: resolveCategories(source.categories),
    mainImage: { ...source.mainImage, src: asset(source.mainImage.src) },
    thumbnailImage: {
      ...source.thumbnailImage,
      src: asset(source.thumbnailImage.src),
    },
    // 24 imported posts have no date in the CMS at all; the template shows a
    // byline without one rather than inventing a date.
    date: source.date ?? null,
    dateUpdated: source.dateUpdated,
    readingTime: source.readingTime ?? estimateReadingTime(source.body),
    breadcrumbs: source.breadcrumbs ?? [
      { name: "Start", href: "/" },
      { name: "Blog", href: "/blog" },
      { name: source.title, href: null },
    ],
    seo: source.seo,
    featured: source.featured,
  };
}

async function listSources(): Promise<PostSource[]> {
  const files = await readdir(POSTS_DIR);
  const slugs = files
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.slice(0, -4));
  const sources = await Promise.all(slugs.map(readSource));
  return sources.filter((s): s is PostSource => s !== null);
}

export const mdxSource: BlogSource = {
  async getPost(slug) {
    const source = await readSource(slug);
    if (!source) return null;
    const { content } = await compileMDX({
      source: source.body,
      components: mdxComponents,
      // GFM for tables and strikethrough — the two things a rich-text field
      // emits that plain CommonMark has no syntax for.
      options: {
        parseFrontmatter: false,
        mdxOptions: { remarkPlugins: [remarkGfm] },
      },
    });
    // `BlogSource` hands the body back as something the page calls, not as an
    // already-rendered tree — the seam has to describe an Astro `Content` and
    // a CMS's renderer just as well as it does an RSC element.
    return {
      ...toSummary(source),
      body: { Content: () => content },
    } satisfies Post;
  },

  async getAllPosts() {
    const sources = await listSources();
    // Undated posts sort last rather than throwing off the order.
    return sources
      .map(toSummary)
      .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
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

/** Every post's slug, for `generateStaticParams`. */
export async function allSlugs(): Promise<string[]> {
  const files = await readdir(POSTS_DIR);
  return files.filter((f) => f.endsWith(".mdx")).map((f) => f.slice(0, -4));
}
