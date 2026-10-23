# Phone number login and mock OTP

## Simple idea

Think of returning to the office.

You do not need to register a new badge. You give your registered phone number, receive a temporary pass code on screen, and enter the office immediately.

## What it does

- It allows existing users to log in at `/login`.
- It asks for the user's 10-digit mobile number (`inputMode="numeric"`).
- It looks up the account in `state.accounts`.
- If no account exists for the phone number, it shows an error and links to `/signup`.
- If an account exists, it generates a 6-digit mock OTP code on screen.
- It displays the temporary code in a teal/amber POC container.
- Typing the correct code signs the user in and redirects to home (`/`).
- Verified staff unlock the staff desk. Pending staff see the waiting screen. Public users see the constituency desk.

## How it does it

1. **Phone step:**
   - The user enters a 10-digit phone number.
   - The app verifies that 10 digits were entered.
   - It searches `state.accounts` via `findAccountByPhone()`.
   - On match, it displays the account name and moves to the OTP step.
2. **Mock OTP step:**
   - The app generates a random 6-digit string in React component state.
   - It shows the code in the POC notice box.
   - The user inputs the code.
   - Incorrect code shows a red error message.
   - The user can click "Generate new code" to resend.
   - On match, it calls `login(phone)` in `src/lib/store.js`.
   - `login()` sets the active `sessionAccountId` and writes `{ accountId }` to `localStorage` under `contact-app-poc-session`.
   - It routes the user to `/`.

## Files

- `src/app/login/page.js` — login form and mock OTP verification
- `src/lib/store.js` — `login`, `findAccountByPhone`, `SESSION_KEY`
- `src/components/AppShell.js` — allows `/login` route for unauthenticated visitors
- `src/i18n/` — localized strings under `login.*`
