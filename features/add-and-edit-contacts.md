# Add and edit contacts

## Simple idea

A contact is a card with four facts: name, phone, job title (designation), and place (geoPath). Add writes a new card. Edit changes the same card.

## What it does

- Staff add a contact on `/contacts/new`.
- Staff edit a contact on `/contacts/[id]`.
- The form checks name, 10-digit phone, designation, assembly, and rural or urban.
- Save puts the record in the one store.

## How it does it

1. `ContactForm` (`src/components/ContactForm.js`) holds field state.
2. Default geoPath is `{ lok_sabha: "ls-1", assembly: "ac-1" }` so Rural and Urban buttons can work.
3. On submit, the form:

   - Trims the name.
   - Keeps only digits of the phone. Length must be 10.
   - Requires designation.
   - Requires `geoPath.assembly` and `geoPath.areaType`.

4. `onSubmit` sends one object to the parent.
5. New page calls `upsertContact(data)` then opens `/contacts/{id}`.
6. Detail page calls `upsertContact(data)` with the existing `id`.
7. `upsertContact` in `src/lib/store.js`:

   - Makes an id with `crypto.randomUUID()` if the record has no id.
   - Sets `pinned: false` and `createdAt` on create. Existing values can overlay these defaults.
   - Replaces the contact if the id exists. Else it puts the new contact at the front of the list.

8. `deleteContact(id)` removes the contact. It also removes notes for that id. It clears `contactId` on appointments. It does not delete the appointment.

## Files

- `src/app/contacts/new/page.js`
- `src/app/contacts/[id]/page.js`
- `src/components/ContactForm.js`
- `src/lib/store.js` — `upsertContact`, `deleteContact`
