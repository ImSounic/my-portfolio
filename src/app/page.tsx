// src/app/page.tsx
'use client'

import { useState } from 'react'
import ContribLoader from '@/components/ContribLoader'
import LoadingScreen from '@/components/LoadingScreen'
import { ThemeProvider, useTheme } from '@/context/ThemeContext'
import { getTheme } from '@/themes/registry'

// The Original theme's loader preloads these (only when that theme is shown).
const assetsToPreload = [
  '/profile.png',
  '/assets/videos/thinking.webm',
  '/assets/videos/adapt.webm',
  '/assets/videos/code.webm',
]

function ActiveTheme() {
  const { theme } = useTheme()
  const { Component } = getTheme(theme)
  return <Component />
}

// The theme switcher (components/layout/ThemeSwitcher.tsx) is retired:
// Contributions is the default and other themes open with ?theme=<id>.
// Contributions gets its own light loader, drawn over the theme while it
// mounts (and already in the static HTML, so it paints at once); the Original
// theme keeps its asset-preloading loader.
function Shell() {
  const { theme, hydrated } = useTheme()
  const [originalLoaded, setOriginalLoaded] = useState(false)

  if (hydrated && theme === 'original' && !originalLoaded) {
    return <LoadingScreen onLoaded={() => setOriginalLoaded(true)} assets={assetsToPreload} />
  }
  return (
    <>
      {hydrated && <ActiveTheme />}
      {theme === 'contributions' && <ContribLoader />}
    </>
  )
}

export default function Home() {
  return (
    <ThemeProvider>
      <Shell />
    </ThemeProvider>
  )
}
