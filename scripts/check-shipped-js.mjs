/**
 * Fails if the build emits JavaScript nothing references.
 *
 * The React integration emits its client runtime whether or not any island
 * uses it, so an unreferenced 190KB chunk can sit in the deploy unnoticed.
 * Walks every .js in dist/, and asserts each one is reachable from some HTML
 * file or from another referenced chunk.
 *
 * There is no allowlist. The one that used to be here covered the verification
 * probes while they were served out of public/; they are served beside the
 * build now, so anything unreferenced in dist/ is a real finding.
 */
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const DIST = process.argv[2] ?? "dist";

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
    unreferenced.push({
      file: path.relative(DIST, f),
      bytes: (await stat(f)).size,
    });
  }
}

console.log(`js files: ${js.length}   html files: ${html.length}`);
if (unreferenced.length === 0) {
  console.log("no unreferenced JS");
  process.exit(0);
}
console.log("\nUNREFERENCED JS:");
for (const u of unreferenced)
  console.log(`  ${u.file}  ${(u.bytes / 1024).toFixed(1)} KB`);
process.exit(1);
