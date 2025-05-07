// src/components/mobile/Hero.tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'
import {useEffect, useRef } from 'react'
import gsap from 'gsap'
import gridSvg from '@/assets/images/grid.svg'
import starSvg from '@/assets/icons/star.svg'
import handSvg from '@/assets/icons/hand.svg'
import localFont from 'next/font/local'
import { Montserrat } from 'next/font/google'

const satoshi = localFont({
  src: [{ path: '../../../public/fonts/Satoshi-Black.otf', weight: '900', style: 'normal' }],
  variable: '--font-satoshi',
})

const pixelFont = localFont({
  src: [{ path: '../../../public/fonts/pixel_font-7.ttf', weight: '400', style: 'normal' }],
  variable: '--font-pixel',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: '600',
  variable: '--font-montserrat',
})

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to('.hero-fade', {
        y: 0,
        autoAlpha: 1,
        stagger: 0.1,
        duration: 1,
        ease: 'power3.out',
        delay: 0.5,
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} id="home" className={`${satoshi.variable} ${montserrat.variable} ${pixelFont.variable} relative min-h-screen flex flex-col items-center justify-center px-4 py-16`}>
      <div className="absolute inset-0 w-full h-full">
        <Image src={gridSvg} alt="Grid background" fill className="object-cover opacity-75" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center w-full">
        <div className="mb-8 hero-fade opacity-0 translate-y-[50px]">
          <div className="w-36 h-36 rounded-full overflow-hidden">
            <Image src="/profile.png" alt="Sounic" width={144} height={144} className="object-cover" />
          </div>
        </div>

        <h1 className="flex flex-row flex-wrap items-center justify-center gap-2 mb-6 hero-fade opacity-0 translate-y-[50px]">
          <span className="font-[family-name:var(--font-satoshi)] text-white text-3xl font-bold">
            HELLO! I&apos;M
          </span>
          <span
            className="font-[family-name:var(--font-satoshi)] text-3xl font-bold relative"
            style={{ WebkitTextStroke: '1px white', WebkitTextFillColor: 'transparent' }}
          >
            SOUNIC
            <Image
              src={starSvg}
              alt="Star decoration"
              width={45}
              height={45}
              className="absolute -top-3 -right-2 w-12 h-12 animate-star-rotation"
              style={{ transform: 'translate(50%, -50%)' }}
            />
          </span>
        </h1>

        <p className="font-[family-name:var(--font-montserrat)] text-sm text-gray-300 mb-8 leading-relaxed hero-fade opacity-0 translate-y-[50px]">
          Enthusiastic Computer Science And AI Graduating Next Semester. Eager To Apply My Software
          Engineering And AI/ML Skills In A Professional Setting.
        </p>

        <div className="flex flex-col gap-3 w-full mb-8 hero-fade opacity-0 translate-y-[50px]">
          <button
            onClick={() => {
              const contactSection = document.querySelector('#contact');
              if (contactSection) {
                contactSection.scrollIntoView();
              }
            }}
            className="w-full py-3 bg-[#E9F5DB] text-black font-medium text-base rounded-[10px] flex items-center justify-center gap-2"
          >
            Let&apos;s Talk
            <Image src={handSvg} alt="Hand icon" width={18} height={18} />
          </button>
          <Link
            href="/Resume.pdf"
            className="w-full py-3 border-2 border-[#E9F5DB] border-dashed text-[#E9F5DB] font-medium text-base rounded-[10px] transition-all hover:border-solid hover:bg-[#E9F5DB] hover:text-black"
          >
            View my Resume
          </Link>
        </div>
      </div>

      <div className="absolute left-4 bottom-8 hero-fade opacity-0 translate-y-[50px]">
        <div className="flex items-center gap-1">
          <div className="w-[1px] h-16 bg-white/50"></div>
          <p className="font-[family-name:var(--font-pixel)] text-[#E9F5DB]/70 text-[10px] tracking-wider" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
            SCROLL
          </p>
        </div>
      </div>
    </section>
  );
}