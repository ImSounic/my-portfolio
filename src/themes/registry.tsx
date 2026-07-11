// src/themes/registry.tsx
'use client'

import dynamic from 'next/dynamic'
import type { ComponentType } from 'react'
import type { ThemeId, ThemeMeta } from './types'

const load = (loader: () => Promise<{ default: ComponentType }>) =>
  dynamic(loader, { loading: () => null, ssr: false })

const OriginalTheme = load(() => import('./original/OriginalTheme'))
const BrutalistTheme = load(() => import('./brutalist/BrutalistTheme'))

export const THEMES: ThemeMeta[] = [
  {
    id: 'original',
    name: 'Original',
    description: 'The classic dark glassmorphic design',
    swatch: '#3CA2F1',
    bg: '#0c0c0c',
    Component: OriginalTheme,
  },
  {
    id: 'brutalist',
    name: 'Neo-Brutalist',
    description: 'Bold colors, hard shadows, big type',
    swatch: '#2b50ff',
    bg: '#f4f4f0',
    Component: BrutalistTheme,
  },
]

export const DEFAULT_THEME: ThemeId = 'original'

export const getTheme = (id: ThemeId): ThemeMeta =>
  THEMES.find((t) => t.id === id) ?? THEMES[0]
