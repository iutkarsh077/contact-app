# Staff and public roles

## Simple idea

Think of two doors into the same house.

- **Staff** open the office door. They enter official term dates and wait for administrator verification. Once verified, they see contacts, appointments, statistics, and travel tools.
- **Public** open the citizen door. They confirm their phone number and immediately see volunteer sign-up, local requests, and travel notices.

The house (the store) is the same. The doors show different rooms.

## What it does

- It assigns a role upon account creation at `/signup`: `staff` or `public`.
- It changes the side menu and navigation based on the active role.
- It displays a waiting screen for staff accounts pending administrator verification.
- It blocks public users from staff screens.
- It shows the user's name and a Sign out button in the header instead of a role switcher.

## How it does it

1. `StoreProvider` in `src/lib/store.js` manages `state.accounts` and `session`.
2. On load, it reads `SESSION_KEY` (`contact-app-poc-session`) and resolves the account from `state.accounts`.
3. `AppShell` (`src/components/AppShell.js`) checks session state:
   - No session: redirects to `/signup`.
   - Pending staff: shows waiting card and hides navigation.
   - Verified staff: shows `STAFF_NAV` and the staff desk.
   - Public: shows `PUBLIC_NAV` and allows only `/`, `/volunteers/register`, and `/requests/new`.
4. If a public user opens a staff path, `AppShell` hides the page and displays a notice.
5. Clicking **Sign out** clears `SESSION_KEY` and redirects to `/signup`.

## Files

- `src/lib/store.js` — `accounts`, `session`, `signUp`, `signOut`, `verifyAccount`
- `src/components/AppShell.js` — navigation, session gate, and waiting card
- `src/app/signup/page.js` — role selection and account creation
- `src/app/page.js` — home content for public and verified staff
