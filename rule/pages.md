# Page rules

## Simple idea

A page is a room. The store is the warehouse. The page asks the warehouse. The page does not own the stock.

## You must

1. Put the route in `src/app/<path>/page.js`.
2. Add `"use client"` when the page uses `useStore`, `useState`, or browser events. Current feature pages are client pages.
3. Call `const { state, t, ... } = useStore()` near the top. Put chrome strings through `t()`.
4. Keep form fields in local `useState`. Send a finished object into the store on submit.
5. Validate before write. Show `error` as a red text line. Do not save invalid data.
6. Wrap the page body in `div` with `mx-auto max-w-* space-y-*`.
7. Put an `h1` and a one-line `p` that says what the screen does.
8. After create of a contact, go to `/contacts/{id}` with `useRouter`.
9. Use `confirm()` before delete or reset, same as current pages.
10. If the page reads `useSearchParams`, wrap the inner component in `Suspense` (see appointments).

## Public vs staff

- Public write pages: `/volunteers/register`, `/requests/new`.
- Unauthenticated entry: `/signup`, `/login`.
- Administrator console: `/admin`.
- Staff list pages read the same arrays.
- Do not add a public path without updating `isPublicAllowed` in `AppShell.js`.

## Filter pages

Contacts, stats, and visits need a deepest-area helper. If you add a filter, walk levels from smallest to largest:

`panchayat_ward`, `village`, `gram_panchayat`, `block_tehsil`, `locality`, `municipal_ward`, `municipality`, `assembly`, `lok_sabha`.

Then call `inArea(geoPath, areaId)`. Do not compare only `geoPath[level] === areaId`. That misses children.
