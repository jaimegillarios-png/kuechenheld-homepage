# Handoff: Küchenheld Homepage Redesign

## Overview
A full-page redesign of the Küchenheld (kuechenheld.de) homepage — a German made-to-measure kitchen retailer selling online plus 8 physical showrooms. The page's job is to get a visitor into a 4-step questionnaire that produces a free, non-binding quote with price indication. Aesthetic direction: premium editorial minimalism — near-black on warm off-white, hairline rules, generous whitespace, light type weights, full-bleed photography, restrained micro-animation.

## About the Design Files
The file in this bundle (`Kuechenheld Homepage v3.dc.html`) is a **design reference created in HTML** — a prototype showing intended look and behavior, not production code to copy directly. It uses a small in-house template runtime (inline styles, a `renderVals()` logic class); do not try to port that runtime.

The task is to **recreate this design in the target codebase's existing environment** (React/Next, Vue, Webflow, etc.) using its established patterns, component library, and styling approach. If no environment exists yet, pick the most appropriate framework and implement there. All inline styles in the reference should become whatever the codebase normally uses (CSS modules, Tailwind, styled-components).

## Fidelity
**High-fidelity.** Colors, type scale, spacing, motion timings and easings are final and intentional. Recreate pixel-accurately. The type scale and 8pt spacing grid below are locked — every spacing value in the design is a multiple of 8 (occasionally 4 for optical fixes).

## Global system

### Design tokens
Colors
- `--ink: #141312` — primary text, dark sections, primary buttons
- `--ink-cta: #1f1d1b` — CTA band background only (deliberately one step lighter than `--ink`)
- `--paper: #ffffff` — hero + default page background
- `--paper-warm: #faf9f6` — questionnaire section background
- `--paper-cream: #f4f2ed` — light section background, mobile nav overlay, light-on-dark text
- `--img-placeholder: #e9e6e0` — behind images while loading
- Ink alphas used verbatim: `rgba(20,19,18,.72)` body on light, `.7` secondary body, `.62` strip text, `.45`/`.4` eyebrows and meta, `.35` list arrows, `.3` large numerals, `.2`/`.18`/`.16`/`.14`/`.12` hairlines (heaviest to lightest)
- Cream alphas on dark: `rgba(244,242,237,.78)` footer links, `.7` body, `.65`/`.55` eyebrows, `.5`/`.4` meta, `.35`/`.18`/`.16` hairlines

Typography — Figtree variable (weights 200–900), loaded from jsDelivr fontsource. Wordmark and footer wordmark use Helvetica Neue/Helvetica/Arial with `letter-spacing:.32em`, uppercase.
| Role | Size | Weight | Line-height | Letter-spacing |
|---|---|---|---|---|
| Hero h1 | clamp(40px, 4.8vw, 80px) | 200 | .98 | — |
| Section h2 | 48px (32px ≤900px) | 300 | 1.1 | — |
| Stat numeral | 56px (40px ≤900px) | 300 | 1 | — |
| Step numeral | 40px | 300 | 1 | — |
| Mobile nav item | 32px | 200 | — | — |
| Card / list title | 24px | 400 | 1.4 | — |
| Body | 16px | 400 | 1.8 | — |
| Small body | 14px | 400 | 1.8 | — |
| Button / link label | 12px | 400 | — | .2em, uppercase |
| Nav item | 12px | 400 | — | .12em, uppercase |
| Strip label | 12px | 400 | — | .22em, uppercase |
| Eyebrow | 10px | 400 | — | .28em, uppercase |
| Hero eyebrow | 10px | 400 | — | .34em (vertical .34em), uppercase |

Spacing — 8pt grid. Section vertical padding 112–128px (64–72px ≤900px), horizontal 40px (24px ≤900px). Content max-width 1240px, centered. Common gaps: 96px (two-column split), 64px, 48px, 40px, 32px, 24px, 16px.

Other: no border-radius anywhere (0 everywhere, including buttons and images). No shadows. Borders are always 1px solid at an ink/cream alpha.

