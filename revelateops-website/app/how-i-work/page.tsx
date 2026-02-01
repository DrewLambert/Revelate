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
                Embedded partnership that builds or stabilizes your revenue stack in 8-16 weeks—whether you're starting from zero or untangling years of tech debt.
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
                    For greenfield: map your revenue model, sales motion, and growth targets to design the right architecture from day one. For brownfield: deep-dive audit of your existing stack to surface what's broken and what's blocking scale.
                  </p>
                  <ul className="mt-6 space-y-3 text-sm text-white/80">
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-cyan shadow-[0_0_8px_rgba(0,217,255,0.6)]" />
                      <span>15-minute intro call with executive recap</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-cyan shadow-[0_0_8px_rgba(0,217,255,0.6)]" />
                      <span>Architecture blueprint or prioritized modernization backlog</span>
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
                  <h3 className="mt-6 font-heading text-xl font-semibold text-white">Build / Rebuild</h3>
                  <p className="mt-3 font-body text-base text-white/70 leading-relaxed">
                    For greenfield: stand up your CRM, routing, forecasting, and integrations — architected to scale from 10 reps to 100. For brownfield: ship regular improvements with regression tests and rollback plans.
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
                  <h3 className="mt-6 font-heading text-xl font-semibold text-white">Stabilize & Scale</h3>
                  <p className="mt-3 font-body text-base text-white/70 leading-relaxed">
                    Wire observability, documentation, and enablement so your team owns the system — whether that's your first ops hire or an existing admin team stepping into a clean architecture.
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

            <div className="grid gap-8 lg:gap-12">
              {/* Case Study #1: Bevi (Featured) */}
              <div className="relative overflow-hidden rounded-2xl border-2 border-cyan/20 bg-white/[0.08] shadow-lg backdrop-blur-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan/5 via-transparent to-transparent" />
                <div className="relative p-8 lg:p-12">
                  {/* Header */}
                  <div className="mb-8">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-cyan mb-2">
                          Featured Case Study
                        </span>
                        <h3 className="font-heading text-2xl font-semibold text-white sm:text-3xl">
                          $100M+ Series C SaaS Company
                        </h3>
                        <p className="font-body text-base text-white/60 mt-2">
                          Smart water cooler manufacturer · Former employer
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Challenge */}
                  <div className="mb-8">
                    <h4 className="font-heading text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <svg className="h-5 w-5 text-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      The Challenge
                    </h4>
                    <ul className="space-y-3 font-body text-base text-white/80">
                      <li className="flex items-start gap-3">
                        <span className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-white/10">
                          <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
                        </span>
                        <span>Lead routing took <strong className="text-white">2+ hours manually</strong> through spreadsheets and Slack messages</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-white/10">
                          <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
                        </span>
                        <span>Sales team bypassed Salesforce for Google Sheets due to data trust issues</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-white/10">
                          <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
                        </span>
                        <span>Duplicate systems across departments costing <strong className="text-white">$200K+ annually</strong></span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-white/10">
                          <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
                        </span>
                        <span>Forecast accuracy unreliable—board deck numbers didn't match CRM</span>
                      </li>
                    </ul>
                  </div>

                  {/* Solution */}
                  <div className="mb-8">
                    <h4 className="font-heading text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <svg className="h-5 w-5 text-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      The Solution
                    </h4>
                    <ul className="space-y-3 font-body text-base text-white/80">
                      <li className="flex items-start gap-3">
                        <span className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-cyan/20">
                          <svg className="h-3 w-3 text-cyan" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </span>
                        <span>Rebuilt lead routing with intelligent territory assignment and automated SLA tracking</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-cyan/20">
                          <svg className="h-3 w-3 text-cyan" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </span>
                        <span>Unified data pipelines across Salesforce, HubSpot, and analytics platforms</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-cyan/20">
                          <svg className="h-3 w-3 text-cyan" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </span>
                        <span>Implemented real-time pipeline reporting with automated data quality checks</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-cyan/20">
                          <svg className="h-3 w-3 text-cyan" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </span>
                        <span>Consolidated 50+ integration workflows eliminating duplicate data entry</span>
                      </li>
                    </ul>
                  </div>

                  {/* Results */}
                  <div className="rounded-xl bg-white/5 border border-cyan/20 p-6">
                    <h4 className="font-heading text-lg font-semibold text-white mb-6 flex items-center gap-2">
                      <svg className="h-5 w-5 text-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      Quantified Results
                    </h4>
                    <div className="grid gap-6 sm:grid-cols-3">
                      <div>
                        <div className="text-3xl font-bold text-cyan mb-2">66%</div>
                        <div className="text-sm text-white/70">Sales cycle acceleration</div>
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-cyan mb-2">3 min</div>
                        <div className="text-sm text-white/70">Lead routing time (from 2+ hours)</div>
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-cyan mb-2">$200K+</div>
                        <div className="text-sm text-white/70">Annual operational savings</div>
                      </div>
                    </div>
                    <div className="mt-6 pt-6 border-t border-white/10">
                      <p className="text-sm text-white/60">
                        <strong className="text-white/80">Timeline:</strong> 12-week embedded engagement ·
                        <strong className="text-white/80 ml-2">Team:</strong> Principal-only delivery ·
                        <strong className="text-white/80 ml-2">Scope:</strong> 150+ workflow implementations
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Case Studies Placeholder */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="relative overflow-hidden rounded-2xl border border-dashed border-white/20 bg-white/[0.05] p-8 text-center backdrop-blur-xl">
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                      <svg className="h-6 w-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-heading text-lg font-semibold text-white mb-2">Series B Case Study #2</h4>
                      <p className="font-body text-sm text-white/60">Additional client story coming soon</p>
                    </div>
                  </div>
                </div>
                <div className="relative overflow-hidden rounded-2xl border border-dashed border-white/20 bg-white/[0.05] p-8 text-center backdrop-blur-xl">
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                      <svg className="h-6 w-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-heading text-lg font-semibold text-white mb-2">Nonprofit Case Study</h4>
                      <p className="font-body text-sm text-white/60">Capability breadth example coming soon</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Client Logos Note */}
              <div className="text-center">
                <p className="font-body text-sm text-white/50">
                  <svg className="inline-block h-4 w-4 mr-2 -mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Client logos and additional anonymized case studies available upon request
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
                      Whether you're building from scratch or rebuilding from chaos — let's map the path forward together.
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
