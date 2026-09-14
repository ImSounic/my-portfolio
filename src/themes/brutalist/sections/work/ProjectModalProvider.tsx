'use client'

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { AnimatePresence } from 'motion/react'
import { projects } from '@/data/portfolio'
import { ProjectModal } from '@/themes/brutalist/sections/work/ProjectModal'

type ProjectModalApi = {
  openId: string | null
  open: (id: string, triggerEl: HTMLElement | null) => void
  close: () => void
}

const ProjectModalContext = createContext<ProjectModalApi>({ openId: null, open: () => {}, close: () => {} })

export const useProjectModal = () => useContext(ProjectModalContext)

// Owns the single project modal so any section (the board, the playbook)
// can open a project in place. Focus returns to the element that opened it.
export function ProjectModalProvider({ children }: { children: ReactNode }) {
  const [openId, setOpenId] = useState<string | null>(null)
  const [triggerEl, setTriggerEl] = useState<HTMLElement | null>(null)

  const open = useCallback((id: string, el: HTMLElement | null) => {
    setTriggerEl(el)
    setOpenId(id)
  }, [])
  const close = useCallback(() => setOpenId(null), [])

  const project = projects.find((p) => p.id === openId) ?? null

  return (
    <ProjectModalContext.Provider value={{ openId, open, close }}>
      {children}
      <AnimatePresence>
        {project && <ProjectModal key={project.id} project={project} onClose={close} triggerEl={triggerEl} />}
      </AnimatePresence>
    </ProjectModalContext.Provider>
  )
}
