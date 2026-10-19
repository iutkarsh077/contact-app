# Appointments and meetings

## Simple idea

An appointment is a timed meeting card. You can clip a small file to the card. You can also clip a contact to the card.

## What it does

- Staff schedule a meeting with title and date-time.
- Staff may link a contact.
- If there is no contact, staff pick a meeting area with GeoPicker.
- Staff may attach a document. The POC limit is 400 KB.
- Staff cancel a meeting.
- The contact detail page shows meetings for that person.

## How it does it

1. Page: `src/app/appointments/page.js`.
2. The page uses `useSearchParams`. If the URL has `contactId`, the form pre-selects that contact.
3. Submit checks title and datetime.
4. `fileToDocument` in `src/components/ui.js` reads the file with `FileReader` as a data URL. If the file is larger than 400 KB, it throws.
5. `upsertAppointment` stores:

   - `title`, `datetime` (ISO string), `contactId`, `geoPath`
   - `documentName`, `documentDataUrl`

6. If a contact is selected, geoPath comes from that contact. Else it uses the form geoPath.
7. The list sorts by datetime.
8. If `documentDataUrl` exists, the UI shows a download link.
9. `deleteAppointment(id)` removes the meeting from the array.

The document lives in `localStorage` as text. That is why the file must stay small.

## Files

- `src/app/appointments/page.js`
- `src/components/ui.js` — `fileToDocument`
- `src/lib/store.js` — `upsertAppointment`, `deleteAppointment`
