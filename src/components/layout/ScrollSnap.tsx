// src/components/layout/ScrollSnap.tsx
'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/dist/ScrollTrigger'
import ScrollToPlugin from 'gsap/dist/ScrollToPlugin'
import Observer from 'gsap/dist/Observer'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, Observer)

export default function ScrollSnap() {
  const isAnimating = useRef(false)
  const currentIndex = useRef(0)

  useEffect(() => {
    // Only enable on desktop with mouse/trackpad
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (isTouch) return
    
    // Disable ScrollSnap for Firefox due to compatibility issues
    const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1
    if (isFirefox) return

    const sections = gsap.utils.toArray<HTMLElement>('section')
    if (sections.length === 0) return

    const goToSection = (index: number) => {
      if (index < 0 || index >= sections.length || isAnimating.current) return
      
      isAnimating.current = true
      currentIndex.current = index

      gsap.to(window, {
        scrollTo: { y: sections[index], autoKill: false },
        duration: 1,
        ease: 'power2.inOut',
        onComplete: () => {
          isAnimating.current = false
        },
      })
    }

    // Listen for navbar navigation events
    const handleNavScroll = (e: Event) => {
      const customEvent = e as CustomEvent<{ targetId: string }>
      const targetId = customEvent.detail.targetId
      const targetIndex = sections.findIndex(s => s.id === targetId.replace('#', ''))
      if (targetIndex !== -1) {
        currentIndex.current = targetIndex
        isAnimating.current = true
        setTimeout(() => {
          isAnimating.current = false
        }, 1100) // Slightly longer than scroll duration
      }
    }
    
    window.addEventListener('navScroll', handleNavScroll)

    // Find current section on load
    const findCurrentSection = () => {
      const windowHeight = window.innerHeight
      
      for (let i = 0; i < sections.length; i++) {
        const rect = sections[i].getBoundingClientRect()
        if (rect.top >= -windowHeight / 2 && rect.top < windowHeight / 2) {
          currentIndex.current = i
          break
        }
      }
    }

    findCurrentSection()

    // Create Observer for wheel and touch events
    const observer = Observer.create({
      type: 'wheel,touch,pointer',
      wheelSpeed: -1,
      tolerance: 10,
      preventDefault: true,
      onUp: () => {
        if (!isAnimating.current) {
          goToSection(currentIndex.current + 1)
        }
      },
      onDown: () => {
        if (!isAnimating.current) {
          goToSection(currentIndex.current - 1)
        }
      },
    })

    // Handle keyboard navigation
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault()
        goToSection(currentIndex.current + 1)
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault()
        goToSection(currentIndex.current - 1)
      }
    }

    window.addEventListener('keydown', handleKeydown)

    return () => {
      observer.kill()
      window.removeEventListener('keydown', handleKeydown)
      window.removeEventListener('navScroll', handleNavScroll)
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  return null
}
