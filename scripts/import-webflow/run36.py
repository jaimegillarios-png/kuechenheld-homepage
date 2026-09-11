# -*- coding: utf-8 -*-
"""
Import the 36 published posts the first run never saw.

Same transform as `run.py` — `convert()` is imported, not reimplemented — so
the CTA component, the drop list, the conversions and the link handling are
identical. Two things differ, both forced by the reason these were missed:

  * The universe is a slug list, not a crawl of the blog index. That index is
    a Webflow Collection List capped at 100 items ordered by `priority`, which
    is exactly what truncated the first run.
  * Metadata comes from the CMS rather than from the index card, because the
    index does not list these posts and therefore has no card for them. That
    is strictly better: summary, author, date, categories, reading time and
    the placement switches come from the field values themselves.

    python3 run36.py <pages-dir> <cms-fields.json> <discriminators.json> <out-dir>
"""
import json, pathlib, re, sys, collections
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import meta as metamod
from transform import convert
from dataclasses import asdict

PAGES = pathlib.Path(sys.argv[1])
FIELDS = json.loads(pathlib.Path(sys.argv[2]).read_text())
DISC = json.loads(pathlib.Path(sys.argv[3]).read_text())
OUT = pathlib.Path(sys.argv[4]); OUT.mkdir(parents=True, exist_ok=True)

AUTHORS = {a["id"]: a for a in json.loads(
    pathlib.Path("../../src/content/authors.json").read_text())}
CATS = {c["id"]: c for c in json.loads(
    pathlib.Path("../../src/content/categories.json").read_text())}
# Webflow item ids -> our author/category ids, matched on the CMS reference.
WF_AUTHOR, WF_CAT = {}, {}

def richtext(html: str):
    m = re.search(r'<div[^>]*class="[^"]*\bw-richtext\b[^"]*"[^>]*>', html)
    if not m: return None
    i = m.end(); depth = 1
    for t in re.finditer(r'<(/?)div\b[^>]*?(/?)>', html[i:]):
        if t.group(2) == '/': continue
        depth += -1 if t.group(1) else 1
        if depth == 0: return html[i:i + t.start()]
    return None

def yaml_str(v):
    if v is None: return "null"
    return '"' + str(v).replace('\\', '\\\\').replace('"', '\\"') + '"'

def iso(de):
    m = re.fullmatch(r"(\d{2})\.(\d{2})\.(\d{4})", (de or "").strip())
    return f"{m.group(3)}-{m.group(2)}-{m.group(1)}" if m else None

reports = []
for slug in sorted(p.stem for p in PAGES.glob("*.html")):
    html = (PAGES / f"{slug}.html").read_text(encoding="utf-8")
    frag = richtext(html)
    page = metamod.from_page(html, slug)
    body, rep = convert(frag, slug)
    f, d = FIELDS[slug], DISC[slug]

    if not page["name"]: rep.warnings.append("no <h1> found for the post name")
    if not d.get("summary"): rep.warnings.append("no post-summary in the CMS")
    if not d.get("date2"): rep.warnings.append("no date-2; using item createdOn")
    if not page["mainImage"]: rep.warnings.append("no og:image for mainImage")

    # Categories come from the breadcrumb, the same as the first run.
    cats = page["categories"]
    date = iso(d.get("date2")) or (f.get("createdOn") or "")[:10] or None
    author = None
    a = metamod.from_page(html, slug)
    m = re.search(r'author-text"><div class="text-weight-semibold">([^<]*)<', html)
    if m:
        nm = m.group(1).strip().lower()
        for aid, rec in AUTHORS.items():
            if rec["name"].strip().lower() == nm: author = aid; break
        if author is None: rep.warnings.append(f"author '{m.group(1)}' not in authors.json")
    rtm = re.search(r'reading-time.*?>(\d+)\s*<', html, re.S)

    fm = [
        "---",
        f'title: {yaml_str(page["name"] or slug)}',
        f"slug: {yaml_str(slug)}",
        f'summary: {yaml_str(d.get("summary"))}',
        f'author: {yaml_str(author) if author else "null"}',
        "categories:" if cats else "categories: []",
        *[f'  - {yaml_str(c["slug"])}' for c in cats],
        "mainImage:",
        f'  src: {yaml_str(page["mainImage"])}',
        '  alt: ""',
        "thumbnailImage:",
        f'  src: {yaml_str(page["mainImage"])}',
        '  alt: ""',
        f'date: {yaml_str(date)}',
        f'readingTime: {int(rtm.group(1)) if rtm else "null"}',
        "breadcrumbs:",
        *[l for c in page["breadcrumbs"] + [{"name": page["name"] or slug, "href": None}]
            for l in (f'  - name: {yaml_str(c["name"])}',
                      f'    href: {yaml_str(c["href"]) if c["href"] else "null"}')],
        "seo:",
        f'  title: {yaml_str(page["metaTitle"])}',
        f'  description: {yaml_str(page["metaDescription"])}',
        f'  index: {"true" if page["robots"] in ("all", "index", None) else "false"}',
        "# Editorial placement, from the CMS. None of these is visible in a",
        "# published page; they decide where a post appears, not what it says.",
        f'featured: {"true" if f["featured"] else "false"}',
        f'showInHomeSlider: {"true" if f["slider"] else "false"}',
        f'showInUeberUns: {"true" if f["uberUns"] else "false"}',
        f'showOnKuechenplanung: {"true" if f["kuechenplanung"] else "false"}',
        f'priority: {f["priority"] if f["priority"] is not None else "null"}',
        "---",
        "",
    ]
    (OUT / f"{slug}.mdx").write_text("\n".join(fm) + body, encoding="utf-8")
    reports.append(asdict(rep))

pathlib.Path("report/import-report-36.json").write_text(
    json.dumps({"posts": reports}, ensure_ascii=False, indent=1), encoding="utf-8")
print(f"wrote {len(reports)} MDX files")
