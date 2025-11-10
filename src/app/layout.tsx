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
        {/* Only eager-load critical assets to keep the first paint fast */}
        <link rel="preload" href="/profile.png" as="image" />
        <link rel="preload" href="/assets/images/grid.svg" as="image" />

        {/* Fonts are still preloaded to avoid layout shifts */}
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