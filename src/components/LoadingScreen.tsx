// src/components/LoadingScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import localFont from 'next/font/local';
import { gsap } from 'gsap';

const satoshi = localFont({
  src: [
    {
      path: '../../public/fonts/Satoshi-Black.otf',
      weight: '900',
      style: 'normal'
    },
  ],
  variable: '--font-satoshi',
});

interface LoadingScreenProps {
  onLoaded: () => void;
  assets: string[];
}

export default function LoadingScreen({ onLoaded, assets }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [assetsLoaded, setAssetsLoaded] = useState(0);
  
  // Refs for animated elements
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressTextRef = useRef<HTMLParagraphElement>(null);
  const counterTextRef = useRef<HTMLParagraphElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  
  // Title letters for animation
  const titleLetters = "LOADING".split("");
  
  // Create horizontal and vertical grid lines data
  const gridLines = [
    ...Array(20).fill(0).map((_, i) => ({ 
      type: 'h', 
      x1: 0, 
      y1: `${(i+1) * 5}%`, 
      x2: '100%', 
      y2: `${(i+1) * 5}%` 
    })),
    ...Array(20).fill(0).map((_, i) => ({ 
      type: 'v', 
      x1: `${(i+1) * 5}%`, 
      y1: 0, 
      x2: `${(i+1) * 5}%`, 
      y2: '100%' 
    }))
  ];
  
  useEffect(() => {
    // Initialize GSAP animations
    const tl = gsap.timeline();
    
    // Get all the elements we want to animate
    const titleChars = titleRef.current?.querySelectorAll('.title-char');
    const gridLinesElements = svgRef.current?.querySelectorAll('line');
    
    // Animate grid lines
    if (gridLinesElements?.length) {
      tl.fromTo(gridLinesElements, 
        { opacity: 0, scale: 0.8 },
        { 
          opacity: 0.3, 
          scale: 1,
          duration: 0.8, 
          stagger: 0.01,
          ease: "power2.inOut"
        }
      );
    }
    
    // Animate title characters
    if (titleChars?.length) {
      tl.fromTo(titleChars, 
        { y: 50, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.8, 
          stagger: 0.08,
          ease: "back.out(1.7)"
        }, 
        "-=0.4"
      );
    }
    
    // Animate progress bar container
    if (progressBarRef.current) {
      tl.fromTo(progressBarRef.current,
        { width: 0, opacity: 0 },
        {
          width: "16rem", 
          opacity: 1, 
          duration: 0.8, 
          ease: "power3.out"
        },
        "-=0.4"
      );
    }
    
    // Animate text elements
    const textElements = [progressTextRef.current, counterTextRef.current].filter(Boolean);
    if (textElements.length) {
      tl.fromTo(textElements,
        { y: 20, opacity: 0 },
        {
          y: 0, 
          opacity: 1, 
          stagger: 0.1, 
          duration: 0.5, 
          ease: "power2.out"
        },
        "-=0.3"
      );
    }
    
    // Create and animate circles and particles
    const container = containerRef.current;
    if (container) {
      // Create circles
      const circles: HTMLDivElement[] = [];
      for (let i = 0; i < 3; i++) {
        const circle = document.createElement('div');
        // Changed from green to blue
        circle.className = 'absolute rounded-full border-2 border-blue-400 opacity-20 bg-blue-400/10';
        circle.style.width = '96px';
        circle.style.height = '96px';
        circle.style.top = `calc(50% + ${i * 20 - 30}px)`;
        circle.style.left = `calc(50% + ${i * 20 - 30}px)`;
        
        container.appendChild(circle);
        circles.push(circle);
        
        // Animate each circle
        gsap.to(circle, {
          x: Math.sin(i) * 40,
          y: Math.cos(i) * 40,
          repeat: -1,
          duration: 3 + i,
          ease: "sine.inOut",
          yoyo: true
        });
        
        // Pulse animation
        gsap.to(circle, {
          scale: 1.2,
          opacity: 0.6,
          repeat: -1,
          duration: 2 + i * 0.5,
          ease: "sine.inOut",
          yoyo: true
        });
      }
      
      // Create particles
      const particles: HTMLDivElement[] = [];
      for (let i = 0; i < 40; i++) {
        const particle = document.createElement('div');
        // Changed from green to blue
        particle.className = 'absolute bg-blue-400 rounded-full opacity-0';
        
        // Random size
        const size = Math.random() * 3 + 1;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        container.appendChild(particle);
        particles.push(particle);
        
        // Random initial position
        gsap.set(particle, {
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          opacity: 0
        });
        
        // Animate each particle
        gsap.timeline({ repeat: -1, repeatDelay: Math.random() * 2 })
          .to(particle, {
            duration: Math.random() * 5 + 3,
            x: `+=${Math.random() * 200 - 100}`,
            y: `+=${Math.random() * 200 - 100}`,
            opacity: Math.random() * 0.5 + 0.1,
            ease: "sine.inOut"
          })
          .to(particle, {
            duration: Math.random() * 5 + 3,
            x: `+=${Math.random() * 200 - 100}`,
            y: `+=${Math.random() * 200 - 100}`,
            opacity: 0,
            ease: "sine.inOut"
          });
      }
      
      // Handle asset loading
      if (assets.length === 0) {
        // If no assets to load, show animation for a while then exit
        setTimeout(() => {
          finishLoadingAnimation(circles);
        }, 2500);
        return;
      }
      
      let loadedCount = 0;
      const totalAssets = assets.length;
      
      const handleAssetLoad = () => {
        loadedCount++;
        setAssetsLoaded(loadedCount);
        const newProgress = Math.floor((loadedCount / totalAssets) * 100);
        setProgress(newProgress);
        
        // Update progress bar with animation
        gsap.to(".progress-fill", {
          width: `${newProgress}%`,
          duration: 0.3,
          ease: "power1.out"
        });
        
        if (loadedCount === totalAssets) {
          // All assets loaded - show 100% briefly before exit animation
          setTimeout(() => {
            finishLoadingAnimation(circles);
          }, 500);
        }
      };
      
      // Function to handle the exit animation
      const finishLoadingAnimation = (circles: HTMLDivElement[]) => {
        // Exit animation
        const exitTl = gsap.timeline({
          onComplete: onLoaded
        });
        
        // Flash progress bar
        exitTl.to(".progress-fill", {
          backgroundColor: "white",
          duration: 0.2,
          repeat: 3,
          yoyo: true
        });
        
        // Scale up circles
        if (circles.length) {
          exitTl.to(circles, {
            scale: 15,
            opacity: 0.8,
            stagger: 0.1,
            duration: 1,
            ease: "power3.in"
          }, "-=0.4");
        }
        
        // Fade out everything
        if (containerRef.current) {
          exitTl.to(containerRef.current, {
            opacity: 0,
            duration: 0.5,
            ease: "power2.in"
          }, "-=0.5");
        }
      };
      
      // Preload all assets
      assets.forEach(assetUrl => {
        const img = new Image();
        img.onload = handleAssetLoad;
        img.onerror = handleAssetLoad; // Count errors as loaded to avoid getting stuck
        img.src = assetUrl;
      });
      
      // Cleanup function
      return () => {
        gsap.killTweensOf("*");
        
        // Remove all dynamically created elements
        [...particles, ...circles].forEach(el => {
          if (el.parentNode) {
            el.parentNode.removeChild(el);
          }
        });
      };
    }
  }, [assets, onLoaded]);
  
  return (
    <div 
      ref={containerRef} 
      className={`${satoshi.variable} fixed inset-0 bg-[#0c0c0c] flex flex-col items-center justify-center z-50 overflow-hidden`}
    >
      {/* SVG Grid Background */}
      <svg 
        ref={svgRef} 
        className="absolute inset-0 w-full h-full" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {gridLines.map((line, i) => (
          <line 
            key={`${line.type}-${i}`}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
            opacity="0"
          />
        ))}
      </svg>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Title with individual letter spans */}
        <div ref={titleRef} className="mb-10 flex">
          {titleLetters.map((letter, index) => (
            <span
              key={`letter-${index}`}
              className="title-char font-[family-name:var(--font-satoshi)] text-white text-5xl md:text-6xl inline-block opacity-0"
            >
              {letter}
            </span>
          ))}
          <span className="absolute -top-1 -right-3 text-sm text-blue-400">...</span>
        </div>
        
        {/* Progress bar container */}
        <div 
          ref={progressBarRef}
          className="w-0 h-2 bg-white/10 rounded-full overflow-hidden mb-4"
        >
          <div 
            className="progress-fill h-full bg-blue-400 transition-all duration-300 ease-in-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Progress percentage */}
        <p 
          ref={progressTextRef} 
          className="text-white text-xl mb-1"
        >
          {progress}%
        </p>
        
        {/* Assets loaded counter */}
        <p 
          ref={counterTextRef} 
          className="text-white/50 text-sm flex flex-col items-center"
        >
          <span className="font-mono">{assetsLoaded} / {assets.length}</span>
          <span className="mt-1 text-xs">LOADING ASSETS</span>
        </p>
      </div>
    </div>
  );
}