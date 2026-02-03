// src/components/sections/WorkSection.tsx
'use client'

import Image from 'next/image'
import { useState, useRef, useCallback } from 'react'
import gsap from 'gsap'
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
    title: 'BIG DATA',
    description: 'Distributed PySpark pipeline on HDFS processing Binance crypto data for 1000+ pairs. Built liquidity/volatility metrics and BTC/ETH shock propagation analysis. Studied cross-market spillovers using VAR models and regime-based sensitivity analysis.',
    shortDesc: 'PySpark pipeline on HDFS analyzing Binance data for 1000+ crypto pairs with shock propagation and spillover analysis.',
    image: '/projects/big-data.png',
    github: 'https://github.com/ImSounic/mbd-project-binance',
    circleImg: '/project-bigdata.png',
    glassCard: '/assets/images/glass-card.png',
  },
  {
    id: 2,
    title: 'DEEP LEARNING',
    description: 'Miscarriage Prediction using Ensemble Deep Learning Models. Models Used in the project: TabTransformer, FT-Transformer, and TabNet. This project showcases my ability to work with complex data and implement advanced machine learning techniques.',
    shortDesc: 'Miscarriage Prediction using Ensemble Deep Learning Models. Models Used in the project: TabTransformer, FT-Transformer, and TabNet.',
    image: '/projects/ai-project.jpg',
    github: 'https://github.com/ImSounic/Miscarriage-Prediction-Using-Ensemble-Deep-Learning-Model.git',
    circleImg: '/project-deeplearning.png',
    glassCard: '/assets/images/glass-card.png',
  },
  {
    id: 3,
    title: 'HOUSE OF GAMES',
    description: 'Created A Quiz Game Inspired By The British TV Show "House Of Games". Implemented Various Game Rounds And Scoring Mechanisms. This Project Highlights My Creativity And Ability To Develop Entertaining Applications.',
    shortDesc: 'Created A Quiz Game Inspired By The British TV Show "House Of Games". Implemented Various Game Rounds And Scoring Mechanisms.',
    image: '/projects/house-of-games.jpg',
    github: 'https://github.com/ImSounic/House-Of-Games.git',
    circleImg: '/project-houseofgames.png',
    glassCard: '/assets/images/glass-card.png',
  },
  {
    id: 4,
    title: 'INTERNSHIP',
    description: 'Built A Chatbot For The Hyderabad Municipal Corporation (India) And Trained Bots Through Web Scraping Using Python. This Experience Enhanced My Backend Development Skills And Gave Me Practical Experience In Deploying AI Solutions.',
    shortDesc: 'Built A Chatbot For The Hyderabad Municipal Corporation (India) And Trained Bots Through Web Scraping Using Python.',
    image: '/projects/internship.jpg',
    company: 'CORETEK LABS',
    duration: 'JUN-SEP 2023',
    decorationType: 'star' as const,
    glassCard: '/assets/images/glass-card-i.png',
  },
  {
    id: 5,
    title: 'CLEANSLATE',
    description: 'A chore-splitting app for university students sharing living spaces. Features automated task distribution, and real-time notifications to ensure fair household responsibilities. Built to promote harmonious co-living through intelligent chore management.',
    shortDesc: 'A smart chore-splitting app for university students sharing living spaces. Features automated task distribution and real-time notifications.',
    image: '/projects/cleanslate.jpg',
    comingSoon: true,
    github: '#',
    circleImg: '/project-cleanslate.png',
    glassCard: '/assets/images/glass-card.png',
  }
]

const GitHubIcon = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="black">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
)

const fontClasses = `${satoshi.variable} ${montserrat.variable}`

