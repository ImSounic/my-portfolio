'use client'

import { useEffect } from 'react'

// ─── DEVTOOLS EASTER EGG (single accent, no emoji) ──────────────
export function DevtoolsEgg() {
  useEffect(() => {
    console.log(
      '%c>>> OH HEY. YOU OPENED DEVTOOLS.',
      'font-size:18px; font-weight:bold; color:#2b50ff; font-family:monospace; letter-spacing:0.1em',
    )
    console.log(
      '%cI\'m Sounic. I build models I can actually explain.\nMostly PyTorch, NLP, and too much PySpark.\nHiring for AI/ML internships starting Sep 2026? Let\'s talk.\n>>> imsounic.dev@gmail.com',
      'font-size:13px; color:#0a0a0a; font-family:monospace; line-height:1.7',
    )
    console.log(
      '%c[ REV 2.0 · UNIT / D-01 · the blueprint aesthetic was deliberate ]',
      'font-size:11px; color:#888; font-family:monospace; font-style:italic',
    )
  }, [])
  return null
}

