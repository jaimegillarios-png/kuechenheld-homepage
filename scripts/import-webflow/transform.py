# -*- coding: utf-8 -*-
"""
Webflow rich text -> MDX.

One-time migration tool. Reads the cached HTML of each published post, lifts the
`.w-richtext` fragment, and rewrites it as MDX: Markdown for prose, JSX for the
two things Markdown cannot express (figures with a width, and the CTA button).

Every rule here corresponds to a decision in the import brief; `Report` records
what each one did so the result can be audited per post.
"""
import re, unicodedata, urllib.parse
from dataclasses import dataclass, field
from bs4 import BeautifulSoup, NavigableString, Tag

_FACTORY = BeautifulSoup("", "lxml")
from labels import normalise

SITE = "https://www.kuechenheld.de"
ZERO_WIDTH = {"‍": "ZWJ", "​": "ZWSP", "﻿": "BOM"}
# NBSP is kept only where it is doing real work: binding a number to its unit
# or to a following word that would read wrongly if it wrapped.
NBSP_KEEP = re.compile(r"(?<=\d) (?=[A-Za-zµ°%€]|$)|(?<=\d) (?=\d)")


@dataclass
class Report:
    slug: str
    ctas: list = field(default_factory=list)
    cta_labels_changed: list = field(default_factory=list)
    figures_full: int = 0
    figures_content: int = 0
    figcaptions: int = 0
    strong_headings_stripped: list = field(default_factory=list)
    empty_p: int = 0
    empty_strong: int = 0
    empty_embeds: int = 0
    zero_width: dict = field(default_factory=dict)
    nbsp_converted: int = 0
    nbsp_kept: int = 0
    links_made_relative: int = 0
    urls_left_encoded: int = 0
    br_dropped_trailing: int = 0
    br_to_paragraph: int = 0
    br_kept_inline: int = 0
    wrappers_unwrapped: int = 0
    attrs_stripped: int = 0
    headings: dict = field(default_factory=dict)
    orphan_li_runs: list = field(default_factory=list)
    emphasis_as_html: int = 0
    heading_levels_fixed: list = field(default_factory=list)
    paragraphs_wrapped: int = 0
    warnings: list = field(default_factory=list)


# --------------------------------------------------------------------------
# text helpers
# --------------------------------------------------------------------------

def clean_text(s: str, rep: Report) -> str:
    for ch, name in ZERO_WIDTH.items():
        n = s.count(ch)
        if n:
            rep.zero_width[name] = rep.zero_width.get(name, 0) + n
            s = s.replace(ch, "")
    out = []
    for i, ch in enumerate(s):
        if ch == " ":
            keep = bool(NBSP_KEEP.search(s[max(0, i - 1):i + 2]))
            if keep:
                rep.nbsp_kept += 1
                out.append(" ")
            else:
                rep.nbsp_converted += 1
                out.append(" ")
        else:
            out.append(ch)
    return "".join(out)


def norm_text(s: str) -> str:
    """Comparable text: no zero-width noise, no repeated whitespace."""
    for ch in ZERO_WIDTH:
        s = s.replace(ch, "")
    return " ".join(s.split())


MD_ESCAPE = re.compile(r"([\\`*_\[\]<>|])")

def escape_md(s: str) -> str:
    """Escape only what would otherwise become markup. Left alone: German
    punctuation, and `#`/`-`/`+` mid-line where they are not a block marker."""
    s = MD_ESCAPE.sub(r"\\\1", s)
    s = re.sub(r"^(\s*)([#>])", r"\1\\\2", s)
    s = re.sub(r"^(\s*)(\d+)\.(\s)", r"\1\2\\.\3", s)
    return s


def decode_double_encoded(url: str, rep: Report) -> str:
    """Deliberately does nothing. Left in place so the reason is recorded.

    Thirty image URLs look double-encoded — `k%25C3%25BCchenheld` where
    `k%C3%BCchenheld` was surely meant. Decoding them is wrong: the files on
    Webflow's CDN are named with those literal characters, so the encoded form
    is the only one that resolves. Checked against the CDN, all thirty return
    200 as they stand and 403 decoded.
    """
    if "%25" in url:
        rep.urls_left_encoded += 1
    return url


