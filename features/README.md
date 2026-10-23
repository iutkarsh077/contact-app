# Features

This folder explains each feature of the Contact Management App.

The app is a **proof of concept (POC)**. A POC is a small working demo. This demo stores data in the browser. It does not use a server database.

## How to read these files

Each file uses two writing methods:

1. **ASD-STE100.** Use short sentences. Use the same word for the same thing. Use the active voice.
2. **Feynman Technique.** Start with a simple idea. Then show the real steps in the code.

Read the files in this order if you are new:

1. [Geographical hierarchy](geographical-hierarchy.md)
2. [Signup and verification](signup.md)
3. [Phone login](login.md)
4. [Staff and public roles](staff-and-public-roles.md)
5. [Languages](languages.md)
6. [Responsive layout](responsive.md)
7. [Dashboard](dashboard.md)
8. [Universal contact search](universal-contact-search.md)
9. [Add and edit contacts](add-and-edit-contacts.md)
10. [Pin contacts](pin-contacts.md)
11. [Notes and history](notes-and-history.md)
12. [Appointments](appointments.md)
13. [Volunteer registration](volunteer-registration.md)
14. [Area-wise statistics](area-wise-statistics.md)
15. [Travel notifications](travel-notifications.md)
16. [Local requests](local-requests.md)

After the features, read [dataflow.md](../dataflow.md). That file shows how data moves through the whole app.

## Word list

Use these words in all feature files. Do not mix synonyms.

| Word | Meaning |
| --- | --- |
| Contact | A person in the office list |
| Store | The one data object in React context |
| geoPath | The area labels on a record |
| Area | One node in the geography tree |
| Staff | Office user |
| Public | Citizen user |
| POC | This browser-only demo |
| Locale | UI language: `en`, `hi`, or `te` |
