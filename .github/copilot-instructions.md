# Copilot instructions for jdem-card-designer

Purpose: Give AI coding agents the minimal, accurate context to be productive in this repository.

- **Project type:** Create React App single-page app using React 19 and `react-scripts` (see [package.json](package.json#L1)).
- **Entry point:** [src/index.js](src/index.js#L1) — renders the main app component.
- **Primary UI & logic:** [src/App.js](src/App.js#L1) — single large component `PlayingCardDesigner` that holds most state and behavior.

Big picture (quick):
- Users upload images (suit symbols, number glyphs, face art, and a card back). These are stored as data-URIs in component state (`suits`, `numbers`, `faceCards`, `cardBack`). See the state declarations and upload handlers in [src/App.js](src/App.js#L1).
- `generateDeck()` composes the 52 cards from `suit` + `value` and is used to render front/back previews and to trigger `window.print()` for printing.
- Styling uses Tailwind: see `src/index.css` (contains `@tailwind` directives) and `devDependencies` in [package.json](package.json#L1).

Critical developer workflows:
- Dev server: `npm start` (uses `react-scripts start`).
- Build: `npm run build`.
- Tests: `npm test` runs CRA test runner. Quick checks should use these scripts.
- CSS: Tailwind is used via PostCSS—confirm `postcss`/`tailwindcss` config if you change global styles (`src/index.css`).

Project-specific patterns and gotchas:
- File input handling: The app supports click, drag, and paste. Look for `handlePaste`, `handleDrop`, and `FileReader.readAsDataURL` usages in [src/App.js](src/App.js#L1).
- Keys & IDs: cards and face images use keys of the form `${suit}-${value}` (example: `spades-K`). When changing data shapes, keep this string format consistent.
- Images are not persisted to disk—only stored in-memory as data URIs. If adding persistence, map existing state keys to whatever API contract you add.
- Print mode: Printing behavior and CSS are implemented inline in `App.js` via an `@media print` style block and `window.print()`; be careful when refactoring into multiple components so print styles remain applied.
- Icons: `lucide-react` is used for UI icons (see imports at top of `src/App.js`).

Where to make common changes:
- Add UI/logic: split `src/App.js` into `src/components/` files for smaller PRs. Preserve the state shape or centralize it into a single provider if you refactor.
- Styling tweaks: edit `src/index.css` and tailwind config if present.

Examples (follow these patterns):
- Upload handler (use FileReader -> data URL): the code pattern in `handleSuitUpload` / `handleNumberUpload`.
- Referencing face images: `faceCards[`${suit}-${value}`]` — use the same index expression.

Notes for reviewers:
- Keep PRs focused: small changes to `App.js` or adding a new component are easier to review than a single large rewrite.
- Verify printing output in browser print preview; the app relies on precise CSS for printable card sizes.

If anything above is unclear or you want this doc expanded (examples, common refactor checklist, or test patterns), say which area and I will iterate.
