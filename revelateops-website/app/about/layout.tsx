import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Drew Lambert',
  description: 'Meet Drew Lambert: Former Senior Revenue Systems Engineer at Bevi ($100M+ Series C). 7+ years Salesforce expertise, 300+ Trailhead badges, 150+ implementations. Boston-based, remote-first RevOps consultant specializing in Series B SaaS modernization.',
  openGraph: {
    title: 'About Drew Lambert | Revelate Operations',
    description: 'Former Senior Revenue Systems Engineer at Bevi. 7+ years Salesforce expertise, 300+ Trailhead badges. Boston-based RevOps consultant.',
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
