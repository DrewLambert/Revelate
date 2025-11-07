'use client'

import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export function GoogleAnalytics({ measurementId }: { measurementId: string }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Track pageviews on route change
  useEffect(() => {
    if (!measurementId) return

    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '')

    // Send pageview with custom URL
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', measurementId, {
        page_path: url,
      })
    }
  }, [pathname, searchParams, measurementId])

  if (!measurementId) return null

  return (
    <>
      {/* Google Analytics gtag.js - Optimized loading */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
        onLoad={() => {
          // Initialize gtag
          (window as any).dataLayer = (window as any).dataLayer || []
          function gtag(...args: any[]) {
            ;(window as any).dataLayer.push(args)
          }
          (window as any).gtag = gtag

          gtag('js', new Date())
          gtag('config', measurementId, {
            send_page_view: false, // We handle pageviews manually for better SPA tracking
          })
        }}
      />
    </>
  )
}
