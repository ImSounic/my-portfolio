// src/components/tablet/WhyHireMeSection.tsx
'use client'

import Image from 'next/image'
import localFont from 'next/font/local'
import { Montserrat } from 'next/font/google'
import hireGridSvg from '@/assets/images/hire-grid.svg'
import TransparentMediaPlayer from '@/components/ui/TransparentMediaPlayer'

const satoshi = localFont({
  src: [{ path: '../../../public/fonts/Satoshi-Black.otf', weight: '900', style: 'normal' }],
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
    description:
      'I Excel At Analyzing Complex Problems And Developing Innovative Solutions. In A Recent Project, I Combined Unsupervised Algorithms With Aerial Sensing To Algorithms Significantly Improving Efficiency. My Proactive Problem-Solving Extends Beyond Traditional Challenges.',
    videoSrc: '/assets/videos/thinking.webm',
    gifSrc: '/assets/videos/thinking.gif',
    apngSrc: '/assets/videos/thinking.png',
    subtitle: '"A CRITICAL THINKER NEVER SLEEPS, JUST DREAMS IN ALGORITHMS."',
  },
  {
    id: 'adaptable-innovator',
    title: 'ADAPTIVE INNOVATOR',
    description:
      "In The Fast-Paced World Of Technology, Adaptability Is Key. I Thrive In Dynamic Environments, Frameworks, And Languages. Learning That I Stay Ahead Of The Curve, Whether It's Mastering A New Programming Language Or Adapting The Latest AI Techniques. My Ability To Automatically Integrate New Technologies Makes Me A Valuable Asset In Any Dynamic Environment.",
    videoSrc: '/assets/videos/adapt.webm',
    gifSrc: '/assets/videos/adapt.gif',
    apngSrc: '/assets/videos/adapt.png',
    subtitle: '"AN ADAPTIVE GUY: CHANGING GEARS AND MASTERING THE NEW."',
  },
  {
    id: 'code-craftsman',
    title: 'CODE CRAFTSMAN',
    description:
      'As A Code Craftsman, I Pride Myself On Writing Clean, Efficient, And Secure Code. My Dedication To The Art Of Programming Ensures That Each Project I Undertake Is Robust. With A Precision And Attention To Detail From Developing Robust Algorithms To Crafting Seamless User Experiences. My Craftsmanship In Code Turns Ideas Into Reality.',
    videoSrc: '/assets/videos/code.webm',
    gifSrc: '/assets/videos/code.gif',
    apngSrc: '/assets/videos/code.png',
    subtitle: '"CRAFTING CODE LIKE AN ARTIST PAINTS A MASTERPIECE."',
  },
]

export default function WhyHireMeSection() {
  return (
    <>
      {/* Viewport 1: Critical Thinker */}
      <section id="why-hire-me" className={`${satoshi.variable} ${montserrat.variable} h-screen relative bg-[#0c0c0c] px-6`}>
        <div className="h-1/3 relative flex items-center justify-center">
          <div className="absolute inset-0 z-0">
            <Image
              src={hireGridSvg}
              alt="Background grid"
              fill
              className="object-cover opacity-100"
              style={{ objectPosition: 'center' }}
            />
          </div>
          <h2 className="font-[family-name:var(--font-satoshi)] text-5xl font-bold text-white relative z-10">
            WHY HIRE ME ?
          </h2>
        </div>

        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 z-0">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full border-2 border-dashed border-white/30 flex items-center justify-center mb-4">
              <span className="text-white/80 text-lg">?</span>
            </div>
            <div className="w-0.5 h-[66vh] bg-white/20" />
          </div>
        </div>

        <div className="h-2/3 relative flex flex-col items-center justify-center z-10">
          <div className="mb-6">
            <TransparentMediaPlayer
              webmSrc={sections[0].videoSrc}
              apngSrc={sections[0].apngSrc}
              altText={sections[0].title}
              width={320}
              height={192}
            />
          </div>

          {/* Text with full background */}
          <div className="w-full bg-[#0c0c0c] px-4 text-center">
            <div className="max-w-md mx-auto mb-10">
              <h3 className="font-[family-name:var(--font-satoshi)] text-2xl font-bold text-white mb-4">
                {sections[0].title}
              </h3>
              <p className="font-[family-name:var(--font-montserrat)] text-gray-300 text-sm leading-relaxed">
                {sections[0].description}
              </p>
            </div>
            <div className="max-w-sm mx-auto">
              <p className="font-[family-name:var(--font-montserrat)] text-green-400 text-xs italic">
                {sections[0].subtitle}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Viewport 2: Adaptive Innovator */}
      <section className={`${satoshi.variable} ${montserrat.variable} h-screen relative bg-[#0c0c0c] flex flex-col items-center justify-center px-6`}>
        <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 z-0">
          <div className="w-0.5 h-full bg-white/20" />
        </div>

        <div className="mb-6 z-10">
          <TransparentMediaPlayer
            webmSrc={sections[1].videoSrc}
            apngSrc={sections[1].apngSrc}
            altText={sections[1].title}
            width={320}
            height={192}
          />
        </div>

        <div className="w-full bg-[#0c0c0c] px-4 text-center z-10">
          <div className="max-w-md mx-auto mb-10">
            <h3 className="font-[family-name:var(--font-satoshi)] text-2xl font-bold text-white mb-4">
              {sections[1].title}
            </h3>
            <p className="font-[family-name:var(--font-montserrat)] text-gray-300 text-sm leading-relaxed">
              {sections[1].description}
            </p>
          </div>
          <div className="max-w-sm mx-auto">
            <p className="font-[family-name:var(--font-montserrat)] text-green-400 text-xs italic">
              {sections[1].subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Viewport 3: Code Craftsman */}
      <section className={`${satoshi.variable} ${montserrat.variable} h-screen relative bg-[#0c0c0c] flex flex-col items-center justify-center px-6`}>
        <div className="absolute left-1/2 top-0 bottom-1/2 -translate-x-1/2">
          <div className="w-0.5 h-[50%] bg-white/20" />
        </div>

        <div className="mb-6">
          <TransparentMediaPlayer
            webmSrc={sections[2].videoSrc}
            apngSrc={sections[2].apngSrc}
            altText={sections[2].title}
            width={320}
            height={192}
          />
        </div>

        <div className="w-full px-4 text-center bg-[#0c0c0c] z-10">
          <div className="max-w-md mx-auto mb-10">
            <h3 className="font-[family-name:var(--font-satoshi)] text-2xl font-bold text-white mb-4">
              {sections[2].title}
            </h3>
            <p className="font-[family-name:var(--font-montserrat)] text-gray-300 text-sm leading-relaxed">
              {sections[2].description}
            </p>
          </div>
          <div className="max-w-sm mx-auto">
            <p className="font-[family-name:var(--font-montserrat)] text-green-400 text-xs italic">
              {sections[2].subtitle}
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
