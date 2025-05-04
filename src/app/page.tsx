// src/app/page.tsx
import Hero from '@/components/home/Hero'
import AboutSection from '@/components/about/AboutSection'
import WhyHireMeSection from '@/components/why-hire-me/WhyHireMeSection'
import SkillsSection from '@/components/skills/SkillsSection'
import WorkSection from '@/components/work/WorkSection'
import ContactSection from '@/components/contact/ContactSection'

export default function Home() {
  return (
    <main>
      <Hero />
      <AboutSection />
      <WhyHireMeSection />
      <SkillsSection />
      <WorkSection />
      <ContactSection />
    </main>
  )
}