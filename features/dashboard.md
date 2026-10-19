# Dashboard

## Simple idea

The dashboard is a summary board. Staff see counts. Public see notices and two action cards.

## What it does

### Staff home (`/`)

- It shows counts: contacts, volunteers, appointments, open requests.
- It shows upcoming travel notices.
- For each notice, it counts contacts and volunteers in that area.
- It lists pinned contacts.

### Public home (`/`)

- It shows upcoming MLA travel notices.
- It links to volunteer registration.
- It links to the local request form.

## How it does it

1. `src/app/page.js` is a client page. It calls `useStore()`.
2. It reads arrays from `state`: `contacts`, `volunteers`, `appointments`, `visits`, `requests`.
3. It filters visits with `date >= today` (date as `YYYY-MM-DD`).
4. For staff notices, `inArea(contact.geoPath, visit.areaId)` counts who the notice reaches.
5. Pinned contacts use `contact.pinned === true`.
6. `StatCard` shows one number.

The dashboard does not write data. It only reads.

## Files

- `src/app/page.js`
- `src/components/StatCard.js`
