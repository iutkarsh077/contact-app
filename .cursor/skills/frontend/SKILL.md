---
name: frontend
description: >-
  Implements, reviews, and polishes frontend UI for this contact-app POC
  (Next.js App Router, React, Tailwind, JavaScript). Use when building or
  changing pages, components, layout, AppShell, forms, lists, dashboards,
  accessibility, responsive behavior, hydration, or performance; or when the
  user mentions frontend, UI, UX, screen, or layout.
---

# Frontend

Sources from [skills.sh](https://skills.sh/):

- [anthropics/skills frontend-design](https://skills.sh/anthropics/skills/frontend-design) — craft, restraint, critique
- [vercel-labs/agent-skills web-design-guidelines](https://skills.sh/vercel-labs/agent-skills/web-design-guidelines) — a11y, forms, focus, overflow
- [vercel-labs/agent-skills vercel-react-best-practices](https://skills.sh/vercel-labs/agent-skills/vercel-react-best-practices) — React/Next performance

This repo already has a visual language. Do **not** invent a new aesthetic. For tokens, cards, and chrome, also read [design-engineering](../design-engineering/SKILL.md) and [visual-system.md](../design-engineering/visual-system.md). Follow `rule/ui.md`, `rule/components.md`, `rule/pages.md`, `rule/javascript.md`.

## Subject

Constituency contact desk for an MLA office in India. Staff and public. Phone first. Hindi and Telugu must wrap, not clip. Data is localStorage via `src/lib/store.js`. No extra npm packages unless React, Next.js, or the browser cannot do the job. JavaScript (`.js`) only. Import with `@/`.

## Workflow

1. Open the nearest existing page (`src/app/page.js`, a list, a form) and copy structure.
2. Reuse `btnPrimary`, `btnGhost`, `inputClass`, `labelClass` from `@/components/ui`. `GeoPicker` for geography. `StatCard` for counts.
3. Chrome copy through `t("key")`. Add the same key in `src/i18n/en.js`, `hi.js`, and `te.js`.
4. Change `AppShell` only for layout or nav. Keep `STAFF_NAV`, `PUBLIC_NAV`, `isPublicAllowed`. Do not add a drawer.
5. Critique in the browser before calling the work done.

## Shell and layout

One shell. One `<main>`. Sticky, not fixed.

```jsx
<aside className="hidden sticky top-0 h-screen w-60 shrink-0 flex-col overflow-hidden bg-slate-900 text-slate-100 md:flex">
<div className="flex min-w-0 flex-1 flex-col">
  <div className="sticky top-0 z-10 bg-white">{/* header + phone chips */}</div>
  <main className="flex-1 p-4 pb-8 md:p-6">{children}</main>
</div>
```

- `AppProviders` wraps `<AppShell>{children}</AppShell>` only. Do not nest a second `<main>` with `mt-*` / `ml-*` to clear a fixed header or sidebar.
- A `fixed` sidebar does not take flex space. Content then centers in the **full viewport** and leaves a gap on the right (and can sit under the sidebar).
- Flex children that wrap text need `min-w-0`.
- Phone: chips `md:hidden`, `overflow-x-auto`. Desktop from `md`: sidebar on, chips off.
- Do not set `overflow-x-hidden` on `body` (clips native selects). Fix overflow at the overflowing node.

Page wrap:

| Surface | Wrap |
| --- | --- |
| Staff dashboard `/` | `w-full space-y-6` (fill the column next to the sidebar) |
| Other staff lists | `mx-auto max-w-5xl space-y-6` |
| Forms / public success | `mx-auto max-w-2xl` or `max-w-lg` |

Title: `h1` + `text-2xl font-semibold`. Lead: `mt-1 text-sm text-slate-600`.

## Craft (from frontend-design)

Spend boldness in one place. This product’s signature is already slate + teal-800 civic chrome — keep it.

- Structural devices (borders, labels, dividers) encode information; do not decorate empty hierarchy.
- Motion only on user action. No fade-and-slide on every card. Honor `prefers-reduced-motion`. Never `transition-all`.
- Copy is UI. Active voice. CTA names the action (`Save contact`, not `Submit`). Empty and error states say what to do next. Errors: `text-sm text-red-700` next to the field. No toast library.
- Hindi/Telugu run longer than English. Wrap. Do not fix widths that clip Devanagari or Telugu.

Do not introduce: new primary color, gradients, `rounded-3xl`, glass, icon/animation packages, a second typeface, or a second shell.

## React and Next (from vercel-react-best-practices)

This POC is mostly `"use client"` + `useStore()`. Do **not** add SWR, server actions, or new data libraries.

Apply these here:

- `rerender-no-inline-components` — never define a component inside a component except file-level helpers already used (`VisitList` in `page.js` is file-level; keep it that way).
- `rerender-derived-state-no-effect` — filter/count in render (`contacts.filter(...)`), not `useEffect` + `setState`.
- `rerender-lazy-state-init` — expensive `useState` initializers as functions.
- `client-localstorage-schema` — all persistence through `src/lib/store.js`. Do not read `localStorage` from pages.
- `js-set-map-lookups` — `inArea` / geo walks stay in `src/lib/geo.js`.
- `rendering-conditional-render` — prefer ternary over `&&` when the left side can be `0`.
- `rendering-hydration-no-flicker` — gate on `ready` from the store. Do not render `Date.now()` / `toLocaleString()` during SSR without a client effect (`todayISO` in `src/app/page.js`).
- `bundle-barrel-imports` — import from `@/components/ui`, `@/lib/store`, `@/lib/geo` as they exist; do not add new barrel files.
- Before new Next.js APIs, read `node_modules/next/dist/docs/`.
- `useSearchParams` needs `Suspense` (see `src/app/appointments/page.js`).

Skip Vercel rules that need new packages or a real backend (`client-swr-dedup`, `server-auth-actions`, `server-cache-lru`, virtualized list libraries). Seed data is small.

## Accessibility and UX (from web-design-guidelines)

On UI review, fetch latest rules from:

`https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md`

Always enforce in this app:

- Semantic HTML: one `h1` per page, `<main>` only in AppShell, `<nav>` for staff/public nav, `<button>` for actions, `<Link>` for routes.
- Labels wrap controls or sit above with `labelClass`. Phone fields: `inputMode="numeric"`.
- Visible focus already on `inputClass` (`focus:border-teal-700 focus:ring-2`). Do not add `outline-none` without a replacement. Use `focus-visible` for new controls.
- Icon-only or unnamed controls need `aria-label`.
- Sticky header must not cover focused fields (`scroll-margin-top` if you add in-page anchors).
- Empty lists: one short sentence, not a blank white card.
- Destructive store writes: `confirm()` first.
- Images / selfie: explicit size; decorative `alt=""`.
- `tabular-nums` on stat values when aligning numbers.

Audit output (terse, `file:line`):

```text
## src/app/page.js
src/app/page.js:57 - page wrap left a right-side gap under a fixed sidebar
```

## States every surface needs

- Default (seed data)
- Empty
- Error (invalid phone, missing area)
- Disabled (GeoPicker rural/urban until assembly is set)
- Staff vs public when the route exists in both worlds

## Browser verification

A screenshot of the happy path is not enough.

1. Exercise the flow: click, type, submit, navigate.
2. Staff and public if shell, nav, or shared components changed.
3. English → Hindi (Telugu if copy or width changed). Chrome translates; layout does not overflow.
4. ~375px: sticky chips, active `bg-teal-800`, page title. `md` (~1280px): sidebar on, chips off, **no empty strip** between content and the right edge of the header column (dashboard fills `w-full`; other staff pages may sit in `max-w-5xl`).
5. Shared cards / GeoPicker / forms still match.

## Do not

- Add a database, login server, SMS, cloud upload, or new npm UI kit.
- Compensate for a `fixed` sidebar with `ml-10` / `mt-16` on page content.
- Hard-code English chrome on new UI.
- Change `html lang` except through AppShell’s existing `useEffect`.
- Leave horizontal scroll except the phone chip row.
