import { Metadata } from 'next';
import Script from 'next/script';
import { generateBreadcrumbSchema, generateFAQSchema } from '@/lib/seo/schemas';

const siteUrl = 'https://www.revelateops.com';

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Frequently asked questions about Revelate Operations RevOps consulting. Learn about engagement models, pricing, timelines, Salesforce expertise, and how embedded partnerships work for Series B SaaS companies.',
  keywords: [
    'RevOps consulting FAQ',
    'Salesforce consultant questions',
    'RevOps pricing questions',
    'Salesforce modernization FAQ',
    'embedded consultant FAQ',
    'Series B SaaS questions',
  ],
  alternates: {
    canonical: `${siteUrl}/faq`,
  },
  openGraph: {
    title: 'FAQ | Revelate Operations',
    description: 'Common questions about RevOps consulting, pricing, timelines, and engagement models.',
    url: `${siteUrl}/faq`,
    type: 'website',
    images: [
      {
        url: '/og/revelate-hero.png',
        width: 1200,
        height: 630,
        alt: 'Revelate Operations FAQ',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'FAQ | Revelate Operations',
    description: 'Common questions about RevOps consulting and Salesforce modernization.',
    images: ['/og/revelate-hero.png'],
  },
};

// Sample FAQs - these should be updated to match actual FAQ content
const faqSchemas = {
  '@context': 'https://schema.org',
  '@graph': [
    generateFAQSchema([
      {
        question: 'What is your pricing for Salesforce modernization?',
        answer: 'Embedded partnerships start at $35K for 6-16 week engagements. Custom packages are available. Ongoing support is $75-110/hour.',
      },
      {
        question: 'How long does a typical engagement take?',
        answer: 'Most Salesforce modernization projects take 8-16 weeks depending on complexity and scope.',
      },
      {
        question: 'Do you work with Series B SaaS companies only?',
        answer: 'We specialize in Series B SaaS companies ($10-50M ARR) but also work with late-stage startups and early Series C companies facing similar challenges.',
      },
      {
        question: 'Are you based in the US?',
        answer: 'Yes, 100% US-based. Boston-area based with remote-first operations. Principal-led consulting with no offshore teams.',
      },
    ]),
    generateBreadcrumbSchema([
      { name: 'Home', url: siteUrl },
      { name: 'FAQ', url: `${siteUrl}/faq` },
    ]),
  ],
};

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <Script
        id="faq-structured-data"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchemas) }}
      />
    </>
  );
}
