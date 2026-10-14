# Contributions theme

Date: 2026-10-14 · Branch: `taste-redesign` · Switcher id `contributions` · Code: `src/themes/contributions/`.

## What it is
A third theme beside Original and Neo-Brutalist. GitHub's dark contribution-graph palette (ground `#0d1117`,
levels `#161b22 #0e4429 #006d32 #26a641 #39d353`), Clash Grotesk throughout.

- **Hero** (`sections/ContribHero.tsx`, `contrib/`): Sounic's real last-year GitHub contribution graph
  (53 weeks × 7 days) with SOUNIC drawn across it in the brightest green and a one-cell dark margin around the
  letters; real levels elsewhere one notch quieter. The hero pins (+=120% desktop, +=110% phone) while scroll
  lifts the letter cells into an MLP, then folds every cell into a CNN (`contrib/targets.ts` maps cells onto
  `net/layouts.ts`). A caption on the right names each stage in two lines; Graph/MLP/CNN buttons jump between
  stages. Reduced motion: stills. No WebGL2: an inline SVG graph.
- **Then:** four contribution levels as an exposure strip ("Most of my work lives at the unglamorous end."),
  the work on a line (pinned horizontal scroll on desktop, swipe on phones; cards show two stack tags and the
  year), a tray that rotates one project every 15 s (holds on hover/focus/offscreen; manual under reduced
  motion), notes, a contact printer doing a real convolution (`conv/`, built with the anatomy skill), the
  stack, about, and "Open a pull request."
- **Data:** `scripts/fetch-contributions.mjs` (npm `prebuild`) snapshots
  github.com/users/ImSounic/contributions into `src/data/contributions.json`; on failure it keeps the last
  snapshot. Snapshot 2026-10-14: 573 contributions.

## History
Grew out of a darkroom-themed redesign (removed): its layout and components were kept and recoloured.
Found pictures (two, credited on the page): `public/found/credits.json`.

## Firefox fix
`src/app/globals.css` had a Firefox-only `html, body { height: 100%; overflow-x: hidden }` that made <body> the
scroller, so ScrollTrigger (which reads the window) froze pinned sections in Firefox/Zen. Now scoped to
`html:has(.theme-original)`.

## Verification
tsc + eslint clean; `npm run build` clean. Taste inspector at 1440/768/390: remaining items are defended
(thin rules in Notes/Stack lists; exposure-card captions read as "eyebrows"; the phone work line scrolls
sideways by design; no video, the 3D graph is the moving picture).
