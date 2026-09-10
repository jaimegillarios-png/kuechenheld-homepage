# -*- coding: utf-8 -*-
"""Drive the import: cached HTML in, MDX + a per-post report out."""
import json, pathlib, re, sys, collections
sys.path.insert(0, str(pathlib.Path(__file__).parent))
from bs4 import BeautifulSoup
import meta as metamod
from transform import convert, Report
from dataclasses import asdict

CACHE = pathlib.Path(sys.argv[1])          # directory of cached post pages
INDEX = pathlib.Path(sys.argv[2])          # cached blog index
OUT = pathlib.Path(sys.argv[3])            # where the .mdx files go
OUT.mkdir(parents=True, exist_ok=True)

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
    s = str(v).replace('\\', '\\\\').replace('"', '\\"')
    return f'"{s}"'

def iso(de: str):
    m = re.fullmatch(r"(\d{2})\.(\d{2})\.(\d{4})", (de or "").strip())
    return f"{m.group(3)}-{m.group(2)}-{m.group(1)}" if m else None

def slugify(name: str):
    s = name.lower()
    for a, b in [("ä","ae"),("ö","oe"),("ü","ue"),("ß","ss"),("&","und")]:
        s = s.replace(a, b)
    return re.sub(r"-+", "-", re.sub(r"[^a-z0-9]+", "-", s)).strip("-")

index_meta = metamod.from_index(INDEX.read_text(encoding="utf-8"))
reports, skipped = [], []

for f in sorted(CACHE.glob("*.html")):
    slug = f.stem
    html = f.read_text(encoding="utf-8")
    frag = richtext(html)
    if frag is None:
        skipped.append((slug, "no .w-richtext container (page is a redirect)"))
        continue

    page = metamod.from_page(html, slug)
    idx = index_meta.get(slug, {})
    body, rep = convert(frag, slug)

    if not page["name"]:            rep.warnings.append("no <h1> found for the post name")
    if not idx.get("summary"):      rep.warnings.append("no summary on the index card")
    if not idx.get("author"):       rep.warnings.append("no author on the index card")
    if not idx.get("date"):         rep.warnings.append("no date on the index card")
    if not page["mainImage"]:       rep.warnings.append("no og:image for mainImage")

    cats = page["categories"]   # already {name, slug} from the breadcrumb href
    fm = [
        "---",
        f'title: {yaml_str(page["name"] or idx.get("summary") or slug)}',
        f"slug: {yaml_str(slug)}",
        f'summary: {yaml_str(idx.get("summary"))}',
        f'author: {yaml_str(slugify(idx["author"])) if idx.get("author") else "null"}',
        "categories:" if cats else "categories: []",
        *[f'  - {yaml_str(c["slug"])}' for c in cats],
        "mainImage:",
        f'  src: {yaml_str(page["mainImage"])}',
        f'  alt: {yaml_str("")}',
        "thumbnailImage:",
        f'  src: {yaml_str((idx.get("thumbnail") or {}).get("src") or page["mainImage"])}',
        f'  alt: {yaml_str((idx.get("thumbnail") or {}).get("alt") or "")}',
        f'date: {yaml_str(iso(idx.get("date")))}',
        f'readingTime: {idx.get("readingTime") or "null"}',
        "breadcrumbs:",
        *[l for c in page["breadcrumbs"] + [{"name": page["name"] or slug, "href": None}]
            for l in (f'  - name: {yaml_str(c["name"])}',
                      f'    href: {yaml_str(c["href"]) if c["href"] else "null"}')],
        "seo:",
        f'  title: {yaml_str(page["metaTitle"])}',
        f'  description: {yaml_str(page["metaDescription"])}',
        f'  index: {"true" if page["robots"] in ("all", "index", None) else "false"}',
        "# `featured` is the one field the published page does not expose; it needs",
        "# one CMS pass to fill in. Defaulted to false.",
        "featured: false",
        "---",
        "",
    ]
    (OUT / f"{slug}.mdx").write_text("\n".join(fm) + body, encoding="utf-8")
    reports.append(asdict(rep))

pathlib.Path(OUT.parent / "import-report.json").write_text(
    json.dumps({"posts": reports, "skipped": skipped}, ensure_ascii=False, indent=1), encoding="utf-8")
print(f"wrote {len(reports)} MDX files; skipped {len(skipped)}")
