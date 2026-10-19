# Local requests for MLA

## Simple idea

A local request is a letter. A citizen writes: here is my name, my phone, my area, and my problem. Staff read the letter and mark it reviewed.

This feature is optional in the goal. The POC includes it.

## What it does

- Public users submit a request on `/requests/new`.
- Staff list requests on `/requests`.
- Status starts as `open`.
- Staff set status to `reviewed`.

## How it does it

1. Form: `src/app/requests/new/page.js`.
2. Submit checks name, 10-digit phone, issue text, assembly, and area type.
3. `addRequest` prepends `{ id, name, phone, issue, geoPath, status: "open", createdAt }`.
4. Success screen tells the citizen that the office can see the request in the app.
5. Staff page: `src/app/requests/page.js`.
6. `setRequestStatus(id, "reviewed")` updates one request.
7. Dashboard counts requests where `status === "open"`.
8. Statistics count open requests in the selected area with `inArea`.

## Files

- `src/app/requests/new/page.js`
- `src/app/requests/page.js`
- `src/lib/store.js` — `addRequest`, `setRequestStatus`
