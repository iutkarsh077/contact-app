# Data flow

This file shows how data moves through the Contact Management App.

It uses short sentences (ASD-STE100). It starts with a simple picture (Feynman Technique).

## 1. Simple picture

Think of one notebook on one desk.

- The **notebook** is the store object in React.
- The **desk drawer** is `localStorage` in this browser.
- Each **page of the app** reads the notebook. Some pages write a new line.
- There is no other notebook. There is no server.

If you open the app on a second computer, that computer has an empty drawer. It gets a fresh copy of the sample seed.

## 2. Words

| Word | Meaning |
| --- | --- |
| State | One JavaScript object with all lists |
| Store API | Functions that change state |
| Persist | Write state as JSON into `localStorage` |
| Seed | The sample data in `src/data/seed.js` |
| geoPath | Area ids on a record |
| Role | `staff` or `public` |
| Account | User record in `accounts[]` |
| Session | Active account id in `contact-app-poc-session` |
| Admin session | Signed-in admin email in `contact-app-poc-admin` |
| Locale | UI language `en`, `hi`, or `te` |

## 3. What the state holds

`createSeedState()` returns this shape:

```
state
├── geoNodes[]        places in the tree
├── contacts[]        people in the office list
├── notes[]           diary lines, linked by contactId
├── appointments[]    meetings, optional contactId + document
├── volunteers[]      public sign-ups
├── visits[]          MLA travel notices
├── requests[]        local development / issue letters
└── accounts[]        signup accounts (staff and public)
```

Session and admin session are kept in separate `localStorage` keys outside `STORAGE_KEY`. Role is derived from `session.role`. Locale is also next to state.

## 4. Start-up flow

Do these steps in order when the browser loads the app.

```
Browser opens any route
        │
        ▼
layout.js wraps children in AppProviders
        │
        ▼
StoreProvider mounts
        │
        ├─ React state starts as createSeedState()
        │  (this avoids a crash on the server render)
        │
        ▼
useEffect runs in the browser
        │
        ├─ Read localStorage key  contact-app-poc-v1
        │     missing  → write seed, use seed
        │     present  → JSON.parse, merge onto seed (including accounts)
        │     error    → use seed
        │
        ├─ Read localStorage key  contact-app-poc-session
        │     present  → set sessionAccountId, resolve session from accounts[]
        │     missing  → no active session
        │
        ├─ Read localStorage key  contact-app-poc-admin
        │     present  → set adminSession ({ email })
        │     missing  → no active admin session
        │
        ├─ Read localStorage key  contact-app-poc-locale
        │     en, hi, or te → set locale
        │     other         → keep en
        │
        └─ setReady(true)
        │
        ▼
Second useEffect
        │
        └─ When ready is true, every state change
           writes JSON to contact-app-poc-v1
```

`AppProviders` then wraps `AppShell`. `AppShell` inspects session state:
- If unauthenticated and not on `/signup` or `/admin`: redirects to `/signup`.
- If staff account is pending verification: displays waiting screen.
- If verified staff: displays `STAFF_NAV` and staff desk.
- If public: displays `PUBLIC_NAV` and public home.
- Header shows user name, sign out, and language buttons.

## 5. Write flow (any create or update)

All writes must go through the store API. Pages must not call `localStorage.setItem` for app data.

```
User submits a form (or clicks Pin, Accept, …)
        │
        ▼
Page validates in the page or in ContactForm
        │
        ▼
Page calls one store function
  upsertContact / addNote / upsertAppointment /
  addVolunteer / setVolunteerStatus / addVisit /
  addRequest / setRequestStatus / togglePin / …
        │
        ▼
update(fn) runs setState
        │
        ▼
fn copies the old state
  It replaces one array with a new array
  It does not mutate the old objects in place
        │
        ▼
React re-renders every page that called useStore()
        │
        ▼
useEffect sees new state and ready === true
        │
        ▼
persist(state) → localStorage.setItem(STORAGE_KEY, JSON)
```

Ids come from `crypto.randomUUID()`. Time fields use ISO strings.

## 6. Read flow (search, stats, dashboard)

