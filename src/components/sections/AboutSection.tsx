// src/components/sections/AboutSection.tsx
'use client'

import Image from 'next/image'
import { useState, useRef, useCallback } from 'react'
import gsap from 'gsap'
import localFont from 'next/font/local'
import { Montserrat } from 'next/font/google'
import radarSvg from '@/assets/icons/radar.svg'
import profileImg from '@/assets/images/about-profile.png'
import CircleFillOverlaySmall from '@/components/ui/CircleFillOverlaySmall'
import bottomGridSvg from '@/assets/images/bottom-grid.svg'
import editingImg from '@/assets/images/editing.png'
import gamingImg from '@/assets/images/gaming.png'

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

const slides = [
  {
    id: 'about',
    title: { normal: 'ABOUT', outline: 'SOUNIC' },
    content: "MS in Computer Science with a specialization in Data Science & Technologies at University of Twente, with a Bachelor's in Computer Science and AI. I build end-to-end ML pipelines and full-stack applications — from ensemble deep learning models for healthcare prediction to cross-platform mobile apps. Currently seeking software engineering or AI/ML internships starting September 2026.",
    image: profileImg,
    imageAlt: 'Sounic in snow mountains',
    overlayText: 'ABOUT'
  },
  {
    id: 'editing',
    title: { normal: 'EDITING', outline: 'ESCAPADES' },
    content: 'Beyond coding, I immerse myself in digital storytelling through video editing. I transform raw footage into captivating visual narratives using After Effects and Premiere Pro. From short films to creative montages, I blend technical precision with artistic vision. This creative outlet allows me to exercise problem-solving in a different dimension, enhancing my ability to translate complex ideas into engaging experiences.',
    image: editingImg,
    imageAlt: 'Video editing setup',
    overlayText: 'EDITING'
  },
  {
    id: 'gaming',
    title: { normal: 'GAMING', outline: 'ESCAPADES' },
    content: "When I'm not coding or editing, I explore interactive worlds through gaming. My passion for strategic gameplay and immersive experiences gives me valuable insights into user engagement and interface design. Gaming has taught me the importance of perseverance, team collaboration, and thinking several steps ahead—skills that directly translate to my approach to software development and problem-solving.",
    image: gamingImg,
    imageAlt: 'Gaming setup',
    overlayText: 'GAMING'
  }
]

