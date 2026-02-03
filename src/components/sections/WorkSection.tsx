// src/components/sections/WorkSection.tsx
'use client'

import Image from 'next/image'
import { useState } from 'react'
import localFont from 'next/font/local'
import { Montserrat } from 'next/font/google'
import circleSvg from '@/assets/icons/circle.svg'
import arrowSvg from '@/assets/icons/arrow.svg'
import iStarSvg from '@/assets/icons/i_star.svg'

const satoshi = localFont({
  src: [{ path: '../../../public/fonts/Satoshi-Black.otf', weight: '900', style: 'normal' }],
  variable: '--font-satoshi',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-montserrat',
})

const projects = [
  {
    id: 1,
    title: 'DEEP LEARNING',
    description: 'Miscarriage Prediction using Ensemble Deep Learning Models. Models Used in the project: TabTransformer, FT-Transformer, and TabNet. This project showcases my ability to work with complex data and implement advanced machine learning techniques.',
    shortDesc: 'Miscarriage Prediction using Ensemble Deep Learning Models. Models Used in the project: TabTransformer, FT-Transformer, and TabNet.',
    image: '/projects/ai-project.png',
    github: 'https://github.com/ImSounic/Miscarriage-Prediction-Using-Ensemble-Deep-Learning-Model.git',
    circleImg: '/project-2.png',
    glassCard: '/assets/images/glass-card.png',
  },
  {
    id: 2,
    title: 'HOUSE OF GAMES',
    description: 'Created A Quiz Game Inspired By The British TV Show "House Of Games". Implemented Various Game Rounds And Scoring Mechanisms. This Project Highlights My Creativity And Ability To Develop Entertaining Applications.',
    shortDesc: 'Created A Quiz Game Inspired By The British TV Show "House Of Games". Implemented Various Game Rounds And Scoring Mechanisms.',
    image: '/projects/house-of-games.png',
    github: 'https://github.com/ImSounic/House-Of-Games.git',
    circleImg: '/project-4.png',
    glassCard: '/assets/images/glass-card.png',
  },
  {
    id: 3,
    title: 'INTERNSHIP',
    description: 'Built A Chatbot For The Hyderabad Municipal Corporation (India) And Trained Bots Through Web Scraping Using Python. This Experience Enhanced My Backend Development Skills And Gave Me Practical Experience In Deploying AI Solutions.',
    shortDesc: 'Built A Chatbot For The Hyderabad Municipal Corporation (India) And Trained Bots Through Web Scraping Using Python. This Experience Enhanced My Backend Development Skills And Gave Me Practical Experience In Deploying AI Solutions.',
    image: '/projects/internship.png',
    company: 'CORETEK LABS',
    duration: 'JUN-SEP 2023',
    decorationType: 'star' as const,
    glassCard: '/assets/images/glass-card-i.png',
  },
  {
    id: 4,
    title: 'CLEANSLATE',
    description: 'A chore-splitting app for university students sharing living spaces. Features automated task distribution, and real-time notifications to ensure fair household responsibilities. Built to promote harmonious co-living through intelligent chore management.',
    shortDesc: 'A smart chore-splitting app for university students sharing living spaces. Features automated task distribution, and real-time notifications to ensure fair household responsibilities. Built to promote harmonious co-living through intelligent chore management.',
    image: '/projects/cleanslate.png',
    comingSoon: true,
    github: '#',
    circleImg: '/project-3.png',
    glassCard: '/assets/images/glass-card.png',
  }
]

const GitHubIcon = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="black">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
)

const fontClasses = `${satoshi.variable} ${montserrat.variable}`

