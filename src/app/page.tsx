// src/app/page.tsx
'use client'

import { useState, type ComponentType } from 'react';
import dynamic from 'next/dynamic';
import LoadingScreen from '@/components/LoadingScreen';
import FirefoxFixProvider from '@/components/layout/FirefoxFixProvider';
import ScrollSnap from '@/components/layout/ScrollSnap';

type SectionComponent = ComponentType;
const withClientDynamic = (loader: () => Promise<{ default: SectionComponent }>) =>
  dynamic(loader, { loading: () => null, ssr: false });

// All consolidated responsive components
const Hero = withClientDynamic(() => import('@/components/sections/Hero'));
const AboutSection = withClientDynamic(() => import('@/components/sections/AboutSection'));
const WhyHireMeSection = withClientDynamic(() => import('@/components/sections/WhyHireMeSection'));
const SkillsSection = withClientDynamic(() => import('@/components/sections/SkillsSection'));
const WorkSection = withClientDynamic(() => import('@/components/sections/WorkSection'));
const ContactSection = withClientDynamic(() => import('@/components/sections/ContactSection'));

// Assets to preload (critical above-the-fold assets)
const assetsToPreload = [
  '/profile.png',
  '/assets/images/grid.svg',
  '/assets/videos/thinking.webm',
  '/assets/videos/adapt.webm', 
  '/assets/videos/code.webm',
];

export default function Home() {
  const [assetsLoaded, setAssetsLoaded] = useState(false);

  const handleAssetsLoaded = () => {
    setAssetsLoaded(true);
  };

  if (!assetsLoaded) {
    return <LoadingScreen onLoaded={handleAssetsLoaded} assets={assetsToPreload} />;
  }

  return (
    <FirefoxFixProvider>
      <ScrollSnap />
      <main className="fade-in">
        <Hero />
        <AboutSection />
        <WhyHireMeSection />
        <SkillsSection />
        <WorkSection />
        <ContactSection />
      </main>
    </FirefoxFixProvider>
  );
}
