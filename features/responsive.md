# Responsive layout

## Simple idea

Think of a fold-out map.

On a small table you keep the map folded. You use a tab for each area. On a large table you open the full sidebar. The map data does not change.

Phone is the default layout. From `md` (768px), the app shows the dark sidebar.

## What it does

- It shows the same staff and public tools on a phone and on a wide screen.
- It keeps header and chips in one sticky white block on a phone.
- It marks the current chip with teal-800, same as the sidebar.
- It shows the current page title on a phone.
- It shows the POC note under the chips on a phone.

## What it does not do

- It does not change the store. `localStorage` keys stay the same.
- It does not add a new role. Roles stay `staff` and `public`.
- It does not add a URL language prefix.
- It does not change the `GeoPicker` cascade.
- It does not add a drawer or bottom tabs.
- It does not set `overflow-x: hidden` on `body`.

## How it does it

1. `AppShell` uses default Tailwind classes for a narrow screen.
2. The sidebar uses `hidden md:flex`. The chip row uses `md:hidden`.
3. `isActivePath` marks `/` only when the path is `/`. Other items are current when the path equals the href or starts with that href plus `/`.
4. The chip row scrolls sideways. If the current chip is off-screen, the row scrolls. The page does not scroll.
5. Forms that used one tight row now stack on a phone (`flex-col` then `sm:flex-row`).
6. Rural and urban buttons wrap (`flex-wrap`).

This is a POC. There is no native app shell.

## Files

- `src/components/AppShell.js` — sticky header, chips, sidebar
- `src/components/ContactForm.js` — save and cancel stack on a phone
- `src/app/contacts/[id]/page.js` — add-note form stacks on a phone
- `src/components/GeoPicker.js` — rural and urban wrap
- `src/components/ui.js` — taller fields (`py-2.5`)
