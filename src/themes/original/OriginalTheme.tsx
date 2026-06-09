// src/themes/original/OriginalTheme.tsx
'use client'

import { type ComponentType } from 'react'
import dynamic from 'next/dynamic'
import Navbar from '@/components/layout/Navbar'
import FirefoxFixProvider from '@/components/layout/FirefoxFixProvider'
import ScrollSnap from '@/components/layout/ScrollSnap'
import TargetCursor from '@/components/ui/reactbits/TargetCursor'

type SectionComponent = ComponentType
const withClientDynamic = (loader: () => Promise<{ default: SectionComponent }>) =>
  dynamic(loader, { loading: () => null, ssr: false })

const Hero = withClientDynamic(() => import('@/components/sections/Hero'))
const AboutSection = withClientDynamic(() => import('@/components/sections/AboutSection'))
const WhyHireMeSection = withClientDynamic(() => import('@/components/sections/WhyHireMeSection'))
const SkillsSection = withClientDynamic(() => import('@/components/sections/SkillsSection'))
const WorkSection = withClientDynamic(() => import('@/components/sections/WorkSection'))
const ContactSection = withClientDynamic(() => import('@/components/sections/ContactSection'))

export default function OriginalTheme() {
  return (
    <div className="theme-original">
      <Navbar />
      <FirefoxFixProvider>
        <ScrollSnap />
        <TargetCursor targetSelector="button, a" spinDuration={3} hoverDuration={0.4} parallaxOn={true} />
        <main className="fade-in relative z-10">
          <Hero />
          <AboutSection />
          <WhyHireMeSection />
          <SkillsSection />
          <WorkSection />
          <ContactSection />
        </main>
      </FirefoxFixProvider>
    </div>
  )
}
