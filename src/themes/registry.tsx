// src/themes/registry.tsx
'use client'

import dynamic from 'next/dynamic'
import type { ComponentType } from 'react'
import type { ThemeId, ThemeMeta } from './types'

const load = (loader: () => Promise<{ default: ComponentType }>) =>
  dynamic(loader, { loading: () => null, ssr: false })

const OriginalTheme = load(() => import('./original/OriginalTheme'))
const BrutalistTheme = load(() => import('./brutalist/BrutalistTheme'))
const ContributionsTheme = load(() => import('./contributions/ContributionsTheme'))

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
  {
    id: 'contributions',
    name: 'Contributions',
    description: 'My real GitHub graph spells my name, then becomes a network',
    swatch: '#39d353',
    bg: '#0d1117',
    Component: ContributionsTheme,
  },
]

export const DEFAULT_THEME: ThemeId = 'contributions'

export const getTheme = (id: ThemeId): ThemeMeta =>
  THEMES.find((t) => t.id === id) ?? THEMES[0]
