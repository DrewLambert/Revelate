import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Services & Pricing',
  description: 'RevOps architecture, Salesforce modernization, and GTM diagnostics for Series B SaaS companies. Embedded partnerships starting at $35K. Fix routing, forecasting, and integrations in 8-16 weeks.',
  openGraph: {
    title: 'Services & Pricing | Revelate Operations',
    description: 'RevOps architecture, Salesforce modernization, and GTM diagnostics for Series B SaaS companies. Embedded partnerships starting at $35K.',
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