// ============ MOBILE COMPONENT ============
function MobileWork() {
  const [activeProject, setActiveProject] = useState(0)
  const project = projects[activeProject]

  return (
    <section id="work" className={`${fontClasses} h-screen overflow-hidden bg-[#0c0c0c] relative flex flex-col items-center py-16 px-4 md:hidden`}>
      <h2 className="font-[family-name:var(--font-satoshi)] text-3xl font-bold text-white text-center mb-6 mt-8">PROJECTS</h2>
      <div className="w-full max-w-sm mx-auto">
        <h3 className="font-[family-name:var(--font-satoshi)] text-2xl font-bold text-white text-center mb-4">{project.title}</h3>
        <div className="relative w-full h-48 rounded-lg overflow-hidden mb-4">
          <Image src={project.image} alt={project.title} fill className="object-cover" />
          {project.github && !project.comingSoon ? (
            <div className="absolute bottom-2 left-2 z-10">
              <a href={project.github} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <GitHubIcon size={16} />
              </a>
            </div>
          ) : project.company ? (
            <div className="absolute bottom-2 left-2 bg-black/80 text-white px-2 py-1 rounded text-xs z-10">{project.company} | {project.duration}</div>
          ) : project.comingSoon ? (
            <div className="absolute bottom-2 left-2 bg-white text-black px-2 py-1 rounded text-xs font-medium z-10">Coming Soon...</div>
          ) : null}
        </div>
        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-lg p-3 mb-6">
          <p className="font-[family-name:var(--font-montserrat)] text-white text-xs leading-relaxed">{project.description}</p>
        </div>
        <div className="flex justify-between items-center">
          <button onClick={() => setActiveProject((prev) => (prev - 1 + projects.length) % projects.length)} className="w-10 h-10 border border-white/30 rounded-full flex items-center justify-center text-white">&lt;</button>
          <div className="text-white/50 text-sm">{activeProject + 1} / {projects.length}</div>
          <button onClick={() => setActiveProject((prev) => (prev + 1) % projects.length)} className="w-10 h-10 border border-white/30 rounded-full flex items-center justify-center text-white">&gt;</button>
        </div>
      </div>
    </section>
  )
}

// ============ TABLET PROJECT VIEWPORT ============
function TabletProjectViewport({ project, isFirst }: { project: typeof projects[0], index: number, isFirst?: boolean }) {
  const isInternship = project.decorationType === 'star'
  
  return (
    <section id={isFirst ? 'work' : undefined} className={`${fontClasses} h-screen overflow-hidden bg-[#0c0c0c] relative hidden md:flex xl:hidden flex-col items-center justify-center px-6`}>
      {isFirst && (
        <div className="mb-16">
          <h2 className="font-[family-name:var(--font-satoshi)] text-4xl md:text-5xl font-bold text-white">PROJECTS</h2>
        </div>
      )}
      <div className="w-full max-w-xl mx-auto">
        <div className="relative">
          {/* Decoration */}
          {isInternship ? (
            <div className="absolute -bottom-[-118px] -right-20 w-40 h-40 z-0">
              <Image src={iStarSvg} alt="Star decoration" width={160} height={160} />
            </div>
          ) : (
            <div className="absolute -bottom-[-158px] -right-12 w-35 h-35 z-0">
              <Image src={circleSvg} alt="Circle decoration" width={100} height={100} />
              {project.circleImg && (
                <div className="absolute top-[-20px] left-[-20px] right-[-20px] bottom-[-20px] flex items-center justify-center">
                  <Image src={project.circleImg} alt="Project text circle" width={200} height={200} className="object-contain animate-spin-slow" />
                </div>
              )}
            </div>
          )}

          {/* Glass Card */}
          <div className="relative w-full h-[720px] z-10">
            <Image src={project.glassCard} alt="Glass card background" fill className="object-contain" />
            <div className="absolute top-48 left-[0px] right-24 p-4">
              <p className="font-[family-name:var(--font-montserrat)] text-white text-sm leading-relaxed max-w-[450px] mx-auto">{project.shortDesc || project.description}</p>
            </div>
          </div>

          {/* Project Image */}
          <div className="absolute -bottom-[-132px] -left-12 w-[550px] h-[300px] rounded-2xl overflow-hidden shadow-2xl z-20">
            <Image src={project.image} alt={project.title} fill className="object-cover" />
            {project.github && !project.comingSoon ? (
              <div className="absolute bottom-4 left-4 flex items-center gap-3 z-30">
                <a href={project.github} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
                  <GitHubIcon size={20} />
                </a>
                <div className="w-8 h-8"><Image src={arrowSvg} alt="Arrow" width={32} height={32} className="object-contain" /></div>
              </div>
            ) : project.company ? (
              <div className="absolute bottom-4 left-4 bg-black/80 text-white px-4 py-2 rounded-lg z-30">
                <p className="text-sm font-medium">{project.company}</p>
                <p className="text-xs">{project.duration}</p>
              </div>
            ) : project.comingSoon ? (
              <div className="absolute bottom-4 left-4 z-30"><div className="bg-white text-black font-[family-name:var(--font-montserrat)] font-semibold px-4 py-2 rounded-lg">Coming Soon...</div></div>
            ) : null}
          </div>

          {/* Vertical Title */}
          <div className="absolute right-8 top-1/2 -translate-y-1/2 z-30">
            <h3 className="font-[family-name:var(--font-satoshi)] text-2xl font-bold text-white tablet-project-title" style={{ writingMode: 'vertical-rl', transform: 'rotate(360deg) translateZ(0)', willChange: 'transform', backfaceVisibility: 'hidden' }}>
              {project.title}
            </h3>
          </div>
        </div>
      </div>
    </section>
  )
}

