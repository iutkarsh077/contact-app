# UI rules

## Simple idea

The screen must look like one product. Use the same colors, the same buttons, and the same form spacing.

## You must

1. Use Tailwind utility classes. Global CSS stays in `src/app/globals.css`.
2. Use slate for text and borders. Use **teal-800** for primary actions and active nav.
3. Use white cards: `rounded-xl border border-slate-200 bg-white`.
4. Use `btnPrimary` for the main save action. Use `btnGhost` for secondary actions.
5. Use `labelClass` and `inputClass` on fields.
6. Show empty lists with a short sentence, not a blank card.
7. Show travel notices with amber (`border-amber-200 bg-amber-50`).
8. Show success after public submit with teal-50 boxes, same as volunteer and request pages.
9. Keep the staff sidebar dark (`bg-slate-900`) in `AppShell`. Show the sidebar from `md` (768px). On a phone, show the same nav as chips. Do not add a drawer.
10. Keep the public/staff switch in the header.
11. Keep the language switch in the AppShell header next to staff/public.
12. Make the phone layout first. Default Tailwind classes are for a narrow screen. Add `md:` for the sidebar and wide layout.
13. Keep header and chips in one sticky white block (`sticky top-0 z-10`). The active chip uses `bg-teal-800 text-white`.
14. Do not set `overflow-x: hidden` on `body`. That can clip native select lists. Scroll chips with `overflow-x-auto` only.

## Forms

1. One column of labels and fields.
2. Geography through `GeoPicker`.
3. Error as `text-sm text-red-700`.
4. Phone: `inputMode="numeric"` where the contact form does this.

## Documents

Appointment files must stay under 400 KB. Use `fileToDocument`. Do not upload to a URL.

## Copy

Write UI chrome through `t("key")` from `useStore()`. Keep English, Hindi, and Telugu keys in `src/i18n`. Do not translate user data (names, notes, messages, area names). Match goal.md words: contact, volunteer, appointment, area, travel notice, request.
