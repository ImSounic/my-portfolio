// src/components/mobile/AboutSection.tsx
'use client'

import Image from 'next/image'
import { useState } from 'react'
import localFont from 'next/font/local'
import { Montserrat } from 'next/font/google'
import radarSvg from '@/assets/icons/radar.svg'
import profileImg from '@/assets/images/about-profile.png'
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
    content: 'I am a soon-to-be graduate with a Bachelor\'s degree in Computer Science and Artificial Intelligence. Throughout my academic journey, I have developed a strong proficiency in Python, Java, JavaScript, Django Framework, SQL, HTML, CSS, and XML. My passion for technology and problem-solving drives me to continuously learn and innovate. I am particularly interested in roles such as Software Engineer and AI/ML Engineer, where I can leverage my skills to contribute to cutting-edge projects and solutions.',
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

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const activeSlide = slides[currentSlide]

  return (
    <section 
      id="about"
      className={`${satoshi.variable} ${montserrat.variable} min-h-screen bg-black relative flex flex-col items-center justify-center px-4 py-16`}
    >
      {/* Custom Grid SVG Background - smaller for mobile */}
      <div className="absolute bottom-0 left-0 right-0 w-full">
        <div className="relative w-full">
          <Image
            src={bottomGridSvg}
            alt="Grid background"
            width={600}
            height={200}
            className="w-full h-auto opacity-60"
          />
        </div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full">
        {/* Section Title */}
        <h2 className="font-[family-name:var(--font-satoshi)] text-3xl font-bold text-white text-center mb-8">
          ABOUT ME
        </h2>

        {/* Main Content Container */}
        <div className="relative">
          {/* Glassmorphism Container with Radar inside */}
          <div className="relative">
            {/* Radar Animation - Now outside the card like in tablet */}
            <div className="absolute -top-8 -left-2 z-0">
              <div className="relative w-16 h-16">
                <Image
                  src={radarSvg}
                  alt="Radar animation"
                  fill
                  className="animate-spin-slow"
                />
                {/* Center dot */}
                <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-red-500 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Glassmorphism Card - Separate from radar */}
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-4 relative">
              {/* Title */}
              <div className="flex items-center gap-1 mb-3">
                <h3 className="font-[family-name:var(--font-satoshi)] text-2xl font-bold text-white">
                  {activeSlide.title.normal}
                </h3>
                <span 
                  className="font-[family-name:var(--font-satoshi)] text-2xl font-bold"
                  style={{
                    WebkitTextStroke: '1px white',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  {activeSlide.title.outline}
                </span>
              </div>
              
              {/* Image */}
              <div className="mb-4">
                <div className="relative w-full h-48 rounded-lg overflow-hidden">
                  <Image
                    src={activeSlide.image}
                    alt={activeSlide.imageAlt}
                    fill
                    className="object-cover"
                  />
                  {/* Overlay text */}
                  <div className="absolute bottom-2 right-2 z-10 bg-black/50 px-2 py-1 rounded text-white font-[family-name:var(--font-montserrat)] text-xs">
                    {activeSlide.overlayText}
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="mb-4">
                <p className="font-[family-name:var(--font-montserrat)] text-gray-300 text-sm leading-relaxed">
                  {activeSlide.content}
                </p>
              </div>
            </div>
          </div>
          
          {/* Navigation buttons */}
          <div className="flex justify-center gap-6 mt-6">
            <button 
              onClick={prevSlide}
              className="w-10 h-10 border-2 border-dashed border-white/30 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:border-white/50 transition-all"
            >
              &lt;
            </button>
            <button 
              onClick={nextSlide}
              className="w-10 h-10 border-2 border-dashed border-white/30 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:border-white/50 transition-all"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}