def relativise(href: str, rep: Report) -> str:
    if href.startswith(SITE):
        rep.links_made_relative += 1
        rest = href[len(SITE):]
        return rest or "/"
    if href.startswith("http://www.kuechenheld.de"):
        rep.links_made_relative += 1
        return href[len("http://www.kuechenheld.de"):] or "/"
    return href


# --------------------------------------------------------------------------
# stage 1 — prune the Webflow scaffolding out of the tree
# --------------------------------------------------------------------------

def extract_ctas(soup: Tag, rep: Report):
    """Replace each CTA embed with a placeholder the serialiser turns into JSX."""
    for a in soup.select("a.offer_button"):
        label_div = a.find("div")
        raw = label_div.get_text(" ", strip=True) if label_div else ""
        raw = raw.replace("‍", "").strip()
        label, changed, why = normalise(raw)
        href = a.get("href", "")
        href = relativise(href, rep)
        # 221 of 223 point at the questionnaire; that is the component default.
        default = href in ("/questionnaire", "/questionnaire/")
        rep.ctas.append({"label": label, "href": None if default else href,
                         "was": raw if changed else None, "rule": why})
        if changed:
            rep.cta_labels_changed.append((raw, label))

        holder = _FACTORY.new_tag("div")
        holder["data-cta"] = "1"
        holder["data-label"] = label
        if not default:
            holder["data-href"] = href
        # Climb to the outermost wrapper this button sits in and replace that,
        # so `container center` and `w-embed` go with it.
        node = a
        while node.parent is not None and node.parent is not soup:
            p = node.parent
            cls = " ".join(p.get("class", []))
            if p.name == "div" and ("w-embed" in cls or "container" in cls or not cls):
                node = p
            else:
                break
        node.replace_with(holder)


def drop_empty(soup: Tag, rep: Report):
    def blank(el: Tag) -> bool:
        t = el.get_text("", strip=True).replace("‍", "").replace("​", "").replace(" ", "")
        return t == "" and not el.find(["img", "figure", "br"]) and not el.find(attrs={"data-cta": True})

    for el in soup.find_all("div", class_="w-embed"):
        if blank(el):
            rep.empty_embeds += 1
            el.decompose()
    for el in soup.find_all(["strong", "em"]):
        if blank(el):
            rep.empty_strong += 1
            # `In einer<strong> </strong>Küche` — the element is empty of words
            # but the space between them is real. Removing the element must
            # leave the space behind or the two words fuse.
            had_space = bool(re.search(r"[ \u00a0]", el.get_text("")))
            el.replace_with(NavigableString(" ") if had_space else "")
    for el in soup.find_all("p"):
        if blank(el):
            rep.empty_p += 1
            el.decompose()


def strip_heading_strong(soup: Tag, rep: Report):
    """A heading that is bold from end to end is not emphasising anything — the
    heading is already the emphasis. Webflow's editor splits that bold across
    several <strong> elements whenever a link or a line break interrupts it, so
    the test is whether the heading has any text *outside* bold, not whether a
    single <strong> happens to be the only child."""
    for h in soup.find_all(["h1", "h2", "h3", "h4", "h5", "h6"]):
        strongs = h.find_all(["strong", "b"])
        if not strongs:
            continue
        whole = norm_text(h.get_text(" "))
        bolded = norm_text(" ".join(s.get_text(" ") for s in strongs))
        if whole and whole == bolded:
            rep.strong_headings_stripped.append((h.name, whole[:70]))
            for s in strongs:
                s.unwrap()


def normalise_figures(soup: Tag, rep: Report):
    for fig in soup.find_all("figure"):
        cls = " ".join(fig.get("class", []))
        full = "w-richtext-align-fullwidth" in cls
        img = fig.find("img")
        cap = fig.find("figcaption")
        # The wrapper <div> around every image carries nothing.
        for d in fig.find_all("div"):
            d.unwrap()
            rep.wrappers_unwrapped += 1
        if img is not None:
            src = decode_double_encoded(img.get("src", ""), rep)
            alt = img.get("alt") or ""
            if alt == "__wf_reserved_inherit":
                alt = ""
            img.attrs = {"src": src, "alt": alt}
        # Webflow marked 361 of 365 figures "fullwidth", which there meant the
        # rich-text column's own width. Here the body has a text measure inside
        # a wider container, so honouring that literally put every photograph
        # 400px wider than the words beside it. They sit at the measure now;
        # `data-width="full"` stays available for a figure that genuinely wants
        # to break out, and the counts still record what the source claimed.
        fig.attrs = {}
        if full:
            rep.figures_full += 1
        else:
            rep.figures_content += 1
        if cap is not None:
            cap.attrs = {}
            rep.figcaptions += 1