// ============ DOT INDICATORS ============
function DotIndicators({ total, active, onDotClick }: { total: number; active: number; onDotClick: (index: number) => void }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onDotClick(i)}
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            i === active 
              ? 'bg-[#E9F5DB] scale-125' 
              : 'bg-white/30 hover:bg-white/50'
          }`}
          aria-label={`Go to project ${i + 1}`}
        />
      ))}
    </div>
  )
}

// ============ MOBILE CAROUSEL ============
function MobileCarousel() {
  const [activeProject, setActiveProject] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  const animateSlide = useCallback((newIndex: number, direction: 'left' | 'right') => {
    if (isAnimating || !contentRef.current) return
    setIsAnimating(true)

    const exitX = direction === 'left' ? -100 : 100
    const enterX = direction === 'left' ? 100 : -100

    gsap.to(contentRef.current, {
      x: exitX,
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        setActiveProject(newIndex)
        gsap.set(contentRef.current, { x: enterX })
        gsap.to(contentRef.current, {
          x: 0,
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out',
          onComplete: () => setIsAnimating(false),
        })
      },
    })
  }, [isAnimating])

  const goToProject = (index: number) => {
    if (index === activeProject || isAnimating) return
    const direction = index > activeProject ? 'left' : 'right'
    animateSlide(index, direction)
  }

  const nextProject = () => {
    const newIndex = (activeProject + 1) % projects.length
    animateSlide(newIndex, 'left')
  }

  const prevProject = () => {
    const newIndex = (activeProject - 1 + projects.length) % projects.length
    animateSlide(newIndex, 'right')
  }

  const project = projects[activeProject]

  return (
    <section className={`${fontClasses} h-screen overflow-hidden bg-[#0c0c0c]/15 relative flex flex-col items-center py-16 px-4 md:hidden`}>
      <h2 className="font-[family-name:var(--font-satoshi)] text-3xl font-bold text-white text-center mb-6 mt-8">PROJECTS</h2>
      
      <div ref={contentRef} className="w-full max-w-sm mx-auto flex-1 flex flex-col">
        <h3 className="font-[family-name:var(--font-satoshi)] text-2xl font-bold text-white text-center mb-4">{project.title}</h3>
        <div className="relative w-full h-48 rounded-lg overflow-hidden mb-4">
          <Image src={project.image} alt={project.title} fill className="object-cover" loading="lazy" />
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
        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-lg p-3 mb-4">
          <p className="font-[family-name:var(--font-montserrat)] text-white text-xs leading-relaxed">{project.shortDesc || project.description}</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-6 mb-4">
        <button onClick={prevProject} disabled={isAnimating} className="w-10 h-10 border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors disabled:opacity-50">&lt;</button>
        <button onClick={nextProject} disabled={isAnimating} className="w-10 h-10 border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors disabled:opacity-50">&gt;</button>
      </div>

      <DotIndicators total={projects.length} active={activeProject} onDotClick={goToProject} />
    </section>
  )
}

