// src/components/desktop/Hero.tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, useMemo, useRef } from 'react'
import gsap from 'gsap'
import gridSvg from '@/assets/images/grid.svg'
import starSvg from '@/assets/icons/star.svg'
import locationSvg from '@/assets/icons/location.svg'
import handSvg from '@/assets/icons/hand.svg'
import greenBoxSvg from '@/assets/icons/green-box.svg'
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
  const [time, setTime] = useState('');
  const [weather, setWeather] = useState('');
  const [mounted, setMounted] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  const bubblePositions = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      left: `${(i * 5) % 100}%`,
      delay: `${(i * 0.1) % 0.8}s`,
      duration: `${0.8 + (i * 0.02) % 0.4}s`,
    }));
  }, []);

  useEffect(() => {
    setMounted(true);

    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      const offset = now.getTimezoneOffset();
      const offsetHours = -offset / 60;
      const offsetString = `GMT${offsetHours >= 0 ? '+' : ''}${offsetHours}`;
      setTime(`${timeString} ${offsetString}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&current_weather=true`
          );
          const data = await response.json();
          setWeather(`${data.current_weather.temperature}°C`);
        } catch (error) {
          console.error('Weather fetch failed:', error);
          setWeather('--°C');
        }
      }, () => {
        setWeather('--°C');
      });
    }

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

  return (
    <section ref={heroRef} id="home" className={`${satoshi.variable} ${montserrat.variable} ${pixelFont.variable} relative min-h-screen flex items-center justify-center`}>
      <div className="absolute inset-0 w-full h-full">
        <Image src={gridSvg} alt="Grid background" fill className="object-cover opacity-75" />
      </div>

      <div className="relative z-10 w-full flex justify-center">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="relative mb-20 hero-fade opacity-0 translate-y-[50px]">
            <div className="w-50 h-50 rounded-full overflow-hidden">
              <Image src="/profile.png" alt="Sounic" width={220} height={220} className="object-cover" />
            </div>
          </div>

          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8 flex items-center justify-center gap-4 hero-fade opacity-0 translate-y-[50px]">
            <span className="font-[family-name:var(--font-satoshi)] text-white">HELLO! I&apos;M</span>
            <span className="font-[family-name:var(--font-satoshi)] relative" style={{ WebkitTextStroke: '2px white', WebkitTextFillColor: 'transparent' }}>
              SOUNIC
              <Image
                src={starSvg}
                alt="Star decoration"
                width={100}
                height={100}
                className="absolute -top-4 -right-4 w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 animate-star-rotation"
                style={{ transform: 'translate(50%, -50%)' }}
              />
            </span>
          </h1>

          <p className="font-[family-name:var(--font-montserrat)] text-lg md:text-xl lg:text-2xl text-gray-300 max-w-4xl mb-12 leading-relaxed hero-fade opacity-0 translate-y-[50px]">
            Enthusiastic Computer Science And AI Graduating Next Semester. Eager To Apply My Software Engineering And AI/ML Skills In A Professional Setting.
          </p>

          <div className="flex gap-6 mb-12 hero-fade opacity-0 translate-y-[50px]">
            <button
              onClick={() => {
                const contactSection = document.querySelector('#contact');
                if (contactSection) {
                  contactSection.scrollIntoView();
                }
              }}
              className="px-12 py-5 bg-[#E9F5DB] text-black font-medium text-lg rounded-[10px] hover:bg-[#E9F5DB]/90 transition-colors flex items-center gap-3"
            >
              Let&apos;s Talk
              <Image src={handSvg} alt="Hand icon" width={24} height={24} />
            </button>
            <Link
              href="/Resume.pdf"
              className="px-12 py-5 border-2 border-[#E9F5DB] border-dashed text-white font-medium text-lg rounded-[10px] transition-all duration-300 hover:border-solid hover:bg-[#E9F5DB] hover:text-black relative overflow-hidden group"
            >
              <span className="relative z-10">View my Resume</span>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {bubblePositions.map((position, i) => (
                  <div
                    key={i}
                    className="bubble-animation absolute w-3 h-3 bg-[#E9F5DB] rounded-full"
                    style={{
                      left: position.left,
                      bottom: '-20px',
                      animationDelay: position.delay,
                      animationDuration: position.duration,
                    }}
                  />
                ))}
              </div>
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 right-8 flex items-center gap-4 hero-fade opacity-0 translate-y-[50px]">
        <div className="text-right">
          <p className="text-gray-300 text-lg italic">Currently Based in United Kingdom</p>
          {timeWeatherDisplay}
        </div>
        <Image src={locationSvg} alt="Location" width={60} height={60} className="opacity-80" />
      </div>

      <div className="absolute left-8 top-[45%] hero-fade opacity-0 translate-y-[50px]">
        <Image src={greenBoxSvg} alt="Available for opportunities" width={20} height={10} className="opacity-90" />
      </div>

      <div className="absolute left-36 bottom-0 flex items-center hero-fade opacity-0 translate-y-[50px]">
        <div className="flex items-center gap-2">
          <div className="w-[2px] h-48 bg-white/50"></div>
          <p className="font-[family-name:var(--font-pixel)] text-white/70 text-xs tracking-wider" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
            SCROLL TO EXPLORE
          </p>
        </div>
      </div>
    </section>
  );
}
