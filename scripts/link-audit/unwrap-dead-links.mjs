/**
 * Unwraps markdown links in post bodies that point at pages this site does not
 * have, keeping the link text.
 *
 * Two groups, both from the Webflow import:
 *
 *  - 19 post slugs that were never imported. Those posts do not exist and are
 *    not coming; a live link to a 404 is worse than plain prose.
 *  - Route families the rebuild has not built (`/kuechenstile`, `/hersteller`
 *    and friends). Those pages are planned, so every one is recorded in
 *    `report/unwrapped-links.json` — when a page lands, its links are restored
 *    from that file rather than rediscovered.
 *
 * `/questionnaire` is deliberately NOT touched: the questionnaire modal has a
 * real route behind it, and those links resolve the moment it ships.
 *
 * One case is not repaired here and was fixed by hand: `kueche-dunkelblau`
 * carried markdown emphasis inside a raw HTML `<p>`, which the unwrap stranded.
 * It is `<em>` now, like the rest of that paragraph, so re-running this script
 * leaves it alone.
 */
import { readFile, readdir, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const POSTS = "src/content/posts";
const KEEP = new Set(["/questionnaire"]);

const files = (await readdir(POSTS)).filter((f) => f.endsWith(".mdx"));
const slugs = new Set(files.map((f) => f.slice(0, -4)));

/** A route this build serves, base path aside. */
function isLive(href) {
  const [pathname] = href.split("#");
  if (KEEP.has(pathname)) return true;
  if (pathname === "/" || pathname === "/blog") return true;
  if (pathname.startsWith("/blog-categories/")) return true;
  if (pathname.startsWith("/blog/")) return slugs.has(pathname.slice(6));
  return false;
}

const unwrapped = [];
let changed = 0;

for (const file of files) {
  const full = path.join(POSTS, file);
  const source = await readFile(full, "utf8");
  const [, frontmatter, body] = source.split(/^---$/m, 3);

  // Markdown links only. Bare URLs and JSX props are left alone.
  const next = body.replace(
    /\[([^\]]+)\]\((\/[^)\s]*)\)/g,
    (match, text, href) => {
      if (isLive(href)) return match;
      unwrapped.push({ post: file.slice(0, -4), target: href, text });
      // A handful of links were authored with the URL as their own text.
      // Keeping that leaves a bare path sitting in the prose, so it goes.
      const bare = text.trim().replace(/^\*+|\*+$/g, "");
      return bare === href || /^(\/|https?:)/.test(bare) ? "" : text;
    },
  );

  // Unwrapping can strand emphasis. `[**Foo**](/x)**:**` becomes
  // `**Foo****:**`, and `[Foo](/x)**.**` becomes `Foo**.**` — in both the
  // delimiters stop flanking a word and markdown renders the asterisks
  // literally. Two repairs, in order:
  //   - four asterisks are two adjacent bold runs; merge them into one
  //   - a run holding nothing but punctuation, now welded to the word before
  //     it, loses its markers. Webflow emitted those; bold commas are not a
  //     thing worth keeping.
  const tidy = next
    .replace(/\*\*\*\*/g, "")
    .replace(/(\w)\*\*([^\w\s*]{1,3})\*\*/g, "$1$2")
    // Dropping a URL-only link can leave the two spaces that flanked it. A
    // trailing double space is a markdown line break, so only interior runs go.
    .replace(/(\S) {2,}(?=\S)/g, "$1 ");

  if (tidy !== body) {
    await writeFile(full, `---${frontmatter}---${tidy}`);
    changed++;
  }
}

const byTarget = new Map();
for (const row of unwrapped) {
  const list = byTarget.get(row.target) ?? [];
  list.push({ post: row.post, text: row.text });
  byTarget.set(row.target, list);
}

const report = {
  generated: new Date().toISOString().slice(0, 10),
  note: "Links removed from post bodies because the target does not exist yet. Restore from here when a route ships.",
  total: unwrapped.length,
  targets: [...byTarget.entries()]
    .sort((a, b) => b[1].length - a[1].length)
    .map(([target, sources]) => ({ target, count: sources.length, sources })),
};

// The script is idempotent, so a second run finds nothing — and writing an
// empty report then would destroy the record of what the first run removed.
if (unwrapped.length === 0) {
  console.log("nothing to unwrap; report left as it is");
} else {
  await mkdir("scripts/link-audit/report", { recursive: true });
  await writeFile(
    "scripts/link-audit/report/unwrapped-links.json",
    JSON.stringify(report, null, 2) + "\n",
  );
  console.log(`posts changed: ${changed}`);
  console.log(
    `links unwrapped: ${unwrapped.length} across ${byTarget.size} targets`,
  );
}
