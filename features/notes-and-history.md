# Notes and history

## Simple idea

A contact is a person. A note is a diary line about that person. Appointments on the same page are the calendar for that person.

The goal is simple: staff must see past talk and past promises in one place.

## What it does

- Every contact has a notes section.
- Staff add a short text note.
- Staff remove a note.
- The same page lists appointments linked to that contact.
- Staff can open the appointments page with `?contactId=` to schedule a meeting.

## How it does it

1. Notes live in `state.notes`. They are not nested inside the contact object.
2. Each note has `id`, `contactId`, `text`, and `createdAt`.
3. The detail page filters `state.notes` where `contactId === id`.
4. `addNote(contactId, text)` puts a new note at the front of the notes array.
5. `deleteNote(id)` removes one note.
6. Appointments on this page filter `state.appointments` where `contactId === id`.
7. If staff delete the contact, notes for that id go away. Appointments stay, but they lose the contact link.

This split (contact + notes + appointments) keeps history even when you edit the contact fields.

## Files

- `src/app/contacts/[id]/page.js`
- `src/lib/store.js` — `addNote`, `deleteNote`
