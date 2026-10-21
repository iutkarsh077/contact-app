# Component rules

## Simple idea

A component is a reusable tool. If two pages need the same tool, put it in `src/components`. If only one page needs it, keep the helper in that page file.

## You must

1. Use a default export for screen components: `GeoPicker`, `ContactForm`, `AppShell`, `StatCard`. Keep AppShell as the only shell. Phone chips and the `md` sidebar must use the same nav lists.
2. Put shared class strings and format helpers in `src/components/ui.js` as named exports.
3. Pass data in. Do not let `ContactForm` or `GeoPicker` call `useStore` unless you have a strong reason. Today they receive `nodes` and callbacks.
4. Keep GeoPicker cascading:

   - Change of a parent deletes child keys.
   - Rural and Urban buttons stay disabled until `value.assembly` is set.
   - Always render a blank `<option value="">` so React state and the select stay in sync.

5. Default new geoPath objects to `{ lok_sabha: "ls-1", assembly: "ac-1" }` when the form is not a filter.
6. Filter pickers may use `allowEmpty`.
7. Pass optional `t` into `GeoPicker` and `ContactForm`. If `t` is missing, keep the English labels.

## You must not

- Duplicate Tailwind strings that already exist in `ui.js` (`inputClass`, `labelClass`, `btnPrimary`, `btnGhost`).
- Nest GeoPicker logic into a new geography library. Extend `geo.js` and `GeoPicker`.
