# Design system

Built from the reference in `references/1.jpg`. Start with the style
guide for rationale, then tokens for implementation values, then
components for how they compose.

- [`style-guide.md`](./style-guide.md) — concept, palette (the Roast
  Scale), type, layout, the Pour Line signature element, imagery, motion,
  voice, accessibility floor.
- [`tokens.css`](./tokens.css) — the actual Tailwind v4 `@theme` tokens.
  Import it into `app/globals.css` (one-line instructions at the top of
  the file) to wire the system into the running app.
- [`components.md`](./components.md) — specs for button, nav, product
  card, badge/roast chip, the Pour Line divider, testimonial card, form
  input, footer, and section container, each with states and exact token
  references.

Stack: Next.js 16 (App Router), Tailwind CSS v4, TypeScript.
