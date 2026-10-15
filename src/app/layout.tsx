// src/app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Analytics from '@/components/analytics/Analytics'
import { MODE_SCRIPT } from '@/themes/contributions/mode'

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
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Contributions theme: apply a saved light-mode choice before first paint (no flash). */}
        <script dangerouslySetInnerHTML={{ __html: MODE_SCRIPT }} />

        {/* Favicon */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="icon" href="/favicon-16x16.png" sizes="16x16" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        {/* The Original theme's images, videos and fonts are no longer preloaded here:
            Contributions is the default, and the Original theme's own loader preloads its assets. */}
      </head>
      <body className={`${inter.className} bg-[#0c0c0c] text-white`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}