# Küchenheld Homepage

Implementation of the Küchenheld homepage redesign (`_handoff/design_handoff_kuechenheld_homepage/`),
plus the blog template and the 100 posts imported from Webflow.

Astro 7 · React 19 islands · TypeScript · CSS Modules.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build
npm run preview
npm run lint
npm run typecheck
npm run check:shipped-js   # after a build
```

## History: the `pre-astro` tag

`pre-astro` (`d2ecfcc`) is the last commit before the migration, when the site
was a Next.js 16 App Router app with `output: export`. It is kept because the
migration's whole standard of proof was _this page, rendered by Next_: the
verification harness compares resolved stylesheets, computed styles and
rendered boxes against that build, and the parity claims in the commit history
mean nothing without something to reproduce them from.

```bash
git worktree add ../kh-pre-astro pre-astro   # build it to re-derive a baseline
```

Delete the tag once nobody needs to re-derive a baseline. Until then it is the
only way to check a claim about what the Next build did.

## Layout

```
src/
  pages/
    index.astro       section composition, in design order
    404.astro
    robots.txt.ts     static endpoint, honours SITE_INDEXABLE
    blog/[slug].astro one page per post
    probe/            prose fixtures, only built with BUILD_FIXTURES=true
  layouts/Base.astro  document shell, fonts, stylesheet order, motion entry
  components/         one .tsx + .module.css per section
    article/          blog-only: header, body, related, MDX mapping
    ui/               shared primitives
  content/
    posts/            100 MDX posts
    authors.json  categories.json
  content.config.ts   collections and their schemas
  lib/
    blog/             the CMS seam — see below
    content.ts        homepage copy and imagery
    motion.ts         scroll reveals, parallax, count-ups, rule draws
    site.ts           base path and indexability
  scripts/motion-entry.ts   starts the motion layer on load
  styles/
    tokens.css        the design tokens
    globals.css       reset, keyframes, shared hover language
    shared.module.css type roles, button shapes, rail arrows
    prose.module.css  the article body
    fonts.css         Figtree plus a metric-matched fallback
public/
  images/  shapes/    photography and the four kitchen-form icons
