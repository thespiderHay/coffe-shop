# Component Specs — Coffee Shop

Reference `style-guide.md` for the rationale behind every token named
here. All values come from `tokens.css`; nothing below should use a raw
hex or px value that isn't already a token — if a component needs one,
add it to `tokens.css` first.

Tailwind utility classes are given alongside each spec since the tokens
are wired into `@theme`, e.g. `bg-accent` resolves to Medium Roast.

---

## 1. Button

Three variants. Square-ish corners (`--radius-sm`, 4px) on purpose — the
brand's printed-label feel extends to controls, so buttons don't get the
generic "pill" rounding.

| Variant | Background | Text | Border | Use for |
|---|---|---|---|---|
| Primary | `--color-accent` (Medium Roast) | `--color-ink-inverse` (Crema) | none | One per view: "Order now," "Add to order" |
| Secondary | transparent | `--color-ink-inverse` or `--color-ink` (context-dependent) | 1px `--color-border-inverse` or `--color-border` | "Explore menu," secondary actions |
| Ghost | transparent | `--color-accent` | none, underline on hover | Inline text-level actions, "View all" |

States:

- **Default** — as above.
- **Hover** — Primary: background → `--color-accent-hover`. Secondary/Ghost: text underline appears using a short Pour Line stroke (`--color-accent-line`, 1.5px, animates in over `--duration-fast`).
- **Active/pressed** — `translateY(1px)`, no shadow change.
- **Focus-visible** — 2px outline `--color-focus-ring`, 2px offset. Never suppressed.
- **Disabled** — 40% opacity, no hover/active transitions, `cursor: not-allowed`.

Sizing: padding `0.75rem 1.5rem` (md, default), `0.5rem 1.125rem` (sm, used only in nav/inline contexts). Min height 44px at default size for touch targets.

Typography: Karla, 16px, weight 600, letter-spacing 0.01em, no uppercase transform (the reference template uppercased CTA text — we keep sentence case, it reads calmer and matches the voice guidelines).

```
[ Order now → ]     primary, bg-accent text-ink-inverse
( Explore menu )    secondary, border border-inverse
  View all →         ghost, text-accent, underline-on-hover
```

---

## 2. Navigation header

Sticky, `--color-surface-inverse` (Dark Roast) background, `--color-ink-inverse` text — matches the reference's dark header but the logotype uses Fraunces instead of a generic display sans.

- Height: 80px desktop / 64px mobile.
- Logo: Fraunces, `--text-h3` (22px), weight 600, `--color-ink-inverse`.
- Links: Karla, 15px, weight 500, `--color-ink-muted-inverse` default → `--color-ink-inverse` on hover/active.
- Active link: underlined with a short static Pour Line stroke (2px `--color-accent-line`), not a background pill.
- Mobile: links collapse behind a hamburger; menu panel slides down using `--duration-base` / `--ease-standard`, background `--color-surface-inverse`, full-width tap targets ≥ 44px tall.
- CTA button in nav (e.g. "Order now") is the Primary button at `sm` size, right-aligned, always visible (not hidden behind the mobile menu).

---

## 3. Product / menu card

The core content unit for "Best Sellers" / menu grids. Differentiates
from the reference by tagging **roast level** as a first-class visual
element (a colored dot from the Roast Scale) instead of a plain text
category label.

```
┌───────────────────────────┐
│                           │
│      [ product photo ]    │  16:9 or 4:5, radius-lg, shadow-warm-sm
│                           │
├───────────────────────────┤
│  ● Medium roast            │  roast dot (--color-medium-roast) + label, text-sm, ink-muted
│  Cappuccino          H3    │  Fraunces, text-h3
│  Espresso, steamed milk    │  Karla, text-sm, ink-muted
│                           │
│  $4.50            [Order] │  price in font-mono text-md, button = Primary sm
└───────────────────────────┘
```

- Card surface: `--color-surface` (or `--color-surface-alt` if placed on a crema section — always contrast with its parent section).
- Radius: `--radius-md` (8px) on the card, `--radius-lg` (16px) on the inner photo.
- Shadow: `--shadow-warm-sm` at rest → `--shadow-warm-md` on hover.
- Hover: `translateY(-4px)`, `--duration-fast`, `--ease-standard`. Card title gains the short Pour Line underline (same treatment as nav active state) instead of a color change — keeps the motif consistent.
- Roast dot: 8px circle, filled with the matching Roast Scale color (Light/Medium/Dark Roast) — this is the one place all three roast-scale hexes are visible together, functioning as a literal legend.
- Price: IBM Plex Mono, `--text-md`, `--color-ink`. Never Karla — this is the one voice rule that must hold everywhere prices appear.

