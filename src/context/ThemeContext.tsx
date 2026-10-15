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
  /** false until the URL has been read on the client; until then `theme` is DEFAULT_THEME. */
  hydrated: boolean
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: DEFAULT_THEME,
  setTheme: () => {},
  hydrated: false,
})

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>(DEFAULT_THEME)
  const [hydrated, setHydrated] = useState(false)

  // Hydrate after mount (avoids SSR mismatch). There is no theme switcher on
  // the page any more, so a choice stored by the old switcher is cleared and
  // everyone gets DEFAULT_THEME; a `?theme=<id>` link still shows another
  // theme for that visit (the other themes' code is kept).
  useEffect(() => {
    try {
      localStorage.removeItem(STORAGE_KEY)
      const linked = new URLSearchParams(window.location.search).get('theme')
      if (isValidTheme(linked)) setThemeState(linked)
    } catch {
      /* ignore */
    }
    setHydrated(true)
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
    <ThemeContext.Provider value={{ theme, setTheme, hydrated }}>{children}</ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
