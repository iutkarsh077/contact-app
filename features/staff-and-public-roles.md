# Staff and public roles

## Simple idea

Think of two doors into the same house.

- **Staff** open the office door. They see contacts, appointments, statistics, and travel tools.
- **Public** open the citizen door. They see volunteer sign-up, local requests, and travel notices.

The house (the store) is the same. The doors show different rooms.

## What it does

- It lets you switch role in the header: Staff or Public.
- It changes the side menu.
- It blocks public users from staff screens.

## How it does it

1. `StoreProvider` keeps `role` in React state.
2. On first load, it reads `localStorage` key `contact-app-poc-role`.
3. `setRole` writes the new role to state and to that key.
4. `AppShell` (`src/components/AppShell.js`) picks `STAFF_NAV` or `PUBLIC_NAV`.
5. Public users may open only `/`, `/volunteers/register`, and `/requests/new`.
6. If a public user opens another path, `AppShell` hides the page. It shows a warning. It does not change the store.

This is a POC. Role is a switch in the browser. It is not a login system.

## Files

- `src/lib/store.js` — `role`, `setRole`
- `src/components/AppShell.js` — menus and the block screen
- `src/app/page.js` — home content for each role
