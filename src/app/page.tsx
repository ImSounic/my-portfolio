// src/app/page.tsx
'use client'

import { useDeviceDetection } from '@/utils/deviceDetection';
import { useEffect, useState } from 'react';
import LoadingScreen from '@/components/LoadingScreen';

// Import your components
import DesktopHero from '@/components/desktop/Hero';
import DesktopAboutSection from '@/components/desktop/AboutSection';
import DesktopWhyHireMeSection from '@/components/desktop/WhyHireMeSection';
import DesktopSkillsSection from '@/components/desktop/SkillsSection';
import DesktopWorkSection from '@/components/desktop/WorkSection';
import DesktopContactSection from '@/components/desktop/ContactSection';

// Tablet components
import TabletHero from '@/components/tablet/Hero';
import TabletAboutSection from '@/components/tablet/AboutSection';
import TabletWhyHireMeSection from '@/components/tablet/WhyHireMeSection';
import TabletSkillsSection from '@/components/tablet/SkillsSection';
import TabletWorkSection from '@/components/tablet/WorkSection';
import TabletContactSection from '@/components/tablet/ContactSection';

// Mobile components
import MobileHero from '@/components/mobile/Hero';
import MobileAboutSection from '@/components/mobile/AboutSection';
import MobileWhyHireMeSection from '@/components/mobile/WhyHireMeSection';
import MobileSkillsSection from '@/components/mobile/SkillsSection';
import MobileWorkSection from '@/components/mobile/WorkSection';
import MobileContactSection from '@/components/mobile/ContactSection';

// Assets to preload
const assetsToPreload = [
  // APNGs
  '/assets/videos/thinking.png',
  '/assets/videos/adapt.png',
  '/assets/videos/code.png',
  
  // Important images
  '/profile.png',
  '/assets/images/about-profile.png',
  '/assets/images/grid.svg',
  '/assets/images/bottom-grid.svg',
  '/assets/images/hire-grid.svg',
  
  // Project images
  '/projects/ai-project.png',
  '/projects/house-of-games.png',
  '/projects/internship.png',
  '/projects/cleanslate.png',
];

export default function Home() {
  const [deviceType, setDeviceType] = useState('desktop');
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [initialRender, setInitialRender] = useState(true);

  // Initialize device detection after first render
  useEffect(() => {
    if (initialRender) {
      // Set initialRender to false to prevent this from running again
      setInitialRender(false);
      
      // Start preloading assets immediately
      // We'll handle deviceType detection after asset loading
    }
  }, [initialRender]);

  // Handle assets loaded
  const handleAssetsLoaded = () => {
    setAssetsLoaded(true);
    
    // Now that assets are loaded, detect device type
    const detectDevice = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setDeviceType('mobile');
      } else if (width < 1280) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };
    
    // Initial detection
    detectDevice();
    
    // Listen for resize
    window.addEventListener('resize', detectDevice);
    
    // Cleanup
    return () => window.removeEventListener('resize', detectDevice);
  };

  // Always show loading screen on the first render
  if (initialRender || !assetsLoaded) {
    return <LoadingScreen onLoaded={handleAssetsLoaded} assets={assetsToPreload} />;
  }

  // After assets are loaded, render the appropriate components based on device type
  if (deviceType === 'mobile') {
    return (
      <main>
        <MobileHero />
        <MobileAboutSection />
        <MobileWhyHireMeSection />
        <MobileSkillsSection />
        <MobileWorkSection />
        <MobileContactSection />
      </main>
    );
  }

  if (deviceType === 'tablet') {
    return (
      <main>
        <TabletHero />
        <TabletAboutSection />
        <TabletWhyHireMeSection />
        <TabletSkillsSection />
        <TabletWorkSection />
        <TabletContactSection />
      </main>
    );
  }

  return (
    <main>
      <DesktopHero />
      <DesktopAboutSection />
      <DesktopWhyHireMeSection />
      <DesktopSkillsSection />
      <DesktopWorkSection />
      <DesktopContactSection />
    </main>
  );
}