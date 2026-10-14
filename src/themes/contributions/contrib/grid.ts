// src/themes/contributions/contrib/grid.ts
// The hero's contribution graph: Sounic's real last-year GitHub calendar
// (src/data/contributions.json, refreshed by `npm run prebuild`), with SOUNIC
// drawn across it in the brightest green. 7 rows (days) × N columns (weeks).
import snapshot from '@/data/contributions.json'

export type Cell = {
  row: number // 0..6, day of week (Sunday first, as on GitHub)
  col: number // week index, oldest first
  level: number // real contribution level 0..4, or -1 where the graph has no day
  letter: boolean // part of the SOUNIC lettering
  shown: number // level drawn in the graph: letters 4, a one-cell dark margin around them, else the real level
}

// 5-row glyphs; '#' is a lit cell. They sit on rows 1..5 of the 7-row graph.
const GLYPHS: Record<string, string[]> = {
  S: ['.###', '#...', '.##.', '...#', '###.'],
  O: ['.##.', '#..#', '#..#', '#..#', '.##.'],
  U: ['#..#', '#..#', '#..#', '#..#', '.##.'],
  N: ['#...#', '##..#', '#.#.#', '#..##', '#...#'],
  I: ['###', '.#.', '.#.', '.#.', '###'],
  C: ['.###', '#...', '#...', '#...', '.###'],
}
export const WORD = 'SOUNIC'

export const WEEKS: number = snapshot.weeks
export const TOTAL: number = snapshot.total
export const RANGE = { from: snapshot.from as string | null, to: snapshot.to as string | null }

const wordWidth = [...WORD].reduce((w, ch) => w + GLYPHS[ch][0].length, 0) + WORD.length - 1
export const WORD_START = Math.floor((WEEKS - wordWidth) / 2)
export const WORD_END = WORD_START + wordWidth // exclusive

const mask = new Set<string>()
{
  let x = WORD_START
  for (const ch of WORD) {
    const g = GLYPHS[ch]
    g.forEach((line, r) => [...line].forEach((c, k) => { if (c === '#') mask.add(`${r + 1}-${x + k}`) }))
    x += g[0].length + 1
  }
}

// Cells touching a letter (8-neighbourhood) are drawn empty so the word reads
// cleanly; everywhere else the graph shows the real level.
const nearLetter = (row: number, col: number) => {
  for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) if (mask.has(`${row + dr}-${col + dc}`)) return true
  return false
}

export const CELLS: Cell[] = []
for (let col = 0; col < WEEKS; col++) {
  for (let row = 0; row < 7; row++) {
    const level = (snapshot.levels as number[][])[row]?.[col] ?? -1
    const letter = mask.has(`${row}-${col}`)
    const shown = letter ? 4 : level < 0 ? -1 : nearLetter(row, col) ? 0 : level
    CELLS.push({ row, col, level, letter, shown })
  }
}

// GitHub dark graph colours. Letters use the top level; the real data behind
// them is drawn one notch quieter so the name reads first.
export const GREENS = ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'] as const
export const LETTER_GREEN = GREENS[4]
export const backgroundColorOf = (level: number) =>
  level <= 0 ? GREENS[0] : level === 1 ? GREENS[1] : level <= 3 ? GREENS[1] : GREENS[2]
