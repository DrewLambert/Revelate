import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Frequently asked questions about Revelate Operations RevOps consulting. Learn about engagement models, pricing, timelines, Salesforce expertise, and how embedded partnerships work for Series B SaaS companies.',
  openGraph: {
    title: 'FAQ | Revelate Operations',
    description: 'Common questions about RevOps consulting, pricing, timelines, and engagement models.',
  },
};

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
