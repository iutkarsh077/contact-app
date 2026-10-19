# Volunteer registration

## Simple idea

A volunteer is a person who says: I will help in this area. The public form is the front door. The staff list is the inbox.

## What it does

- Public users register on `/volunteers/register`.
- They give name, 10-digit phone, designation, and geoPath.
- The record starts with status `pending`.
- Staff see all volunteers on `/volunteers`.
- Staff accept a pending volunteer. Status becomes `accepted`.

## How it does it

1. Public form: `src/app/volunteers/register/page.js`.
2. Submit checks name, 10-digit phone, assembly, and area type.
3. `addVolunteer` prepends a record with a new id, `status: "pending"`, and `createdAt`.
4. The form then shows a success screen. It does not send SMS or email.
5. Staff page: `src/app/volunteers/page.js`.
6. `setVolunteerStatus(id, "accepted")` maps the volunteers array and changes status.
7. Volunteers stay in `state.volunteers`. They are not auto-copied into `contacts`.

## Files

- `src/app/volunteers/register/page.js`
- `src/app/volunteers/page.js`
- `src/lib/store.js` — `addVolunteer`, `setVolunteerStatus`