DROP_ATTR = re.compile(r"^(data-rt-|w-)|^(class|style|id|loading|width|height|srcset|sizes)$")

def strip_attrs(soup: Tag, rep: Report):
    for el in soup.find_all(True):
        if el.get("data-cta") or el.name == "figure":
            continue
        keep = {}
        for k, v in list(el.attrs.items()):
            if el.name == "a" and k == "href":
                keep[k] = v
            elif el.name == "img" and k in ("src", "alt"):
                keep[k] = v
            elif el.name == "ol" and k == "start" and str(v) != "1":
                keep[k] = v
            else:
                rep.attrs_stripped += 1
        el.attrs = keep


def adopt_orphan_lis(soup: Tag, rep: Report):
    """Four posts contain <li> elements sitting outside any list — malformed
    source, not something the parser did. A run of them was meant to be one
    list, so each run is wrapped in a <ul>."""
    run = []
    def flush():
        if not run:
            return
        ul = _FACTORY.new_tag("ul")
        run[0].insert_before(ul)
        for li in run:
            ul.append(li.extract())
        rep.orphan_li_runs.append(len(run))
        run.clear()

    for child in list(soup.children):
        if isinstance(child, Tag) and child.name == "li":
            run.append(child)
        elif isinstance(child, NavigableString) and not str(child).strip():
            continue
        else:
            flush()
    flush()


# The article's own <h1> is the post title, so a body outline starts at h2.
PROSE_TOP = 2

def normalise_heading_levels(soup: Tag, rep: Report):
    """Close the gaps in a post's outline: after an h2 comes an h3, never an h5.

    Depth is taken from a stack of the levels still open rather than by
    clamping each heading against the one before it. Clamping gets siblings
    wrong — the second of two h5s under an h2 would land a level below the
    first instead of beside it. The stack keeps siblings level and keeps real
    nesting nested, so h2 > h4 > h5 becomes h2 > h3 > h4."""
    stack: list[int] = []
    for h in soup.find_all(["h1", "h2", "h3", "h4", "h5", "h6"]):
        level = int(h.name[1])
        # An <h1> in the body duplicates the article's own title. Treated as the
        # root of the outline it would push every real section a level down, so
        # it joins the top level rather than sitting above it.
        if level == 1:
            level = PROSE_TOP
        while stack and stack[-1] >= level:
            stack.pop()
        stack.append(level)
        out = min(6, PROSE_TOP + len(stack) - 1)
        if f"h{out}" != h.name:
            rep.heading_levels_fixed.append(
                (f"{h.name}->h{out}", norm_text(h.get_text(" "))[:60]))
            h.name = f"h{out}"


def unwrap_leftover_divs(soup: Tag, rep: Report):
    for d in soup.find_all("div"):
        if d.get("data-cta"):
            continue
        rep.wrappers_unwrapped += 1
        d.unwrap()


# --------------------------------------------------------------------------
# stage 2 — <br> classification
# --------------------------------------------------------------------------

BR_MIN_SIDE = 30  # chars either side before a <br> counts as a paragraph break

def classify_brs(soup: Tag, rep: Report):
    """Three outcomes, per the brief: a <br> that only pads the end of a block
    is dropped; one that separates two substantial runs of text becomes a
    paragraph break; anything else stays a line break inside its line."""
    for br in list(soup.find_all("br")):
        parent = br.parent
        after = "".join(
            s if isinstance(s, NavigableString) else s.get_text("", strip=True)
            for s in br.next_siblings
        ).strip().replace("‍", "")
        before = "".join(
            s if isinstance(s, NavigableString) else s.get_text("", strip=True)
            for s in br.previous_siblings
        ).strip().replace("‍", "")

        if not after:
            rep.br_dropped_trailing += 1
            br.decompose()
        elif parent is not None and parent.name == "p" \
                and len(before) >= BR_MIN_SIDE and len(after) >= BR_MIN_SIDE:
            br.name = "span"
            br.attrs = {"data-para-split": "1"}
            br.string = ""
            rep.br_to_paragraph += 1
        else:
            rep.br_kept_inline += 1


