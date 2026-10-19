# Project rules

## Simple idea

This app is a paper office in a browser tab. Keep it small. Keep data in one place. Do not build a second office.

## You must

1. Keep this a **POC**. Store app data in `localStorage` through `src/lib/store.js`.
2. Use **JavaScript**. Do not add TypeScript files.
3. Use the **App Router** under `src/app`.
4. Import with the alias `@/` (see `jsconfig.json`).
5. Put shared logic in `src/lib`. Put sample data in `src/data/seed.js`. Put UI in `src/components`.
6. Use React function components. Use default export for pages and screen components.
7. Mark interactive files with `"use client"` at the top.
8. Before you use a new Next.js API, read the guide in `node_modules/next/dist/docs/`. This Next.js version can differ from older versions.
9. Do not add a database, auth server, SMS, or cloud upload.
10. Do not add a new npm package unless the task cannot use React, Next.js, or the browser API.

## You must not

- Call `localStorage` from a page for contact data. Use the store.
- Split contacts into more than one list.
- Bypass `GeoPicker` with a free-text area on forms that need geography.
- Invent a new role besides `staff` and `public`.
- Rewrite the stack (no TypeScript migration, no Redux, no extra CSS framework).

## Names

| Kind | Pattern | Example |
| --- | --- | --- |
| Page folder | kebab-case | `src/app/contacts/new` |
| Component file | PascalCase | `ContactForm.js` |
| Lib file | camelCase | `store.js`, `geo.js` |
| Function | camelCase | `upsertContact` |
| Constant | SCREAMING_SNAKE or existing export | `STORAGE_KEY`, `GEO_LEVELS` |

## Word list in code comments

Use: contact, store, geoPath, area, staff, public, POC. Do not mix synonyms in comments.
