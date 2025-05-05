// src/app/page.tsx
'use client'
import { useDeviceDetection } from '@/utils/deviceDetection';
import { useEffect, useState } from 'react';

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

export default function Home() {
  const deviceType = useDeviceDetection();
  const [isClient, setIsClient] = useState(false);

  // Use effect to mark when client-side JS is running
  useEffect(() => {
    setIsClient(true);
  }, []);

  // If not yet client-side, render all versions with CSS display control
  if (!isClient) {
    return (
      <>
        <div className="mobile-view">
          <main>
            <MobileHero />
            <MobileAboutSection />
            <MobileWhyHireMeSection />
            <MobileSkillsSection />
            <MobileWorkSection />
            <MobileContactSection />
          </main>
        </div>
        
        <div className="tablet-view">
          <main>
            <TabletHero />
            <TabletAboutSection />
            <TabletWhyHireMeSection />
            <TabletSkillsSection />
            <TabletWorkSection />
            <TabletContactSection />
          </main>
        </div>
        
        <div className="desktop-view">
          <main>
            <DesktopHero />
            <DesktopAboutSection />
            <DesktopWhyHireMeSection />
            <DesktopSkillsSection />
            <DesktopWorkSection />
            <DesktopContactSection />
          </main>
        </div>
      </>
    );
  }

  // After client-side JS runs, use the device detection logic
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