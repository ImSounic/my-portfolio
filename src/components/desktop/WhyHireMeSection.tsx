// src/components/desktop/WhyHireMeSection.tsx
'use client'

import Image from 'next/image'
import localFont from 'next/font/local'
import { Montserrat } from 'next/font/google'
import hireGridSvg from '@/assets/images/hire-grid.svg'
import TransparentMediaPlayer from '@/components/ui/TransparentMediaPlayer'

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
    mp4Src: '/assets/videos/thinking.mp4',
    webmSrc: '/assets/videos/thinking.webm',
    apngSrc: '/assets/videos/thinking.png', // Fallback for devices that can't play transparent videos
    subtitle: '"A CRITICAL THINKER NEVER SLEEPS, JUST DREAMS IN ALGORITHMS."'
  },
  {
    id: 'adaptable-innovator',
    title: 'ADAPTIVE INNOVATOR',
    description: 'In The Fast-Paced World Of Technology, Adaptability Is Key. I Thrive In Dynamic Environments, Frameworks, And Languages. Learning That I Stay Ahead Of The Curve, Whether It\'s Mastering A New Programming Language Or Adapting The Latest AI Techniques. My Ability To Automatically Integrate New Technologies Makes Me A Valuable Asset In Any Dynamic Environment.',
    mp4Src: '/assets/videos/adapt.mp4',
    webmSrc: '/assets/videos/adapt.webm',
    apngSrc: '/assets/videos/adapt.png', // Fallback for devices that can't play transparent videos
    subtitle: '"AN ADAPTIVE GUY: CHANGING GEARS AND MASTERING THE NEW."'
  },
  {
    id: 'code-craftsman',
    title: 'CODE CRAFTSMAN',
    description: 'As A Code Craftsman, I Pride Myself On Writing Clean, Efficient, And Secure Code. My Dedication To The Art Of Programming Ensures That Each Project I Undertake Is Robust. With A Precision And Attention To Detail From Developing Robust Algorithms To Crafting Seamless User Experiences. My Craftsmanship In Code Turns Ideas Into Reality.',
    mp4Src: '/assets/videos/code.mp4',
    webmSrc: '/assets/videos/code.webm',
    apngSrc: '/assets/videos/code.png', // Fallback for devices that can't play transparent videos
    subtitle: '"CRAFTING CODE LIKE AN ARTIST PAINTS A MASTERPIECE."'
  }
]

