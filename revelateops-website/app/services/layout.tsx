import { Metadata } from 'next';
import Script from 'next/script';
import { generateServiceSchema, generateBreadcrumbSchema } from '@/lib/seo/schemas';

const siteUrl = 'https://www.revelateops.com';

export const metadata: Metadata = {
  title: 'Services & Pricing',
  description: 'RevOps architecture, Salesforce modernization, and GTM diagnostics for Series B SaaS companies. Embedded partnerships starting at $35K. Fix routing, forecasting, and integrations in 8-16 weeks.',
  keywords: [
    'Salesforce consulting pricing',
    'RevOps services',
    'Salesforce modernization cost',
    'Series B RevOps consultant',
    'CRM integration services',
    'Salesforce technical debt remediation',
    'revenue operations pricing',
    'embedded RevOps consultant',
  ],
  alternates: {
    canonical: `${siteUrl}/services`,
  },
  openGraph: {
    title: 'Services & Pricing | Revelate Operations',
    description: 'RevOps architecture, Salesforce modernization, and GTM diagnostics for Series B SaaS companies. Embedded partnerships starting at $35K.',
    url: `${siteUrl}/services`,
    type: 'website',
    images: [
      {
        url: '/og/revelate-hero.png',
        width: 1200,
        height: 630,
        alt: 'Revelate Operations Services',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Services & Pricing | Revelate Operations',
    description: 'RevOps architecture and Salesforce modernization for Series B SaaS. Starting at $35K.',
    images: ['/og/revelate-hero.png'],
  },
};

const serviceSchemas = {
  '@context': 'https://schema.org',
  '@graph': [
    generateServiceSchema({
      name: 'Salesforce Modernization',
      description: 'Legacy Salesforce org modernization for Series B SaaS teams. Fix routing, forecasting, and integrations without rebuilding the entire org.',
      price: '35000',
      url: `${siteUrl}/services`,
    }),
    generateServiceSchema({
      name: 'Integration Architecture',
      description: 'Design and implement robust integration architecture between Salesforce and your revenue stack.',
      url: `${siteUrl}/services`,
    }),
    generateServiceSchema({
      name: 'Technical Debt Remediation',
      description: 'Systematic cleanup of Salesforce technical debt accumulated during rapid growth.',
      url: `${siteUrl}/services`,
    }),
    generateBreadcrumbSchema([
      { name: 'Home', url: siteUrl },
      { name: 'Services', url: `${siteUrl}/services` },
    ]),
  ],
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <Script
        id="services-structured-data"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchemas) }}
      />
    </>
  );
}
