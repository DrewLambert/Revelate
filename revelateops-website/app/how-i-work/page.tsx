'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export default function HowIWorkPage() {
  const prefersReducedMotion = useReducedMotion();
  const motionDisabled = prefersReducedMotion;

  const getFadeProps = (delay = 0) => {
    if (motionDisabled) return {};
    return {
      initial: { opacity: 0, y: 32 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, amount: 0.2 },
      transition: { duration: 0.6, delay }
    } as const;
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-navy text-white">
      {/* Background gradients and effects - matching About page */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#080B16] via-[#09102A] to-[#070915]" />
        <div className="absolute top-[-25%] right-[-20%] h-[34rem] w-[34rem] rounded-full bg-cyan/20 blur-[160px]" />
        <div className="absolute bottom-[-30%] left-[-18%] h-[40rem] w-[40rem] rounded-full bg-cyan/15 blur-[190px]" />
        {!motionDisabled && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0.35 }}
            animate={{ opacity: [0.25, 0.45, 0.25], scale: [0.97, 1.03, 0.97], rotate: [0, 2, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="absolute top-[12%] left-[10%] h-64 w-64 rounded-xl border border-cyan/15 bg-cyan/10 blur-3xl" />
            <div className="absolute bottom-[18%] right-[14%] h-56 w-56 rounded-full border border-magenta/25 bg-magenta/10 blur-2xl" />
          </motion.div>
        )}
      </div>

      {/* Constellation dots - matching About page */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {[
          { x: '15%', y: '15%' }, { x: '25%', y: '12%' }, { x: '35%', y: '10%' },
          { x: '45%', y: '14%' }, { x: '55%', y: '15%' }, { x: '65%', y: '12%' },
          { x: '75%', y: '18%' }, { x: '85%', y: '15%' }, { x: '95%', y: '16%' },
          { x: '12%', y: '35%' }, { x: '28%', y: '38%' }, { x: '42%', y: '40%' },
          { x: '58%', y: '42%' }, { x: '72%', y: '38%' }, { x: '88%', y: '35%' },
          { x: '10%', y: '60%' }, { x: '22%', y: '58%' }, { x: '38%', y: '65%' },
          { x: '52%', y: '62%' }, { x: '68%', y: '60%' }, { x: '82%', y: '58%' },
          { x: '18%', y: '82%' }, { x: '32%', y: '85%' }, { x: '48%', y: '88%' },
          { x: '64%', y: '85%' }, { x: '78%', y: '82%' }, { x: '92%', y: '80%' }
        ].map((pos, i) => (
          <div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-cyan opacity-30"
            style={{ left: pos.x, top: pos.y }}
          />
        ))}
      </div>

      <div className="relative z-10 pt-36 pb-24 md:pt-40 lg:pt-44 xl:pt-48 lg:pb-32">
        <div className="mx-auto max-w-6xl px-6 lg:max-w-7xl lg:px-12">
          {/* Hero Section */}
          <motion.section
            className="mb-24 lg:mb-32"
            initial={motionDisabled ? undefined : { opacity: 0, y: 32 }}
            animate={motionDisabled ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <div className="text-center max-w-4xl mx-auto">
              <span className="text-xs font-semibold uppercase tracking-[0.4em] text-cyan">
                Methodology
              </span>
              <h1 className="font-heading mt-5 text-3xl font-semibold leading-[1.2] sm:text-4xl md:text-5xl lg:text-6xl text-white">
                How I Work With Clients
              </h1>
              <p className="mx-auto mt-6 max-w-2xl font-body text-xl leading-relaxed text-white/80 md:text-2xl">
                Embedded partnership that stabilizes your revenue stack in 8-16 weeks—without freezing revenue for months.
              </p>
            </div>
          </motion.section>

          {/* 3-Phase Process */}
          <motion.section className="mb-24 lg:mb-32" {...getFadeProps(0.1)}>
            <div className="text-center mb-16">
              <p className="text-xs uppercase tracking-[0.4em] text-white/50">Process</p>
              <h2 className="font-heading mt-5 text-2xl font-semibold text-white sm:text-3xl md:text-4xl">
                Three-Phase Approach
              </h2>
              <p className="mt-4 font-body text-lg text-white/70 md:text-xl max-w-2xl mx-auto">
                From discovery to production deployment with regular cadence
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {/* Phase 1 */}
              <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/[0.08] p-8 shadow-lg backdrop-blur-xl transition-all duration-300 hover:border-cyan/40 hover:shadow-[0_20px_40px_rgba(0,217,255,0.15)]">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan/5 via-transparent to-transparent" />
                <div className="relative">
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-cyan/20 text-xl font-semibold text-cyan shadow-[0_0_20px_rgba(0,217,255,0.3)]">
                    1
                  </span>
                  <h3 className="mt-6 font-heading text-xl font-semibold text-white">Diagnose</h3>
                  <p className="mt-3 font-body text-base text-white/70 leading-relaxed">
                    Deep-dive audit of your revenue stack. I map automations, integrations, data flows, and surface what's broken.
                  </p>
                  <ul className="mt-6 space-y-3 text-sm text-white/80">
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-cyan shadow-[0_0_8px_rgba(0,217,255,0.6)]" />
                      <span>15-minute intro call with executive recap</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-cyan shadow-[0_0_8px_rgba(0,217,255,0.6)]" />
                      <span>Prioritized modernization backlog ranked by revenue risk</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-cyan shadow-[0_0_8px_rgba(0,217,255,0.6)]" />
                      <span>Aligned budget, owners, and success metrics</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Phase 2 - Featured */}
              <div className="relative overflow-hidden rounded-2xl border-2 border-cyan bg-white/[0.12] p-8 shadow-[0_20px_50px_rgba(0,217,255,0.25)] backdrop-blur-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan/10 via-transparent to-transparent" />
                <div className="relative">
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-cyan/30 text-xl font-semibold text-cyan shadow-[0_0_25px_rgba(0,217,255,0.5)]">
                    2
                  </span>
                  <h3 className="mt-6 font-heading text-xl font-semibold text-white">Rebuild</h3>
                  <p className="mt-3 font-body text-base text-white/70 leading-relaxed">
                    Ship regular improvements to routing, forecasting, attribution, and integrations with regression tests and rollback plans.
                  </p>
                  <ul className="mt-6 space-y-3 text-sm text-white/80">
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-cyan shadow-[0_0_8px_rgba(0,217,255,0.6)]" />
                      <span>Version-controlled automations with reviewers</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-cyan shadow-[0_0_8px_rgba(0,217,255,0.6)]" />
                      <span>Live health dashboards for SLA, pipeline, and ARR</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-cyan shadow-[0_0_8px_rgba(0,217,255,0.6)]" />
                      <span>Change log committed to your repo with Loom walkthroughs</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Phase 3 */}
              <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/[0.08] p-8 shadow-lg backdrop-blur-xl transition-all duration-300 hover:border-cyan/40 hover:shadow-[0_20px_40px_rgba(0,217,255,0.15)]">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan/5 via-transparent to-transparent" />
                <div className="relative">
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-cyan/20 text-xl font-semibold text-cyan shadow-[0_0_20px_rgba(0,217,255,0.3)]">
                    3
                  </span>
                  <h3 className="mt-6 font-heading text-xl font-semibold text-white">Stabilize</h3>
                  <p className="mt-3 font-body text-base text-white/70 leading-relaxed">
                    Wire observability, documentation, and enablement so the internal team owns the system without vendor hand-holding.
                  </p>
                  <ul className="mt-6 space-y-3 text-sm text-white/80">
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-cyan shadow-[0_0_8px_rgba(0,217,255,0.6)]" />
                      <span>Leadership scorecards wired to trusted data</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-cyan shadow-[0_0_8px_rgba(0,217,255,0.6)]" />
                      <span>Runbooks and enablement sessions for admins and GTM</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-cyan shadow-[0_0_8px_rgba(0,217,255,0.6)]" />
                      <span>30-day follow-up window for edge cases</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Case Studies Section */}
          <motion.section className="mb-24 lg:mb-32" {...getFadeProps(0.15)}>
            <div className="text-center mb-16">
              <p className="text-xs uppercase tracking-[0.4em] text-white/50">Impact</p>
              <h2 className="font-heading mt-5 text-2xl font-semibold text-white sm:text-3xl md:text-4xl">
                Client Results
              </h2>
              <p className="mt-4 font-body text-lg text-white/70 md:text-xl max-w-2xl mx-auto">
                Real outcomes from recent engagements
              </p>
            </div>

            {/* PLACEHOLDER: Drew to provide case studies */}
            <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-cyan/30 bg-white/[0.05] p-12 text-center backdrop-blur-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan/5 via-transparent to-transparent" />
              <div className="relative">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-cyan/10">
                  <svg className="h-8 w-8 text-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="font-heading text-xl font-semibold text-white mb-3">Case Studies Coming Soon</h3>
                <p className="font-body text-base text-white/70 max-w-2xl mx-auto">
                  Drew will provide 3 detailed case studies with client context, problems solved, and quantified results.
                </p>
              </div>
            </div>
          </motion.section>

          {/* CTA Section */}
          <motion.section
            className="relative mx-auto max-w-5xl"
            {...getFadeProps(0.2)}
          >
            <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/[0.08] shadow-[0_20px_60px_rgba(0,0,0,0.3)] backdrop-blur-xl">
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan/5 via-transparent to-transparent" />

              <div className="relative p-10 sm:p-14 lg:p-20">
                <div className="text-center space-y-8">
                  <div className="space-y-4">
                    <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-cyan">
                      Let's connect
                    </span>
                    <h2 className="font-heading text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                      Ready to discuss your situation?
                    </h2>
                    <p className="mx-auto max-w-2xl font-body text-lg text-white/80 leading-relaxed md:text-xl">
                      Let's map what's broken and outline the fix together.
                    </p>
                  </div>

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
                    <Link
                      href="/book"
                      className="inline-flex items-center justify-center gap-3 rounded-xl bg-cyan px-10 py-5 text-base font-semibold text-navy shadow-[0_8px_20px_rgba(0,217,255,0.3)] transition-all duration-200 hover:bg-cyan/90 hover:shadow-[0_12px_30px_rgba(0,217,255,0.4)]"
                    >
                      Book A Diagnostic Call
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.5}>
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                      </svg>
                    </Link>
                    <Link
                      href="/fit-assessment"
                      className="inline-flex items-center justify-center gap-3 rounded-xl border-2 border-white/30 bg-white/[0.08] px-10 py-5 text-base font-semibold text-white backdrop-blur-xl transition-all duration-200 hover:border-cyan/40 hover:bg-white/[0.12] hover:shadow-[0_8px_20px_rgba(0,217,255,0.2)]"
                    >
                      Check If We're A Fit
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </main>
  );
}
