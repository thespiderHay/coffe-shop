# Style Guide — Coffee Shop

This system was built from the reference in `docs/design/references/1.jpg`
(a "Caffeine" template: near-black serif hero, cream body, terracotta
best-seller block, tilted photo cards, dark footer). We kept that
direction's temperature and structure — warm palette, bold serif display,
dark hero, generous product photography — but built our own vocabulary on
top of it instead of reproducing the template. Everything below is
grounded in one idea: **the site's design language should read like the
physical language of coffee roasting**, not a generic warm palette applied
to a generic layout.

Stack: Next.js 16 (App Router) + Tailwind CSS v4 (CSS-first `@theme`) +
TypeScript. Tokens live in `docs/design/tokens.css` and are meant to be
imported directly — see the header comment in that file for the one-line
wiring into `app/globals.css`.

## 1. Concept

A small-batch roaster and café site, not a chain. The person landing on
this page cares about origin, roast level, and craft — they've had bad
"gourmet" coffee before and can tell the difference. The page's job is to
make the coffee legible as *made*, not just sold: show the roast, name the
process, let the product photography do the convincing.

## 2. Palette — the Roast Scale

Six hexes, each named for a stage of roasting a bean, not for its UI role.
Naming the palette this way keeps every color decision traceable to the
subject instead of to "primary/secondary/accent" abstractions.

| Name | Hex | Role | Notes |
|---|---|---|---|
| Green Bean | `#7C8363` | Freshness accent | Unroasted bean color. Used **only** for "fresh," "in stock," "organic/eco" cues — a "new arrival" dot, a sustainability note. If it shows up more than once per screen, it's overused. |
| Crema | `#F3E9D8` | Base surface | The site's primary background — warm, slightly pink-toned off-white, like foam on espresso. Replaces a flat white/gray canvas. |
| Light Roast | `#D9B98C` | Secondary surface | Alternating section tint, card backgrounds on the crema base. |
| Medium Roast | `#B4622D` | Primary accent | CTAs, links, active nav state, price highlights. This is the brand color — burnt caramel, not a generic terracotta. |
| Dark Roast | `#2B1B14` | Ink / dark surface | Body text on light surfaces, and the header/hero/footer dark background. A warm near-black, not `#000` or `#171717` — always has brown in it. |
| Crema Gold | `#C99A3C` | Hairline accent | The pour-line divider, star ratings, focus rings, thin rules. Never used as a fill for large areas — it's a line weight, not a background. |

Semantic aliases (`--color-surface`, `--color-accent`, `--color-ink`,
etc.) map onto these six in `tokens.css`. **Components should reference
the semantic name, not the roast-scale name** — that indirection is what
lets the palette evolve without a find-and-replace across every component.

Contrast checked: Dark Roast on Crema is ~13:1 (AAA). Ink-inverse (Crema)
on Dark Roast is the same pair reversed. Medium Roast on Crema is ~4.6:1 —
fine for large text (18px+/bold) and icons, but body-sized Medium-Roast-on-Crema
text should not be used for anything below `--text-md`.

## 3. Type

| Role | Family | Used for |
|---|---|---|
| Display | **Fraunces** | Hero headline, section headings only. A warm, slightly organic serif with soft ink-traps — reads as crafted, not corporate, and is distinct from the generic high-contrast Didone (Playfair-style) serif the reference template used. Set tight (`line-height` 1.0–1.15), never for body text. |
| Body | **Karla** | Paragraphs, nav, buttons, form labels. A humanist sans with rounded terminals — friendlier and less ubiquitous than Inter, still highly legible at small sizes. |
| Utility / mono | **IBM Plex Mono** | Prices, weights (`12oz`, `250g`), roast dates, order numbers. This is the detail that makes the UI feel like a coffee bag label — anything that would be printed or stamped uses mono, everything conversational uses Karla. |

Load Fraunces and Karla via `next/font/google`; IBM Plex Mono the same
way. Fraunces should use its `opsz` (optical size) axis if loaded as a
variable font — heavier/tighter at display sizes.

### Scale

1.25 ratio (major third) from a 16px base. Full values in `tokens.css`
§4. In practice:

- **Hero** (`--text-hero`, 88px / 64px tablet / 40px mobile): Fraunces, one job per page.
- **H1** (`--text-h1`, 48px): page-level section titles ("Best Sellers," "Our Story").
- **H2** (`--text-h2`, 36px): subsection titles.
- **H3** (`--text-h3`, 22px): card titles (drink names).
- **Body** (16–18px): Karla, `line-height` 1.6.
- **Caption/mono** (14px): Karla for labels, IBM Plex Mono for values.

## 4. Layout & spacing

- Container max-width: 1280px, 24px gutter on mobile.
- Section rhythm: 96px vertical padding desktop, 56px mobile
  (`--section-y` / `--section-y-mobile`). Keep this consistent — the
  reference's sections felt uneven; a fixed rhythm is a deliberate fix.
  When paired with Tailwind's `.section` + `.cta` style class combos,
  double check specificity — a section's own padding utilities should
  always win over a nested component's margin, not fight it.
- Grid: 12-column, 24px gutter, standard CSS grid or Tailwind's grid
  utilities — no custom grid system needed.
- Alternate surface tint (Crema → Light Roast → Crema…) between sections
  instead of a hard color jump, so the terracotta "Best Sellers" block
  reads as one stop on a gradient of roast, not an unrelated color choice.

## 5. Signature element — the Pour Line

The one thing this page should be remembered for: section transitions are
marked by a thin **Crema Gold line that draws itself in on scroll**,
tracing a loose, hand-drawn arc — like the last thread of coffee falling
from a pour-over dripper — instead of a hard rule or a straight divider.

- Implementation: an inline SVG `<path>` per divider, `stroke-dasharray`
  set to the path length, animated `stroke-dashoffset` from full to 0 via
  an IntersectionObserver-triggered class, `--duration-slow` (700ms),
  `--ease-pour`.
- Used **once per section boundary**, never as decoration mid-section.
- Doubles as the underline treatment on the primary nav's active link and
  on hovered product-card titles, at a much shorter length — so the motif
  reappears at small scale without being repeated as a big gesture.
- Full spec in `components.md` §5.

This replaces the reference template's plain straight section edges and
gives the page exactly one moment of motion-as-metaphor instead of
scattered micro-animations.

## 6. Imagery

- Photography over illustration: pour shots, roast/bean macro shots,
  hands on the machine — the reference's instinct here was right, keep it.
- Frame product/story photography in a `--radius-lg` (16px) rounded
  rectangle with a `--shadow-warm-lg` shadow; a slight rotation
  (2–4°, alternating direction) is permitted on secondary story images
  only, never on primary product shots or the hero.
- No stock-photo gloss — prefer shots with visible steam, texture, or a
  human hand in frame over a sterile studio product shot.

## 7. Motion principles

- One orchestrated moment (the pour-line draw-in) beats scattered hover
  effects. Resist adding a second "signature" animation.
- Card hover: `--duration-fast` (150ms) lift (`translateY(-4px)`) +
  `--shadow-warm-md` → `--shadow-warm-lg`. Nothing more.
- All motion respects `prefers-reduced-motion: reduce` — pour-lines render
  fully drawn (no animation), hover lifts remain (they're not vestibular
  triggers) but transition instantly.

## 8. Voice & writing

- Say what the drink is, not what the brand feels about it. "Espresso,
  pulled to order, 18g double shot" beats "Experience the rich and bold
  flavors of our exquisite blends."
- Buttons name the action and keep that name through the flow: "Add to
  order" → cart confirmation says "Added," not "Success."
- Roast/origin facts go in mono (utility voice); everything persuasive
  goes in Karla (conversational voice). Don't mix the two jobs in one
  string.
- No filler adjectives ("exquisite," "perfect," "amazing") — let the
  specific fact (origin, process, roast date) carry the persuasion.

## 9. Accessibility floor

- All interactive elements get a visible focus ring using
  `--color-focus-ring` (Crema Gold), 2px offset — never remove `:focus`
  outlines without replacing them.
- Text contrast meets WCAG AA at minimum (see §2 contrast notes); body
  copy uses Dark Roast on Crema/Light Roast, never Medium Roast.
- Motion respects `prefers-reduced-motion` (see §7).
- Touch targets ≥ 44×44px for nav, buttons, and card CTAs.
- Responsive down to 360px width; hero type scales via the `--text-hero`
  → `--text-4xl` → mobile clamp described in `components.md`.
