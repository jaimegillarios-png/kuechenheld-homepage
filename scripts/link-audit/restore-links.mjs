/**
 * Restores links unwrapped by `unwrap-dead-links.mjs` whose targets now exist.
 *
 * They were unwrapped on the belief that the posts did not exist. They did —
 * the first import took its universe from the blog index, which is a Webflow
 * Collection List capped at 100 items, so 36 published posts were never seen
 * and every link to one of them looked dead.
 *
 * Two targets are retargeted rather than restored: the live site 301s them to
 * a replacement, so the link should point where the reader ends up.
 */
import { readFile, writeFile, readdir } from "node:fs/promises";
import path from "node:path";

const POSTS = "src/content/posts";
const REPORT = "scripts/link-audit/report/unwrapped-links.json";

const RETARGET = {
  "/blog/kuchentheke-gestalten-ideen-fur-ihren-kuechentresen":
    "/blog/moderne-wohnkuechen-mit-integrierter-theke-oder-tisch",
  "/blog/kuechenfronten-mit-griffen-oder-grifflos": "/blog/grifflose-kuechen",
};

const slugs = new Set(
  (await readdir(POSTS)).filter((f) => f.endsWith(".mdx")).map((f) => f.slice(0, -4)),
);
const report = JSON.parse(await readFile(REPORT, "utf8"));

/** Where a recorded target should point now, or null to leave it unwrapped. */
function resolve(target) {
  const retargeted = RETARGET[target] ?? target;
  if (!retargeted.startsWith("/blog/")) return null;
  return slugs.has(retargeted.slice(6)) ? retargeted : null;
}

const wanted = new Map(); // post -> [{text, href}]
const stillDead = [];
for (const t of report.targets) {
  const href = resolve(t.target);
  for (const s of t.sources) {
    if (href) {
      if (!wanted.has(s.post)) wanted.set(s.post, []);
      wanted.get(s.post).push({ text: s.text, href });
    } else {
      stillDead.push({ post: s.post, target: t.target, text: s.text });
    }
  }
}

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
let restored = 0, notFound = [];
for (const [post, links] of wanted) {
  const file = path.join(POSTS, `${post}.mdx`);
  const src = await readFile(file, "utf8");
  const [, fm, body] = src.split(/^---$/m, 3);
  let next = body;
  for (const { text, href } of links) {
    // Put the link back around the exact text it was unwrapped from, once.
    const re = new RegExp(`(?<!\\]\\()${escape(text)}`);
    if (!re.test(next)) { notFound.push({ post, text: text.slice(0, 40) }); continue; }
    next = next.replace(re, `[${text}](${href})`);
    restored++;
  }
  if (next !== body) await writeFile(file, `---${fm}---${next}`);
}

console.log(`links restored: ${restored}`);
console.log(`text no longer matched: ${notFound.length}`);
for (const n of notFound) console.log(`   ${n.post}: ${n.text}`);
console.log(`left unwrapped (target still does not exist): ${stillDead.length}`);
const byTarget = {};
for (const d of stillDead) byTarget[d.target] = (byTarget[d.target] ?? 0) + 1;
for (const [t, n] of Object.entries(byTarget).sort((a, b) => b[1] - a[1]).slice(0, 8))
  console.log(`   ${String(n).padStart(3)}  ${t}`);
