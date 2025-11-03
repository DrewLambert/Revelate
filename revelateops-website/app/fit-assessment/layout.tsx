import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Fit Assessment',
  description: 'Take the 5-minute RevOps fit assessment. Discover if your Series B SaaS company is ready for Salesforce modernization and embedded RevOps partnership. Get personalized package recommendations.',
  openGraph: {
    title: 'Fit Assessment | Revelate Operations',
    description: '5-minute quiz to determine if embedded RevOps is right for your Series B SaaS company.',
  },
};

export default function FitAssessmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
