---
name: design-engineering
description: >-
  Implements and polishes UI as a design engineer for this contact-app POC.
  Reuses the slate/teal-800 system, AppShell, GeoPicker, StatCard, and
  src/components/ui.js classes. Use when changing layout, styling, Tailwind,
  forms, empty/error/success states, spacing, typography, responsive behavior,
  visual polish, or when the user mentions design, screen, look, or UX.
---

# Design engineering

Ship UI that looks like the screens already in this repo. Do not invent a second visual language.

Read [visual-system.md](visual-system.md) before adding or restyling a screen.

Also follow `rule/ui.md` and `rule/components.md`.

## Workflow

1. **Match, then change.** Open the nearest existing page (`src/app/page.js`, a form page, a list page) and copy its header, card, list, and button patterns. Diff new classes against those files.
2. **Reuse primitives.** `btnPrimary`, `btnGhost`, `inputClass`, `labelClass` from `@/components/ui`. `GeoPicker` for geography. `StatCard` for counts. Do not duplicate those class strings.
3. **Chrome vs data.** User-visible chrome goes through `t("key")` from `useStore()`. Add the same key in `src/i18n/en.js`, `hi.js`, and `te.js`. Do not translate stored names, notes, messages, designation IDs, or area names.
4. **Implement the smallest structure.** One page column. Labels above fields. Primary action last. Secondary as `btnGhost` or a text link.
5. **Verify in the browser** before calling the work done (see below). If something looks off, fix it and re-check.

## Layout rules

- Page wrap: `mx-auto max-w-5xl space-y-6` (staff lists/dashboard) or `mx-auto max-w-2xl` / `max-w-lg` (forms and public success).
- Page title: `h1` with `text-2xl font-semibold`. Lead: `mt-1 text-sm text-slate-600`.
- Cards and list shells: `rounded-xl border border-slate-200 bg-white`. Padding `p-4`. Stat cards may use `shadow-sm`.
- Lists: stacked rows with a hairline (`border-t border-slate-100`) or one card containing items. Empty list: one short sentence, not an empty card.
- Errors: `text-sm text-red-700` next to the form, not a toast library.
- Success (public submit): `rounded-xl border border-teal-200 bg-teal-50 p-6` with `text-teal-950` / `text-teal-900`.
- Notices / blocked public route: amber `border-amber-200 bg-amber-50`.
- Phone first. Default classes fit a narrow screen. From `md`, show the dark sidebar (`bg-slate-900`) and hide chips (`md:hidden`).
- Shell: sticky white header plus chips (`sticky top-0 z-10`). Active chip and sidebar link use `bg-teal-800 text-white`. Language pills and staff/public pills stay in the header.
- Change `AppShell` only when the task is layout or nav. Keep `STAFF_NAV`, `PUBLIC_NAV`, and `isPublicAllowed`. Do not add a drawer.

## Interaction and states

Every new or changed surface must have:

- Default (with sample data)
- Empty
- Error (invalid phone, missing area)
- Disabled (GeoPicker rural/urban until assembly is set)
- Staff vs public, if the route exists in both worlds

Pill buttons (language, role): selected `bg-teal-800 text-white`; idle `border border-slate-300 text-slate-600`; shape `rounded-full px-3 py-1 text-xs`.

Links that look like cards: `hover:border-teal-700`.

Do not add hover/focus libraries, animation packages, or new color tokens. Tailwind utilities only.

## Typography and overflow

Hindi and Telugu run longer than English. Prefer wrapping over truncation.

- Sidebar labels and header pills already `flex-wrap`. Keep that.
- Do not fix widths that clip Devanagari or Telugu.
- Native file inputs stay in the browser language; do not fake a custom file button unless the task asks for it.

## Browser verification

Use the IDE browser when available. A screenshot of the happy path is not enough.

1. Exercise the changed flow (click, type, submit, navigate).
2. Check **staff** and **public** if the shell, nav, or shared components changed.
3. Switch **English → Hindi** (and Telugu if copy or layout width changed). Confirm chrome translates and layout does not overflow.
4. At a narrow viewport (~375px): sticky chips, active chip color, page title. Then at `md` (~1280px): sidebar on, chips off.
5. Confirm other pages that share the same card/form/GeoPicker still look consistent.

## Do not

- Add npm packages for icons, animation, or CSS-in-JS.
- Introduce a new primary color, gradient, or large radius (`rounded-3xl`, glass, shadows beyond `shadow-sm` on stat cards).
- Put geography UI anywhere except `GeoPicker`.
- Hard-code English strings in new UI chrome.
- Leave a blank white card when a list has zero items.
- Change `html lang` except through the existing AppShell `useEffect`.
