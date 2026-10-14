// scripts/fetch-contributions.mjs
// Snapshot of the public GitHub contribution calendar for the Contributions
// theme. Runs before `next build` (npm "prebuild"); on any failure it keeps the
// existing snapshot so builds never break offline.
//   node scripts/fetch-contributions.mjs [user]
import { writeFileSync, existsSync } from 'node:fs'

const USER = process.argv[2] || 'ImSounic'
const OUT = new URL('../src/data/contributions.json', import.meta.url)

try {
  const res = await fetch(`https://github.com/users/${USER}/contributions`, {
    headers: { 'User-Agent': 'portfolio-contributions-snapshot' },
    signal: AbortSignal.timeout(15000),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const html = await res.text()

  // Each day: <td ... data-date="YYYY-MM-DD" id="contribution-day-component-ROW-COL" data-level="L">
  const cell = /data-date="(\d{4}-\d{2}-\d{2})"\s+id="contribution-day-component-(\d+)-(\d+)"\s+data-level="(\d)"/g
  const days = []
  for (const m of html.matchAll(cell)) days.push({ date: m[1], row: +m[2], col: +m[3], level: +m[4] })
  if (days.length < 300) throw new Error(`only ${days.length} days parsed`)

  // Counts live in the tooltips: "3 contributions on May 2nd." / "No contributions on ..."
  const tip = /for="contribution-day-component-(\d+)-(\d+)"[^>]*>(No|\d+) contributions? on/g
  const counts = new Map()
  for (const m of html.matchAll(tip)) counts.set(`${m[1]}-${m[2]}`, m[3] === 'No' ? 0 : +m[3])

  const weeks = Math.max(...days.map((d) => d.col)) + 1
  const levels = Array.from({ length: 7 }, () => Array(weeks).fill(-1)) // -1 = no day (future / before range)
  let total = 0
  for (const d of days) {
    levels[d.row][d.col] = d.level
    total += counts.get(`${d.row}-${d.col}`) ?? 0
  }
  const sorted = days.map((d) => d.date).sort()
  const snapshot = { user: USER, fetchedAt: new Date().toISOString(), from: sorted[0], to: sorted.at(-1), total, weeks, levels }
  writeFileSync(OUT, JSON.stringify(snapshot) + '\n')
  console.log(`contributions: ${days.length} days, ${weeks} weeks, ${total} contributions (${snapshot.from} to ${snapshot.to})`)
} catch (err) {
  const keep = existsSync(OUT) ? 'keeping the existing snapshot' : 'no snapshot exists yet'
  console.warn(`contributions: fetch failed (${err.message}); ${keep}`)
  if (!existsSync(OUT)) {
    // An empty-but-valid snapshot keeps the theme rendering (all grey).
    writeFileSync(OUT, JSON.stringify({ user: USER, fetchedAt: null, from: null, to: null, total: 0, weeks: 53, levels: Array.from({ length: 7 }, () => Array(53).fill(0)) }) + '\n')
  }
}
