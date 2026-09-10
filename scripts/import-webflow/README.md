# Webflow → MDX importer

One-time migration tool. Not part of the app build.

    python3 run.py <cached-post-pages-dir> <cached-blog-index.html> <out-dir>

## Source

Bodies come from the **published** pages rather than a CMS export, which is
sound here because every difference between the stored field and the published
one is in the drop list anyway:

| stored | published | this importer |
|---|---|---|
| `data-rt-embed-type`, `data-rt-*` | stripped by Webflow | dropped |
| `id=""` on every element | stripped by Webflow | dropped |
| `alt="__wf_reserved_inherit"` | rewritten to `alt=""` | rewritten to `alt=""` |
| `uploads-ssl.webflow.com` arrow icon | rewritten to `assets-global` | icon dropped entirely |

`fixtures/stored-form.html` exercises the stored constructs directly, so the
rules stay covered if this is ever re-run against a real export.

Element *structure* is identical between the two — verified on a post with
8 h2, 3 figures, 12 divs, 6 imgs and 9 anchors.

## Not covered

`featured` is the one field the published page does not expose. Every post
imports as `featured: false` and needs one CMS pass to fill in.

`fixtures/prose-kitchensink.mdx` is the hand-written fixture that exercises
tables, blockquotes and `hr`. No real post uses any of them, so it is kept here
rather than in the corpus — it is the only coverage those prose branches have.
