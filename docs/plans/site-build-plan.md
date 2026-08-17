# The Spider — 3-page coffee shop site

## Context

`app/` is still the untouched `create-next-app` scaffold. A design system
(`docs/design/{style-guide.md,tokens.css,components.md}`) and a 20-item
menu CSV (`docs/menu-item.csv`) already exist from earlier work, but
nothing has been built against them yet — no routes beyond the default
`/`, no `components/`/`lib/`/`types/`/`data/` directories, no fonts wired
in, no photography in `public/`.

The ask: a 3-page site (Home, About, Menu) for "The Spider," a cosy
neighbourhood specialty-coffee shop in Riyadh, with a reservation-modal
booking flow and real Pexels photography. Two scope decisions are already
made:
- **Images**: a curated set (~9 photos: hero, 4 category photos, 1–2
  about/interior, 2 event) reused across items in the same category,
  rather than 20 unique item photos.
- **Reservations**: a Next.js route handler that appends to a local JSON
  file — explicitly a throwaway "backend comes later" placeholder, not
  real persistence (see caveat in §6).

This plan builds the whole site against the existing design system as
written, with one small, deliberate addition to it (an error-state color
token that the docs anticipated but didn't define).

## File/folder structure

```
app/
  layout.tsx            # fonts (Fraunces/Karla/IBM Plex Mono) + <Header>/<Footer>
  globals.css            # imports tokens.css, overrides font vars, body base styles
  page.tsx                # Home
  about/page.tsx
  menu/page.tsx
  api/reserve/route.ts
lib/
  csv.ts                 # dependency-free CSV parser
  menu.ts                 # reads docs/menu-item.csv, groups/filters — server-only
  events.ts               # recurring event defs + next-occurrence computation
  validation.ts            # shared client+server reservation validation rules
components/
  Section.tsx              # .section/.container wrapper (components.md §9)
  Header.tsx
  Footer.tsx
  PourLine.tsx              # signature divider, components.md §5, verbatim approach
  Button.tsx                 # Primary/Secondary/Ghost, components.md §1
  Badge.tsx                   # roast chip / Popular / House Favorite / Fresh, §4
  MenuCard.tsx                  # product/menu card, §3 (Order button intentionally omitted — see §5 below)
  EventCard.tsx
  ReserveTable.tsx                # trigger button + native <dialog> form
types/
  menu.ts
  events.ts
  reservation.ts
data/                              # gitignored, created at runtime by the API route
  reservations.json
public/
  images/
    hero.jpg
    category-espresso.jpg
    category-pastries.jpg
    category-sandwiches.jpg
    category-cold-drinks.jpg
    about-interior.jpg               # NOT a literal "founder portrait" — see §7
    event-open-mic.jpg
    event-coffee-tasting.jpg
```

## 1. Design-system addition: an error token

`components.md` §7 anticipates an error state for form inputs but says
"use a dedicated error red if one is ever needed; do not overload Medium
Roast" — no such token exists yet in `tokens.css`. Add one alongside the
other semantic aliases in `docs/design/tokens.css` §2 (and its `@theme
inline` mapping), since the reservation form needs it and nothing should
invent a raw hex ad hoc:

```css
--color-error: #B3261E;
--color-error-bg: #F7E4E1;
```

This is the only edit to the design docs this build makes.

## 2. Wire the design system in

- `app/globals.css`:
  ```css
  @import "tailwindcss";
  @import "../docs/design/tokens.css";

  :root {
    --font-display: var(--font-fraunces), "Fraunces", "Iowan Old Style", "Palatino Linotype", Georgia, serif;
    --font-sans:    var(--font-karla), "Karla", "Segoe UI", system-ui, sans-serif;
    --font-mono:    var(--font-plex-mono), "IBM Plex Mono", "SFMono-Regular", ui-monospace, monospace;
  }

  body {
    background: var(--color-surface);
    color: var(--color-ink);
    font-family: var(--font-sans);
  }
  ```
  This `:root` block comes after the `tokens.css` import, so at equal
  specificity it wins for these three properties — `tokens.css` itself
  stays untouched (the design-coffe-review agent's boundary), and its
  static font stacks become the trailing fallback behind the real
  next/font variable. `tokens.css` already uses `@theme inline`, which is
  what lets Tailwind re-resolve `font-display`/`font-sans`/`font-mono`
  utilities to this final cascaded value.

- `app/layout.tsx`: load fonts via `next/font/google` and apply their
  `.variable` classes on `<html>`, replacing the current Geist setup:
  ```ts
  const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces', axes: ['opsz'] });
  const karla = Karla({ subsets: ['latin'], variable: '--font-karla' });
  const plexMono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-plex-mono' });
  ```
  Update `metadata` (title "The Spider — Specialty Coffee in Riyadh").
  Wrap `children` with `<Header />` and `<Footer />`.

- `components/Section.tsx`: encodes `.section` (vertical rhythm,
  `--section-y`/`--section-y-mobile`) and `.container` (`--container-max`,
  horizontal padding) as one component so no page hand-rolls the
  specificity trap `components.md` §9 warns about.

Verify at this point with `npm run dev` that `bg-accent`, `font-display`,
`shadow-warm-md` etc. actually resolve, before any real content exists —
cheapest point to catch a token-wiring mistake.

## 3. Data layer

**`lib/csv.ts`** — quoted-comma-aware parser (matches the CSV's actual
shape; no escaped-quote or embedded-newline handling needed):
```ts
function parseCsvLine(line: string): string[] { /* toggle inQuotes on '"', split on ',' when not in quotes */ }
export function parseCsv(content: string): Record<string, string>[] { /* header row -> keyed rows */ }
```

**`types/menu.ts`**:
```ts
export type MenuCategory = 'Espresso Drinks' | 'Pastries' | 'Sandwiches' | 'Cold Drinks';
export type MenuBadge = 'Popular' | 'House Favorite' | null;
export interface MenuItem { category: MenuCategory; name: string; description: string; price: number; badge: MenuBadge; }
```

**`lib/menu.ts`** — `fs.readFileSync(path.join(process.cwd(), 'docs/menu-item.csv'))`
+ `parseCsv`. **Server-only** — a comment at the top says so; only import
this from Server Components (Home, Menu page), never from a `'use client'`
file. Exposes:
- `MENU_CATEGORY_ORDER` — `['Espresso Drinks', 'Pastries', 'Sandwiches', 'Cold Drinks']`
- `getAllMenuItems(): MenuItem[]`
- `getMenuByCategory(): Record<MenuCategory, MenuItem[]>` (preserves CSV row order within each category)
- `getPopularItems(): MenuItem[]` — `badge === 'Popular'` only (exactly 4,
  one per category — the clean, literal reading of "most popular" for a
  homepage features grid; `House Favorite` is a different claim and stays
  a menu-page-only badge, not blended into "popular")

**`types/events.ts` / `lib/events.ts`** — Riyadh is fixed UTC+3, no DST,
but "now" must be computed as Riyadh sees it, not the server's local time
(Vercel/Node runs in UTC):
```ts
export interface RecurringEvent { id: string; title: string; description: string; dayOfWeek: number; startHour: number; startMinute: number; }
export const RIYADH_TZ = 'Asia/Riyadh';
export const EVENTS: RecurringEvent[] = [
  { id: 'open-mic', title: 'Open Mic Night', dayOfWeek: 5, startHour: 19, startMinute: 0, description: '...' },
  { id: 'coffee-tasting', title: 'Coffee Tasting', dayOfWeek: 6, startHour: 10, startMinute: 0, description: '...' },
];
```
`getNextOccurrence(event, from = new Date())`:
1. Extract Riyadh's current `{year, month, day, weekday, hour, minute}` via
   `Intl.DateTimeFormat('en-CA', { timeZone: RIYADH_TZ, ...}).formatToParts(from)`
   — don't hand-roll UTC+3 offset math on `from`.
2. `diffDays = (event.dayOfWeek - currentWeekdayIndex + 7) % 7`.
3. Candidate instant: `Date.UTC(year, month-1, day + diffDays, event.startHour - 3, event.startMinute)`.
4. If `diffDays === 0` and that instant already passed, add 7 days and recompute.
5. Format the result back through `Intl.DateTimeFormat(..., { timeZone: RIYADH_TZ, weekday:'long', month:'long', day:'numeric', hour:'numeric', minute:'2-digit' })` for display.

`getUpcomingEvents()` maps both events through this, sorted by date. Do
this only in Server Components (Home) — no client-side Date math, avoids
server/client "now" hydration mismatches. Calling `new Date()` in a Server
Component makes that render dynamic rather than statically prerendered —
expected and fine at this scale, no config needed.

## 4. Shared components

Build and sanity-check in isolation before wiring into pages:
- `Button.tsx`, `Badge.tsx` — straight from `components.md` §1/§4.
- `PourLine.tsx` — the literal `<svg><path>` + IntersectionObserver
  `.is-visible` + `prefers-reduced-motion` fallback given verbatim in
  `components.md` §5. Verify the reduced-motion fallback actually renders
  fully-drawn (toggle the OS setting) before reusing it three times.
- `Header.tsx` — sticky, dark surface-inverse, per §2. Its always-visible
  CTA slot is `<ReserveTable variant="nav" />` (see §5) rather than an
  "Order now" button — there's no ordering system, so the CTA is
  repurposed to the one real conversion action this site has, and it's
  reachable from every page this way, not just the Home hero.
- `Footer.tsx` — per §8, Pour Line above it like any other section boundary.
- `MenuCard.tsx`, `EventCard.tsx` — per §3/EventCard has no direct spec,
  follow the same photo+title+mono-detail+description shape as MenuCard.

## 5. Reservation flow

**`types/reservation.ts`**: `ReservationInput { name; partySize; date; time }`,
`Reservation extends ReservationInput { id; createdAt }`.

**`lib/validation.ts`** (shared by client and route, so rules never
drift): name trimmed, min 2 chars; partySize integer 1–12; date matches
`YYYY-MM-DD` and is not in the past (compare against Riyadh "today" via
the `events.ts` timezone helper); time matches `HH:MM`. Returns
`{ valid: true, data } | { valid: false, errors: string[] }`.

**`ReserveTable.tsx`** (client component, mounted at nav CTA and Home hero
CTA — two instances, each with independent local state, no shared
context needed):
- Native `<dialog>`, always mounted closed (never conditionally rendered
  — avoids SSR/hydration mismatch). Drive it from a `useEffect` on
  `isOpen` calling `dialogRef.current.showModal()` / `.close()` —
  `showModal()` is what actually gives the top-layer render, real
  `::backdrop`, focus trap, and focus-restore-on-close; setting `open` via
  React alone does not.
- Escape-to-close and focus trap are free. Backdrop-click-to-close needs
  an explicit `onClick` that only closes when `e.target === dialogRef.current`.
- `aria-labelledby` on the form heading; autofocus the name field.
- Styling: `background: var(--color-surface); border-radius: var(--radius-lg); box-shadow: var(--shadow-warm-lg); padding: 2.5rem;` and `::backdrop { background: rgb(43 27 20 / 0.6); }`.
- Fields per `components.md` §7 (48px height, `--radius-sm`, border
  `--color-border` → `--color-accent` on focus + `--color-focus-ring`):
  name (text), party size (number, min 1/max 12), date (`type="date"`,
  `min` = Riyadh-today), time (`type="time"`).
- States: `idle | submitting | success | error`. POST JSON to
  `/api/reserve`. Errors render with the new `--color-error`/`--color-error-bg`
  tokens (never Medium Roast). Success replaces the form with a
  confirmation message and an explicit "Close" button (no auto-close).

**`app/api/reserve/route.ts`**:
```ts
export async function POST(request: Request) {
  // unparseable JSON -> 400
  // lib/validation.ts failure -> 422 { errors: string[] }
  // fs.mkdir(dataDir, { recursive: true }); read-or-init data/reservations.json; push { ...data, id: crypto.randomUUID(), createdAt }; write
  // fs write throws -> 500 generic message
  // success -> 201 { id }
}
```
A comment at the top of this file states the persistence caveat plainly:
`fs`-based writes only work on a long-lived Node process (local dev,
`next start` on a traditional host). On Vercel's default serverless
functions the filesystem outside `/tmp` is read-only and `/tmp` isn't
durable across invocations — this log will not actually persist there.
That's an accepted, deliberate "backend comes later" tradeoff, not a bug
to rediscover during a future deploy.

Add `/data/` to `.gitignore` before this route ever runs, so generated
reservation data with real names/dates never gets committed.

`MenuCard.tsx` intentionally has no per-item CTA (the documented spec
includes an "Order" button, but there's no cart/ordering system to send
it to) — a short comment in the file notes this as a deliberate deviation
from `components.md` §3.

## 6. Pages

Build with gray placeholder image boxes first, wire real photos in §7.

**Home** (`app/page.tsx`, Server Component):
1. Hero — full-bleed background image, dark-roast gradient overlay for
   text legibility, Fraunces headline + Karla subhead evocative of a
   cosy Riyadh neighbourhood spot (not generic "exquisite blends" copy —
   plain, specific, warm), primary CTA `<ReserveTable variant="hero" />`,
   secondary "View the menu" link to `/menu`.
2. "Popular right now" — grid of `getPopularItems()` (4 items, one per
   category) via `MenuCard`.
3. "This week" — `getUpcomingEvents()` via `EventCard`, showing the real
   next Friday/Saturday dates.
4. Closing CTA band before the footer.
5. `PourLine` between each section boundary, once each — no mid-section decoration.

**About** (`app/about/page.tsx`, static Server Component): founders'
story — invented but specific, not generic "we love coffee" copy. Two
founders (fictional), a concrete reason for the name "The Spider" (tied
to something real and warm about the original space, not a generic
naming device), and an actual timeline (training → returning to Riyadh →
opening the first small space → today) — a real chronology, so dated
markers are legitimate here per the style guide's "numbered markers only
when order carries real information" rule. Framed image per §6 imagery
rules (`--radius-lg`, `--shadow-warm-lg`, slight rotation permitted since
this is secondary story imagery).

**Menu** (`app/menu/page.tsx`, Server Component): short intro line, then
one section per `MENU_CATEGORY_ORDER` category — heading, `PourLine`
between categories, grid of `MenuCard` for that category's items (all
sharing that category's one photo — intentional per the curated-image
decision, not a bug). Ends with one clear `<ReserveTable variant="cta" />`
band instead of per-item order buttons.

## 7. Images

Source via browser automation against Pexels during this phase (not
before — layout/typography get validated with placeholders first per §6).
Search terms per slot:
- Hero: a moody/warm coffee-shop or pour shot with enough negative space
  for overlaid text.
- `category-espresso.jpg`: latte art / espresso shot.
- `category-pastries.jpg`: croissant/pastry display.
- `category-sandwiches.jpg`: café sandwich or light lunch spread.
- `category-cold-drinks.jpg`: iced coffee.
- `about-interior.jpg`: shop interior, hands roasting/cupping, or a
  candid coffee-shop moment — **not** a posed two-person "portrait" style
  photo captioned as if it's literally Sara and Yousef. The founders are
  invented; the photo shouldn't imply it's a real photograph of them.
- `event-open-mic.jpg`: acoustic performance / small cafe stage.
- `event-coffee-tasting.jpg`: coffee cupping/tasting session.

Download directly into `public/images/` (no `next.config.ts` remote
pattern needed — everything is local). Render via `next/image`: `fill`
inside aspect-ratio-constrained wrappers for card/photo slots (matches
the 16:9/4:5 framing in the design docs without hardcoding each source
file's exact pixel dimensions), `priority` on the hero image only (LCP).

## Verification

1. `npm run lint` and `npm run build` — confirm strict TypeScript passes
   and, specifically, that `lib/menu.ts`'s `fs` usage never leaks into a
   client bundle (a bloated/broken client chunk is the tell if it does).
2. `npm run dev` manual walkthrough of all three routes at ~360px,
   tablet, and desktop widths.
3. Keyboard-only pass through the header nav and the reservation dialog
   (tab order, Escape, focus trap, focus restored to the trigger on close).
4. Toggle OS `prefers-reduced-motion` and confirm Pour Lines render fully
   drawn with no animation.
5. Full reservation loop: submit valid data, confirm `data/reservations.json`
   is created/appended; submit invalid data (empty name, past date),
   confirm 422 + inline errors render with the new error token.
6. Run the `design-coffe-review` subagent in review-and-fix mode as a
   final compliance pass, explicitly telling it two things are approved
   deviations and not findings: the header/hero CTA is "Reserve a table"
   instead of "Order now," and `MenuCard` has no per-item Order button.
