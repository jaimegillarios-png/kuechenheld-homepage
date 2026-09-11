import { defineCollection, reference, z } from "astro:content";
import { file, glob } from "astro/loaders";

/**
 * Authors and categories are references on a post, not pages of their own.
 * They were hand-joined against two JSON files; they are data collections now,
 * so `reference()` validates at build that every post points at one that exists.
 */
const authors = defineCollection({
  loader: file("src/content/authors.json"),
  schema: z.object({
    name: z.string(),
    role: z.string().optional(),
    avatar: z.string().optional(),
  }),
});

const categories = defineCollection({
  loader: file("src/content/categories.json"),
  schema: z.object({
    name: z.string(),
    slug: z.string(),
  }),
});

const image = z.object({ src: z.string(), alt: z.string().default("") });

/**
 * The imported corpus carries real gaps from the CMS: 24 posts have no date at
 * all, one has no author and one no summary. The schema accepts them rather
 * than failing the build over data the source never had — losing a post
 * because its `date-2` field was null is worse than rendering it undated.
 */
const postSchema = z.object({
  title: z.string(),
  slug: z.string(),
  summary: z.string().nullable().default(null),
  author: reference("authors").nullable().default(null),
  categories: z.array(reference("categories")).default([]),
  mainImage: image,
  thumbnailImage: image,
  date: z.string().nullable().default(null),
  dateUpdated: z.string().nullable().default(null),
  readingTime: z.number().nullable().default(null),
  breadcrumbs: z
    .array(z.object({ name: z.string(), href: z.string().nullable() }))
    .default([]),
  seo: z.object({
    title: z.string().nullable().default(null),
    description: z.string().nullable().default(null),
    index: z.boolean().default(true),
  }),
  featured: z.boolean().default(false),
});

const posts = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "src/content/posts" }),
  schema: postSchema,
});

/**
 * Prose fixtures. Not content — they exercise the parts of the prose layer the
 * real corpus happens not to use: no imported post contains a table, an `hr`,
 * a `Stat` or a nested ordered list, so nothing else would notice if the MDX
 * component mapping silently stopped applying. Rendered only when
 * `BUILD_FIXTURES=true`; see `src/pages/probe/[fixture].astro`.
 */
const fixtures = defineCollection({
  loader: glob({
    pattern: "**/*.mdx",
    base: "scripts/import-webflow/fixtures",
  }),
  schema: postSchema,
});

export const collections = { posts, fixtures, authors, categories };