// ============ DESKTOP PROJECT VIEWPORT ============
function DesktopProjectViewport({ project, isFirst }: { project: typeof projects[0], index: number, isFirst?: boolean }) {
  const isInternship = project.decorationType === 'star'
  
  return (
    <section id={isFirst ? 'work' : undefined} className={`${fontClasses} h-screen overflow-hidden bg-[#0c0c0c] relative hidden xl:flex ${isFirst ? 'flex-col' : ''} items-center justify-center`}>
      {isFirst && (
        <div className="mb-24">
          <h2 className="font-[family-name:var(--font-satoshi)] text-6xl md:text-7xl font-bold text-white">PROJECTS</h2>
        </div>
      )}
      <div className="w-full max-w-7xl mx-auto px-8">
        <div className="relative">
          {/* Decoration */}
          {isInternship ? (
            <div className="absolute -bottom-28 -right-[-50px] w-60 h-60 z-0">
              <Image src={iStarSvg} alt="Star decoration" width={260} height={260} />
            </div>
          ) : (
            <div className="absolute -bottom-20 -right-[-80px] w-40 h-40 z-0">
              <Image src={circleSvg} alt="Circle decoration" width={140} height={140} />
              {project.circleImg && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image src={project.circleImg} alt="Project text circle" width={280} height={280} className="object-contain animate-spin-slow mr-4 mb-4" />
                </div>
              )}
            </div>
          )}

          {/* Glass Card */}
          <div className="relative w-full h-[500px] z-10">
            <Image src={project.glassCard} alt="Glass card background" fill className="object-contain" />
            <div className="absolute top-[-8px] left-36 right-12 p-8">
              <p className="font-[family-name:var(--font-montserrat)] text-white text-l leading-relaxed max-w-[700px]">{project.description}</p>
            </div>
          </div>

          {/* Project Image */}
          <div className="absolute -bottom-16 -left-[-60px] w-[850px] h-[450px] rounded-2xl overflow-hidden shadow-2xl z-20">
            <Image src={project.image} alt={project.title} fill className="object-cover" />
            {project.github && !project.comingSoon ? (
              <div className="absolute bottom-8 left-8 flex items-center gap-4 z-30">
                <a href={project.github} target="_blank" rel="noopener noreferrer" className="w-14 h-14 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
                  <GitHubIcon size={28} />
                </a>
                <div className="w-12 h-12"><Image src={arrowSvg} alt="Arrow" width={48} height={48} className="object-contain" /></div>
              </div>
            ) : project.company ? (
              <div className="absolute bottom-8 left-8 bg-black/80 text-white px-4 py-2 rounded-lg z-30">
                <p className="text-sm font-medium">{project.company}</p>
                <p className="text-xs">{project.duration}</p>
              </div>
            ) : project.comingSoon ? (
              <div className="absolute bottom-8 left-8 z-30"><div className="bg-white text-black font-[family-name:var(--font-montserrat)] font-semibold px-6 py-3 rounded-lg">Coming Soon...</div></div>
            ) : null}
          </div>

          {/* Vertical Title */}
          <div className="absolute right-24 top-64 -translate-y-1/2 -translate-x-36 z-20">
            <h3 className="font-[family-name:var(--font-satoshi)] text-4xl font-bold text-white" style={{ writingMode: 'vertical-rl', transform: 'rotate(360deg)' }}>
              {project.title}
            </h3>
          </div>
        </div>
      </div>
    </section>
  )
}

// ============ MAIN EXPORT ============
export default function WorkSection() {
  return (
    <>
      {/* Mobile */}
      <MobileWork />

      {/* Tablet */}
      {projects.map((project, i) => (
        <TabletProjectViewport key={`tablet-${project.id}`} project={project} index={i} isFirst={i === 0} />
      ))}

      {/* Desktop */}
      {projects.map((project, i) => (
        <DesktopProjectViewport key={`desktop-${project.id}`} project={project} index={i} isFirst={i === 0} />
      ))}
    </>
  )
}