export default function AboutSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  const animateSlide = useCallback((direction: 'left' | 'right', newIndex: number) => {
    if (isAnimating || !contentRef.current) return
    setIsAnimating(true)

    const exitX = direction === 'left' ? -60 : 60
    const enterX = direction === 'left' ? 60 : -60

    gsap.to(contentRef.current, {
      x: exitX,
      opacity: 0,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: () => {
        setCurrentSlide(newIndex)
        gsap.set(contentRef.current, { x: enterX, opacity: 0 })
        gsap.to(contentRef.current, {
          x: 0,
          opacity: 1,
          duration: 0.25,
          ease: 'power2.out',
          onComplete: () => setIsAnimating(false),
        })
      },
    })
  }, [isAnimating])

  const nextSlide = () => {
    const newIndex = (currentSlide + 1) % slides.length
    animateSlide('left', newIndex)
  }

  const prevSlide = () => {
    const newIndex = (currentSlide - 1 + slides.length) % slides.length
    animateSlide('right', newIndex)
  }

  const activeSlide = slides[currentSlide]

  return (
    <section 
      id="about"
      className={`${satoshi.variable} ${montserrat.variable} h-screen overflow-hidden bg-[#0c0c0c]/80 relative flex flex-col items-center justify-center px-4 py-16 md:flex-row md:px-6 md:py-0 xl:px-0`}
    >
      {/* Custom Grid SVG Background at bottom center */}
      <div className="absolute bottom-0 left-0 right-0 w-full md:flex md:justify-center">
        <div className="relative w-full md:max-w-4xl xl:max-w-7xl">
          {/* Mobile grid */}
          <Image
            src={bottomGridSvg}
            alt="Grid background"
            width={600}
            height={200}
            className="w-full h-auto opacity-60 md:hidden"
          />
          {/* Tablet grid */}
          <Image
            src={bottomGridSvg}
            alt="Grid background"
            width={1200}
            height={350}
            className="w-full h-auto opacity-100 hidden md:block xl:hidden"
            style={{ transformOrigin: 'bottom center' }}
          />
          {/* Desktop grid */}
          <Image
            src={bottomGridSvg}
            alt="Grid background"
            width={1920}
            height={500}
            className="w-full h-auto opacity-100 hidden xl:block"
            style={{ transformOrigin: 'bottom center' }}
          />
        </div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full md:max-w-4xl md:mx-auto xl:max-w-7xl xl:px-8">
        {/* Section Title */}
        <h2 className="font-[family-name:var(--font-satoshi)] text-3xl font-bold text-white text-center mb-8 md:text-4xl md:mb-10 xl:text-5xl xl:mb-12">
          ABOUT ME
        </h2>

        {/* Main Content Container */}
        <div className="relative">
          {/* Desktop Navigation Arrows - Side panel */}
          <div className="hidden xl:flex absolute 2xl:-left-24 xl:-left-16 top-1/2 -translate-y-1/2 flex-col gap-8 z-20">
            <button 
              onClick={nextSlide}
              className="btn-circle-fill w-12 h-20 border-2 border-dashed border-white/30 rounded-lg flex items-center justify-center text-white/50 transition-all duration-300"
            >
              <CircleFillOverlaySmall />
              <span className="relative z-10">&gt;</span>
            </button>
            <button 
              onClick={prevSlide}
              className="btn-circle-fill w-12 h-20 border-2 border-dashed border-white/30 rounded-lg flex items-center justify-center text-white/50 transition-all duration-300"
            >
              <CircleFillOverlaySmall />
              <span className="relative z-10">&lt;</span>
            </button>
          </div>

          {/* Tablet Navigation Arrows - Top center */}
          <div className="hidden md:flex xl:hidden justify-center gap-4 mb-6">
            <button 
              onClick={prevSlide}
              className="btn-circle-fill w-10 h-16 border-2 border-dashed border-white/30 rounded-lg flex items-center justify-center text-white/50 transition-all"
            >
              <CircleFillOverlaySmall />
              <span className="relative z-10">&lt;</span>
            </button>
            <button 
              onClick={nextSlide}
              className="btn-circle-fill w-10 h-16 border-2 border-dashed border-white/30 rounded-lg flex items-center justify-center text-white/50 transition-all"
            >
              <CircleFillOverlaySmall />
              <span className="relative z-10">&gt;</span>
            </button>
          </div>

          {/* Glassmorphism Container with Radar */}
          <div className="relative">
            {/* Radar Animation - Responsive sizes */}
            <div className="absolute -top-8 -left-2 z-0 md:-top-14 md:-left-14 xl:-top-20 xl:-left-20">
              {/* Mobile radar */}
              <div className="relative w-16 h-16 md:hidden">
                <Image src={radarSvg} alt="Radar animation" fill className="animate-spin-slow" />
                <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-red-500 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
              </div>
              {/* Tablet radar */}
              <div className="relative w-28 h-28 hidden md:block xl:hidden">
                <Image src={radarSvg} alt="Radar animation" fill className="animate-spin-slow" />
                <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-red-500 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
              </div>
              {/* Desktop radar */}
              <div className="relative w-40 h-40 hidden xl:block">
                <Image src={radarSvg} alt="Radar animation" fill className="animate-spin-slow" />
                <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-red-500 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Glassmorphism Card */}
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-4 relative md:rounded-2xl md:p-6 xl:p-20 overflow-hidden">
              <div ref={contentRef}>
              {/* Mobile layout: title → image → text */}
              <div className="md:hidden">
                {/* Title */}
                <div className="flex items-center gap-1 mb-3">
                  <h3 className="font-[family-name:var(--font-satoshi)] text-2xl font-bold text-white">
                    {activeSlide.title.normal}
                  </h3>
                  <span 
                    className="font-[family-name:var(--font-satoshi)] text-2xl font-bold"
                    style={{ WebkitTextStroke: '1px white', WebkitTextFillColor: 'transparent' }}
                  >
                    {activeSlide.title.outline}
                  </span>
                </div>
                
                {/* Image */}
                <div className="mb-4">
                  <div className="relative w-full h-48 rounded-lg overflow-hidden">
                    <Image src={activeSlide.image} alt={activeSlide.imageAlt} fill className="object-cover" />
                    <div className="absolute bottom-2 right-2 z-10 bg-black/50 px-2 py-1 rounded text-white font-[family-name:var(--font-montserrat)] text-xs">
                      {activeSlide.overlayText}
                    </div>
                  </div>
                </div>
                
                {/* Text */}
                <div className="mb-4">
                  <p className="font-[family-name:var(--font-montserrat)] text-gray-300 text-sm leading-relaxed">
                    {activeSlide.content}
                  </p>
                </div>
              </div>

              {/* Tablet layout: title → text → image (stacked) */}
              <div className="hidden md:flex xl:hidden flex-col gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <h3 className="font-[family-name:var(--font-satoshi)] text-3xl font-bold text-white">
                      {activeSlide.title.normal}
                    </h3>
                    <span 
                      className="font-[family-name:var(--font-satoshi)] text-3xl font-bold"
                      style={{ WebkitTextStroke: '1px white', WebkitTextFillColor: 'transparent' }}
                    >
                      {activeSlide.title.outline}
                    </span>
                  </div>
                  <p className="font-[family-name:var(--font-montserrat)] text-gray-300 text-base leading-relaxed">
                    {activeSlide.content}
                  </p>
                </div>
                <div className="relative flex justify-center">
                  <div className="relative w-72 h-72 rounded-lg overflow-hidden">
                    <Image src={activeSlide.image} alt={activeSlide.imageAlt} fill className="object-cover" />
                    <div className="absolute bottom-4 right-4 z-10 bg-black/50 px-3 py-1 rounded text-white font-[family-name:var(--font-montserrat)] text-lg">
                      {activeSlide.overlayText}
                    </div>
                  </div>
                </div>
              </div>

              {/* Desktop layout: 2-col grid, text left + image right */}
              <div className="hidden xl:grid grid-cols-2 gap-40 items-center">
                <div className="space-y-8">
                  <div className="flex items-center gap-2">
                    <h3 className="font-[family-name:var(--font-satoshi)] text-4xl font-bold text-white">
                      {activeSlide.title.normal}
                    </h3>
                    <span 
                      className="font-[family-name:var(--font-satoshi)] text-4xl font-bold"
                      style={{ WebkitTextStroke: '1px white', WebkitTextFillColor: 'transparent' }}
                    >
                      {activeSlide.title.outline}
                    </span>
                  </div>
                  <p className="font-[family-name:var(--font-montserrat)] text-gray-300 text-lg leading-relaxed">
                    {activeSlide.content}
                  </p>
                </div>
                <div className="relative flex justify-end">
                  <div className="relative w-96 h-96 rounded-lg overflow-hidden">
                    <Image src={activeSlide.image} alt={activeSlide.imageAlt} fill className="object-cover" />
                    <div className="absolute bottom-4 right-4 z-10 bg-black/50 px-3 py-1 rounded text-white font-[family-name:var(--font-montserrat)] text-lg">
                      {activeSlide.overlayText}
                    </div>
                  </div>
                </div>
              </div>
              </div>
            </div>
          </div>

          {/* Mobile Navigation Arrows - Bottom center */}
          <div className="flex md:hidden justify-center gap-6 mt-6">
            <button 
              onClick={prevSlide}
              className="btn-circle-fill w-10 h-14 border-2 border-dashed border-white/30 rounded-lg flex items-center justify-center text-white/50 transition-all"
            >
              <CircleFillOverlaySmall />
              <span className="relative z-10">&lt;</span>
            </button>
            <button 
              onClick={nextSlide}
              className="btn-circle-fill w-10 h-14 border-2 border-dashed border-white/30 rounded-lg flex items-center justify-center text-white/50 transition-all"
            >
              <CircleFillOverlaySmall />
              <span className="relative z-10">&gt;</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
