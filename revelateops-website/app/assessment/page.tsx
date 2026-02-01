import type { Metadata } from 'next';
import AssessmentWizard from '@/components/assessment/AssessmentWizard';

export const metadata: Metadata = {
  title: 'RevOps Health Assessment | Free Revenue Operations Diagnostic',
  description:
    'Take the free RevOps Health Assessment to score your revenue operations across 5 critical dimensions. Get personalized recommendations and a visual breakdown in under 3 minutes.',
  keywords: [
    'RevOps assessment',
    'revenue operations health check',
    'Salesforce audit',
    'RevOps maturity',
    'CRM health assessment',
    'pipeline accuracy',
    'sales operations diagnostic',
  ],
  openGraph: {
    title: 'RevOps Health Assessment | How Healthy Is Your Revenue Operation?',
    description:
      'Score your revenue operations across CRM Health, Data Quality, Process Automation, Integration Health, and Team Enablement. Free assessment with personalized recommendations.',
    url: 'https://www.revelateops.com/assessment',
    images: [
      {
        url: '/og/revelate-hero.png',
        width: 1200,
        height: 630,
        alt: 'RevOps Health Assessment by Revelate Operations',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RevOps Health Assessment | Revelate Operations',
    description:
      'How healthy is your revenue operation? Take the free 3-minute assessment and get a personalized score with actionable recommendations.',
  },
  alternates: {
    canonical: 'https://www.revelateops.com/assessment',
  },
};

export default function AssessmentPage() {
  return <AssessmentWizard />;
}
