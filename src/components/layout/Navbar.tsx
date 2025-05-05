// src/components/layout/Navbar.tsx
'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { useDeviceDetection } from '@/utils/deviceDetection'

const navItems = [
  { href: '#home', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#why-hire-me', label: 'Why hire me?' },
  { href: '#work', label: 'Work' },
  { href: '#contact', label: 'Contact' },
]

export default function Navbar() {
  const pathname = usePathname()
  const deviceType = useDeviceDetection()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const target = document.querySelector(href)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMenuOpen(false)
  }

  // Mobile Navbar
  if (deviceType === 'mobile') {
    return (
      <nav className="fixed top-0 left-0 w-full z-50">
        {/* Mobile Hamburger Button */}
        <div className="absolute top-3 right-3 z-50">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-10 h-10 rounded-full backdrop-blur-md bg-black/50 flex items-center justify-center border border-white/20"
          >
            {isMenuOpen ? (
              // Close icon
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M18.3 5.71a.996.996 0 00-1.41 0L12 10.59 7.11 5.7A.996.996 0 105.7 7.11L10.59 12 5.7 16.89a.996.996 0 101.41 1.41L12 13.41l4.89 4.89a.996.996 0 101.41-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"/>
              </svg>
            ) : (
              // Menu icon
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu - Fullscreen overlay */}
        {isMenuOpen && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center">
            <div className="flex flex-col items-center gap-8">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleClick(e, item.href)}
                  className="text-xl font-medium text-white relative py-1"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>
    )
  }

  // Tablet Navbar
  if (deviceType === 'tablet') {
    return (
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-auto">
        <div className="px-6 py-3 rounded-full border border-white/10 backdrop-blur-md bg-black/30">
          <div className="flex items-center gap-5">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleClick(e, item.href)}
                className={`text-sm font-medium transition-colors cursor-pointer ${
                  pathname === item.href
                    ? 'text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </nav>
    )
  }

  // Desktop Navbar
  return (
    <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-50">
      <div className="px-10 py-4 rounded-full border border-white/10 backdrop-blur-md bg-black/30">
        <div className="flex items-center gap-10">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => handleClick(e, item.href)}
              className={`text-base font-medium transition-colors cursor-pointer ${
                pathname === item.href
                  ? 'text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  )
}