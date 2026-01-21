import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import { ConditionalLayout } from "@/components/ConditionalLayout";
import KeyboardScrollProvider from "@/components/KeyboardScrollProvider";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { homepageSchemas } from "@/lib/seo/schemas";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-body",
});

// Fraunces: Variable serif with soft serifs for editorial authority
// Brand system specifies semibold (600) for headlines
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["600"],
  display: "swap",
  variable: "--font-heading",
});

const siteUrl = "https://www.revelateops.com";
const siteTitle = "Revelate Operations | RevOps Consulting for Series B Startups";
const siteDescription =
  "Legacy Salesforce modernization for Series B SaaS teams. Fix routing, forecasting, and integrations without rebuilding the entire org.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: '%s | Revelate Operations',
  },
  description: siteDescription,
  keywords: [
    'Salesforce modernization',
    'RevOps consulting',
    'Series B SaaS',
    'revenue operations',
    'Salesforce integration',
    'GTM operations',
    'Boston RevOps',
    'remote RevOps consultant',
    'CRM modernization',
    'sales operations'
  ],
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: siteTitle,
    description: siteDescription,
    siteName: "Revelate Operations",
    images: [
      {
        url: "/og/revelate-hero.png",
        width: 1200,
        height: 630,
        alt: "Revelate Operations Salesforce Modernization",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@revelateops",
    creator: "@revelateops",
    title: siteTitle,
    description: siteDescription,
    images: ["/og/revelate-hero.png"],
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    other: [
      {
        rel: "android-chrome-192x192",
        url: "/android-chrome-192x192.png",
      },
      {
        rel: "android-chrome-512x512",
        url: "/android-chrome-512x512.png",
      },
    ],
  },
  manifest: "/site.webmanifest",
};

// Enhanced structured data imported from lib/seo/schemas.ts
// Includes Organization, Website, LocalBusiness, and Person schemas

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Structured data is safe - it's static schema content from lib/seo/schemas.ts
  const structuredData = JSON.stringify(homepageSchemas);

  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="font-sans antialiased">
        <KeyboardScrollProvider />
        <a
          href="#differentiators"
          className="skip-link fixed left-4 top-4 z-[999] -translate-y-20 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-[#080a12] shadow transition focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-cyan"
        >
          Skip to main content
        </a>
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
        <GoogleAnalytics />
        <script
          id="structured-data"
          type="application/ld+json"
          // Safe: homepageSchemas is static SEO data, not user input
          dangerouslySetInnerHTML={{ __html: structuredData }}
        />
      </body>
    </html>
  );
}
