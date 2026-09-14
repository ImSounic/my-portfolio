'use client'

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { projects } from '@/data/portfolio'

type Project = (typeof projects)[number]

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// A skill matches a project by tag, or as a whole word anywhere in its copy.
export const projectMatchesSkill = (project: Project, skill: string) => {
  const needle = skill.toLowerCase()
  if (project.tags.some((t) => t.toLowerCase() === needle)) return true
  const re = new RegExp(`(^|[^a-z0-9])${escape(needle)}(?![a-z0-9])`, 'i')
  return re.test(`${project.title} ${project.subtitle} ${project.blurb} ${project.description} ${project.tags.join(' ')}`)
}

export const projectsForSkill = (skill: string) => projects.filter((p) => projectMatchesSkill(p, skill))

type FilterApi = { filter: string | null; setFilter: (skill: string | null) => void }
const ProjectFilterContext = createContext<FilterApi>({ filter: null, setFilter: () => {} })
export const useProjectFilter = () => useContext(ProjectFilterContext)

export function ProjectFilterProvider({ children }: { children: ReactNode }) {
  const [filter, setFilterState] = useState<string | null>(null)
  const setFilter = useCallback((skill: string | null) => setFilterState(skill), [])
  const value = useMemo(() => ({ filter, setFilter }), [filter, setFilter])
  return <ProjectFilterContext.Provider value={value}>{children}</ProjectFilterContext.Provider>
}
