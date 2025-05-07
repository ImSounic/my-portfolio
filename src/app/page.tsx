// src/app/page.tsx
'use client'

import { useEffect, useState } from 'react';
import LoadingScreen from '@/components/LoadingScreen';
import FirefoxFixProvider from '@/components/layout/FirefoxFixProvider';

// Desktop components
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
  // MP4 videos instead of large PNGs
  '/assets/videos/thinking.mp4',
  '/assets/videos/adapt.mp4',
  '/assets/videos/code.mp4',
  // Keep WebM as fallback for browsers that don't support MP4 with transparency
  '/assets/videos/thinking.webm',
  '/assets/videos/adapt.webm',
  '/assets/videos/code.webm',
  // Keep important images
  '/profile.png',
  '/assets/images/about-profile.png',
  '/assets/images/grid.svg',
  '/assets/images/bottom-grid.svg',
  '/assets/images/hire-grid.svg',
  '/projects/ai-project.png',
  '/projects/house-of-games.png',
  '/projects/internship.png',
  '/projects/cleanslate.png',
];

export default function Home() {
  const [deviceType, setDeviceType] = useState('desktop');
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [initialRender, setInitialRender] = useState(true);

  useEffect(() => {
    if (initialRender) {
      setInitialRender(false);
    }
  }, [initialRender]);

  const handleAssetsLoaded = () => {
    setAssetsLoaded(true);
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
    detectDevice();
    window.addEventListener('resize', detectDevice);
    return () => window.removeEventListener('resize', detectDevice);
  };

  if (initialRender || !assetsLoaded) {
    return <LoadingScreen onLoaded={handleAssetsLoaded} assets={assetsToPreload} />;
  }

  // Wrap all content with FirefoxFixProvider
  if (deviceType === 'mobile') {
    return (
      <FirefoxFixProvider>
        <main className="fade-in">
          <MobileHero />
          <MobileAboutSection />
          <MobileWhyHireMeSection />
          <MobileSkillsSection />
          <MobileWorkSection />
          <MobileContactSection />
        </main>
      </FirefoxFixProvider>
    );
  }

  if (deviceType === 'tablet') {
    return (
      <FirefoxFixProvider>
        <main className="fade-in">
          <TabletHero />
          <TabletAboutSection />
          <TabletWhyHireMeSection />
          <TabletSkillsSection />
          <TabletWorkSection />
          <TabletContactSection />
        </main>
      </FirefoxFixProvider>
    );
  }

  return (
    <FirefoxFixProvider>
      <main className="fade-in">
        <DesktopHero />
        <DesktopAboutSection />
        <DesktopWhyHireMeSection />
        <DesktopSkillsSection />
        <DesktopWorkSection />
        <DesktopContactSection />
      </main>
    </FirefoxFixProvider>
  );
}