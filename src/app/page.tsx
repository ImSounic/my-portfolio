// src/app/page.tsx
'use client'

import { useState } from 'react'
import LoadingScreen from '@/components/LoadingScreen'
import ThemeSwitcher from '@/components/layout/ThemeSwitcher'
import { ThemeProvider, useTheme } from '@/context/ThemeContext'
import { getTheme } from '@/themes/registry'

// Assets to preload (critical above-the-fold assets)
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

export default function Home() {
  const [assetsLoaded, setAssetsLoaded] = useState(false)

  if (!assetsLoaded) {
    return <LoadingScreen onLoaded={() => setAssetsLoaded(true)} assets={assetsToPreload} />
  }

  return (
    <ThemeProvider>
      <ThemeSwitcher />
      <ActiveTheme />
    </ThemeProvider>
  )
}
