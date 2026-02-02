// src/app/page.tsx
'use client'

import { useEffect, useState, type ComponentType } from 'react';
import dynamic from 'next/dynamic';
import LoadingScreen from '@/components/LoadingScreen';
import FirefoxFixProvider from '@/components/layout/FirefoxFixProvider';

type SectionComponent = ComponentType;
const withClientDynamic = (loader: () => Promise<{ default: SectionComponent }>) =>
  dynamic(loader, { loading: () => null, ssr: false });

// Desktop components
const DesktopHero = withClientDynamic(() => import('@/components/desktop/Hero'));
const DesktopSkillsSection = withClientDynamic(() => import('@/components/desktop/SkillsSection'));
const DesktopWorkSection = withClientDynamic(() => import('@/components/desktop/WorkSection'));

// Tablet components
const TabletHero = withClientDynamic(() => import('@/components/tablet/Hero'));
const TabletSkillsSection = withClientDynamic(() => import('@/components/tablet/SkillsSection'));
const TabletWorkSection = withClientDynamic(() => import('@/components/tablet/WorkSection'));

// Mobile components
const MobileHero = withClientDynamic(() => import('@/components/mobile/Hero'));
const MobileSkillsSection = withClientDynamic(() => import('@/components/mobile/SkillsSection'));
const MobileWorkSection = withClientDynamic(() => import('@/components/mobile/WorkSection'));

// Consolidated responsive components
const AboutSection = withClientDynamic(() => import('@/components/sections/AboutSection'));
const WhyHireMeSection = withClientDynamic(() => import('@/components/sections/WhyHireMeSection'));
const ContactSection = withClientDynamic(() => import('@/components/sections/ContactSection'));

// Assets to preload (only above-the-fold imagery)
const assetsToPreload = ['/profile.png', '/assets/images/grid.svg', '/assets/images/about-profile.png'];

export default function Home() {
  const [deviceType, setDeviceType] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [assetsLoaded, setAssetsLoaded] = useState(false);

  useEffect(() => {
    if (!assetsLoaded) {
      return;
    }

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
  }, [assetsLoaded]);

  const handleAssetsLoaded = () => {
    setAssetsLoaded(true);
  };

  if (!assetsLoaded) {
    return <LoadingScreen onLoaded={handleAssetsLoaded} assets={assetsToPreload} />;
  }

  // Wrap all content with FirefoxFixProvider
  if (deviceType === 'mobile') {
    return (
      <FirefoxFixProvider>
        <main className="fade-in">
          <MobileHero />
          <AboutSection />
          <WhyHireMeSection />
          <MobileSkillsSection />
          <MobileWorkSection />
          <ContactSection />
        </main>
      </FirefoxFixProvider>
    );
  }

  if (deviceType === 'tablet') {
    return (
      <FirefoxFixProvider>
        <main className="fade-in">
          <TabletHero />
          <AboutSection />
          <WhyHireMeSection />
          <TabletSkillsSection />
          <TabletWorkSection />
          <ContactSection />
        </main>
      </FirefoxFixProvider>
    );
  }

  return (
    <FirefoxFixProvider>
      <main className="fade-in">
        <DesktopHero />
        <AboutSection />
        <WhyHireMeSection />
        <DesktopSkillsSection />
        <DesktopWorkSection />
        <ContactSection />
      </main>
    </FirefoxFixProvider>
  );
}
