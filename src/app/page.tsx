// src/app/page.tsx
'use client'

import { useState, type ComponentType } from 'react';
import dynamic from 'next/dynamic';
import LoadingScreen from '@/components/LoadingScreen';
import FirefoxFixProvider from '@/components/layout/FirefoxFixProvider';
import ScrollSnap from '@/components/layout/ScrollSnap';
import LiquidEther from '@/components/ui/reactbits/LiquidEther';

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
      {/* Liquid Ether Background - full page */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <LiquidEther
          colors={['#e6f88b', '#01e0fe', '#0a1af5']}
          isBounce={true}
          mouseForce={12}
          autoSpeed={0.3}
          autoIntensity={1}
        />
      </div>
      <main className="fade-in relative z-10">
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