export default function WhyHireMeSection() {
  return (
    <>
      {/* First viewport: Title + Critical Thinker */}
      <section id="why-hire-me" className={`${satoshi.variable} ${montserrat.variable} h-screen relative bg-[#0c0c0c]`}>
        {/* Title Section with background grid */}
        <div className="h-1/3 relative flex items-center justify-center">
          {/* Background Grid - positioned behind the title */}
          <div className="absolute inset-0 z-0">
            <Image
              src={hireGridSvg}
              alt="Background grid"
              fill
              className="object-cover opacity-100"
              style={{ objectPosition: 'center' }}
            />
          </div>
          
          {/* Title - positioned above the grid */}
          <h2 className="font-[family-name:var(--font-satoshi)] text-6xl md:text-7xl font-bold text-white relative z-10">
            WHY HIRE ME ?
          </h2>
        </div>

        {/* Vertical scroll line with question mark */}
        <div className="absolute left-1/2 top-1/3 -translate-x-1/2">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full border-2 border-dashed border-white/30 flex items-center justify-center mb-4">
              <span className="text-white/80 text-xl">?</span>
            </div>
            <div className="w-0.5 h-[66vh] bg-white/20" />
          </div>
        </div>

        {/* Critical Thinker Section */}
        <div className="h-2/3 relative flex items-center justify-center">
          {/* Left side - Title and Description - Made responsive */}
          <div className="absolute 2xl:left-24 xl:left-28 lg:left-16 top-1/2 -translate-y-1/2 2xl:max-w-md xl:max-w-sm lg:max-w-xs">
            <h3 className="font-[family-name:var(--font-satoshi)] text-3xl font-bold text-white mb-6">
              {sections[0].title}
            </h3>
            <p className="font-[family-name:var(--font-montserrat)] text-gray-300 text-base leading-relaxed">
              {sections[0].description}
            </p>
          </div>

          {/* Center - Video */}
          <div className="relative">
            <TransparentMediaPlayer
              mp4Src={sections[0].mp4Src}
              webmSrc={sections[0].webmSrc}
              apngSrc={sections[0].apngSrc}
              altText={sections[0].title}
              width={500}
              height={300}
            />
          </div>

          {/* Right side - Subtitle - Made responsive */}
          <div className="absolute 2xl:right-24 xl:right-28 lg:right-16 top-1/2 -translate-y-1/2 2xl:max-w-md xl:max-w-sm lg:max-w-xs">
            <p className="font-[family-name:var(--font-montserrat)] text-green-400 text-sm italic">
              {sections[0].subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Second viewport: Adaptive Innovator */}
      <section className={`${satoshi.variable} ${montserrat.variable} h-screen relative bg-[#0c0c0c] flex items-center justify-center`}>
        {/* Continue vertical line */}
        <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2">
          <div className="w-0.5 h-full bg-white/20" />
        </div>

        {/* Left side - Subtitle (SWAPPED) - Made responsive */}
        <div className="absolute 2xl:left-24 xl:left-28 lg:left-16 top-1/2 -translate-y-1/2 2xl:max-w-md xl:max-w-sm lg:max-w-xs">
          <p className="font-[family-name:var(--font-montserrat)] text-green-400 text-sm italic">
            {sections[1].subtitle}
          </p>
        </div>

        {/* Center - Video */}
        <div className="relative">
          <TransparentMediaPlayer
            mp4Src={sections[1].mp4Src}
            webmSrc={sections[1].webmSrc}
            apngSrc={sections[1].apngSrc}
            altText={sections[1].title}
            width={500}
            height={300}
          />
        </div>

        {/* Right side - Title and Description (SWAPPED) - Made responsive */}
        <div className="absolute 2xl:right-36 xl:right-28 lg:right-16 top-1/2 -translate-y-1/2 2xl:max-w-md xl:max-w-sm lg:max-w-xs">
          <h3 className="font-[family-name:var(--font-satoshi)] text-3xl font-bold text-white mb-6">
            {sections[1].title}
          </h3>
          <p className="font-[family-name:var(--font-montserrat)] text-gray-300 text-base leading-relaxed">
            {sections[1].description}
          </p>
        </div>
      </section>

      {/* Third viewport: Code Craftsman */}
      <section className={`${satoshi.variable} ${montserrat.variable} h-screen relative bg-[#0c0c0c] flex items-center justify-center`}>
        {/* Continue vertical line */}
        <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2">
          <div className="w-0.5 h-1/2 bg-white/20" />
        </div>

        {/* Left side - Title and Description - Made responsive */}
        <div className="absolute 2xl:left-24 xl:left-28 lg:left-16 top-1/2 -translate-y-1/2 2xl:max-w-md xl:max-w-sm lg:max-w-xs">
          <h3 className="font-[family-name:var(--font-satoshi)] text-3xl font-bold text-white mb-6">
            {sections[2].title}
          </h3>
          <p className="font-[family-name:var(--font-montserrat)] text-gray-300 text-base leading-relaxed">
            {sections[2].description}
          </p>
        </div>

        {/* Center - Video */}
        <div className="relative">
          <TransparentMediaPlayer
            mp4Src={sections[2].mp4Src}
            webmSrc={sections[2].webmSrc}
            apngSrc={sections[2].apngSrc}
            altText={sections[2].title}
            width={500}
            height={300}
          />
        </div>

        {/* Right side - Subtitle - Made responsive */}
        <div className="absolute 2xl:right-24 xl:right-28 lg:right-16 top-1/2 -translate-y-1/2 2xl:max-w-md xl:max-w-sm lg:max-w-xs">
          <p className="font-[family-name:var(--font-montserrat)] text-green-400 text-sm italic">
            {sections[2].subtitle}
          </p>
        </div>
      </section>
    </>
  )
}