def split_paragraphs(soup: Tag, rep: Report):
    """Apply the paragraph breaks marked above by splitting the <p> in two."""
    for marker in list(soup.find_all("span", attrs={"data-para-split": "1"})):
        p = marker.find_parent("p")
        if p is None:
            marker.decompose(); continue
        head, tail = [], []
        seen = False
        for child in list(p.children):
            if child is marker:
                seen = True; continue
            (tail if seen else head).append(child.extract())
        new = _FACTORY.new_tag("p")
        for c in tail:
            new.append(c)
        for c in head:
            p.append(c)
        p.insert_after(new)
        marker.decompose()


# --------------------------------------------------------------------------
# stage 3 — serialise to MDX
# --------------------------------------------------------------------------

HEADING_MD = {"h1": "#", "h2": "##", "h3": "###", "h4": "####", "h5": "#####", "h6": "######"}


EMPH = ("strong", "b", "em", "i")

def touching(node: Tag) -> bool:
    """True when another emphasis run butts straight up against this one.
    `**a***b*` has no reading a Markdown parser can recover, so one side has
    to become a tag."""
    for sib in (node.previous_sibling, node.next_sibling):
        if isinstance(sib, Tag) and sib.name in EMPH:
            return True
        if isinstance(sib, NavigableString) and str(sib) and not str(sib)[-1 if sib is node.previous_sibling else 0].isspace():
            nxt = sib.previous_sibling if sib is node.previous_sibling else sib.next_sibling
            if isinstance(nxt, Tag) and nxt.name in EMPH and not str(sib).strip():
                return True
    return False


def emphasise(node: Tag, kids: str, kind: str, rep: Report) -> str:
    """Wrap emphasis without producing markup Markdown cannot read back.

    Two things go wrong with a naive `**text**`. Whitespace inside the markers
    stops them binding, so any leading or trailing space is hoisted outside.
    And emphasis nested inside emphasis collapses into a run of asterisks that
    the parser cannot split — `<strong><em>x</em></strong>` becomes `***x***`
    and, next to another run, renders literally. Nested emphasis is therefore
    emitted as a tag, which MDX passes through and the prose layer styles."""
    if not kids.strip():
        return ""
    lead = " " if kids[:1].isspace() else ""
    trail = " " if kids[-1:].isspace() else ""
    core = kids.strip()
    nested = node.find(["strong", "b", "em", "i"]) is not None
    if nested or node.find_parent(["strong", "b", "em", "i"]) is not None or touching(node):
        rep.emphasis_as_html += 1
        return f"{lead}<{kind}>{core}</{kind}>{trail}"
    mark = "**" if kind == "strong" else "*"
    return f"{lead}{mark}{core}{mark}{trail}"


def inline(node, rep: Report) -> str:
    if isinstance(node, NavigableString):
        return escape_md(clean_text(str(node), rep))
    if not isinstance(node, Tag):
        return ""
    kids = "".join(inline(c, rep) for c in node.children)
    name = node.name
    if name in ("strong", "b", "em", "i"):
        return emphasise(node, kids, "strong" if name in ("strong", "b") else "em", rep)
    if name == "a":
        href = node.get("href", "")
        href = relativise(decode_double_encoded(href, rep), rep)
        # Hoist surrounding space outside the link, the same as emphasis does.
        # Stripping it here loses the word gap when the next node is emphasis.
        lead = " " if kids[:1].isspace() else ""
        trail = " " if kids[-1:].isspace() else ""
        text = kids.strip() or href
        return f"{lead}[{text}]({href}){trail}"
    if name == "br":
        return "  \n"          # markdown hard line break
    if name == "img":
        return f'<img src="{node.get("src","")}" alt="{node.get("alt","")}" />'
    return kids


