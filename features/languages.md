# Languages (English, Hindi, Telugu)

## Simple idea

Think of three stickers on the same notebook.

The notebook (the store lists) does not change. You only change the sticker language on buttons, titles, and errors.

## What it does

- It lets staff and public pick English, Hindi, or Telugu in the header.
- It translates chrome UI: menus, headings, labels, empty text, and errors.
- It does not translate contact names, notes, visit messages, request text, or area names in the seed.
- It does not change URLs. Paths stay `/contacts`, not `/hi/contacts`.

## How it does it

1. `StoreProvider` keeps `locale` next to `role`. Locale is not inside the contact JSON.
2. On first load, it reads `localStorage` key `contact-app-poc-locale`.
3. Allowed values are `en`, `hi`, and `te`. Any other value stays `en`.
4. `setLocale` writes the new locale to state and to that key. `reset()` does not clear locale.
5. Pages call `t("nav.contacts")` from `useStore()`. `t` reads `src/i18n/en.js`, `hi.js`, or `te.js`.
6. If a key is missing, `t` uses the English string.
7. After hydrate, `AppShell` sets `document.documentElement.lang`.
8. Stored codes stay English: volunteer `pending`, request `open`, designation values such as `Sarpanch`. The screen shows a translated label.

This is a POC. There is no translation npm package.

## Files

- `src/i18n/en.js`, `src/i18n/hi.js`, `src/i18n/te.js` — dictionaries
- `src/i18n/index.js` — `translate`, `isLocale`
- `src/lib/store.js` — `locale`, `setLocale`, `t`
- `src/components/AppShell.js` — language buttons
