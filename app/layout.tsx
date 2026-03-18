import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#ffffff',
}

export const metadata: Metadata = {
  title: 'Discover PNG Languages | CORA',
  description: 'Explore Papua New Guinea\u2019s 800+ languages. Tap any region to discover speakers, culture, oral histories, and connect with your community through CORA.',
  keywords: ['Papua New Guinea', 'PNG languages', 'Tok Pisin', 'Melanesia', 'CORA', 'oral history', 'Tumbuna stories', 'PNG communities'],
  openGraph: {
    title: 'Discover Your Language \u2014 Papua New Guinea',
    description: 'Find your language, share your Tumbuna story, and connect with CORA\u2019s community programs across PNG.',
    type: 'website',
    siteName: 'PNG Language Map | CORA',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Discover Your Language \u2014 Papua New Guinea',
    description: 'Explore 800+ PNG languages. Tap a region to learn about culture, crops, and oral histories.',
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