def render_list(ul: Tag, rep: Report, depth: int = 0) -> str:
    ordered = ul.name == "ol"
    lines, n = [], int(ul.get("start", 1) or 1)
    pad = "  " * depth
    for li in ul.find_all("li", recursive=False):
        nested = [c for c in li.find_all(["ul", "ol"], recursive=False)]
        for x in nested:
            x.extract()
        text = "".join(inline(c, rep) for c in li.children).strip()
        text = re.sub(r"\n{2,}", "\n", text)
        marker = f"{n}." if ordered else "-"
        lines.append(f"{pad}{marker} {text}" if text else f"{pad}{marker}")
        n += 1
        for x in nested:
            lines.append(render_list(x, rep, depth + 1))
    return "\n".join(lines)


def render_figure(fig: Tag, rep: Report) -> str:
    img = fig.find("img")
    cap = fig.find("figcaption")
    width = ' data-width="full"' if fig.get("data-width") == "full" else ""
    out = [f"<figure{width}>"]
    if img is not None:
        out.append(f'  <img src="{img.get("src","")}" alt="{img.get("alt","")}" />')
    if cap is not None:
        text = "".join(inline(c, rep) for c in cap.children).strip()
        if text:
            out.append(f"  <figcaption>{text}</figcaption>")
    out.append("</figure>")
    return "\n".join(out)


def render_cta(div: Tag) -> str:
    label = div.get("data-label", "")
    href = div.get("data-href")
    attrs = f' href="{href}"' if href else ""
    return f'<CtaButton{attrs} label="{label}" />'


def serialise(soup: Tag, rep: Report) -> str:
    blocks = []
    for el in soup.children:
        if isinstance(el, NavigableString):
            if el.strip():
                blocks.append(escape_md(clean_text(str(el).strip(), rep)))
            continue
        if not isinstance(el, Tag):
            continue
        if el.get("data-cta"):
            blocks.append(render_cta(el)); continue
        if el.name in HEADING_MD:
            text = "".join(inline(c, rep) for c in el.children).strip()
            text = text.replace("\n", " ")
            if text:
                rep.headings[el.name] = rep.headings.get(el.name, 0) + 1
                blocks.append(f"{HEADING_MD[el.name]} {text}")
            continue
        if el.name in ("ul", "ol"):
            blocks.append(render_list(el, rep)); continue
        if el.name == "figure":
            blocks.append(render_figure(el, rep)); continue
        if el.name == "p":
            text = "".join(inline(c, rep) for c in el.children).strip()
            if not text:
                continue
            # A line that opens with an HTML tag is read as an HTML *block*, so
            # the prose after it would break into a second paragraph. Wrapping
            # the whole thing keeps it one block.
            if re.match(r"<(strong|em|img)\b", text):
                rep.paragraphs_wrapped += 1
                text = f"<p>{text}</p>"
            blocks.append(text)
            continue
        if el.name == "hr":
            blocks.append("---"); continue
        if el.name == "blockquote":
            text = "".join(inline(c, rep) for c in el.children).strip()
            blocks.append("\n".join("> " + l for l in text.split("\n")))
            continue
        if el.name == "img":
            blocks.append(f'<img src="{el.get("src","")}" alt="{el.get("alt","")}" />')
            continue
        text = "".join(inline(c, rep) for c in el.children).strip()
        if text:
            rep.warnings.append(f"unhandled <{el.name}> serialised as a paragraph")
            blocks.append(text)
    body = "\n\n".join(b for b in blocks if b.strip())
    return re.sub(r"\n{3,}", "\n\n", body).strip() + "\n"


def convert(fragment_html: str, slug: str):
    soup = BeautifulSoup(f"<div id='root'>{fragment_html}</div>", "lxml").find(id="root")
    rep = Report(slug=slug)
    extract_ctas(soup, rep)
    normalise_figures(soup, rep)
    classify_brs(soup, rep)
    split_paragraphs(soup, rep)
    drop_empty(soup, rep)
    # After the <br> and empty-node noise is gone, so a heading padded with
    # either still reads as bold end to end.
    strip_heading_strong(soup, rep)
    normalise_heading_levels(soup, rep)
    strip_attrs(soup, rep)
    unwrap_leftover_divs(soup, rep)
    adopt_orphan_lis(soup, rep)
    return serialise(soup, rep), rep
