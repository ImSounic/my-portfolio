// src/components/sections/WhyHireMeSection.tsx
'use client'

import Image from 'next/image'
import localFont from 'next/font/local'
import { Montserrat } from 'next/font/google'
import hireGridSvg from '@/assets/images/hire-grid.svg'
import titleLineSvg from '@/assets/icons/title-line.svg'
import titleLineFlippedSvg from '@/assets/icons/title-line-flipped.svg'
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

const pixelFont = localFont({
  src: [{ path: '../../../public/fonts/pixel_font-7.ttf', weight: '400', style: 'normal' }],
  variable: '--font-pixel',
})

const sections = [
  {
    id: 'critical-thinker',
    title: 'CRITICAL THINKER',
    description: 'I Excel At Analyzing Complex Problems And Developing Innovative Solutions. In A Recent Project, I Combined Unsupervised Algorithms With Aerial Sensing To Algorithms Significantly Improving Efficiency. My Proactive Problem-Solving Extends Beyond Traditional Challenges.',
    mp4Src: '/assets/videos/thinking.mp4',
    webmSrc: '/assets/videos/thinking.webm',
    apngSrc: '/assets/videos/thinking.png',
    subtitle: '"A CRITICAL THINKER NEVER SLEEPS, JUST DREAMS IN ALGORITHMS."',
  },
  {
    id: 'adaptable-innovator',
    title: 'ADAPTIVE INNOVATOR',
    description: "In The Fast-Paced World Of Technology, Adaptability Is Key. I Thrive In Dynamic Environments, Frameworks, And Languages. Learning That I Stay Ahead Of The Curve, Whether It's Mastering A New Programming Language Or Adapting The Latest AI Techniques. My Ability To Automatically Integrate New Technologies Makes Me A Valuable Asset In Any Dynamic Environment.",
    mp4Src: '/assets/videos/adapt.mp4',
    webmSrc: '/assets/videos/adapt.webm',
    apngSrc: '/assets/videos/adapt.png',
    subtitle: '"AN ADAPTIVE GUY: CHANGING GEARS AND MASTERING THE NEW."',
  },
  {
    id: 'code-craftsman',
    title: 'CODE CRAFTSMAN',
    description: 'As A Code Craftsman, I Pride Myself On Writing Clean, Efficient, And Secure Code. My Dedication To The Art Of Programming Ensures That Each Project I Undertake Is Robust. With A Precision And Attention To Detail From Developing Robust Algorithms To Crafting Seamless User Experiences. My Craftsmanship In Code Turns Ideas Into Reality.',
    mp4Src: '/assets/videos/code.mp4',
    webmSrc: '/assets/videos/code.webm',
    apngSrc: '/assets/videos/code.png',
    subtitle: '"CRAFTING CODE LIKE AN ARTIST PAINTS A MASTERPIECE."',
  },
]

