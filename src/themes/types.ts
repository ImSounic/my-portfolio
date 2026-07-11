// src/themes/types.ts
import type { ComponentType } from 'react'

export type ThemeId =
  | 'original'
  | 'brutalist'

export interface ThemeMeta {
  id: ThemeId
  name: string
  description: string
  /** Accent color shown as a swatch in the theme switcher */
  swatch: string
  /** Background color shown behind the swatch */
  bg: string
  Component: ComponentType
}
