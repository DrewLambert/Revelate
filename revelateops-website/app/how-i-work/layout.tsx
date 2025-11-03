import { Metadata } from 'next';
import Script from 'next/script';
import { generateBreadcrumbSchema } from '@/lib/seo/schemas';

const siteUrl = 'https://www.revelateops.com';

export const metadata: Metadata = {
  title: 'How I Work',
  description: 'Three-phase embedded RevOps methodology: Discovery & architecture audit, implementation & testing, production deployment. Real case study: 66% sales acceleration, $200K+ savings in 12 weeks. Principal-only delivery for Series B SaaS.',
  keywords: [
    'RevOps methodology',
    'Salesforce implementation process',
    'embedded consultant workflow',
    'RevOps case study',
    'Salesforce project phases',
    'RevOps consulting process',
  ],
  alternates: {
    canonical: `${siteUrl}/how-i-work`,
  },
  openGraph: {
    title: 'How I Work | Revelate Operations',
    description: 'Three-phase embedded RevOps methodology with proven results. Case study: 66% sales acceleration, $200K+ savings in 12 weeks.',
    url: `${siteUrl}/how-i-work`,
    type: 'website',
    images: [
      {
        url: '/og/revelate-hero.png',
        width: 1200,
        height: 630,
        alt: 'Revelate Operations Methodology',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How I Work | Revelate Operations',
    description: 'Three-phase RevOps methodology: 66% sales acceleration, $200K+ savings.',
    images: ['/og/revelate-hero.png'],
  },
};

const howIWorkSchemas = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'HowTo',
      name: 'Embedded RevOps Methodology',
      description: 'Three-phase approach to Salesforce modernization and revenue operations for Series B SaaS companies',
      step: [
        {
          '@type': 'HowToStep',
          name: 'Discovery & Architecture Audit',
          text: 'Comprehensive analysis of existing Salesforce org, integrations, and revenue operations processes',
        },
        {
          '@type': 'HowToStep',
          name: 'Implementation & Testing',
          text: 'Build and test solutions in sandbox environments before production deployment',
        },
        {
          '@type': 'HowToStep',
          name: 'Production Deployment',
          text: 'Deploy modernized Salesforce architecture with comprehensive documentation',
        },
      ],
    },
    generateBreadcrumbSchema([
      { name: 'Home', url: siteUrl },
      { name: 'How I Work', url: `${siteUrl}/how-i-work` },
    ]),
  ],
};

export default function HowIWorkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <Script
        id="how-i-work-structured-data"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howIWorkSchemas) }}
      />
    </>
  );
}
