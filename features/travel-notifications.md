# Travel notifications

## Simple idea

The MLA will visit a place. Staff write a notice on that place. People whose area sits in that place see the notice.

This POC does not send SMS. The notice is an in-app message.

## What it does

- Staff create a visit on `/visits`: area, date, message.
- The notice stores `areaId` (deepest selected area) and the full `geoPath`.
- The app counts contacts and volunteers in that area.
- Staff home and public home show visits with `date` today or later.
- Staff can remove a notice.

## How it does it

1. Page: `src/app/visits/page.js`.
2. Submit requires an area id, a date, and a message.
3. `addVisit` stores `{ id, geoPath, areaId, date, message, createdAt }`.
4. Reach count: `inArea(record.geoPath, visit.areaId)` on contacts and on volunteers.
5. Dashboard (`src/app/page.js`) filters `visits` with `v.date >= todayISO()`.
6. Public users see the same upcoming notices. They do not see staff counts.

A visit at Block level reaches every contact whose geoPath includes that Block or a child of that Block.

## Files

- `src/app/visits/page.js`
- `src/app/page.js`
- `src/lib/store.js` — `addVisit`, `deleteVisit`, `inArea`
