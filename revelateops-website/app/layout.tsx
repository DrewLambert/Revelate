import type { Metadata } from 'next'
import './globals.css'
import Providers from './providers'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { GoogleAnalytics } from '@/components/GoogleAnalytics'

export const metadata: Metadata = {
  title: 'Revelate Operations - Admin',
  description: 'Admin CRM for Revelate Operations',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
        <SpeedInsights />
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        )}
      </body>
    </html>
  )
}
