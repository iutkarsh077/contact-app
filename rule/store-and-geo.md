# Store and geography rules

## Simple idea

The store is one box. Geography is a tree. Every person-like record points at the tree with a geoPath.

## Store (`src/lib/store.js`)

You must:

1. Change lists only inside `update(fn)`.
2. Return a new state object: `{ ...s, contacts: ... }`.
3. Keep `STORAGE_KEY` as `contact-app-poc-v1` unless you also migrate old JSON.
4. Merge loaded JSON onto `createSeedState()` so new keys appear after a seed change.
5. Wait for `ready` before persist. This avoids writing empty seed over saved data during hydrate.
6. Export `useStore`. Throw if a component is outside `StoreProvider`.
7. Keep `inArea` as a wrapper around `contactInArea(state.geoNodes, geoPath, areaId)`.
8. Keep `locale`, `session` (`contact-app-poc-session`), and `adminSession` (`contact-app-poc-admin`) outside `STORAGE_KEY` JSON. `reset()` must not clear session, admin session, or locale. Role is derived from `session.role`. Accounts live in `state.accounts`.

New entity rules:

- Add the array to `createSeedState()`.
- Add an `add*` or `upsert*` function next to the others.
- Give `id` and `createdAt`.
- If the entity has a place, give it `geoPath`.

You must not read `window` during the first `useState` initializer in a way that differs from today. First paint uses seed. The effect loads storage.

## Geography (`src/lib/geo.js`, `src/data/seed.js`)

You must:

1. Keep `GEO_LEVELS` as the single list of levels.
2. Give each geo node `id`, `name`, `level`, `parentId`. Add `areaType` on rural and urban nodes.
3. Use `descendantIds` for “this area and below”.
4. Use `formatPath` to show a geoPath as text.
5. Add sample nodes in `seed.js` if you add a level that the UI can select.
6. Support `stopAt="assembly"` in `GeoPicker` when only Lok Sabha and Assembly selection is needed (e.g. signup).

You must not store area as a single string on contacts. Use the geoPath object.
