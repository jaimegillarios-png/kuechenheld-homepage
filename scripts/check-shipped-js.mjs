/**
 * Fails if the Astro build emits JavaScript nothing references.
 *
 * The React integration emits its client runtime whether or not any island
 * uses it, so an unreferenced 190KB chunk can sit in the deploy unnoticed.
 * Walks every .js in dist/, and asserts each one is reachable from some HTML
 * file or from another referenced chunk.
 */
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const DIST = process.argv[2] ?? "dist";
// Harness probes are copied into public/ during the migration and are expected
// to be unreferenced; they must not survive to a real deploy.
const HARNESS = new Set([
  "capture.js", "compare.js", "motion.js", "render.js", "rendercap.js",
  "rendercmp.js", "reveal.js", "runcmp.js", "settle.js", "cls.js",
]);

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

const files = await walk(DIST);
const js = files.filter((f) => f.endsWith(".js"));
const html = files.filter((f) => f.endsWith(".html"));
const contents = new Map(
  await Promise.all(
    [...html, ...js].map(async (f) => [f, await readFile(f, "utf8")]),
  ),
);

const unreferenced = [];
for (const f of js) {
  const base = path.basename(f);
  // Search every other file, never the candidate itself — a chunk that names
  // itself would otherwise look self-referencing, and one referenced exactly
  // once would look unreferenced.
  let refs = 0;
  for (const [other, text] of contents) {
    if (other === f) continue;
    refs += text.split(base).length - 1;
  }
  if (refs === 0) {
    unreferenced.push({ file: path.relative(DIST, f), bytes: (await stat(f)).size, harness: HARNESS.has(base) });
  }
}

const real = unreferenced.filter((u) => !u.harness);
const harness = unreferenced.filter((u) => u.harness);

console.log(`js files: ${js.length}   html files: ${html.length}`);
if (harness.length) console.log(`harness probes (expected, must not deploy): ${harness.length}`);
if (real.length === 0) {
  console.log("no unreferenced application JS");
  process.exit(0);
}
console.log("\nUNREFERENCED APPLICATION JS:");
for (const u of real) console.log(`  ${u.file}  ${(u.bytes / 1024).toFixed(1)} KB`);
process.exit(1);
