# Visual system

Copy these recipes. Do not invent parallel ones.

## Color

| Role | Classes |
| --- | --- |
| Page background | `bg-slate-50` (shell). Body `--background: #f8fafc` |
| Text | `text-slate-900` body, `text-slate-600` lead, `text-slate-500` meta |
| Border | `border-slate-200` cards, `border-slate-300` inputs and idle pills |
| Primary | `bg-teal-800` / `hover:bg-teal-700` / `text-white` |
| Focus ring | `focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20` (already on `inputClass`) |
| Sidebar | `bg-slate-900 text-slate-100`; office kicker `text-teal-300`; idle nav `text-slate-300 hover:bg-slate-800`; active `bg-teal-800` |
| Warning | `border-amber-200 bg-amber-50 text-amber-950` |
| Success | `border-teal-200 bg-teal-50 text-teal-950` |
| Danger text | `text-red-700` |

No other brand colors.

## Type scale (pages)

| Element | Classes |
| --- | --- |
| Page title | `text-2xl font-semibold` |
| Section title | `text-lg` or `font-medium` inside a card |
| Lead / hint | `text-sm text-slate-600` |
| Label | `labelClass` (`text-xs font-medium text-slate-600`) |
| Stat value | `text-3xl font-semibold text-slate-900` |
| Stat label | `text-xs font-medium uppercase tracking-wide text-slate-500` |
| Sidebar kicker | `text-xs uppercase tracking-wider text-teal-300` |
| POC note | `text-[11px] leading-4 text-slate-500` |

Fonts come from `layout.js`: Geist + Noto Sans Devanagari + Noto Sans Telugu. Do not load extra fonts.

## Shared classes (`src/components/ui.js`)

Import from `@/components/ui`:

- `inputClass` — full-width field
- `labelClass` — field label
- `btnPrimary` — save / submit / schedule
- `btnGhost` — cancel / secondary
- `formatDate(iso, locale)` — pass `locale` from the store
- `formatPhone(phone)`
- `fileToDocument(file)` — appointments only, 400 KB cap

## Screen recipes

**Staff page header**

```jsx
<header>
  <h1 className="text-2xl font-semibold">{t("…")}</h1>
  <p className="mt-1 text-sm text-slate-600">{t("…")}</p>
</header>
```

**Form card**

```jsx
<form className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
  <label className="block">
    <span className={labelClass}>{t("…")}</span>
    <input className={inputClass} />
  </label>
  <GeoPicker nodes={state.geoNodes} value={geoPath} onChange={setGeoPath} t={t} />
  {error ? <p className="text-sm text-red-700">{error}</p> : null}
  <button type="submit" className={btnPrimary}>{t("…")}</button>
</form>
```

**Stat grid** — `grid gap-3 sm:grid-cols-2 lg:grid-cols-4` plus `StatCard`.

**Public choice cards** — `grid gap-3 sm:grid-cols-2`, each `Link` is `rounded-xl border border-slate-200 bg-white p-4 hover:border-teal-700`.

**List row** — name `font-medium`, phone/designation `text-sm text-slate-600`, geo path `text-xs text-slate-500`, status as plain translated text (not a new badge component). Pin/accept on the right.

**Main padding** lives in AppShell (`p-4 pb-8 md:p-6`). Pages do not add a second full-page background.

**Phone shell** — sticky header, current-page title (`md:hidden`), language and role pills, then chips. Active chip `bg-teal-800 text-white`. Idle chip has a border. POC note under chips on the phone only.

**Desktop shell** — `hidden md:flex` sidebar. Chips `md:hidden`. Same teal active link.

## Spacing

Prefer `gap-3`, `space-y-3` (forms), `space-y-6` (page sections), `p-4` (cards), `px-4 py-3` (header). Do not mix `p-5`/`p-8` cards next to `p-4` cards.

## Motion

No new transitions unless a sibling control already uses one. Prefer instant state changes.