### Motion
Easings: `cubic-bezier(.16,1,.3,1)` (primary, decelerating) for reveals; `cubic-bezier(.62,.02,.24,1)` for the hero curtain; `linear` for the hero zoom drift; `ease` for opacity.
- `khLineUp` translateY(110%)→0, 1.1s — hero headline lines inside `overflow:hidden` clips, staggered .1s/.24s/.38s
- `khFade` opacity 0→1, 1–1.4s
- `khRule` scaleX(0)→1 from left, 1.2s — hairline rules
- `khDrop` scaleY(0)→1 from top, 1.2s — hero vertical tick
- `khRise` translateY + fade — body copy, buttons, strip items
- `khImgIn` clip-path inset(0 0 0 100%)→inset(0), 1.7s — photo curtain wipe (right→left reveal), **no scale**
- `khSlideLag` translateX(9%)→0, 1.7s — image lags behind the curtain
- `khHeroDrift` scale(1.1)→1, 9s linear — continuous slow zoom-out on the visible hero slide
- `khEdge` — 1px white vertical line travels with the curtain edge, fading in at 8% and out at 100%
- `khAcc` grid-template-rows 0fr→1fr + fade, .55s — FAQ answer open; `khAccText` translateY(8px)+fade, .6s, .12s delay
- `khNavIn` translateY(-12px)+fade, .5s — mobile nav overlay
- Scroll reveals: IntersectionObserver-style logic reveals headings (clip mask), eyebrows (letter-spacing tighten + fade), photos (curtain), grid children (staggered rise ~110ms apart), stat numbers (count up). Horizontal rails stagger their first 4 cards on arrival.
- Sticky header hides on scroll-down past 120px, returns on scroll-up.
- All of the above is suppressed under `prefers-reduced-motion: reduce` (hero carousel holds slide 1; hover zooms disabled).

### Link and image hover language
- **Nav / plain text links** (`[data-ul]`): 1px underline wipes in from the left on hover (transform-origin left, .5s), wipes out to the right on leave.
- **Underlined uppercase links** (`[data-ul2]`, e.g. ERFAHRUNGSBERICHTE ANSEHEN): the resting rule is a `::before` line. On hover it retracts to the right (.4s, `cubic-bezier(.4,0,1,1)`) while a second line at 45% opacity draws in from the left (.5s, `cubic-bezier(0,0,.3,1)`, .08s behind). On leave the drawn line only **fades** out (.18s) and the resting rule slides back (.24s) — deliberately quieter than the entrance.
- **Clickable images** (`[data-zoom]`): image scales to 1.045 over .7s `cubic-bezier(.22,1,.36,1)`, clipped by a fixed-size frame (frame never grows). Blog rows trigger the zoom from anywhere in the row (`[data-zoomparent]`).
- **Arrow buttons**: 40×40, `rgba(255,255,255,.92)` on 1px `rgba(20,19,18,.12)`, invert to ink/white on hover; opacity fades in on rail hover; vertically centered on the image, not the section.

## Screens / Views
Single responsive page, sections top to bottom.

### 1. Header (sticky)
Wordmark left · nav (Küchendesign, Planung, Blog, Standorte) · right group (Einloggen, Termin buchen). 24px/40px padding, white, `position:sticky; top:0; z-index:20`. Hides/reveals on scroll direction.
≤900px: nav and right group hidden; a two-line burger (24px + 16px hairlines, 40×40 target) opens a full-screen `--paper-cream` overlay (`z-index:200`, scrollable): wordmark + ×, then 32px/200 nav items separated by hairlines, "Termin buchen" as a full-width ink button pinned to the bottom with Einloggen under it.

### 2. Hero (min-height 824px, 100vh flex column with the strip)
Three columns: 56px rail | text (1fr) | image (1.02fr).
- Rail: "01" top, vertical "Küchenheld — seit 2019" centered, 1px/64px vertical tick bottom.
- Text: eyebrow "Küchen, individuell geplant"; h1 three lines — "Küche kaufen" / *von zuhause* (italic, indented 1.1em) / "aus" (indented 2.6em); full-width hairline; body copy; primary ink button "Küchenwünsche angeben" + `[data-ul2]` link "Showrooms ansehen".
- Image: **4-slide auto carousel**, 8.6s per slide, wrapping. Each advance: incoming slide z-index 2 (outgoing 1, others reset to 0 and re-hidden — never an unbounded counter), curtain `khImgIn`, `khSlideLag` on the image layer, `khHeroDrift` restarted, travelling white edge line, and the caption pair (model left / city right, 10px eyebrow, white at .9) swaps with the slide. Four 24×2px dots top-right, active at opacity 1, others .35, .5s crossfade.

