import { Metadata } from 'next';
import Script from 'next/script';
import { generateBreadcrumbSchema } from '@/lib/seo/schemas';

const siteUrl = 'https://www.revelateops.com';

export const metadata: Metadata = {
  title: 'Fit Assessment',
  description: 'Take the 5-minute RevOps fit assessment. Discover if your Series B SaaS company is ready for Salesforce modernization and embedded RevOps partnership. Get personalized package recommendations.',
  keywords: [
    'RevOps assessment',
    'Salesforce readiness quiz',
    'Series B SaaS assessment',
    'RevOps fit quiz',
    'Salesforce modernization assessment',
    'CRM health check',
  ],
  alternates: {
    canonical: `${siteUrl}/fit-assessment`,
  },
  openGraph: {
    title: 'Fit Assessment | Revelate Operations',
    description: '5-minute quiz to determine if embedded RevOps is right for your Series B SaaS company.',
    url: `${siteUrl}/fit-assessment`,
    type: 'website',
    images: [
      {
        url: '/og/revelate-hero.png',
        width: 1200,
        height: 630,
        alt: 'RevOps Fit Assessment',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fit Assessment | Revelate Operations',
    description: '5-minute quiz: Is your Series B SaaS ready for RevOps modernization?',
    images: ['/og/revelate-hero.png'],
  },
};

const assessmentSchemas = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      name: 'RevOps Fit Assessment',
      description: 'Interactive assessment to determine RevOps readiness for Series B SaaS companies',
      applicationCategory: 'BusinessApplication',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    },
    generateBreadcrumbSchema([
      { name: 'Home', url: siteUrl },
      { name: 'Fit Assessment', url: `${siteUrl}/fit-assessment` },
    ]),
  ],
};

export default function FitAssessmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <Script
        id="fit-assessment-structured-data"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(assessmentSchemas) }}
      />
    </>
  );
}
