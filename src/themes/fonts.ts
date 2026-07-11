// src/themes/fonts.ts
// Distinctive type system shared across themes. Each font exposes a CSS variable
// so themes can opt into the ones that fit. NO Inter / Roboto / system sans here.
import {
  Space_Grotesk,
  Instrument_Serif,
  Syne,
  Bricolage_Grotesque,
  Space_Mono,
} from 'next/font/google'
import localFont from 'next/font/local'

// Distinctive grotesque — great for UI + headings with character.
export const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

// Elegant editorial display serif (single weight, very characterful).
export const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
  display: 'swap',
})

// Loud, experimental display — for the brutalist/zine headlines.
export const syne = Syne({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-syne',
  display: 'swap',
})

// Warm modern grotesque — friendly body alternative.
export const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-bricolage',
  display: 'swap',
})

// Quirky fixed-width with a retro edge.
export const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-space-mono',
  display: 'swap',
})

// ── Aeonik — the Neo-Brutalist display face (h1 + all bold titles). ──────────
// Aeonik is a LICENSED font (CoType Foundry) with no free/Google source, so it
// must be self-hosted from local files. Until the licensed Aeonik files are
// added, this loads Satoshi (Indian Type Foundry, already in public/fonts) as a
// close geometric-grotesque stand-in.
//
// TO USE REAL AEONIK: drop the files into public/fonts (Regular/Bold/Black, .woff2
// preferred) and replace the `src` array below, e.g.:
//   src: [
//     { path: '../../public/fonts/Aeonik-Regular.woff2', weight: '400', style: 'normal' },
//     { path: '../../public/fonts/Aeonik-Bold.woff2',    weight: '700', style: 'normal' },
//     { path: '../../public/fonts/Aeonik-Black.woff2',   weight: '900', style: 'normal' },
//   ]
// Nothing else has to change — the theme references the `--font-aeonik` variable.
export const aeonik = localFont({
  src: [
    { path: '../../public/fonts/Satoshi-Black.otf', weight: '700 900', style: 'normal' },
  ],
  variable: '--font-aeonik',
  display: 'swap',
})