### 3. Trust strip
Three equal cells divided by hairlines, 12px/.22em uppercase: "1.500+ Küchen pro Jahr" · "★ 4.7 Reviews.io" · third proof point. Staggered rise on load.

### 4. Questionnaire — `id="fragebogen"` (scroll target for all primary CTAs)
Background `--paper-warm`, padding 120px 40px 128px. Eyebrow "Schritt 1 von 4 — Küchenform"; h2 "Jetzt Ihre Küchenwünsche angeben und ein kostenloses Angebot erhalten"; meta "Kostenlos · 2 Minuten · Unverbindlich"; a 4-across grid of kitchen-form choice cards (16px gap; single column ≤560px); below, an underlined "Andere Küchenform / steht noch nicht fest" link and, once a card is picked, a continue row.

### 5. So funktioniert — `id="planung"`
Two equal columns, full-bleed parallax photo left (min-height 640px), content right (104px 56px 112px): eyebrow, h2 "So funktioniert der Küchenkauf mit Küchenheld", body, then three numbered steps (01/02/03) as 56px numeral + text rows separated by hairlines.

### 6. Küchenplanung entdecken — `id="kuechendesign"`
Heading block (h2 + body, max 60ch), then a horizontal scroll-snap rail of cards, each `calc((100% - 64px)/3)` wide with 32px gaps: 3/4 image in a `[data-zoom]` frame, 24px title, 14px body (max 44ch). Bare ← → arrows overlaid at the vertical center of the card image. Card order ends with "Küchenstile".

### 7. Kundenerfahrungen
Two equal columns. Left: full-height image slider (min-height 800px) — slides are full-width scroll-snap panels with a 10px uppercase white caption bottom-left (24px inset); arrows vertically centered. Right: eyebrow "Erfahrungsberichte", h2 (clamp 32–48px), body, `[data-ul2]` "Erfahrungsberichte ansehen".

### 8. Bewertungen
Three-column quote slider with the stats row and bare ← → arrows inline after it.

### 9. Werte
Four-column grid of value cards, hairline separated, staggered reveal.

### 10. Standorte — `id="standorte"`
Two columns (.85fr / 1fr, 96px gap). Left: eyebrow "Standorte", h2, body, outlined button "Küchenberatung buchen", then 8 / Showrooms + second stat. Right: index list of the 8 showrooms — `40px | 1fr | 24px` rows (number, city, →), hairline-separated, padding-left shifts on hover.

### 11. Angebotsvergleich band
`--paper-cream`, 112px 40px. h2 "Haben Sie schon ein Angebot? Vergleichen lohnt sich!", body (max 50ch), outlined button "Jetzt Angebot vergleichen" (fills ink on hover). *Note: this band's copy was written for the redesign; the service itself is real.*

### 12. FAQ
Two columns: left h2, right body + `[data-ul2]` "Kostenlose Beratung". Below, a numbered accordion: rows are `56px | 1fr | 32px` (number, question 24px, sign), hairline-separated, 32px 8px padding. The sign is always "+" and rotates 45° when open (.45s). Open answer: grid-rows 0fr→1fr reveal with the answer text rising in behind it; answer row is `56px | 1fr | 32px` with an empty first cell, body max 72ch, 40px bottom padding. Collapse unmounts (instant).

### 13. Blog — `id="blog"`
Header row: eyebrow "Blog" + h2 "Tipps & Inspiration rund um den Küchenkauf" left, body (max 46ch) right. Then a featured post (large image) and 5 index rows: `clamp(96px,14vw,176px) | 1fr` with `clamp(16px,2vw,32px)` gap, hairline-separated, 24px vertical padding. Hovering anywhere on a row zooms its thumbnail inside a fixed frame. Ends with `[data-ul2]` "Alle Beiträge ansehen".

