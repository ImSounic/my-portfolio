// src/components/sections/Hero.tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import gridSvg from '@/assets/images/grid.svg'
import starSvg from '@/assets/icons/star.svg'
import locationSvg from '@/assets/icons/location.svg'
import handSvg from '@/assets/icons/hand.svg'
import greenBoxSvg from '@/assets/icons/green-box.svg'
import localFont from 'next/font/local'
import { Montserrat } from 'next/font/google'
import CircleFillOverlay from '@/components/ui/CircleFillOverlay'
import { BlurText, ShinyText } from '@/components/ui/reactbits'

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
  const [time, setTime] = useState('');
  const [weather, setWeather] = useState('');
  const [mounted, setMounted] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  // Bubble positions for tablet resume button animation
  useEffect(() => {
    setMounted(true);

    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Europe/Amsterdam'
      });
      // Determine current CET/CEST offset
      const offsetLabel = new Date().toLocaleString('en-US', { timeZone: 'Europe/Amsterdam', timeZoneName: 'short' }).split(' ').pop();
      setTime(`${timeString} ${offsetLabel}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);

    // Fetch Enschede, Netherlands weather (hardcoded coords)
    (async () => {
      try {
        const response = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=52.2215&longitude=6.8937&current_weather=true'
        );
        const data = await response.json();
        setWeather(`${data.current_weather.temperature}°C`);
      } catch (error) {
        console.error('Weather fetch failed:', error);
        setWeather('--°C');
      }
    })();

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.5 });
      tl.to('.hero-fade', {
        y: 0,
        autoAlpha: 1,
        stagger: 0.1,
        duration: 1,
        ease: 'power3.out'
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const timeWeatherDisplay = mounted ? (
    <p className="text-gray-400 text-sm">{time} {weather}</p>
  ) : (
    <p className="text-gray-400 text-sm">Loading...</p>
  );

  const scrollToContact = () => {
    const contactSection = document.querySelector('#contact');
    if (contactSection) {
      contactSection.scrollIntoView();
    }
  };

  return (
    <section ref={heroRef} id="home" className={`${satoshi.variable} ${montserrat.variable} ${pixelFont.variable} relative h-screen overflow-hidden flex flex-col items-center justify-center px-4 py-16 md:flex-row md:px-8 md:py-0 xl:px-0`}>
      <div className="absolute inset-0 w-full h-full">
        <Image src={gridSvg} alt="Grid background" fill className="object-cover opacity-75" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center w-full md:justify-center">
        {/* Title — Mobile */}
        <div className="flex flex-row flex-wrap items-center justify-center gap-2 mb-6 hero-fade opacity-0 translate-y-[50px] md:hidden">
          <BlurText 
            text="HELLO! I'M" 
            className="font-[family-name:var(--font-satoshi)] text-white text-3xl font-bold"
            delay={100}
            animateBy="words"
          />
          <span className="font-[family-name:var(--font-satoshi)] text-3xl font-bold relative" style={{ WebkitTextStroke: '1px white', WebkitTextFillColor: 'transparent' }}>
            <ShinyText 
              text="SOUNIC" 
              color="transparent"
              shineColor="rgba(255,255,255,0.8)"
              speed={3}
              className="font-[family-name:var(--font-satoshi)]"
            />
            <Image src={starSvg} alt="Star decoration" width={45} height={45} className="absolute -top-3 -right-2 w-12 h-12 animate-star-rotation" style={{ transform: 'translate(50%, -50%)' }} />
          </span>
        </div>

        {/* Title — Tablet */}
        <div className="hidden md:flex xl:hidden text-5xl md:text-6xl font-bold mb-6 items-center justify-center gap-3 hero-fade opacity-0 translate-y-[50px]">
          <BlurText 
            text="HELLO! I'M" 
            className="font-[family-name:var(--font-satoshi)] text-white"
            delay={100}
            animateBy="words"
          />
          <span className="font-[family-name:var(--font-satoshi)] relative" style={{ WebkitTextStroke: '2px white', WebkitTextFillColor: 'transparent' }}>
            <ShinyText 
              text="SOUNIC" 
              color="transparent"
              shineColor="rgba(255,255,255,0.8)"
              speed={3}
              className="font-[family-name:var(--font-satoshi)]"
            />
            <Image src={starSvg} alt="Star decoration" width={80} height={80} className="absolute -top-4 -right-4 w-16 h-16 animate-star-rotation" style={{ transform: 'translate(50%, -50%)' }} />
          </span>
        </div>

        {/* Title — Desktop */}
        <div className="hidden xl:flex text-6xl md:text-7xl lg:text-8xl font-bold mb-8 items-center justify-center gap-4 hero-fade opacity-0 translate-y-[50px]">
          <BlurText 
            text="HELLO! I'M" 
            className="font-[family-name:var(--font-satoshi)] text-white"
            delay={100}
            animateBy="words"
          />
          <span className="font-[family-name:var(--font-satoshi)] relative" style={{ WebkitTextStroke: '2px white', WebkitTextFillColor: 'transparent' }}>
            <ShinyText 
              text="SOUNIC" 
              color="transparent"
              shineColor="rgba(255,255,255,0.8)"
              speed={3}
              className="font-[family-name:var(--font-satoshi)]"
            />
            <Image src={starSvg} alt="Star decoration" width={100} height={100} className="absolute -top-4 -right-4 w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 animate-star-rotation" style={{ transform: 'translate(50%, -50%)' }} />
          </span>
        </div>

        {/* Description */}
        <p className="font-[family-name:var(--font-montserrat)] text-base text-gray-300 mb-8 leading-relaxed hero-fade opacity-0 translate-y-[50px] md:text-xl md:max-w-2xl md:mb-10 xl:text-xl xl:max-w-4xl xl:mb-12">
          First-year Master&apos;s student in Data Science &amp; Technologies, graduating 2027. Seeking software engineering or AI/ML internships starting September 2026.
        </p>

        {/* Buttons — Mobile (stacked) */}
        <div className="flex flex-col gap-3 w-full mb-8 hero-fade opacity-0 translate-y-[50px] md:hidden">
          <button onClick={scrollToContact} className="w-full py-3 bg-[#E9F5DB] text-black font-medium text-base rounded-[10px] flex items-center justify-center gap-2">
            Let&apos;s Talk
            <Image src={handSvg} alt="Hand icon" width={18} height={18} />
          </button>
          <Link href="/Resume.pdf" className="btn-circle-fill w-full py-3 border-2 border-[#E9F5DB] border-dashed text-[#E9F5DB] font-medium text-base rounded-[10px] transition-all text-center">
            <CircleFillOverlay />
            <span className="relative z-10">View my Resume</span>
          </Link>
        </div>

        {/* Buttons — Tablet (row with bubble animation) */}
        <div className="hidden md:flex xl:hidden gap-4 mb-10 hero-fade opacity-0 translate-y-[50px]">
          <button onClick={scrollToContact} className="px-8 py-4 bg-[#E9F5DB] text-black font-medium text-base rounded-[10px] hover:bg-[#E9F5DB]/90 transition-colors flex items-center gap-2">
            Let&apos;s Talk
            <Image src={handSvg} alt="Hand icon" width={20} height={20} />
          </button>
          <Link href="/Resume.pdf" className="btn-circle-fill px-8 py-4 border-2 border-[#E9F5DB] border-dashed text-[#E9F5DB] font-medium text-base rounded-[10px] transition-all duration-300">
            <CircleFillOverlay />
            <span className="relative z-10">View my Resume</span>
          </Link>
        </div>

        {/* Buttons — Desktop (row, larger) */}
        <div className="hidden xl:flex gap-6 mb-12 hero-fade opacity-0 translate-y-[50px]">
          <button onClick={scrollToContact} className="px-12 py-5 bg-[#E9F5DB] text-black font-medium text-lg rounded-[10px] hover:bg-[#E9F5DB]/90 transition-colors flex items-center gap-3">
            Let&apos;s Talk
            <Image src={handSvg} alt="Hand icon" width={24} height={24} />
          </button>
          <Link href="/Resume.pdf" className="btn-circle-fill px-12 py-5 border-2 border-[#E9F5DB] border-dashed text-[#E9F5DB] font-medium text-lg rounded-[10px] transition-all duration-300">
            <CircleFillOverlay />
            <span className="relative z-10">View my Resume</span>
          </Link>
        </div>
      </div>

      {/* Location info — Tablet */}
      <div className="hidden md:flex xl:hidden absolute bottom-6 right-6 items-center gap-3 hero-fade opacity-0 translate-y-[50px]">
        <div className="text-right">
          <p className="text-gray-300 text-base italic">Currently Based in Netherlands</p>
          {timeWeatherDisplay}
        </div>
        <Image src={locationSvg} alt="Location" width={40} height={40} className="opacity-80" />
      </div>

      {/* Location info — Desktop */}
      <div className="hidden xl:flex absolute bottom-8 right-8 items-center gap-4 hero-fade opacity-0 translate-y-[50px]">
        <div className="text-right">
          <p className="text-gray-300 text-lg italic">Currently Based in Netherlands</p>
          {timeWeatherDisplay}
        </div>
        <Image src={locationSvg} alt="Location" width={60} height={60} className="opacity-80" />
      </div>

      {/* Green box — Tablet */}
      <div className="hidden md:block xl:hidden absolute left-6 top-[45%] hero-fade opacity-0 translate-y-[50px]">
        <Image src={greenBoxSvg} alt="Available for opportunities" width={16} height={8} className="opacity-90" />
      </div>

      {/* Green box — Desktop */}
      <div className="hidden xl:block absolute left-8 top-[45%] hero-fade opacity-0 translate-y-[50px]">
        <Image src={greenBoxSvg} alt="Available for opportunities" width={20} height={10} className="opacity-90" />
      </div>

      {/* Scroll indicator — Mobile */}
      <div className="absolute left-4 bottom-8 hero-fade opacity-0 translate-y-[50px] md:hidden">
        <div className="flex items-center gap-1">
          <div className="relative w-[1px] h-16 bg-white/20 overflow-hidden">
            <div className="scroll-line-pulse" />
          </div>
          <p className="font-[family-name:var(--font-pixel)] text-[#E9F5DB]/70 text-[10px] tracking-wider" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}><span className="text-[#38bdf8]">{"// "}</span>SCROLL</p>
        </div>
      </div>

      {/* Scroll indicator — Tablet */}
      <div className="hidden md:flex xl:hidden absolute left-24 bottom-0 items-center hero-fade opacity-0 translate-y-[50px]">
        <div className="flex items-center gap-2">
          <div className="relative w-[2px] h-36 bg-white/20 overflow-hidden">
            <div className="scroll-line-pulse" />
          </div>
          <p className="font-[family-name:var(--font-pixel)] text-white/70 text-xs tracking-wider" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}><span className="text-[#38bdf8]">{"// "}</span>SCROLL TO EXPLORE</p>
        </div>
      </div>

      {/* Scroll indicator — Desktop */}
      <div className="hidden xl:flex absolute left-36 bottom-0 items-center hero-fade opacity-0 translate-y-[50px]">
        <div className="flex items-center gap-2">
          <div className="relative w-[2px] h-48 bg-white/20 overflow-hidden">
            <div className="scroll-line-pulse" />
          </div>
          <p className="font-[family-name:var(--font-pixel)] text-white/70 text-xs tracking-wider" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}><span className="text-[#38bdf8]">{"// "}</span>SCROLL TO EXPLORE</p>
        </div>
      </div>
    </section>
  );
}