---

## 4. Badge / roast-level chip

Used standalone in filters ("All / Light / Medium / Dark / Espresso") and
as the small dot inside product cards.

- Shape: `--radius-pill` — the one place full rounding is used, deliberately, to distinguish "filter/tag" affordances from "button" affordances.
- Default: `--color-surface-alt` background, `--color-ink` text, `--color-border`.
- Selected/active: `--color-accent` background, `--color-ink-inverse` text, no border.
- Padding: `0.375rem 1rem`. Text: Karla, 14px, weight 500.
- The "Fresh" / "New" badge is the one place `--color-fresh` (Green Bean) appears as a fill — pill shape, `--color-ink-inverse` text, used at most once per card.

---

## 5. Pour Line divider (signature element)

```html
<div class="pour-divider" aria-hidden="true">
  <svg viewBox="0 0 1280 60" preserveAspectRatio="none">
    <path d="M0,30 C 320,10 640,50 960,25 S 1280,30 1280,30"
          class="pour-line" />
  </svg>
</div>
```

```css
.pour-line {
  fill: none;
  stroke: var(--color-accent-line);
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-dasharray: var(--path-length); /* set via JS: path.getTotalLength() */
  stroke-dashoffset: var(--path-length);
  transition: stroke-dashoffset var(--duration-slow) var(--ease-pour);
}
.pour-line.is-visible {
  stroke-dashoffset: 0;
}
@media (prefers-reduced-motion: reduce) {
  .pour-line {
    stroke-dashoffset: 0;
    transition: none;
  }
}
```

- Trigger: IntersectionObserver adds `.is-visible` when the divider enters
  the viewport (threshold ~0.4), once — do not re-trigger on scroll-back.
- Placement: centered between sections, ~60px tall band, full container
  width. Exactly one per section boundary — see style-guide.md §5 for the
  restraint rule.
- Small-scale reuse: the same path shape (not the same `<svg>`) is used at
  ~40px width as the underline for active nav links and hovered card
  titles, static (no dash animation) at that size — a 1.5px stroke.

---

## 6. Testimonial card

- Background: `--color-surface-inverse` (Dark Roast) — the one place a
  dark card sits on a light section, for contrast/emphasis, matching the
  reference's instinct to spotlight a quote.
- Quote: Fraunces, `--text-h3` (22px), `--color-ink-inverse`, `line-height` 1.4 — display face used for a body-length quote is the one intentional exception to "display for headlines only," because it's short and functions as a pull-quote.
- Attribution: Karla, 14px, weight 600, `--color-accent-line` (Crema Gold) — not plain white, so it reads as a signature/name.
- Star rating: 5 small marks using `--color-accent-line`, not a generic yellow.
- Radius: `--radius-md`. Padding: 2.5rem.

---

## 7. Form input (newsletter / order form)

- Background: `--color-surface`. Border: 1px `--color-border` default →
  `--color-accent` on focus, plus the standard focus ring.
- Radius: `--radius-sm` (matches buttons — inputs and buttons share the
  "printed label" corner treatment, cards and photos get the softer one).
- Placeholder text: `--color-ink-muted`, Karla, 15px.
- Paired submit button: Primary variant, same height as the input (48px),
  attached with no gap on desktop, stacked with 12px gap on mobile.
- Error state: border → `#B4622D`-adjacent but distinct — use a dedicated
  error red if one is ever needed; do not overload Medium Roast as an
  error color since it's already the primary accent.

---

## 8. Footer

- Background: `--color-surface-inverse`, text `--color-ink-inverse` /
  `--color-ink-muted-inverse` for secondary lines — same dark treatment as
  the header, bookending the page.
- Logotype repeats the nav treatment (Fraunces, `--text-h3`).
- Body/contact text: Karla, 15px. Address/phone values that are literal
  data (phone number, hours) may use `font-mono` at 14px for the same
  "label" reason prices do.
- Divider from the section above it uses the full-width Pour Line, same
  as any other section boundary — the footer is not a special case.

---

## 9. Section container

```css
.section {
  padding-block: var(--section-y-mobile);
  padding-inline: var(--container-padding);
}
@media (min-width: 768px) {
  .section { padding-block: var(--section-y); }
}
.section > .container {
  max-width: var(--container-max);
  margin-inline: auto;
}
```

Keep `.section` responsible for vertical rhythm only, and `.container`
responsible for horizontal max-width only — don't let a child component's
own margin fight `.section`'s padding (a `.cta` block inside `.section`
should never set its own `margin-block`; use gap/flow spacing from the
parent instead). This is the specificity trap called out in
`style-guide.md` §4 — keep the two selectors' jobs from overlapping.