// ============ TABLET CAROUSEL ============
function TabletCarousel() {
  const [activeProject, setActiveProject] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  const animateSlide = useCallback((newIndex: number, direction: 'left' | 'right') => {
    if (isAnimating || !contentRef.current) return
    setIsAnimating(true)

    const exitX = direction === 'left' ? -80 : 80
    const enterX = direction === 'left' ? 80 : -80

    gsap.to(contentRef.current, {
      x: exitX,
      opacity: 0,
      scale: 0.95,
      duration: 0.4,
      ease: 'power2.in',
      onComplete: () => {
        setActiveProject(newIndex)
        gsap.set(contentRef.current, { x: enterX, scale: 0.95 })
        gsap.to(contentRef.current, {
          x: 0,
          opacity: 1,
          scale: 1,
          duration: 0.4,
          ease: 'power2.out',
          onComplete: () => setIsAnimating(false),
        })
      },
    })
  }, [isAnimating])

  const goToProject = (index: number) => {
    if (index === activeProject || isAnimating) return
    const direction = index > activeProject ? 'left' : 'right'
    animateSlide(index, direction)
  }

  const nextProject = () => {
    const newIndex = (activeProject + 1) % projects.length
    animateSlide(newIndex, 'left')
  }

  const prevProject = () => {
    const newIndex = (activeProject - 1 + projects.length) % projects.length
    animateSlide(newIndex, 'right')
  }

  const project = projects[activeProject]
  const isInternship = project.decorationType === 'star'

  return (
    <section className={`${fontClasses} h-screen overflow-hidden bg-[#0c0c0c]/15 relative hidden md:flex xl:hidden flex-col items-center pt-24 px-6`}>
      <h2 className="font-[family-name:var(--font-satoshi)] text-4xl md:text-5xl font-bold text-white mb-6">PROJECTS</h2>

      <div ref={contentRef} className="w-full max-w-xl mx-auto">
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
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image src={project.circleImg} alt="Project text circle" width={250} height={250} className="object-contain animate-spin-slow" />
                </div>
              )}
            </div>
          )}

          {/* Glass Card */}
          <div className="relative w-full h-[500px] z-10">
            <Image src={project.glassCard} alt="Glass card background" fill className="object-contain" />
            <div className="absolute top-32 left-4 right-20 p-4">
              <p className="font-[family-name:var(--font-montserrat)] text-white text-sm leading-relaxed max-w-[400px]">{project.shortDesc || project.description}</p>
            </div>
          </div>

          {/* Project Image */}
          <div className="absolute -bottom-[-80px] -left-8 w-[450px] h-[250px] rounded-2xl overflow-hidden shadow-2xl z-20">
            <Image src={project.image} alt={project.title} fill className="object-cover" loading="lazy" />
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
          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-30">
            <h3 className="font-[family-name:var(--font-satoshi)] text-2xl font-bold text-white" style={{ writingMode: 'vertical-rl' }}>
              {project.title}
            </h3>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-40">
        <button onClick={prevProject} disabled={isAnimating} className="w-12 h-12 border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors disabled:opacity-50">
          &lt;
        </button>
      </div>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-40">
        <button onClick={nextProject} disabled={isAnimating} className="w-12 h-12 border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors disabled:opacity-50">
          &gt;
        </button>
      </div>

      {/* Dot Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40">
        <DotIndicators total={projects.length} active={activeProject} onDotClick={goToProject} />
      </div>
    </section>
  )
}

// ============ DESKTOP CAROUSEL ============
function DesktopCarousel() {
  const [activeProject, setActiveProject] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  const animateSlide = useCallback((newIndex: number, direction: 'left' | 'right') => {
    if (isAnimating || !contentRef.current) return
    setIsAnimating(true)

    const exitX = direction === 'left' ? -100 : 100
    const enterX = direction === 'left' ? 100 : -100

    gsap.to(contentRef.current, {
      x: exitX,
      opacity: 0,
      scale: 0.95,
      duration: 0.5,
      ease: 'power3.in',
      onComplete: () => {
        setActiveProject(newIndex)
        gsap.set(contentRef.current, { x: enterX, scale: 0.95 })
        gsap.to(contentRef.current, {
          x: 0,
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: 'power3.out',
          onComplete: () => setIsAnimating(false),
        })
      },
    })
  }, [isAnimating])

  const goToProject = (index: number) => {
    if (index === activeProject || isAnimating) return
    const direction = index > activeProject ? 'left' : 'right'
    animateSlide(index, direction)
  }

  const nextProject = () => {
    const newIndex = (activeProject + 1) % projects.length
    animateSlide(newIndex, 'left')
  }

  const prevProject = () => {
    const newIndex = (activeProject - 1 + projects.length) % projects.length
    animateSlide(newIndex, 'right')
  }

  const project = projects[activeProject]
  const isInternship = project.decorationType === 'star'

  return (
    <section className={`${fontClasses} h-screen overflow-hidden bg-[#0c0c0c]/15 relative hidden xl:flex flex-col items-center pt-28`}>
      <h2 className="font-[family-name:var(--font-satoshi)] text-6xl md:text-7xl font-bold text-white mb-10">PROJECTS</h2>

      <div ref={contentRef} className="w-full max-w-7xl mx-auto px-8">
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
                  <Image src={project.circleImg} alt="Project text circle" width={350} height={350} className="object-contain animate-spin-slow" />
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
            <Image src={project.image} alt={project.title} fill className="object-cover" loading="lazy" />
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

      {/* Navigation Arrows */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 z-40">
        <button onClick={prevProject} disabled={isAnimating} className="w-14 h-14 border-2 border-white/30 rounded-full flex items-center justify-center text-white text-xl hover:bg-white/10 hover:border-white/50 transition-all disabled:opacity-50">
          &lt;
        </button>
      </div>
      <div className="absolute right-8 top-1/2 -translate-y-1/2 z-40">
        <button onClick={nextProject} disabled={isAnimating} className="w-14 h-14 border-2 border-white/30 rounded-full flex items-center justify-center text-white text-xl hover:bg-white/10 hover:border-white/50 transition-all disabled:opacity-50">
          &gt;
        </button>
      </div>

      {/* Dot Indicators */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-40">
        <DotIndicators total={projects.length} active={activeProject} onDotClick={goToProject} />
      </div>
    </section>
  )
}

// ============ MAIN EXPORT ============
export default function WorkSection() {
  return (
    <div id="work">
      <MobileCarousel />
      <TabletCarousel />
      <DesktopCarousel />
    </div>
  )
}
