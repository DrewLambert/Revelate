import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How I Work',
  description: 'Three-phase embedded RevOps methodology: Discovery & architecture audit, implementation & testing, production deployment. Real case study: 66% sales acceleration, $200K+ savings in 12 weeks. Principal-only delivery for Series B SaaS.',
  openGraph: {
    title: 'How I Work | Revelate Operations',
    description: 'Three-phase embedded RevOps methodology with proven results. Case study: 66% sales acceleration, $200K+ savings in 12 weeks.',
  },
};

export default function HowIWorkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