export default function WhyHireMeSection() {
  const fontClasses = `${satoshi.variable} ${montserrat.variable} ${pixelFont.variable}`

  return (
    <>
      {/* ====== VIEWPORT 1: Title + Critical Thinker ====== */}
      <section id="why-hire-me" className={`${fontClasses} h-screen overflow-hidden relative bg-[#0c0c0c]/30 px-4 py-16 flex flex-col md:px-6 md:py-0 xl:px-0 xl:block`}>
        
        {/* Title area with background grid */}
        <div className="pt-8 pb-6 relative flex items-center justify-center md:h-1/3 md:pt-0 md:pb-0 xl:h-1/3">
          <div className="absolute inset-0 z-0">
            <Image
              src={hireGridSvg}
              alt="Background grid"
              fill
              className="object-cover opacity-60 md:opacity-100"
              style={{ objectPosition: 'center' }}
            />
          </div>
          <h2 className="font-[family-name:var(--font-satoshi)] text-3xl font-bold text-white relative z-10 md:text-5xl xl:text-6xl">
            WHY HIRE ME ?
          </h2>
        </div>

        {/* Vertical line with ? — Mobile (short) */}
        <div className="relative flex justify-center mb-6 md:hidden">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full border-2 border-dashed border-white/30 flex items-center justify-center mb-2">
              <span className="text-white/80 text-sm">?</span>
            </div>
            <div className="relative w-0.5 h-8 bg-white/20 overflow-hidden"><div className="scroll-line-pulse" /></div>
          </div>
        </div>

        {/* Vertical line with ? — Tablet */}
        <div className="hidden md:block xl:hidden absolute left-1/2 top-1/3 -translate-x-1/2 z-0">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full border-2 border-dashed border-white/30 flex items-center justify-center mb-4">
              <span className="text-white/80 text-lg">?</span>
            </div>
            <div className="relative w-0.5 h-[66vh] bg-white/20 overflow-hidden"><div className="scroll-line-pulse" /></div>
          </div>
        </div>

        {/* Vertical line with ? — Desktop */}
        <div className="hidden xl:block absolute left-1/2 top-1/3 -translate-x-1/2">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full border-2 border-dashed border-white/30 flex items-center justify-center mb-4">
              <span className="text-white/80 text-xl">?</span>
            </div>
            <div className="relative w-0.5 h-[66vh] bg-white/20 overflow-hidden"><div className="scroll-line-pulse" /></div>
          </div>
        </div>

        {/* Mobile: title → video → desc → subtitle (stacked) */}
        <div className="flex-1 flex flex-col items-center justify-center px-2 md:hidden">
          <h3 className="font-[family-name:var(--font-satoshi)] text-xl font-bold text-white text-center mb-4">
            {sections[0].title}
          </h3>
          <div className="mb-4">
            <TransparentMediaPlayer mp4Src={sections[0].mp4Src} webmSrc={sections[0].webmSrc} apngSrc={sections[0].apngSrc} altText={sections[0].title} width={240} height={144} />
          </div>
          <p className="font-[family-name:var(--font-montserrat)] text-gray-300 text-xs leading-relaxed text-center mb-4">
            {sections[0].description}
          </p>
          <p className="font-[family-name:var(--font-pixel)] text-[#3CA2F1] text-xs text-center">
            {sections[0].subtitle}
          </p>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="w-6 h-6 border-b-2 border-r-2 border-white/30 transform rotate-45 animate-bounce" />
          </div>
        </div>

        {/* Tablet: video → title+desc → subtitle (stacked, centered) */}
        <div className="hidden md:flex xl:hidden h-2/3 flex-col items-center justify-center z-10">
          <div className="mb-6">
            <TransparentMediaPlayer mp4Src={sections[0].mp4Src} webmSrc={sections[0].webmSrc} apngSrc={sections[0].apngSrc} altText={sections[0].title} width={320} height={192} />
          </div>
          <div className="w-full bg-[#0c0c0c]/30 px-4 text-center">
            <div className="max-w-md mx-auto mb-10">
              <h3 className="font-[family-name:var(--font-satoshi)] text-2xl font-bold text-white mb-4">{sections[0].title}</h3>
              <p className="font-[family-name:var(--font-montserrat)] text-gray-300 text-sm leading-relaxed">{sections[0].description}</p>
            </div>
            <div className="max-w-sm mx-auto">
              <p className="font-[family-name:var(--font-pixel)] text-[#3CA2F1] text-xs">{sections[0].subtitle}</p>
            </div>
          </div>
        </div>

        {/* Desktop: 3-column (title+desc LEFT | video CENTER | subtitle RIGHT) */}
        <div className="hidden xl:flex h-2/3 relative items-center justify-center">
          <div className="absolute 2xl:left-16 xl:left-8 top-1/2 -translate-y-1/2">
            <h3 className="font-[family-name:var(--font-satoshi)] text-3xl font-bold text-white whitespace-nowrap mb-0">{sections[0].title}</h3>
            <div className="relative">
              <Image src={titleLineSvg} alt="" width={450} height={160} />
              <p className="absolute top-3 left-0 font-[family-name:var(--font-montserrat)] text-gray-300 text-sm leading-relaxed max-w-[310px]">{sections[0].description}</p>
            </div>
          </div>
          <div className="relative">
            <TransparentMediaPlayer mp4Src={sections[0].mp4Src} webmSrc={sections[0].webmSrc} apngSrc={sections[0].apngSrc} altText={sections[0].title} width={500} height={300} />
          </div>
          <div className="absolute 2xl:right-24 xl:right-28 top-1/2 -translate-y-1/2 2xl:max-w-md xl:max-w-sm">
            <p className="font-[family-name:var(--font-pixel)] text-[#3CA2F1] text-sm">{sections[0].subtitle}</p>
          </div>
        </div>
      </section>

      {/* ====== VIEWPORT 2: Adaptive Innovator ====== */}
      <section className={`${fontClasses} h-screen overflow-hidden relative bg-[#0c0c0c]/30 px-4 py-16 flex flex-col items-center justify-center md:px-6 md:py-0 xl:px-0`}>
        
        {/* Vertical line — Tablet */}
        <div className="hidden md:block xl:hidden absolute left-1/2 top-0 bottom-0 -translate-x-1/2 z-0">
          <div className="relative w-0.5 h-full bg-white/20 overflow-hidden"><div className="scroll-line-pulse" /></div>
        </div>

        {/* Vertical line — Desktop */}
        <div className="hidden xl:block absolute left-1/2 top-0 bottom-0 -translate-x-1/2">
          <div className="relative w-0.5 h-full bg-white/20 overflow-hidden"><div className="scroll-line-pulse" /></div>
        </div>

        {/* Mobile: title → video → desc → subtitle */}
        <div className="flex flex-col items-center justify-center md:hidden">
          <h3 className="font-[family-name:var(--font-satoshi)] text-xl font-bold text-white text-center mb-4">
            {sections[1].title}
          </h3>
          <div className="mb-4">
            <TransparentMediaPlayer mp4Src={sections[1].mp4Src} webmSrc={sections[1].webmSrc} apngSrc={sections[1].apngSrc} altText={sections[1].title} width={240} height={144} />
          </div>
          <p className="font-[family-name:var(--font-montserrat)] text-gray-300 text-xs leading-relaxed text-center mb-4">
            {sections[1].description}
          </p>
          <p className="font-[family-name:var(--font-pixel)] text-[#3CA2F1] text-xs text-center">
            {sections[1].subtitle}
          </p>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="w-6 h-6 border-b-2 border-r-2 border-white/30 transform rotate-45 animate-bounce" />
          </div>
        </div>

        {/* Tablet: video → title+desc → subtitle */}
        <div className="hidden md:flex xl:hidden flex-col items-center justify-center z-10">
          <div className="mb-6">
            <TransparentMediaPlayer mp4Src={sections[1].mp4Src} webmSrc={sections[1].webmSrc} apngSrc={sections[1].apngSrc} altText={sections[1].title} width={320} height={192} />
          </div>
          <div className="w-full bg-[#0c0c0c]/30 px-4 text-center">
            <div className="max-w-md mx-auto mb-10">
              <h3 className="font-[family-name:var(--font-satoshi)] text-2xl font-bold text-white mb-4">{sections[1].title}</h3>
              <p className="font-[family-name:var(--font-montserrat)] text-gray-300 text-sm leading-relaxed">{sections[1].description}</p>
            </div>
            <div className="max-w-sm mx-auto">
              <p className="font-[family-name:var(--font-pixel)] text-[#3CA2F1] text-xs">{sections[1].subtitle}</p>
            </div>
          </div>
        </div>

        {/* Desktop: 3-column SWAPPED (subtitle LEFT | video CENTER | title+desc RIGHT) */}
        <div className="hidden xl:flex relative items-center justify-center w-full h-full">
          <div className="absolute 2xl:left-24 xl:left-28 top-1/2 -translate-y-1/2 2xl:max-w-md xl:max-w-sm">
            <p className="font-[family-name:var(--font-pixel)] text-[#3CA2F1] text-sm">{sections[1].subtitle}</p>
          </div>
          <div className="relative">
            <TransparentMediaPlayer mp4Src={sections[1].mp4Src} webmSrc={sections[1].webmSrc} apngSrc={sections[1].apngSrc} altText={sections[1].title} width={500} height={300} />
          </div>
          <div className="absolute 2xl:right-16 xl:right-8 top-1/2 -translate-y-1/2">
            <div className="flex flex-col items-end">
              <h3 className="font-[family-name:var(--font-satoshi)] text-3xl font-bold text-white whitespace-nowrap mb-0">{sections[1].title}</h3>
              <div className="relative">
                <Image src={titleLineFlippedSvg} alt="" width={450} height={160} />
                <p className="absolute top-3 right-0 font-[family-name:var(--font-montserrat)] text-gray-300 text-sm leading-relaxed max-w-[310px] text-right">{sections[1].description}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====== VIEWPORT 3: Code Craftsman ====== */}
      <section className={`${fontClasses} h-screen overflow-hidden relative bg-[#0c0c0c]/30 px-4 py-16 flex flex-col items-center justify-center md:px-6 md:py-0 xl:px-0`}>
        
        {/* Vertical line — Tablet (half height) */}
        <div className="hidden md:block xl:hidden absolute left-1/2 top-0 bottom-1/2 -translate-x-1/2">
          <div className="relative w-0.5 h-[50%] bg-white/20 overflow-hidden"><div className="scroll-line-pulse" /></div>
        </div>

        {/* Vertical line — Desktop (half height) */}
        <div className="hidden xl:block absolute left-1/2 top-0 bottom-0 -translate-x-1/2">
          <div className="relative w-0.5 h-1/2 bg-white/20 overflow-hidden"><div className="scroll-line-pulse" /></div>
        </div>

        {/* Mobile: title → video → desc → subtitle */}
        <div className="flex flex-col items-center justify-center md:hidden">
          <h3 className="font-[family-name:var(--font-satoshi)] text-xl font-bold text-white text-center mb-4">
            {sections[2].title}
          </h3>
          <div className="mb-4">
            <TransparentMediaPlayer mp4Src={sections[2].mp4Src} webmSrc={sections[2].webmSrc} apngSrc={sections[2].apngSrc} altText={sections[2].title} width={240} height={144} />
          </div>
          <p className="font-[family-name:var(--font-montserrat)] text-gray-300 text-xs leading-relaxed text-center mb-4">
            {sections[2].description}
          </p>
          <p className="font-[family-name:var(--font-pixel)] text-[#3CA2F1] text-xs text-center">
            {sections[2].subtitle}
          </p>
        </div>

        {/* Tablet: video → title+desc → subtitle */}
        <div className="hidden md:flex xl:hidden flex-col items-center justify-center">
          <div className="mb-6">
            <TransparentMediaPlayer mp4Src={sections[2].mp4Src} webmSrc={sections[2].webmSrc} apngSrc={sections[2].apngSrc} altText={sections[2].title} width={320} height={192} />
          </div>
          <div className="w-full px-4 text-center bg-[#0c0c0c]/30 z-10">
            <div className="max-w-md mx-auto mb-10">
              <h3 className="font-[family-name:var(--font-satoshi)] text-2xl font-bold text-white mb-4">{sections[2].title}</h3>
              <p className="font-[family-name:var(--font-montserrat)] text-gray-300 text-sm leading-relaxed">{sections[2].description}</p>
            </div>
            <div className="max-w-sm mx-auto">
              <p className="font-[family-name:var(--font-pixel)] text-[#3CA2F1] text-xs">{sections[2].subtitle}</p>
            </div>
          </div>
        </div>

        {/* Desktop: 3-column (title+desc LEFT | video CENTER | subtitle RIGHT) */}
        <div className="hidden xl:flex relative items-center justify-center w-full h-full">
          <div className="absolute 2xl:left-16 xl:left-8 top-1/2 -translate-y-1/2">
            <h3 className="font-[family-name:var(--font-satoshi)] text-3xl font-bold text-white whitespace-nowrap mb-0">{sections[2].title}</h3>
            <div className="relative">
              <Image src={titleLineSvg} alt="" width={450} height={160} />
              <p className="absolute top-3 left-0 font-[family-name:var(--font-montserrat)] text-gray-300 text-sm leading-relaxed max-w-[310px]">{sections[2].description}</p>
            </div>
          </div>
          <div className="relative">
            <TransparentMediaPlayer mp4Src={sections[2].mp4Src} webmSrc={sections[2].webmSrc} apngSrc={sections[2].apngSrc} altText={sections[2].title} width={500} height={300} />
          </div>
          <div className="absolute 2xl:right-24 xl:right-28 top-1/2 -translate-y-1/2 2xl:max-w-md xl:max-w-sm">
            <p className="font-[family-name:var(--font-pixel)] text-[#3CA2F1] text-sm">{sections[2].subtitle}</p>
          </div>
        </div>
      </section>
    </>
  )
}