### 14. CTA band (above footer)
Two equal columns, `--ink-cta` background, cream text. Left: photo (min-height 560px, parallax). Right (120px 80px, centered): eyebrow "Küchenkauf starten", h2 "Angebot mit Preisindikation für Ihre Traumküche" (max 20ch), body (max 44ch), cream button "Kostenloses Angebot erhalten" (hover → transparent with a cream inset ring), then a hairline and three uppercase reassurance items 40px apart: Unverbindlich · Kostenlos · In 24 Stunden. Stacks ≤900px (image min-height 320px, padding 64px 24px 72px).

### 15. Footer
`--ink` background, cream text. Row 1: wordmark + newsletter (eyebrow, body max 34ch, email field as a hairline-underlined row with "Anmelden"). Then four link columns — Über Küchenheld, Service, Ratgeber, Showrooms — 12px items, 12px gaps. Bottom bar above a hairline: © Küchenheld GmbH 2026 and bare social icons (Facebook, Instagram, Pinterest, LinkedIn — 16px SVG, `rgba(244,242,237,.7)` → full cream on hover, .3s).

## Interactions & Behavior
- **Anchor navigation.** Sections carry `id`s: `#fragebogen`, `#planung`, `#kuechendesign`, `#standorte`, `#blog`. All nav items and six CTAs are real `<a href="#...">` links whose click handler smooth-scrolls to `getBoundingClientRect().top + pageYOffset - 8` (instant under reduced motion). The CTAs pointing at `#fragebogen`: header "Termin buchen", hero "Küchenwünsche angeben", Standorte "Küchenberatung buchen", "Jetzt Angebot vergleichen", FAQ "Kostenlose Beratung", CTA band "Kostenloses Angebot erhalten".
- **Hero carousel**: `setInterval` 8600ms; skipped entirely under reduced motion. Should pause when off-screen in production (not implemented in the reference).
- **Rails**: native horizontal scroll with `scroll-snap-type: x mandatory`, hidden scrollbars, arrow buttons scroll by one card width; arrows fade in on rail hover.
- **FAQ accordion**: single-open (`openIdx`), click toggles.
- **Questionnaire**: selecting a form card sets `picked` and reveals the continue row.
- **Mobile nav**: `navOpen` boolean; tapping an item closes the panel then scrolls to its target.
- **Responsive**: ≤900px — two-column sections stack, h2 48→32px, stats 56→40px, section padding eases, nav → burger, CTA band stacks. ≤560px — single column, full-width cards, hero image stacks below the text.

## State Management
`navOpen` (bool), `openIdx` (int, -1 = closed), `picked` (kitchen-form selection or null), `hov1/hov2/hov3` (bools controlling rail arrow opacity). Hero slide index, z-index bookkeeping and the reveal/parallax/count-up work are imperative DOM effects in the reference; in a component framework use refs + effects, or a small carousel/observer hook. No data fetching — all copy and images are static. Production will need: questionnaire submission, newsletter signup, blog/showroom content from CMS.

## Assets
All photography is Küchenheld's own, referenced from their Webflow CDN (`cdn.prod.website-files.com/6391b8b8063c7487769d5e4c/…` and `…/6391b8b8063c74b54a9d5e71/…`) plus a few files the user supplied, which live in `uploads/` in this bundle:
- `csm_Schueller_wohnkueche_8b26b4edbd.webp`, `100_JEK_Haecker_Kueche_1700x1200.jpg`, `csm_Vegas_Urban_Brown_Metallic_Header_2560x1250_b7a6423bef.jpg` — hero carousel slides 2–4
- `Kuechenheld Lichterfelde -HEJM-4499.jpg`, `GS8A83612.jpg` — Kundenerfahrungen slider slides 1–2
- `pasted-1786635089801-0.png` — So funktioniert full-bleed photo
- `shape-kitchenette.svg`, `shape-l-form.svg`, `shape-u.svg`, `shape-island.svg` — the four kitchen-form icons in the questionnaire (104×80)
Icons: inline SVG only (4 social marks). No icon font, no illustration. Font: Figtree variable via fontsource CDN — self-host in production.

## Files
- `Kuechenheld Homepage v3.dc.html` — the design reference (all sections, motion, responsive rules)
- `uploads/` — user-supplied photography and the four kitchen-form SVG icons used by the reference
- `support.js` — the reference's template runtime; needed only to open the HTML locally, **not** to be ported
