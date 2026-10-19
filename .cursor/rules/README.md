# Code rules

This folder is the coding standard for this project.

You must follow these rules when you add or change code.

The rules come from the code that exists today. They are not a new style.

## How to read

Each file uses ASD-STE100 (short sentences, same words) and the Feynman Technique (simple idea first, then the rule).

| File | When to use |
| --- | --- |
| [project.md](project.md) | Always |
| [javascript.md](javascript.md) | `.js` files |
| [pages.md](pages.md) | files under `src/app` |
| [components.md](components.md) | files under `src/components` |
| [store-and-geo.md](store-and-geo.md) | `src/lib`, `src/data` |
| [ui.md](ui.md) | layout, Tailwind, forms |

Cursor also loads copies of these rules from `.cursor/rules/`. Agents must follow them.

## If two rules conflict

1. Keep this a browser POC.
2. Keep one store.
3. Match the file next to your change.
