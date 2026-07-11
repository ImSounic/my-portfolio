// src/context/ThemeContext.tsx
'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { ThemeId } from '@/themes/types'
import { DEFAULT_THEME, THEMES } from '@/themes/registry'

const isValidTheme = (id: string | null): id is ThemeId =>
  !!id && THEMES.some((t) => t.id === id)

const STORAGE_KEY = 'portfolio-theme'

interface ThemeContextValue {
  theme: ThemeId
  setTheme: (id: ThemeId) => void
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: DEFAULT_THEME,
  setTheme: () => {},
})

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>(DEFAULT_THEME)

  // Hydrate from localStorage after mount (avoids SSR mismatch)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (isValidTheme(stored)) {
        setThemeState(stored)
      } else if (stored) {
        // Stale/removed theme (e.g. an old 'minimal') — reset to default.
        localStorage.setItem(STORAGE_KEY, DEFAULT_THEME)
      }
    } catch {
      /* ignore */
    }
  }, [])

  const setTheme = (id: ThemeId) => {
    setThemeState(id)
    try {
      localStorage.setItem(STORAGE_KEY, id)
    } catch {
      /* ignore */
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
