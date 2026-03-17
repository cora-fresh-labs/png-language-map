import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Papua New Guinea — Languages & Communities | CORA',
  description: 'Interactive map of Papua New Guinea showing language groups, tribal regions, and farming communities. Explore 800+ languages across PNG\'s 22 provinces.',
  keywords: ['Papua New Guinea', 'PNG languages', 'tribal map', 'farming communities', 'CORA', 'carbon credits'],
  openGraph: {
    title: 'Papua New Guinea — Languages & Communities',
    description: 'Explore PNG\'s incredible linguistic diversity — 800+ languages across 22 provinces. Click any region to discover local crops, culture, and communities.',
    type: 'website',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Papua New Guinea — Languages & Communities',
    description: 'Interactive map of PNG language groups and farming communities',
  }
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
