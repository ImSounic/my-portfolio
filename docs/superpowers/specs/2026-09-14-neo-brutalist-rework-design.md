# Neo-Brutalist theme rework: design

Date: 2026-09-14
Status: approved
Scope: `src/themes/brutalist/**` only. The Original theme, the global loading screen and `src/data/portfolio.ts` (except the `hotTakes` shape) are out of bounds.

## Decisions made during brainstorming

| Question | Decision |
|---|---|
| Depth of change | Full visual rework of the Neo-Brutalist theme |
| Leading reference | Love and Money (loveandmoney.com): full-bleed accent colour fields, giant wordmark, all-caps editorial, numbered sections |
| Secondary references | Sasha Martynchuk (letter-roll hovers, parallax cards, copy-email); Maria Vasilyeva (counters, rhythm) |
| Elements that survive | Falling-cards project board and modal; draggable availability sticker; global loading screen; palette switcher; TargetCursor |
| Elements removed | Marquee ticker strip |
| Code approach | Split the 1,978-line `BrutalistTheme.tsx` into modules with zero visual change, then rework section by section |

## 1. Direction and page rhythm

Full-bleed editorial. Sections alternate between three fields: the accent colour field (the four palettes, now full-screen), paper, and ink.

```
Hero (accent field)
Playbook (paper)
Skills (ink)
Work board (paper, kept as-is)
About (paper)
Contact (accent field bookend)
Footer (ink)
```

Switching palette recolours the hero and contact fields live. Type stays Aeonik display + Space Mono telemetry, all-caps throughout.

## 2. Code structure (Phase 0, zero visual change)

```
src/themes/brutalist/
  BrutalistTheme.tsx      root only: palette state, cursor, Lenis, section order
  tokens.ts               PALETTES, C, ACCENT/ACCENT_TEXT/ON_ACCENT, accentA(), EASE_OUT, SPRING,
                          rotation tables, NEW_PROJECT_IDS, canHover, scrollTo
  brutalist.css           unchanged
  primitives/             GrainOverlay, Crosshair, FrameTag, Tape, DevtoolsEgg, SectionHeader,
                          PaletteSwitcher, Marquee (deleted in Phase 2)
  nav/Navbar.tsx
  sections/               Hero, Manifesto (becomes Playbook in Phase 3), Skills, About, Contact, Footer
  sections/work/          board.ts (STATUS_MAP, fallVariants), PinCard, FallNoteCard, ProjectModal,
                          PageNav, BoardHeader, WorkSection   (moved byte-for-byte)
  motion/                 the animation primitives below
```

Sections import only `tokens`, `primitives`, `motion`, fonts and `portfolio.ts`. Phase 0 is a pure relocation, verified in the browser before any visual work.

## 3. Motion primitives (`motion/`)

| Primitive | Source | Behaviour | Used on |
|---|---|---|---|
| `SplitReveal` | Love and Money | Splits text into lines/words with `split-type`; each line rises out of a clip mask with stagger, once, on entering the viewport | Headings, playbook rows, manifesto statement, board header |
| `LetterRoll` | Sasha Martynchuk | Each character is duplicated; on hover the stack rolls up 100% | Nav links, socials, VIEW/EXPAND labels, footer links |
| `Magnetic` | Vasilyeva / Martynchuk | Element eases toward the pointer inside a radius, springs back on leave | Primary CTAs, palette swatches, page-flip control |
| `Parallax` | Sasha Martynchuk | `useScroll` + `useTransform` small vertical drift | About clippings, hero sticker |
| `Counter` | Maria Vasilyeva | Number ticks up when in view | Telemetry stats: project count, years, stack size |
| `CopyEmail` | Sasha Martynchuk | Click copies the address; label reads COPIED for 1.5 s | Contact and footer email |
| `useLenis` | (shared feel of all three) | Smooth scroll mounted with the theme, torn down on unmount | Theme root |

Motion rules: `prefers-reduced-motion` turns reveals into opacity-only, disables Lenis, parallax and letter-roll. Touch (`canHover` false) disables magnetic and hover-only affordances.

## 4. Per-section rework

**Hero.** The accent colour field. Giant wordmark SOUNIC sized to the viewport width, in the on-accent ink; each letter rises from a clip mask on mount, immediately after the global loader hands off. Beneath it: the all-caps `profile.tagline` line and the existing telemetry strip. The faint outlined `01` numeral stays. AKKARAJU becomes an outlined second line at a smaller size so nothing clips at 375px. The draggable availability sticker stays on the field; its tape turns white.

**Playbook** (replaces Manifesto). `manifesto` rendered as a two-line split-reveal statement, then six numbered rows 01 to 06 from `hotTakes`: giant numeral in a sticky left column on desktop, a short all-caps title, the take as body. Rows alternate paper/white and reveal line by line.
Data change: `hotTakes` becomes `{ title: string; body: string }[]`. Titles: Interpretability, The Boring Tool, Class Imbalance, Big Data, Pacing, Out of Sample. Confirm no other consumer before changing the shape.

**Skills.** Same content. Category headers split-reveal; chips stagger in and get a hard-shadow press on hover; group counts use `Counter`.

**Work.** Board and modal untouched. Additive only: `SplitReveal` on the board header, `LetterRoll` on EXPAND/VIEW labels, `Magnetic` on the page-flip control.

**About.** Keeps its zine clippings. Adds `Parallax` drift on the clippings and split-reveal on headings.

**Contact.** Accent-field bookend mirroring the hero: giant on-accent LET'S TALK, the four link blocks retained, email becomes `CopyEmail`, socials get `LetterRoll`, primary CTA is `Magnetic`.

**Footer and Navbar.** Footer links `LetterRoll`. Navbar links `LetterRoll` plus a 2px accent scroll-progress hairline along the top. Palette switcher stays. Marquee removed.

## 5. Guardrails

WCAG-AA through the existing verified palette tokens; `:focus-visible` rings and 44px touch targets; no em or en dashes and no emojis in rendered copy; 375 / 768 / desktop responsive; `npm run build` (TypeScript + ESLint) stays clean.

## 6. Failure handling

`split-type` runs client-side in an effect and falls back to plain text if it throws. Lenis is torn down on unmount so switching themes cannot leave a hijacked scroll. Clipboard failure shows the address as selectable text rather than a false COPIED state.

## 7. Verification and delivery

There is no test runner. Each phase is verified by build plus browser checks and committed and pushed to `main` on its own.

- P0 Module split. Parity checks: board pages and cards fall in, modal opens/closes with focus trap, sticker drags, palette switch persists across reload, cursor snaps, Original theme unaffected.
- P1 Motion primitives, each reduced-motion aware.
- P2 Hero + Navbar, Marquee removed.
- P3 Playbook (with the `hotTakes` shape change).
- P4 Skills + About.
- P5 Contact + Footer.
- P6 Board polish, Lenis, full QA: four palettes x three widths x reduced-motion.

## 8. Out of scope

Sound or annotation toggles, WebGL image distortion, a themed preloader, page transitions, a project index list.
