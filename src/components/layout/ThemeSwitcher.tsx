// src/components/layout/ThemeSwitcher.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useTheme } from '@/context/ThemeContext'
import { THEMES } from '@/themes/registry'

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Close on outside click / Escape
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  const active = THEMES.find((t) => t.id === theme) ?? THEMES[0]

  return (
    <div ref={ref} className="fixed top-4 right-4 z-[10000]" style={{ cursor: 'auto' }}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Switch theme"
        className="group flex items-center gap-2 rounded-full border border-white/15 bg-black/60 px-3.5 py-2 text-sm font-medium text-white shadow-lg backdrop-blur-xl transition-all hover:border-white/30 hover:bg-black/80"
        style={{ cursor: 'pointer' }}
      >
        <span
          className="h-3.5 w-3.5 rounded-full ring-2 ring-white/20 transition-transform group-hover:scale-110"
          style={{ background: active.swatch }}
        />
        <span className="hidden sm:inline">Theme</span>
        <motion.svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
        >
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute right-0 mt-2 w-72 origin-top-right overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c0c]/95 p-2 shadow-2xl backdrop-blur-2xl"
          >
            <div className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-white/40">
              Choose a theme
            </div>
            <div className="max-h-[60vh] space-y-0.5 overflow-y-auto">
              {THEMES.map((t) => {
                const selected = t.id === theme
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTheme(t.id)
                      setOpen(false)
                    }}
                    className={`flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-colors ${
                      selected ? 'bg-white/10' : 'hover:bg-white/5'
                    }`}
                    style={{ cursor: 'pointer' }}
                  >
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ring-1 ring-white/10"
                      style={{ background: t.bg }}
                    >
                      <span className="h-3.5 w-3.5 rounded-full" style={{ background: t.swatch }} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-white">{t.name}</span>
                      <span className="block truncate text-xs text-white/40">{t.description}</span>
                    </span>
                    {selected && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0 text-white">
                        <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
