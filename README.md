# Küchenheld Homepage

Implementation of the Küchenheld homepage redesign (`_handoff/design_handoff_kuechenheld_homepage/`).

Next.js 16 (App Router) · TypeScript · CSS Modules · React 19.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run lint
npm run typecheck
```

## Layout

```
src/
  app/
    layout.tsx        root shell, Figtree via next/font, metadata
    page.tsx          section composition, in design order
    globals.css       design tokens, keyframes, shared hover language
  components/         one .tsx + .module.css per section
  lib/
    content.ts        all copy and imagery
    motion.ts         scroll reveals, parallax, count-ups, rule draws
    useRail.ts        horizontal scroll-snap rail behaviour
  styles/
    shared.module.css type roles, button shapes, rail arrows
public/
  images/  shapes/    photography and the four kitchen-form icons
```

Sections are server components. Only the five that hold state are client
components: `Header` (sticky behaviour + mobile nav), `Hero` (carousel),
`Questionnaire` (form selection), `Faq` (accordion), and the three rails
(`Discover`, `Reviews`, `CustomerStories`).

## Design system

Tokens live in `globals.css` as custom properties — `--ink`, `--paper-warm`,
the ink/cream alpha ramp, the three easings, `--content-max`, `--gutter`. The
type scale and button shapes are in `styles/shared.module.css`; sections
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

`lib/motion.ts` runs the page-level choreography from a single mount effect
(`components/MotionRuntime.tsx`). Sections opt in with data attributes rather
than being discovered by a DOM sweep:

| Attribute | Effect |
|---|---|
| `data-reveal="mask"` | heading rises out of a clip mask |
| `data-reveal="letter"` | eyebrow fades in as its tracking tightens |
| `data-reveal="wipe"` | photo curtain-wipes in |
| `data-reveal="rise"` | translate + fade |
| `data-reveal-delay="140"` | extra delay in ms |
| `data-reveal-stagger` | stagger direct children (`-step` sets the interval) |
| `data-parallax` | slow vertical drift, image oversized to 118% |
| `data-count` | count the numeral up, German number formatting |
| `data-rule` | hairline draws in from the left |

Component-local motion (hero curtain, accordion, nav overlay) is plain CSS
animation. Everything is suppressed under `prefers-reduced-motion: reduce`; the
hero carousel holds slide 1 and also pauses when scrolled out of view.

Hover language is global, applied by attribute: `data-ul` (wiping underline),
`data-ul2` (retract-and-draw underline), `data-zoom` / `data-zoomparent`
(image scales inside a fixed frame).

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
- **Content.** `lib/content.ts` is static. Blog posts, showrooms and reviews
  should come from the CMS.
- **Images.** Photography is still served from the Webflow CDN, allow-listed in
  `next.config.ts`. Point `remotePatterns` at the production DAM when it moves.
- **Routes.** Nothing links to a page that does not exist. Anything without a
  destination renders as inert styled text through `components/MaybeLink.tsx`.
  Fill in `routes` in `lib/content.ts` (`login`, `blog`, `testimonials`,
  `showrooms`) and those become real anchors with no markup change; individual
  posts and showrooms can override with their own optional `href`. The only real
  links today are the in-page anchors and the four social URLs.
