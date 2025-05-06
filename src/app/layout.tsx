// src/app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navbar from '@/components/layout/Navbar'
import Analytics from '@/components/analytics/Analytics'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sounic - Portfolio',
  description: 'Enthusiastic AI/ML Engineer with a passion for building innovative solutions. Explore my portfolio to see my projects and skills.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Preload critical images */}
        <link rel="preload" href="/profile.png" as="image" />
        <link rel="preload" href="/assets/images/about-profile.png" as="image" />
        <link rel="preload" href="/assets/images/grid.svg" as="image" />
        <link rel="preload" href="/assets/images/bottom-grid.svg" as="image" />
        <link rel="preload" href="/assets/images/hire-grid.svg" as="image" />
        <link rel="preload" href="/assets/images/skills-grid.svg" as="image" />
        <link rel="preload" href="/assets/images/contact-grid.svg" as="image" />
        
        {/* Preload icons */}
        <link rel="preload" href="/assets/icons/star.svg" as="image" />
        <link rel="preload" href="/assets/icons/location.svg" as="image" />
        <link rel="preload" href="/assets/icons/hand.svg" as="image" />
        <link rel="preload" href="/assets/icons/radar.svg" as="image" />
        <link rel="preload" href="/assets/icons/arrow.svg" as="image" />
        <link rel="preload" href="/assets/icons/contact.svg" as="image" />
        <link rel="preload" href="/assets/icons/linkedin.svg" as="image" />
        <link rel="preload" href="/assets/icons/mail.svg" as="image" />
        
        {/* Preload project images */}
        <link rel="preload" href="/projects/ai-project.png" as="image" />
        <link rel="preload" href="/projects/house-of-games.png" as="image" />
        <link rel="preload" href="/projects/internship.png" as="image" />
        <link rel="preload" href="/projects/cleanslate.png" as="image" />
        
        {/* Preload MP4 videos instead of WebM */}
        <link rel="preload" href="/assets/videos/thinking.mp4" as="video" type="video/mp4" />
        <link rel="preload" href="/assets/videos/adapt.mp4" as="video" type="video/mp4" />
        <link rel="preload" href="/assets/videos/code.mp4" as="video" type="video/mp4" />
        
        {/* Keep WebM as fallback for better compatibility */}
        <link rel="preload" href="/assets/videos/thinking.webm" as="video" type="video/webm" />
        <link rel="preload" href="/assets/videos/adapt.webm" as="video" type="video/webm" />
        <link rel="preload" href="/assets/videos/code.webm" as="video" type="video/webm" />
        
        {/* Preload fonts */}
        <link rel="preload" href="/fonts/Satoshi-Black.otf" as="font" type="font/otf" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/pixel_font-7.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen bg-[#0c0c0c] text-white">
          <Navbar />
          <main>{children}</main>
        </div>
        <Analytics />
      </body>
    </html>
  )
}