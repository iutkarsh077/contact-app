# Signup and verification

## Simple idea

Think of registering at an office gate.

- **Public** visitors write their name and phone. They confirm a temporary pass code. The gate opens immediately to citizen services.
- **Staff** members enter official MLA office credentials and term dates. They also confirm a temporary pass code. Their badge stays **pending** until the office administrator checks and approves it.
- **Administrator** opens a separate console with email and password to verify staff members.

This is a proof of concept (POC). There is no server. The app does **not send SMS**.

## What it does

- It asks all new users to sign up at `/signup`.
- It lets users choose one of two roles: **Staff** or **Public**.
- It asks for name, 10-digit phone, and assembly constituency.
- For staff, it also asks for official term start date and term end date.
- It shows a 6-digit POC code on screen. The user types this code to confirm their phone.
- Wrong code shows an error and does not create an account.
- Public users go directly to the public home screen after verification.
- Staff accounts stay in `pending` status. They see a waiting screen until verified.
- The administrator logs in at `/admin` with email and password to verify pending staff.
- When verified, the staff desk unlocks in the same browser.

## How it does it

1. **Role step:** The user picks `staff` or `public`.
2. **Details step:**
   - Full name.
   - 10-digit mobile number (`inputMode="numeric"`).
   - Assembly constituency through `GeoPicker stopAt="assembly"`.
   - Staff only: `termStart` and `termEnd` (`type="date"`, `termEnd >= termStart`).
   - Optional selfie capture using device camera or photo upload fallback (local capture feature).
3. **OTP step:**
   - The app generates a 6-digit code in React component state.
   - It displays the code in a teal/amber POC box.
   - The user inputs the code.
   - On match, the app calls `signUp()` in `src/lib/store.js`.
   - The app saves the account in `state.accounts` and stores `{ accountId }` in `localStorage` under `contact-app-poc-session`.
   - The app routes the user to `/`.

## Administrator console

- Route: `/admin`.
- Accessible without a user session so verification can happen.
- Sign in uses POC credentials (`admin@poc.local` / `admin`).
- Shows pending staff accounts: name, phone, assembly constituency, term dates, and created timestamp.
- Clicking **Verify** sets the account status to `verified`.
- Verified staff accounts display below in a read-only list.

## POC limits and phone login

- OTP is kept only in component state. It is never saved to `localStorage` or on the account record.
- No third-party SMS or auth libraries are used.
- Existing accounts log in with mobile number and mock OTP at `/login`.

## Files

- `src/app/signup/page.js` — multi-step signup and OTP confirmation
- `src/components/SelfieCapture.js` — device camera selfie capture with live viewfinder and fallback
- `src/app/admin/page.js` — administrator login and staff verification list
- `src/lib/store.js` — `accounts`, `SESSION_KEY`, `ADMIN_SESSION_KEY`, `signUp`, `verifyAccount`
- `src/components/AppShell.js` — session gating, waiting screen, and header sign out
- `src/components/GeoPicker.js` — `stopAt="assembly"` mode
