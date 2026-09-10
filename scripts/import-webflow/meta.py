# -*- coding: utf-8 -*-
"""Post metadata, scraped from the published pages and the blog index."""
import re, html as htmllib
from bs4 import BeautifulSoup

SITE = "https://www.kuechenheld.de"

def _meta(head: str, key: str, attr: str = "property"):
    m = re.search(r'<meta[^>]*content="([^"]*)"[^>]*' + attr + r'="' + key + r'"', head)
    if not m:
        m = re.search(r'<meta[^>]*' + attr + r'="' + key + r'"[^>]*content="([^"]*)"', head)
    return htmllib.unescape(m.group(1)) if m else None


def from_index(index_html: str):
    """slug -> {summary, thumbnail, author, date, readingTime, category}"""
    soup = BeautifulSoup(index_html, "lxml")
    out = {}
    for item in soup.select(".blog7_item"):
        link = item.select_one("a.blog7_item-link[href^='/blog/']")
        if not link:
            continue
        slug = link["href"].rsplit("/", 1)[-1]
        rec = out.setdefault(slug, {})
        img = item.select_one(".blog7_image-wrapper img")
        if img and img.get("src"):
            rec["thumbnail"] = {"src": img["src"], "alt": img.get("alt") or ""}
        summary = item.select_one(".blog7_item-content-top .text-size-regular")
        if summary:
            rec["summary"] = summary.get_text(" ", strip=True)
        author = item.select_one(".blog7_author-text .text-weight-semibold")
        if author:
            rec["author"] = author.get_text(strip=True)
        date = item.select_one(".blog-post1_date .text-size-small")
        if date:
            rec["date"] = date.get_text(strip=True)
        rt = item.select_one(".blog7_reading-time .text-size-small")
        if rt and rt.get_text(strip=True).isdigit():
            rec["readingTime"] = int(rt.get_text(strip=True))
        cat = item.select_one(".blog-category-item .text-size-small")
        if cat:
            rec["category"] = cat.get_text(strip=True)
    return out


def from_page(page_html: str, slug: str):
    head = page_html[:page_html.find("</head>")]
    soup = BeautifulSoup(page_html, "lxml")
    title = soup.title.get_text(strip=True) if soup.title else None
    h1 = soup.find("h1")
    robots = _meta(head, "robots", "name") or "all"

    # The rendered trail is Home > Blog > category…; it does not include the
    # post itself, so that is appended. Archived categories are not rendered,
    # which is the outcome we want anyway.
    bc = soup.select_one(".blog-post1_breadcrumb")
    crumbs, cats = [], []
    if bc:
        for a in bc.select("a[href]"):
            text = a.get_text(" ", strip=True)
            if not text:
                continue
            href = a["href"]
            href = href[len(SITE):] if href.startswith(SITE) else href
            crumbs.append({"name": text, "href": href})
            if a.find_parent(class_="breadcrumb-category-item"):
                cats.append({"name": text, "slug": href.rsplit("/", 1)[-1]})

    author_img = soup.select_one(".blog-post1_author-image-wrapper img")
    updated = None
    for d in soup.select(".blog-post1_date"):
        if "w-condition-invisible" in " ".join(d.get("class", [])):
            continue
        t = d.get_text(" ", strip=True)
        if re.fullmatch(r"\d{2}\.\d{2}\.\d{4}", t or ""):
            updated = updated or t

    return {
        "metaTitle": title,
        "metaDescription": _meta(head, "og:description") or _meta(head, "description", "name"),
        "mainImage": _meta(head, "og:image"),
        "robots": robots,
        "name": h1.get_text(" ", strip=True) if h1 else None,
        "breadcrumbs": crumbs,
        "categories": cats,
        "authorAvatar": author_img["src"] if author_img and author_img.get("src") else None,
        "dateOnPage": updated,
        "canonical": (re.search(r'<link rel="canonical" href="([^"]*)"', head) or [None, None])[1],
    }
