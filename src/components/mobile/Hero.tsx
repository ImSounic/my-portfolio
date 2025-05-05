// src/components/mobile/Hero.tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import gridSvg from '@/assets/images/grid.svg'
import starSvg from '@/assets/icons/star.svg'
import locationSvg from '@/assets/icons/location.svg'
import handSvg from '@/assets/icons/hand.svg'
import localFont from 'next/font/local'
import { Montserrat } from 'next/font/google'

const satoshi = localFont({
  src: [
    {
      path: '../../../public/fonts/Satoshi-Black.otf',
      weight: '900',
      style: 'normal'
    }
  ],
  variable: '--font-satoshi',
})

const pixelFont = localFont({
  src: [
    {
      path: '../../../public/fonts/pixel_font-7.ttf',
      weight: '400',
      style: 'normal'
    }
  ],
  variable: '--font-pixel',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: '600',
  variable: '--font-montserrat',
})

export default function Hero() {
  const [time, setTime] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Update time every minute
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      setTime(timeString);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="home" className={`${satoshi.variable} ${montserrat.variable} ${pixelFont.variable} relative min-h-screen flex flex-col items-center justify-center px-4 py-16`}>
      {/* Grid SVG Background */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={gridSvg}
          alt="Grid background"
          fill
          className="object-cover opacity-75"
        />
      </div>
      
      <div className="relative z-10 flex flex-col items-center text-center w-full">
        {/* Profile Image */}
        <div className="mb-8">
          <div className="w-36 h-36 rounded-full overflow-hidden">
            <Image
              src="/profile.png"
              alt="Sounic"
              width={144}
              height={144}
              className="object-cover"
            />
          </div>
        </div>
        
        {/* Hero Text */}
        <h1 className="flex flex-col gap-2 mb-6">
          <span className="font-[family-name:var(--font-satoshi)] text-white text-3xl font-bold">
            HELLO! I&apos;M
          </span>
          <span
            className="font-[family-name:var(--font-satoshi)] text-4xl font-bold relative"
            style={{
              WebkitTextStroke: '1px white',
              WebkitTextFillColor: 'transparent'
            }}
          >
            SOUNIC
            {/* Star - smaller for mobile */}
            <Image
              src={starSvg}
              alt="Star decoration"
              width={40}
              height={40}
              className="absolute -top-2 -right-2 w-10 h-10 animate-star-rotation"
              style={{ transform: 'translate(50%, -50%)' }}
            />
          </span>
        </h1>
        
        <p className="font-[family-name:var(--font-montserrat)] text-sm text-gray-300 mb-8 leading-relaxed">
          Enthusiastic Computer Science And AI Student At University Of
          Leeds, Graduating Next Semester. Eager To Apply My Software
          Engineering And AI/ML Skills In A Professional Setting.
        </p>
        
        {/* CTA Buttons - Full width on mobile */}
        <div className="flex flex-col gap-3 w-full mb-8">
          <button
            onClick={() => {
              const contactSection = document.querySelector('#contact');
              if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="w-full py-3 bg-[#E9F5DB] text-black font-medium text-base rounded-[10px] flex items-center justify-center gap-2"
          >
            Let&apos;s Talk
            <Image
              src={handSvg}
              alt="Hand icon"
              width={18}
              height={18}
            />
          </button>
          <Link
            href="/Resume.pdf"
            className="w-full py-3 border-2 border-[#E9F5DB] border-dashed text-white font-medium text-base rounded-[10px] transition-all hover:border-solid hover:bg-[#E9F5DB] hover:text-black"
          >
            View my Resume
          </Link>
        </div>
        
        {/* Location Info - Bottom of content rather than absolute */}
        <div className="flex items-center gap-2 mt-4">
          <Image
            src={locationSvg}
            alt="Location"
            width={24}
            height={24}
            className="opacity-80"
          />
          <div>
            <p className="text-gray-300 text-xs italic">
              Currently Based in Leeds, UK
            </p>
            <p className="text-gray-400 text-xs">
              {mounted ? time : 'Loading...'}
            </p>
          </div>
        </div>
      </div>

      {/* Simplified scroll indicator */}
      <div className="absolute left-4 bottom-8">
        <div className="flex items-center gap-1">
          <div className="w-[1px] h-16 bg-white/50"></div>
          <p className="font-[family-name:var(--font-pixel)] text-white/70 text-[10px] tracking-wider" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
            SCROLL
          </p>
        </div>
      </div>
    </section>
  )
}