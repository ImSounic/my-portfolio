// src/components/tablet/Hero.tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, useMemo } from 'react'
import gridSvg from '@/assets/images/grid.svg'
import starSvg from '@/assets/icons/star.svg'
import locationSvg from '@/assets/icons/location.svg'
import handSvg from '@/assets/icons/hand.svg'
import greenBoxSvg from '@/assets/icons/green-box.svg'
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
  const [weather, setWeather] = useState('');
  const [mounted, setMounted] = useState(false);

  // Create stable random values for bubbles
  const bubblePositions = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      left: `${(i * 5) % 100}%`,
      delay: `${(i * 0.1) % 0.8}s`,
      duration: `${0.8 + (i * 0.02) % 0.4}s`,
    }));
  }, []);

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
      const offset = now.getTimezoneOffset();
      const offsetHours = -offset / 60;
      const offsetString = `GMT${offsetHours >= 0 ? '+' : ''}${offsetHours}`;
      
      setTime(`${timeString} ${offsetString}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);

    // Get weather data (using visitor's location)
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

  // Render time/weather only on client
  const timeWeatherDisplay = mounted ? (
    <p className="text-gray-400 text-sm">
      {time} {weather}
    </p>
  ) : (
    <p className="text-gray-400 text-sm">
      Loading...
    </p>
  );

  return (
    <section id="home" className={`${satoshi.variable} ${montserrat.variable} ${pixelFont.variable} relative min-h-screen flex items-center justify-center px-8`}>
      {/* Grid SVG Background */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={gridSvg}
          alt="Grid background"
          fill
          className="object-cover opacity-75"
        />
      </div>
      
      <div className="relative z-10 w-full flex justify-center">
        <div className="flex flex-col items-center justify-center text-center">
          {/* Profile Image */}
          <div className="relative mb-16">
            <div className="w-40 h-40 rounded-full overflow-hidden">
              <Image
                src="/profile.png"
                alt="Sounic"
                width={180}
                height={180}
                className="object-cover"
              />
            </div>
          </div>
          
          {/* Hero Text with special styling */}
          <h1 className="text-5xl md:text-6xl font-bold mb-6 flex items-center justify-center gap-3">
            <span className="font-[family-name:var(--font-satoshi)] text-white">
              HELLO! I&apos;M
            </span>
            <span
              className="font-[family-name:var(--font-satoshi)] relative"
              style={{
                WebkitTextStroke: '2px white',
                WebkitTextFillColor: 'transparent'
              }}
            >
              SOUNIC
              {/* Star positioned relative to SOUNIC text */}
              <Image
                src={starSvg}
                alt="Star decoration"
                width={80}
                height={80}
                className="absolute -top-4 -right-4 w-16 h-16 animate-star-rotation"
                style={{ transform: 'translate(50%, -50%)' }}
              />
            </span>
          </h1>
          
          <p className="font-[family-name:var(--font-montserrat)] text-lg max-w-2xl mb-10 leading-relaxed">
            Enthusiastic Computer Science And AI Student Graduating Next Semester. Eager To Apply My Software
            Engineering And AI/ML Skills In A Professional Setting.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex gap-4 mb-10">
            <button
              onClick={() => {
                const contactSection = document.querySelector('#contact');
                if (contactSection) {
                  contactSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="px-8 py-4 bg-[#E9F5DB] text-black font-medium text-base rounded-[10px] hover:bg-[#E9F5DB]/90 transition-colors flex items-center gap-2"
            >
              Let&apos;s Talk
              <Image
                src={handSvg}
                alt="Hand icon"
                width={20}
                height={20}
              />
            </button>
            <Link
              href="/Resume.pdf"
              className="px-8 py-4 border-2 border-[#E9F5DB] border-dashed text-white font-medium text-base rounded-[10px] transition-all duration-300 hover:border-solid hover:bg-[#E9F5DB] hover:text-black relative overflow-hidden group"
            >
              <span className="relative z-10">View my Resume</span>
              {/* Bubble animation container */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {/* Create multiple bubbles with stable positions */}
                {bubblePositions.map((position, i) => (
                  <div
                    key={i}
                    className="bubble-animation absolute w-2 h-2 bg-[#E9F5DB] rounded-full"
                    style={{
                      left: position.left,
                      bottom: '-20px',
                      animationDelay: position.delay,
                      animationDuration: position.duration
                    }}
                  />
                ))}
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Location Info - Bottom Right */}
      <div className="absolute bottom-6 right-6 flex items-center gap-3">
        <div className="text-right">
          <p className="text-gray-300 text-base italic">
            Currently Based in United Kingdom
          </p>
          {timeWeatherDisplay}
        </div>
        <Image
          src={locationSvg}
          alt="Location"
          width={40}
          height={40}
          className="opacity-80"
        />
      </div>

      {/* Green Box SVG - Left Center */}
      <div className="absolute left-6 top-[45%]">
        <Image
          src={greenBoxSvg}
          alt="Available for opportunities"
          width={16}
          height={8}
          className="opacity-90"
        />
      </div>

      {/* Scroll to Explore - Left Bottom */}
      <div className="absolute left-24 bottom-0 flex items-center">
        <div className="flex items-center gap-2">
          <div className="w-[2px] h-36 bg-white/50"></div>
          <p className="font-[family-name:var(--font-pixel)] text-white/70 text-xs tracking-wider" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
            SCROLL TO EXPLORE
          </p>
        </div>
      </div>
    </section>
  )
}