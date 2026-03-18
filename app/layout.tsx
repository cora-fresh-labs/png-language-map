import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0d2818',
}

export const metadata: Metadata = {
  title: 'Papua New Guinea — Languages & Communities | CORA',
  description: 'Interactive map of Papua New Guinea showing 800+ language groups, tribal regions, crops, and farming communities across 22 provinces. Explore PNG\'s incredible linguistic diversity.',
  keywords: ['Papua New Guinea', 'PNG languages', 'tribal map', 'farming communities', 'CORA', 'biochar', 'carbon credits', 'Melanesia', 'language map'],
  openGraph: {
    title: 'Papua New Guinea — 800+ Languages Mapped',
    description: 'Explore PNG\'s incredible linguistic diversity. Click any region to discover local languages, crops, culture, and CORA biochar programs.',
    type: 'website',
    siteName: 'PNG Language Map | CORA',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Papua New Guinea — 800+ Languages Mapped',
    description: 'Interactive map of PNG language groups, crops, and farming communities. Powered by CORA.',
  },
  robots: 'index, follow',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