```
Page calls useStore()
        │
        ▼
Page reads state.lists
        │
        ▼
Page may keep local UI state (q, geo picker, …)
        │
        ▼
Page filters in the page (useMemo or direct filter)
        │
        ├─ text / designation checks on the page
        └─ area checks via inArea(geoPath, areaId)
                    │
                    ▼
              contactInArea in geo.js
                    │
                    ▼
              descendantIds(geoNodes, areaId)
              plus pathValues(geoPath)
```

The store does not run search. The page runs search. The store only gives `inArea` as a helper that closes over `state.geoNodes`.

## 7. How area matching flows

A record stores many area ids in `geoPath`. A filter or a visit stores one `areaId`.

```
areaId = deepest selected node (ward, village, block, …)
        │
        ▼
Collect that node and all children, grandchildren, …
        │
        ▼
Look at every id in the record geoPath
        │
        ▼
If any geoPath id is in the descendant set → match
```

Example: visit `areaId = blk-1` (Block Chomu).

- Contact in village `vil-1` matches. `vil-1` is a child of gram panchayat `gp-1`, which is a child of `blk-1`. The geoPath also contains `block_tehsil: blk-1`.
- Contact in another assembly does not match.

## 8. Role flow

```
Header click Staff or Public
        │
        ▼
setRole(next)
        │
        ├─ React role state
        └─ localStorage  contact-app-poc-role
        │
        ▼
AppShell picks STAFF_NAV or PUBLIC_NAV
        │
        ▼
If role is public and path is not allowed
        → hide children
        → show the staff-only warning
        → do not change lists
```

Allowed public paths: `/`, `/volunteers/register`, `/requests/new`.

## 9. Feature to write function

| User action | Function | Array that changes |
| --- | --- | --- |
| Add or edit contact | `upsertContact` | `contacts` |
| Delete contact | `deleteContact` | `contacts`, `notes`, `appointments` (unlink) |
| Pin | `togglePin` | `contacts` |
| Add note | `addNote` | `notes` |
| Remove note | `deleteNote` | `notes` |
| Schedule meeting | `upsertAppointment` | `appointments` |
| Cancel meeting | `deleteAppointment` | `appointments` |
| Register volunteer | `addVolunteer` | `volunteers` |
| Accept volunteer | `setVolunteerStatus` | `volunteers` |
| Publish visit | `addVisit` | `visits` |
| Remove visit | `deleteVisit` | `visits` |
| Submit request | `addRequest` | `requests` |
| Mark reviewed | `setRequestStatus` | `requests` |
| Reset sample | `reset` | full state → seed |

## 10. Links between lists

```
contact.id  ◄──── notes.contactId
            ◄──── appointments.contactId  (optional)

geoNodes.id ◄──── geoPath values
            ◄──── visits.areaId

No foreign key engine exists.
Pages and store functions keep the links by hand.
```

When you delete a contact:

- Notes with that `contactId` are removed.
- Appointments keep the row. `contactId` becomes `""`.

## 11. Document flow (appointments only)

```
User picks a file
        │
        ▼
fileToDocument(file)
        │
        ├─ size > 400 KB → error, no write
        └─ FileReader.readAsDataURL
        │
        ▼
{ documentName, documentDataUrl }
        │
        ▼
Stored on the appointment in state
        │
        ▼
JSON in localStorage
        │
        ▼
UI shows an <a download> link
```

## 12. Screen map

```
layout.js
  AppProviders
    StoreProvider     ← all data
      AppShell        ← role, locale, nav, block
        page.js       ← dashboard (read)
        /contacts     ← search (read) + pin (write)
        /contacts/new ← upsertContact
        /contacts/[id]← edit, notes, pin, delete
        /appointments ← upsertAppointment
        /volunteers   ← setVolunteerStatus
        /volunteers/register ← addVolunteer
        /stats        ← read + inArea
        /visits       ← addVisit
        /requests     ← setRequestStatus
        /requests/new ← addRequest
```

## 13. What does not flow

- Data does not go to a server.
- Data does not go to SMS.
- Role does not go through a login API.
- A second browser does not share the drawer.

This is the full data path of the POC.
