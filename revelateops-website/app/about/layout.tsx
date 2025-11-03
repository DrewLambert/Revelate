import { Metadata } from 'next';
import Script from 'next/script';
import { founderSchema, generateBreadcrumbSchema } from '@/lib/seo/schemas';

const siteUrl = 'https://www.revelateops.com';

export const metadata: Metadata = {
  title: 'About Drew Lambert',
  description: 'Meet Drew Lambert: Former Senior Revenue Systems Engineer at $100M+ Series C. 7+ years Salesforce expertise, 300+ Trailhead badges, 150+ implementations. Boston-based, remote-first RevOps consultant specializing in Series B SaaS modernization.',
  keywords: [
    'Drew Lambert',
    'Salesforce consultant Boston',
    'RevOps engineer',
    'Salesforce expert',
    'revenue systems engineer',
    'Series B consultant',
    'CRM specialist',
    'remote RevOps consultant',
  ],
  alternates: {
    canonical: `${siteUrl}/about`,
  },
  openGraph: {
    title: 'About Drew Lambert | Revelate Operations',
    description: 'Former Senior Revenue Systems Engineer at $100M+ Series C. 7+ years Salesforce expertise, 300+ Trailhead badges. Boston-based RevOps consultant.',
    url: `${siteUrl}/about`,
    type: 'profile',
    images: [
      {
        url: '/founder-portrait.png',
        width: 800,
        height: 800,
        alt: 'Drew Lambert - Founder of Revelate Operations',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'About Drew Lambert | Revelate Operations',
    description: 'Former Senior Revenue Systems Engineer. Salesforce expert specializing in Series B SaaS modernization.',
    images: ['/founder-portrait.png'],
  },
};

const aboutSchemas = {
  '@context': 'https://schema.org',
  '@graph': [
    founderSchema,
    generateBreadcrumbSchema([
      { name: 'Home', url: siteUrl },
      { name: 'About', url: `${siteUrl}/about` },
    ]),
    {
      '@type': 'ProfilePage',
      mainEntity: {
        '@id': `${siteUrl}/#founder`,
      },
    },
  ],
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <Script
        id="about-structured-data"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchemas) }}
      />
    </>
  );
}
