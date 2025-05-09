// src/components/desktop/WorkSection.tsx
'use client'

import Image from 'next/image'
import localFont from 'next/font/local'
import { Montserrat } from 'next/font/google'
import circleSvg from '@/assets/icons/circle.svg'
import arrowSvg from '@/assets/icons/arrow.svg'
import iStarSvg from '@/assets/icons/i_star.svg'

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
    github: 'https://github.com/ImSounic/Miscarriage-Prediction-Using-Ensemble-Deep-Learning-Model.git'
  },
  {
    id: 2,
    title: 'HOUSE OF GAMES',
    description: 'Created A Quiz Game Inspired By The British TV Show "House Of Games". Implemented Various Game Rounds And Scoring Mechanisms. This Project Highlights My Creativity And Ability To Develop Entertaining Applications.',
    image: '/projects/house-of-games.png',
    github: 'https://github.com/ImSounic/House-Of-Games.git'
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
    description: 'A chore-splitting app for university students sharing living spaces. Features automated task distribution, and real-time notifications to ensure fair household responsibilities. Built to promote harmonious co-living through intelligent chore management.',
    image: '/projects/cleanslate.png',
    github: '#'
  }
]

export default function WorkSection() {
  return (
    <>
      {/* First viewport: Title + First Project */}
      <section id="work" className={`${satoshi.variable} ${montserrat.variable} h-screen bg-[#0c0c0c] relative  flex flex-col items-center justify-center`}>
        {/* Title - Positioned higher */}
        <div className="mb-24">
          <h2 className="font-[family-name:var(--font-satoshi)] text-6xl md:text-7xl font-bold text-white">
            PROJECTS
          </h2>
        </div>

        {/* First Project - Centered Container */}
        <div className="w-full max-w-7xl mx-auto px-8">
          <div className="relative">
            {/* Circle Icon - Bottom Right (Behind) */}
            <div className="absolute -bottom-20 -right-[-80px] w-40 h-40 z-0">
              <Image
                src={circleSvg}
                alt="Circle decoration"
                width={140}
                height={140}
              />
              
              {/* Text Wrapped in Circle - Added with increased size and rotation */}
              <div className="absolute inset-0  flex items-center justify-center">
                <Image
                  src="/project-2.png"
                  alt="Project 2 text circle"
                  width={280}
                  height={280}
                  className="object-contain animate-spin-slow mr-4 mb-4"
                />
              </div>
            </div>

            {/* Glass Card Background - Now using PNG instead of SVG */}
            <div className="relative w-full h-[500px] z-10">
              <Image
                src="/assets/images/glass-card.png" 
                alt="Glass card background"
                fill
                className="object-contain"
              />
              
              {/* Project Description */}
              <div className="absolute top-[-8px] left-36 right-12 p-8">
                <p className="font-[family-name:var(--font-montserrat)] text-white text-l leading-relaxed max-w-[700px]">
                  {projects[0].description}
                </p>
              </div>
            </div>

            {/* Project Image - Positioned outside bottom left */}
            <div className="absolute -bottom-16 -left-[-60px] w-[850px] h-[450px] rounded-2xl overflow-hidden shadow-2xl z-20">
              {projects[0].image ? (
                <Image
                  src={projects[0].image}
                  alt={projects[0].title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                  <span className="text-gray-500">Project Image</span>
                </div>
              )}
              
              {/* GitHub Icon and Arrow - Positioned on top of the image */}
              {projects[0].github && (
                <div className="absolute bottom-8 left-8 flex items-center gap-4 z-30">
                  <a 
                    href={projects[0].github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-14 h-14 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    <svg 
                      width="28" 
                      height="28" 
                      viewBox="0 0 24 24" 
                      fill="black"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                  <div className="w-12 h-12">
                    <Image
                      src={arrowSvg}
                      alt="Arrow"
                      width={48}
                      height={48}
                      className="object-contain"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Vertical Title - Right Side */}
            <div className="absolute right-24 top-64 -translate-y-1/2 -translate-x-36 z-20">
              <h3 
                className="font-[family-name:var(--font-satoshi)] text-4xl font-bold text-white"
                style={{ 
                  writingMode: 'vertical-rl',
                  transform: 'rotate(360deg)'
                }}
              >
                {projects[0].title}
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* Second viewport: House of Games */}
      <section className={`${satoshi.variable} ${montserrat.variable} h-screen bg-[#0c0c0c] relative flex items-center justify-center `}>
        <div className="w-full max-w-7xl mx-auto px-8">
          <div className="relative">
            {/* Circle Icon - Bottom Right (Behind) */}
            <div className="absolute -bottom-20 -right-[-80px] w-40 h-40 z-0">
              <Image
                src={circleSvg}
                alt="Circle decoration"
                width={140}
                height={140}
              />
              
              {/* Text Wrapped in Circle - Added with increased size and rotation */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src="/project-4.png"
                  alt="Project text circle"
                  width={280}
                  height={280}
                  className="object-contain animate-spin-slow mr-4 mb-4"
                />
              </div>
            </div>

            {/* Glass Card Background - Using PNG */}
            <div className="relative w-full h-[500px] z-10">
              <Image
                src="/assets/images/glass-card.png"
                alt="Glass card background"
                fill
                className="object-contain"
              />
              
              {/* Project Description */}
              <div className="absolute top-[-8px] left-36 right-12 p-8">
                <p className="font-[family-name:var(--font-montserrat)] text-white text-l leading-relaxed max-w-[700px]">
                  {projects[1].description}
                </p>
              </div>
            </div>

            {/* Project Image - Positioned outside bottom left */}
            <div className="absolute -bottom-16 -left-[-60px] w-[850px] h-[450px] rounded-2xl overflow-hidden shadow-2xl z-20">
              {projects[1].image ? (
                <Image
                  src={projects[1].image}
                  alt={projects[1].title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                  <span className="text-gray-500">Project Image</span>
                </div>
              )}
              
              {/* GitHub Icon and Arrow - Positioned on top of the image */}
              {projects[1].github && (
                <div className="absolute bottom-8 left-8 flex items-center gap-4 z-30">
                  <a 
                    href={projects[1].github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-14 h-14 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    <svg 
                      width="28" 
                      height="28" 
                      viewBox="0 0 24 24" 
                      fill="black"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                  <div className="w-12 h-12">
                    <Image
                      src={arrowSvg}
                      alt="Arrow"
                      width={48}
                      height={48}
                      className="object-contain"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Vertical Title - Right Side */}
            <div className="absolute right-24 top-64 -translate-y-1/2 -translate-x-36 z-20">
              <h3 
                className="font-[family-name:var(--font-satoshi)] text-4xl font-bold text-white"
                style={{ 
                  writingMode: 'vertical-rl',
                  transform: 'rotate(360deg)'
                }}
              >
                {projects[1].title}
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* Third viewport: Internship */}
      <section className={`${satoshi.variable} ${montserrat.variable} h-screen bg-[#0c0c0c] relative flex items-center justify-center `}>
        <div className="w-full max-w-7xl mx-auto px-8">
          <div className="relative">
            {/* Circle Icon - Bottom Right (Behind) */}
            <div className="absolute -bottom-28 -right-[-50px] w-60 h-60 z-0">
              <Image
                src={iStarSvg}
                alt="Star decoration"
                width={260}
                height={260}
              />
              {/* No circular text for this project as requested */}
            </div>

            {/* Glass Card Background - Using PNG */}
            <div className="relative w-full h-[500px] z-10">
              <Image
                src="/assets/images/glass-card-i.png"
                alt="Glass card background"
                fill
                className="object-contain"
              />
              
              {/* Project Description */}
              <div className="absolute top-[-8px] left-36 right-12 p-8">
                <p className="font-[family-name:var(--font-montserrat)] text-white text-l leading-relaxed max-w-[700px]">
                  {projects[2].description}
                </p>
              </div>
            </div>

            {/* Project Image - Positioned outside bottom left */}
            <div className="absolute -bottom-16 -left-[-60px] w-[850px] h-[450px] rounded-2xl overflow-hidden shadow-2xl z-20">
              {projects[2].image ? (
                <Image
                  src={projects[2].image}
                  alt={projects[2].title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                  <span className="text-gray-500">Project Image</span>
                </div>
              )}
              
              {/* Internship Badge - Now at bottom left of the image, like the "Coming Soon" badge */}
              {projects[2].company && (
                <div className="absolute bottom-8 left-8 bg-black/80 text-white px-4 py-2 rounded-lg z-30">
                  <p className="text-sm font-medium">{projects[2].company}</p>
                  <p className="text-xs">{projects[2].duration}</p>
                </div>
              )}
            </div>

            {/* Vertical Title - Right Side */}
            <div className="absolute right-24 top-64 -translate-y-1/2 -translate-x-36 z-20">
              <h3 
                className="font-[family-name:var(--font-satoshi)] text-4xl font-bold text-white"
                style={{ 
                  writingMode: 'vertical-rl',
                  transform: 'rotate(360deg)'
                }}
              >
                {projects[2].title}
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* Fourth viewport: Cleanslate */}
      <section className={`${satoshi.variable} ${montserrat.variable} h-screen bg-[#0c0c0c] relative flex items-center justify-center `}>
        <div className="w-full max-w-7xl mx-auto px-8">
          <div className="relative">
            {/* Circle Icon - Bottom Right (Behind) */}
            <div className="absolute -bottom-20 -right-[-80px] w-40 h-40 z-0">
              <Image
                src={circleSvg}
                alt="Circle decoration"
                width={140}
                height={140}
              />
              
              {/* Text Wrapped in Circle - Added with increased size and rotation */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src="/project-3.png"
                  alt="Project text circle"
                  width={280}
                  height={280}
                  className="object-contain animate-spin-slow mr-4 mb-4"
                />
              </div>
            </div>

            {/* Glass Card Background - Using PNG */}
            <div className="relative w-full h-[500px] z-10">
              <Image
                src="/assets/images/glass-card.png"
                alt="Glass card background"
                fill
                className="object-contain"
              />
              
              {/* Project Description */}
              <div className="absolute top-[-8px] left-36 right-12 p-8">
                <p className="font-[family-name:var(--font-montserrat)] text-white text-l leading-relaxed max-w-[700px]">
                  {projects[3].description}
                </p>
              </div>

            </div>

            {/* Project Image - Positioned outside bottom left */}
            <div className="absolute -bottom-16 -left-[-60px] w-[850px] h-[450px] rounded-2xl overflow-hidden shadow-2xl z-20">
              {projects[3].image ? (
                <Image
                  src={projects[3].image}
                  alt={projects[3].title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                  <span className="text-gray-500">Project Image</span>
                </div>
              )}
              
              {/* Coming Soon - Positioned on top of the image */}
              <div className="absolute bottom-8 left-8 z-30">
                <div className="bg-white text-black font-[family-name:var(--font-montserrat)] font-semibold px-6 py-3 rounded-lg">
                  Coming Soon...
                </div>
              </div>
            </div>

            {/* Vertical Title - Right Side */}
            <div className="absolute right-24 top-64 -translate-y-1/2 -translate-x-36 z-20">
              <h3 
                className="font-[family-name:var(--font-satoshi)] text-4xl font-bold text-white"
                style={{ 
                  writingMode: 'vertical-rl',
                  transform: 'rotate(360deg)'
                }}
              >
                {projects[3].title}
              </h3>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}