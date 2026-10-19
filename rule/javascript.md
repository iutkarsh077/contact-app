# JavaScript rules

## Simple idea

Write plain JavaScript that a reader can follow from top to bottom. Prefer a small named function over a clever one-liner.

## You must

1. Use ES modules: `import` / `export`.
2. Use `function name()` for event handlers and helpers in the same file.
3. Use `const` for values that do not change. Use `let` only when the value changes.
4. Copy state. Do not mutate arrays or objects that came from the store.

```
// Wrong
state.contacts.push(record);

// Right
contacts: [record, ...s.contacts]
```

5. Give ids with `crypto.randomUUID()`.
6. Store dates as ISO strings (`toISOString()`). Store visit dates as `YYYY-MM-DD` when the input is `type="date"`.
7. Store phones as 10 digits. Strip non-digits before save. Format only in the UI with `formatPhone`.
8. Keep files as `.js`. Do not add `.jsx` unless you match a new project-wide choice. Current pages use `.js`.
9. Handle JSON parse errors. `loadState` already uses try/catch. Keep that pattern for storage.

## You must not

- Use TypeScript types or `.ts` files.
- Use classes for UI.
- Use `var`.
- Swallow errors with an empty `catch` when the user must see a message. Form submit must set `error` text.
