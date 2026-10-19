# Area-wise statistics

## Simple idea

Pick a box on the map. Count what sits in that box and in all smaller boxes inside it.

## What it does

- Staff pick an administrative level on `/stats`.
- The page shows counts for:

  - contacts (and how many are pinned)
  - volunteers (and how many are pending)
  - appointments
  - open local requests

- If staff pick no small area, the page counts the full seed geography.

## How it does it

1. Page: `src/app/stats/page.js`.
2. GeoPicker runs with `allowEmpty`. Staff can stop at any level.
3. `deepest(geo)` finds the smallest selected area id.
4. `useMemo` filters each list with `inArea(..., areaId)`.
5. For appointments with a `contactId`, the page uses the contact geoPath if the contact exists. Else it uses the appointment geoPath.
6. `StatCard` shows the numbers.

The page does not write data. Change the picker. The counts change.

## Files

- `src/app/stats/page.js`
- `src/components/StatCard.js`
- `src/lib/geo.js` — `contactInArea`, `areaName`
