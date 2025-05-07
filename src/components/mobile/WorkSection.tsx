// src/components/mobile/WorkSection.tsx
'use client'

import Image from 'next/image'
import { useState } from 'react'
import localFont from 'next/font/local'
import { Montserrat } from 'next/font/google'

const satoshi = localFont({
  src: [
    {
      path: '../../../public/fonts/Satoshi-Black.otf',
      weight: '900',
      style: 'normal'
    },
  ],
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
    image: '/projects/ai-project.png',
    github: '#'
  },
  {
    id: 2,
    title: 'HOUSE OF GAMES',
    description: 'Created A Quiz Game Inspired By The British TV Show "House Of Games". Implemented Various Game Rounds And Scoring Mechanisms. This Project Highlights My Creativity And Ability To Develop Entertaining Applications.',
    image: '/projects/house-of-games.png',
    github: '#'
  },
  {
    id: 3,
    title: 'INTERNSHIP',
    description: 'Built A Chatbot For The Hyderabad Municipal Corporation (India) And Trained Bots Through Web Scraping Using Python. This Experience Enhanced My Backend Development Skills And Gave Me Practical Experience In Deploying AI Solutions.',
    image: '/projects/internship.png',
    company: 'CORETEK LABS',
    duration: 'JUN-SEP 2023'
  },
  {
    id: 4,
    title: 'CLEANSLATE',
    description: 'A smart chore-splitting app for university students sharing living spaces. Features automated task distribution, and real-time notifications to ensure fair household responsibilities. Built to promote harmonious co-living through intelligent chore management.',
    image: '/projects/cleanslate.png',
    comingSoon: true
  }
]

export default function WorkSection() {
  const [activeProject, setActiveProject] = useState(0);

  const nextProject = () => {
    setActiveProject((prev) => (prev + 1) % projects.length);
  };

  const prevProject = () => {
    setActiveProject((prev) => (prev - 1 + projects.length) % projects.length);
  };

  // Get current project
  const project = projects[activeProject];

  return (
    <section id="work" className={`${satoshi.variable} ${montserrat.variable} min-h-screen bg-[#0c0c0c] relative  flex flex-col items-center py-16 px-4`}>
      {/* Title */}
      <h2 className="font-[family-name:var(--font-satoshi)] text-3xl font-bold text-white text-center mb-6 mt-8">
        PROJECTS
      </h2>
      
      {/* Project display */}
      <div className="w-full max-w-sm mx-auto">
        {/* Project Title */}
        <h3 className="font-[family-name:var(--font-satoshi)] text-2xl font-bold text-white text-center mb-4">
          {project.title}
        </h3>
        
        {/* Image */}
        <div className="relative w-full h-48 rounded-lg overflow-hidden mb-4">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover"
          />
          
          {/* Show GitHub button, internship badge, or coming soon badge as appropriate */}
          {project.github && !project.comingSoon ? (
            <div className="absolute bottom-2 left-2 z-10">
              <a 
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-white rounded-full flex items-center justify-center"
              >
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="black"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>
          ) : project.company ? (
            <div className="absolute bottom-2 left-2 bg-black/80 text-white px-2 py-1 rounded text-xs z-10">
              {project.company} | {project.duration}
            </div>
          ) : project.comingSoon ? (
            <div className="absolute bottom-2 left-2 bg-white text-black px-2 py-1 rounded text-xs font-medium z-10">
              Coming Soon...
            </div>
          ) : null}
        </div>
        
        {/* Description */}
        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-lg p-3 mb-6">
          <p className="font-[family-name:var(--font-montserrat)] text-white text-xs leading-relaxed">
            {project.description}
          </p>
        </div>
        
        {/* Navigation buttons */}
        <div className="flex justify-between items-center">
          <button 
            onClick={prevProject}
            className="w-10 h-10 border border-white/30 rounded-full flex items-center justify-center text-white"
          >
            &lt;
          </button>
          
          <div className="text-white/50 text-sm">
            {activeProject + 1} / {projects.length}
          </div>
          
          <button 
            onClick={nextProject}
            className="w-10 h-10 border border-white/30 rounded-full flex items-center justify-center text-white"
          >
            &gt;
          </button>
        </div>
      </div>
    </section>
  )
}