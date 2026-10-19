# Pin contacts

## Simple idea

A pin is a bookmark on a contact. Pinned contacts stay at the top of the list. They also show on the staff dashboard.

## What it does

- Staff pin or unpin a contact from the list or the detail page.
- Pinned contacts sort first on `/contacts`.
- The dashboard lists pinned contacts.

## How it does it

1. Each contact has `pinned` as true or false.
2. `togglePin(id)` maps the contacts list. It flips `pinned` for that id.
3. The contacts page sorts with `Number(b.pinned) - Number(a.pinned)`. True becomes 1. False becomes 0.
4. The list and the detail title show a pin mark when `pinned` is true.
5. The dashboard uses `contacts.filter((c) => c.pinned)`.

The pin flag lives on the contact. It is not a second list.

## Files

- `src/lib/store.js` — `togglePin`
- `src/app/contacts/page.js`
- `src/app/contacts/[id]/page.js`
- `src/app/page.js`
