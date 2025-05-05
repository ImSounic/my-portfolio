// src/components/mobile/WhyHireMeSection.tsx
'use client'

import Image from 'next/image'
import localFont from 'next/font/local'
import { Montserrat } from 'next/font/google'
import hireGridSvg from '@/assets/images/hire-grid.svg'
// Remove GIF imports and use WebM paths

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
  weight: ['400', '500'],
  variable: '--font-montserrat',
})

const sections = [
  {
    id: 'critical-thinker',
    title: 'CRITICAL THINKER',
    description: 'I Excel At Analyzing Complex Problems And Developing Innovative Solutions. In A Recent Project, I Combined Unsupervised Algorithms With Aerial Sensing To Algorithms Significantly Improving Efficiency. My Proactive Problem-Solving Extends Beyond Traditional Challenges.',
    videoSrc: '/assets/videos/thinking.webm',
    subtitle: '"A CRITICAL THINKER NEVER SLEEPS, JUST DREAMS IN ALGORITHMS."'
  },
  {
    id: 'adaptable-innovator',
    title: 'ADAPTIVE INNOVATOR',
    description: 'In The Fast-Paced World Of Technology, Adaptability Is Key. I Thrive In Dynamic Environments, Frameworks, And Languages. Learning That I Stay Ahead Of The Curve, Whether It\'s Mastering A New Programming Language Or Adapting The Latest AI Techniques. My Ability To Automatically Integrate New Technologies Makes Me A Valuable Asset In Any Dynamic Environment.',
    videoSrc: '/assets/videos/adapt.webm',
    subtitle: '"AN ADAPTIVE GUY: CHANGING GEARS AND MASTERING THE NEW."'
  },
  {
    id: 'code-craftsman',
    title: 'CODE CRAFTSMAN',
    description: 'As A Code Craftsman, I Pride Myself On Writing Clean, Efficient, And Secure Code. My Dedication To The Art Of Programming Ensures That Each Project I Undertake Is Robust. With A Precision And Attention To Detail From Developing Robust Algorithms To Crafting Seamless User Experiences. My Craftsmanship In Code Turns Ideas Into Reality.',
    videoSrc: '/assets/videos/code.webm',
    subtitle: '"CRAFTING CODE LIKE AN ARTIST PAINTS A MASTERPIECE."'
  }
]

export default function WhyHireMeSection() {
  return (
    <>
      {/* First section: Title + Critical Thinker */}
      <section id="why-hire-me" className={`${satoshi.variable} ${montserrat.variable} min-h-screen relative snap-start bg-black px-4 py-16 flex flex-col`}>
        {/* Title Section with reduced background grid */}
        <div className="pt-8 pb-6 relative flex items-center justify-center">
          {/* Background Grid */}
          <div className="absolute inset-0 z-0">
            <Image
              src={hireGridSvg}
              alt="Background grid"
              fill
              className="object-cover opacity-60"
              style={{ objectPosition: 'center' }}
            />
          </div>
          
          {/* Title */}
          <h2 className="font-[family-name:var(--font-satoshi)] text-3xl font-bold text-white relative z-10">
            WHY HIRE ME ?
          </h2>
        </div>

        {/* Vertical line with question mark */}
        <div className="relative flex justify-center mb-6">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full border-2 border-dashed border-white/30 flex items-center justify-center mb-2">
              <span className="text-white/80 text-sm">?</span>
            </div>
            <div className="w-0.5 h-8 bg-white/20" />
          </div>
        </div>

        {/* Critical Thinker Section - Compact for mobile */}
        <div className="flex-1 flex flex-col items-center justify-center px-2">
          {/* Title */}
          <h3 className="font-[family-name:var(--font-satoshi)] text-xl font-bold text-white text-center mb-4">
            {sections[0].title}
          </h3>
          
          {/* Video */}
          <div className="mb-4">
            <div className="relative w-60 h-36">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-contain"
              >
                <source src={sections[0].videoSrc} type="video/webm" />
                Your browser does not support WebM videos.
              </video>
            </div>
          </div>
          
          {/* Description */}
          <p className="font-[family-name:var(--font-montserrat)] text-gray-300 text-xs leading-relaxed text-center mb-4">
            {sections[0].description}
          </p>
          
          {/* Subtitle */}
          <p className="font-[family-name:var(--font-montserrat)] text-green-400 text-xs italic text-center">
            {sections[0].subtitle}
          </p>
          
          {/* Down arrow indicator */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="w-6 h-6 border-b-2 border-r-2 border-white/30 transform rotate-45 animate-bounce" />
          </div>
        </div>
      </section>

      {/* Second section: Adaptive Innovator */}
      <section className={`${satoshi.variable} ${montserrat.variable} min-h-screen relative snap-start bg-black px-4 py-16 flex flex-col items-center justify-center`}>
        {/* Title */}
        <h3 className="font-[family-name:var(--font-satoshi)] text-xl font-bold text-white text-center mb-4">
          {sections[1].title}
        </h3>
        
        {/* Video */}
        <div className="mb-4">
          <div className="relative w-60 h-36">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-contain"
            >
              <source src={sections[1].videoSrc} type="video/webm" />
              Your browser does not support WebM videos.
            </video>
          </div>
        </div>
        
        {/* Description */}
        <p className="font-[family-name:var(--font-montserrat)] text-gray-300 text-xs leading-relaxed text-center mb-4">
          {sections[1].description}
        </p>
        
        {/* Subtitle */}
        <p className="font-[family-name:var(--font-montserrat)] text-green-400 text-xs italic text-center">
          {sections[1].subtitle}
        </p>
        
        {/* Down arrow indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="w-6 h-6 border-b-2 border-r-2 border-white/30 transform rotate-45 animate-bounce" />
        </div>
      </section>

      {/* Third section: Code Craftsman */}
      <section className={`${satoshi.variable} ${montserrat.variable} min-h-screen relative snap-start bg-black px-4 py-16 flex flex-col items-center justify-center`}>
        {/* Title */}
        <h3 className="font-[family-name:var(--font-satoshi)] text-xl font-bold text-white text-center mb-4">
          {sections[2].title}
        </h3>
        
        {/* Video */}
        <div className="mb-4">
          <div className="relative w-60 h-36">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-contain"
            >
              <source src={sections[2].videoSrc} type="video/webm" />
              Your browser does not support WebM videos.
            </video>
          </div>
        </div>
        
        {/* Description */}
        <p className="font-[family-name:var(--font-montserrat)] text-gray-300 text-xs leading-relaxed text-center mb-4">
          {sections[2].description}
        </p>
        
        {/* Subtitle */}
        <p className="font-[family-name:var(--font-montserrat)] text-green-400 text-xs italic text-center">
          {sections[2].subtitle}
        </p>
      </section>
    </>
  )
}