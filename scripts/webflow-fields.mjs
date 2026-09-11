/**
 * Writes the five editorial placement fields, and a date for the posts that
 * never had one, into the MDX frontmatter.
 *
 * None of the five is derivable from published HTML — they decide where a post
 * appears, not what it says — so they come from the Webflow Data API. The
 * fetch is manual (the MCP CMS tool, results spilled to disk); this script
 * applies what came back.
 *
 * `date` for the undated posts is the item's `createdOn`, not `lastPublished`:
 * every post reports the same April 2025 lastPublished, which is a site-wide
 * republish rather than a publication date. `createdOn` lands in 2021-2022,
 * which matches the content.
 */
import { readFile, writeFile, readdir } from "node:fs/promises";
import path from "node:path";

const SRC = process.argv[2];
const POSTS = "src/content/posts";
const fields = JSON.parse(await readFile(SRC, "utf8"));

const set = (fm, key, value) => {
  const line = `${key}: ${value}`;
  const re = new RegExp(`^${key}: .*$`, "m");
  return re.test(fm) ? fm.replace(re, line) : fm;
};

let changed = 0, datesFilled = 0;
for (const file of (await readdir(POSTS)).filter((f) => f.endsWith(".mdx"))) {
  const slug = file.slice(0, -4);
  const row = fields[slug];
  if (!row) continue;

  const full = await readFile(path.join(POSTS, file), "utf8");
  const [, fm, body] = full.split(/^---$/m, 3);
  let next = fm;

  // The placement switches sit next to `featured`, which is already there.
  next = set(next, "featured", row.featured);
  if (!/^priority: /m.test(next)) {
    next = next.replace(/^featured: .*$/m, (m) =>
      `${m}\n# Editorial placement, from the CMS. None of these is visible in a\n# published page; they decide where a post appears, not what it says.\nshowInHomeSlider: ${row.slider}\nshowInUeberUns: ${row.uberUns}\nshowOnKuechenplanung: ${row.kuechenplanung}\npriority: ${row.priority ?? "null"}`,
    );
  }

  if (/^date: null$/m.test(next) && row.createdOn) {
    next = set(next, "date", `"${row.createdOn.slice(0, 10)}"`);
    datesFilled++;
  }

  if (next !== fm) {
    await writeFile(path.join(POSTS, file), `---${next}---${body}`);
    changed++;
  }
}
console.log(`posts updated: ${changed}`);
console.log(`dates filled from createdOn: ${datesFilled}`);
