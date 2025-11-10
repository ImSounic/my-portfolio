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
const DesktopAboutSection = withClientDynamic(() => import('@/components/desktop/AboutSection'));
const DesktopWhyHireMeSection = withClientDynamic(() => import('@/components/desktop/WhyHireMeSection'));
const DesktopSkillsSection = withClientDynamic(() => import('@/components/desktop/SkillsSection'));
const DesktopWorkSection = withClientDynamic(() => import('@/components/desktop/WorkSection'));
const DesktopContactSection = withClientDynamic(() => import('@/components/desktop/ContactSection'));

// Tablet components
const TabletHero = withClientDynamic(() => import('@/components/tablet/Hero'));
const TabletAboutSection = withClientDynamic(() => import('@/components/tablet/AboutSection'));
const TabletWhyHireMeSection = withClientDynamic(() => import('@/components/tablet/WhyHireMeSection'));
const TabletSkillsSection = withClientDynamic(() => import('@/components/tablet/SkillsSection'));
const TabletWorkSection = withClientDynamic(() => import('@/components/tablet/WorkSection'));
const TabletContactSection = withClientDynamic(() => import('@/components/tablet/ContactSection'));

// Mobile components
const MobileHero = withClientDynamic(() => import('@/components/mobile/Hero'));
const MobileAboutSection = withClientDynamic(() => import('@/components/mobile/AboutSection'));
const MobileWhyHireMeSection = withClientDynamic(() => import('@/components/mobile/WhyHireMeSection'));
const MobileSkillsSection = withClientDynamic(() => import('@/components/mobile/SkillsSection'));
const MobileWorkSection = withClientDynamic(() => import('@/components/mobile/WorkSection'));
const MobileContactSection = withClientDynamic(() => import('@/components/mobile/ContactSection'));

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