```

## Islands

Everything renders to HTML. Eight units ship JavaScript, and nothing else does:

| Island                                   | Why                          |
| ---------------------------------------- | ---------------------------- |
| `Header` (`client:load`)                 | sticky behaviour, mobile nav |
| `Hero` (`client:load`)                   | carousel                     |
| `Questionnaire`                          | form selection               |
| `Discover`, `Reviews`, `CustomerStories` | scroll-snap rails            |
| `Faq`                                    | holds the accordion          |
| `Footer`                                 | holds the newsletter form    |

`Faq` and `Footer` are islands for one stateful child each. Astro hydrates at
the boundary a page declares, so a stateful component nested inside a static
one is rendered and then inert — the accordion did not open, and the style
harness could not see it because the closed state is identical. If a component
below one of these grows state, check it actually runs.

`check:shipped-js` walks the build and fails on any JavaScript nothing
references, which is how an island's runtime shipping for nobody gets caught.

## The CMS seam

`lib/blog/index.ts` binds one adapter, and the template imports only from
there:

```ts
export { astroSource as blog, allSlugs } from "./astro-source";
```

`lib/blog/types.ts` describes what a page reads and names no framework —
a post's body is a `RichText` the page calls, which an Astro `Content`, an RSC
element and a CMS's own renderer all satisfy. `astro:content` appears in
`astro-source.ts` and nowhere else. Swapping in a CMS is that one line.

`components/article/mdxComponents.tsx` is the only help MDX needs: a scroll
wrapper for tables, plus `CtaButton` and `Stat`. Everything else a post writes
is styled by element selector in `prose.module.css`, so a CMS's raw rich-text
HTML renders the same as the local MDX.

## Design system

Tokens live in `styles/tokens.css` as custom properties. Components reference
semantic tokens or the spacing scale, never a literal that encodes a design
decision; structural values, optical corrections and choreography offsets are
the exceptions. A component that needs a value with no semantic token is a
gap in the token layer, not a reason to reach into the primitives.

The type scale and button shapes are in `styles/shared.module.css`; sections
`composes` from it rather than restating sizes.

Two conventions worth knowing before editing:

- **Sections never carry `max-width` and horizontal padding on the same
  element.** The reset sets `box-sizing: border-box`, so combining them would
  take the gutter out of the 1240px content width. Pad the `<section>`, then
  hold the content with an inner `.container`.
- **A heading's `max-width` measure is dropped below 900px by the component's
  own class**, not by the shared `.h2`. `composes` produces two classes of equal
  specificity, so a `max-width: none` in `.h2` would win or lose purely on emit
  order.

## Motion

`lib/motion.ts` runs the page-level choreography, started once from
`scripts/motion-entry.ts`. Sections opt in with data attributes rather than
being discovered by a DOM sweep:

| Attribute                 | Effect                                              |
| ------------------------- | --------------------------------------------------- |
| `data-reveal="mask"`      | heading rises out of a clip mask                    |
| `data-reveal="letter"`    | eyebrow fades in as its tracking tightens           |
| `data-reveal="wipe"`      | photo curtain-wipes in                              |
| `data-reveal="rise"`      | translate + fade                                    |
| `data-reveal-delay="140"` | extra delay in ms                                   |
| `data-reveal-stagger`     | stagger direct children (`-step` sets the interval) |
| `data-parallax`           | slow vertical drift, image oversized to 118%        |
| `data-count`              | count the numeral up, German number formatting      |
| `data-rule`               | hairline draws in from the left                     |

The entry point runs on `load`, not on `DOMContentLoaded`: reveal targets are
measured with `getBoundingClientRect`, so images have to have been laid out.

Component-local motion (hero curtain, accordion, nav overlay) is plain CSS
animation. Everything is suppressed under `prefers-reduced-motion: reduce`; the
hero carousel holds slide 1 and also pauses when scrolled out of view.

Hover language is global, applied by attribute: `data-ul` (wiping underline),
`data-ul2` (retract-and-draw underline), `data-zoom` / `data-zoomparent`
(image scales inside a fixed frame).

## Deployment

`.github/workflows/deploy.yml` builds on a push to `main` and publishes to
GitHub Pages. A project site is served from a subpath, so the workflow sets
`BASE_PATH`; `import.meta.env.BASE_URL` is the only place that subpath is
known, and `lib/site.ts`'s `asset()` is what applies it to `/public` paths
written as plain strings.

`SITE_INDEXABLE` stays unset there, so the build keeps its `noindex` tag and a
`Disallow: /` robots.txt. Set it to `"true"` only on the deployment that
genuinely serves the site — otherwise an indexable copy competes with
kuechenheld.de.

## Fidelity

Section heights were measured against the reference prototype at 375px, 860px
and 1440px. Every section matches exactly, with one deliberate exception:

- **Hero height.** The prototype pins the hero to its 824px `min-height`
  because its 100vh flex column accidentally also wraps the questionnaire and
  the "So funktioniert" section. Here the column holds only the hero and the
  trust strip, so the two together fill the viewport — 833.5px at a 900px-tall
  window instead of 824px. This follows the handoff's stated intent ("min-height
  824px, 100vh flex column with the strip") and behaves sensibly on tall
  screens, where the prototype would leave the next section poking above the
  fold.

## Before going live

- **Questionnaire.** Only step 1 of 4 is built, matching the design. Steps 2–4
  and submission need wiring; `Weiter` and `Andere Küchenform` are inert.
- **Newsletter.** `components/Newsletter.tsx` marks the integration point. The
  design has no success or error state — agree on one before wiring it.
- **Content.** `lib/content.ts` is static. Showrooms and reviews should come
  from the CMS; the blog already reads through the seam above.
- **Blog index.** There is no `/blog` listing page yet, and `routes.blog` is
  still `null`. Breadcrumbs and related cards already link to `/blog/<slug>`.
- **Featured posts.** All 100 imported posts carry `featured: false`; the
  import had nothing to derive it from. One editorial pass sets them.
- **Images.** Photography is still served from the Webflow CDN — 360 files,
  131.4 MB, none of it migrated. Post bodies reference absolute CDN URLs, so
  moving them means rewriting the MDX as well as copying the files.
- **Subpath links.** Hand-written internal `href`s (breadcrumbs, related cards)
  are absolute and are not rewritten by `BASE_PATH`, so they resolve to the
  domain root on a project-site deployment. Unchanged from the Next build,
  where `basePath` only rewrote `next/link`. Route them through `asset()` when
  the site moves off a subpath deployment, or before one goes public.
- **Routes.** Nothing links to a page that does not exist. Anything without a
  destination renders as inert styled text through `components/MaybeLink.tsx`.
  Fill in `routes` in `lib/content.ts` (`login`, `blog`, `testimonials`,
  `showrooms`) and those become real anchors with no markup change.
