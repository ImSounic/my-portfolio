// src/themes/registry.tsx
'use client'

import dynamic from 'next/dynamic'
import type { ComponentType } from 'react'
import type { ThemeId, ThemeMeta } from './types'

const load = (loader: () => Promise<{ default: ComponentType }>) =>
  dynamic(loader, { loading: () => null, ssr: false })

const OriginalTheme = load(() => import('./original/OriginalTheme'))
const MinimalTheme = load(() => import('./minimal/MinimalTheme'))
const Minimal2Theme = load(() => import('./minimal2/Minimal2Theme'))
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
    id: 'minimal',
    name: 'Minimal',
    description: 'Art-directed editorial magazine',
    swatch: '#8b1a1a',
    bg: '#f5f2ea',
    Component: MinimalTheme,
  },
  {
    id: 'minimal2',
    name: 'Minimal 2',
    description: 'Clean Notion/Linear-style workspace',
    swatch: '#1F6C9F',
    bg: '#f7f6f3',
    Component: Minimal2Theme,
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
