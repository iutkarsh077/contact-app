# Universal contact search

## Simple idea

All contacts sit in one list. Search is a sieve. You pour the full list through holes: text, designation, and area. What remains is the result.

## What it does

- It searches name, designation, and phone digits.
- It filters by designation.
- It filters by geographical area at these levels: Assembly Constituency, Block / Tehsil, Gram Panchayat, Village, Panchayat Ward, Municipality, Municipal Ward (and optional Locality).
- It sorts pinned contacts first, then name.
- It opens add-contact and contact detail.

## How it does it

1. The page is `src/app/contacts/page.js`.
2. Local state holds `q` (search text), `designation`, and `geo` (filter path).
3. `deepestFilter(geo)` walks levels from the smallest area up. It returns the first id that is set. That id is the filter area.
4. For each contact, the page checks:

   - Text: name contains the query, or designation contains the query, or phone contains the digits.
   - Designation: exact match, or empty means all.
   - Area type: if the picker set rural or urban, the contact must match.
   - Area: `inArea(c.geoPath, areaId)` must be true. Empty area means all contacts.

5. `inArea` uses descendants. A Block filter includes villages under that Block.
6. Pin uses `togglePin(id)` from the store. The list updates because `state.contacts` changes.

## Files

- `src/app/contacts/page.js` — sieve
- `src/components/GeoPicker.js` — area filter (`allowEmpty` is true)
- `src/lib/store.js` — `inArea`, `togglePin`
- `src/lib/geo.js` — `contactInArea`, `formatPath`
