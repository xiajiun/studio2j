import type { Metadata } from 'next'
import { Fraunces, Inter } from 'next/font/google'
import './globals.css'
import { LangProvider } from '@/components/LangProvider'

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-fraunces',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Studio2J — Korean and Japanese shops, delivered',
  description: 'Proxy buying and fair haul service from Seoul and Tokyo. Founded 2025.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/studio2j_logo_nobg.png', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body style={{ backgroundColor: '#F5EFE6', color: '#4B372A' }}>
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  )
}
