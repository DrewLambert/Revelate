'use client';

import React from 'react';
import { motion, type Variants } from 'framer-motion';

/*
 * ═══════════════════════════════════════════════════════════════════
 * THE REVELATE METHOD™
 * A Revenue Systems Engineering Framework
 * ═══════════════════════════════════════════════════════════════════
 *
 * This is not a marketing acronym. It's a synthesis of proven frameworks
 * adapted for the specific problem of modernizing revenue operations
 * architecture at growth-stage B2B companies.
 *
 * ── INTELLECTUAL FOUNDATIONS ──
 *
 * Systems Thinking & Constraint Theory:
 *   • Theory of Constraints (Goldratt, 1984) — The system's output is
 *     governed by its constraint. Identify it, exploit it, elevate it,
 *     repeat. Applied here: we don't rebuild everything. We find the
 *     constraint in your revenue system and fix THAT first.
 *   • Systems Thinking (Senge, Meadows) — Revenue operations is an
 *     interconnected system. A routing fix ripples into forecasting,
 *     which ripples into board reporting. You can't fix in isolation.
 *
 * Platform Architecture:
 *   • Salesforce Well-Architected Framework — Solutions should be
 *     Trusted (secure, reliable), Easy (intentional, automated),
 *     and Adaptable (resilient, composable). Every change we ship
 *     is evaluated against these three pillars.
 *   • Forrester RevOps Maturity Model — Understanding where you sit
 *     on the maturity curve (reactive → managed → optimized) determines
 *     what interventions actually help vs. what's premature optimization.
 *
 * Revenue Architecture:
 *   • Winning by Design Revenue Architecture & Bowtie Model — The full
 *     customer lifecycle isn't a funnel, it's a bowtie. Impact and value
 *     flow in both directions. We architect systems that serve the
 *     complete revenue motion, not just top-of-funnel.
 *   • SiriusDecisions/Forrester Revenue Waterfall — Stage definitions
 *     and handoff points matter. Bad stage architecture = bad data =
 *     bad decisions. We audit and correct the waterfall implementation.
 *   • MEDDPICC — Metrics, Economic Buyer, Decision Criteria, Decision
 *     Process, Paper Process, Identify Pain, Champion, Competition.
 *     Your CRM should encode this natively, not fight it.
 *
 * Engineering & Delivery:
 *   • Lean / Toyota Production System — Continuous improvement (kaizen),
 *     waste elimination (muda), flow efficiency. Applied: we eliminate
 *     operational waste in your RevOps processes — manual reconciliation,
 *     duplicate data entry, broken handoffs.
 *   • ITIL Change Management + DevOps — Structured change control meets
 *     progressive delivery. Every production change is incremental,
 *     regression-tested, and reversible. No big-bang rewrites.
 *   • Observability-Driven Engineering — You can't improve what you
 *     can't see. Instrument first, then optimize. Dashboards aren't
 *     vanity metrics — they're the control plane.
 *
 * ── DREW'S ORIGINAL SYNTHESIS ──
 *
 * What makes The Revelate Method distinct from applying any single
 * framework above:
 *
 *   1. Constraint-first triage — We don't start with a SOW. We start
 *      by mapping the system and finding where revenue is leaking.
 *      TOC meets revenue architecture.
 *
 *   2. Principal-embedded delivery — Not outsourced labor. One person
 *      who holds full context from diagnosis through handoff. This is
 *      the opposite of the agency model where knowledge fragments
 *      across 8-12 team members.
 *
 *   3. Progressive delivery for CRM — Borrowed from software engineering
 *      but adapted for Salesforce/RevOps. Feature flags, sandbox-first,
 *      regression tests, rollback plans. Treating your CRM like the
 *      production system it actually is.
 *
 *   4. Observability before optimization — Instrument the system BEFORE
 *      making changes. You need a baseline to prove improvement and
 *      catch regressions. Most consultancies skip this.
 *
 *   5. Documentation-first handoff — The client owns the system after.
 *      Runbooks, Looms, enablement sessions. Not a dependency on us
 *      coming back. This is the Lean principle of building capability,
 *      not just delivering output.
 *
 *   6. Dual greenfield/brownfield — Works whether you're building from
 *      scratch (seed-stage) or modernizing a system with years of
 *      accumulated tech debt. Same principles, different entry points.
 *
 * ── THE THREE PHASES ──
 *
 *   DIAGNOSE → ARCHITECT → ENABLE
 *
 *   These aren't arbitrary buckets. They map to a deliberate progression:
 *     - Diagnose = Understand the system (systems thinking + TOC)
 *     - Architect = Fix the system (progressive delivery + Well-Architected)
 *     - Enable = Transfer the system (lean capability building + observability)
 *
 *   The cycle repeats. After Enable, the constraint may shift. A new
 *   Diagnose phase finds the next bottleneck. This is Goldratt's
 *   "never let inertia become the constraint" principle.
 *
 * ═══════════════════════════════════════════════════════════════════
 */

interface Phase {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  principleSource: string;
  deliverables: string[];
  icon: React.ReactNode;
}

interface Foundation {
  name: string;
  author: string;
  application: string;
}

const phases: Phase[] = [
  {
    number: '01',
    title: 'Diagnose',
    subtitle: 'Map the system. Find the constraint.',
    description:
      'Revenue operations is an interconnected system — routing affects forecasting, which affects board reporting, which affects hiring decisions. We map the full system before touching anything: data flows, automations, integrations, handoff points, and stage definitions. Then we apply constraint analysis to find where revenue is actually leaking. Not where it feels broken — where the data proves it.',
    principleSource: 'Systems thinking · Theory of Constraints · Revenue Architecture',
    deliverables: [
      'Full revenue system map — automations, integrations, data flows, handoff points',
      'Constraint analysis identifying the #1 bottleneck limiting revenue throughput',
      'Revenue waterfall audit — stage definitions, conversion leakage, attribution gaps',
      'Prioritized modernization backlog ranked by revenue impact, not effort',
    ],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Architect',
    subtitle: 'Fix incrementally. Ship with confidence.',
    description:
      'We treat your CRM like the production system it is. Every change is sandbox-first, regression-tested, and shipped with a rollback plan. No big-bang rewrites — progressive delivery borrowed from software engineering and adapted for Salesforce. Each sprint ships measurable improvements while the rest of your revenue system keeps running.',
    principleSource: 'Progressive delivery · Well-Architected · Lean waste elimination',
    deliverables: [
      'Incremental production fixes — routing, forecasting, integrations — with regression tests',
      'Version-controlled automations with change logs and rollback plans',
      'Live health dashboards as the control plane — SLA, pipeline accuracy, ARR reconciliation',
      'Process waste elimination — manual reconciliation, duplicate entry, broken handoffs',
    ],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Enable',
    subtitle: 'Instrument. Transfer. Your team owns it.',
    description:
      'The engagement ends when your team can operate independently — not when the hours run out. We wire observability so you can see what\'s happening in real time, build runbooks so any admin can troubleshoot, and run enablement sessions so your team understands not just what was built, but why. The goal is capability transfer, not billable dependency.',
    principleSource: 'Observability-driven engineering · Lean capability building · ITIL knowledge management',
    deliverables: [
      'Observability layer — alerting on critical workflows, anomaly detection, health scores',
      'Leadership scorecards wired to trusted, reconciled data',
      'Runbooks, Loom walkthroughs, and enablement sessions for admins and GTM teams',
      '30-day follow-up window for edge cases and questions',
    ],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
];

const foundations: Foundation[] = [
  {
    name: 'Theory of Constraints',
    author: 'Goldratt',
    application: 'Constraint-first triage — find the bottleneck, fix it, measure, repeat',
  },
  {
    name: 'Salesforce Well-Architected',
    author: 'Salesforce',
    application: 'Every change evaluated against Trusted, Easy, Adaptable pillars',
  },
  {
    name: 'Revenue Architecture & Bowtie',
    author: 'Winning by Design',
    application: 'Full lifecycle revenue system design, not just top-of-funnel',
  },
  {
    name: 'Lean / Toyota Production System',
    author: 'Ohno, Shingo',
    application: 'Waste elimination (muda), continuous improvement (kaizen)',
  },
  {
    name: 'Progressive Delivery',
    author: 'DevOps / ITIL',
    application: 'Incremental, regression-tested, reversible production changes',
  },
  {
    name: 'Revenue Waterfall',
    author: 'SiriusDecisions / Forrester',
    application: 'Stage definitions, handoff points, and conversion measurement',
  },
];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const phaseVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' as const },
  },
};

const connectorVariants: Variants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 0.8, ease: 'easeOut' as const, delay: 0.3 },
  },
};

const foundationVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
};

export default function RevelateMethod() {
  return (
    <section
      id="method"
      className="relative overflow-hidden py-24 bg-bg-deep"
      aria-labelledby="method-heading"
    >
      {/* Blueprint grid background */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.03)_1px,transparent_1px)] [background-size:48px_48px]" />
        <div className="absolute left-[15%] top-[20%] h-[400px] w-[400px] rounded-full bg-cyan/[0.04] blur-[120px]" />
        <div className="absolute right-[10%] bottom-[10%] h-[300px] w-[300px] rounded-full bg-accent-secondary/[0.03] blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan/20 bg-cyan/[0.08] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-cyan">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan animate-pulse" />
            Our framework
          </span>
          <h2
            id="method-heading"
            className="mt-6 text-2xl font-semibold leading-[1.15] sm:text-3xl md:text-4xl lg:text-5xl text-text-primary"
          >
            The Revelate Method<sup className="text-cyan text-[0.5em] ml-0.5 align-super">™</sup>
          </h2>
          <p className="mt-5 text-base leading-7 text-text-secondary md:text-lg">
            Revenue operations is an interconnected system, not a list of tickets. A routing change
            ripples into forecasting. A bad stage definition corrupts board reporting. You can&apos;t
            fix these problems in isolation.
          </p>
          <p className="mt-4 text-base leading-7 text-text-secondary md:text-lg">
            The Revelate Method applies systems thinking, constraint theory, and progressive delivery
            to revenue architecture — treating your CRM as the production system it actually is.
            Three phases. One principal. Your team owns the result.
          </p>
        </motion.div>

        {/* Core Cycle Diagram — Diagnose → Architect → Enable → (repeat) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10 flex items-center justify-center"
        >
          <div className="inline-flex items-center gap-3 rounded-full border border-white/[0.08] bg-bg-surface/60 px-5 py-2.5">
            <span className="text-sm font-semibold text-text-primary">Diagnose</span>
            <svg className="h-3 w-3 text-cyan/50" viewBox="0 0 12 12" fill="currentColor"><path d="M2 5h6.6L6.3 2.7 7 2l4 4-4 4-.7-.7L8.6 7H2V5z" /></svg>
            <span className="text-sm font-semibold text-text-primary">Architect</span>
            <svg className="h-3 w-3 text-cyan/50" viewBox="0 0 12 12" fill="currentColor"><path d="M2 5h6.6L6.3 2.7 7 2l4 4-4 4-.7-.7L8.6 7H2V5z" /></svg>
            <span className="text-sm font-semibold text-text-primary">Enable</span>
            <svg className="h-3 w-3 text-cyan/50" viewBox="0 0 12 12" fill="currentColor"><path d="M2 5h6.6L6.3 2.7 7 2l4 4-4 4-.7-.7L8.6 7H2V5z" /></svg>
            <span className="text-xs text-text-muted italic">repeat at new constraint</span>
          </div>
        </motion.div>

        {/* Phase Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="mt-12"
        >
          {/* Desktop: Horizontal flow with connectors */}
          <div className="hidden lg:grid lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-start lg:gap-0">
            {phases.map((phase, index) => (
              <React.Fragment key={phase.title}>
                <motion.div
                  variants={phaseVariants}
                  className="group relative"
                >
                  <div className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-bg-surface p-6 transition-all duration-300 hover:border-cyan/30 hover:shadow-[0_0_32px_rgba(34,211,238,0.08)] h-full flex flex-col">
                    {/* Phase header */}
                    <div className="flex items-center gap-3 mb-4">
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan/[0.1] text-cyan transition-colors group-hover:bg-cyan/[0.15]">
                        {phase.icon}
                      </span>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">
                          Phase {phase.number}
                        </span>
                        <h3 className="text-lg font-semibold text-text-primary leading-tight">
                          {phase.title}
                        </h3>
                      </div>
                    </div>

                    {/* Subtitle */}
                    <p className="text-sm font-medium text-cyan mb-3">
                      {phase.subtitle}
                    </p>

                    {/* Description */}
                    <p className="text-[13px] leading-relaxed text-text-secondary mb-5 flex-grow">
                      {phase.description}
                    </p>

                    {/* Principle source */}
                    <p className="text-[10px] uppercase tracking-[0.08em] text-text-muted mb-4 italic">
                      {phase.principleSource}
                    </p>

                    {/* Deliverables */}
                    <div className="border-t border-white/[0.06] pt-4 mt-auto">
                      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted mb-3">
                        Deliverables
                      </p>
                      <ul className="space-y-2">
                        {phase.deliverables.map((item) => (
                          <li key={item} className="flex items-start gap-2.5">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan/60" />
                            <span className="text-xs leading-relaxed text-text-secondary">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Bottom accent */}
                    <div className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-cyan/0 via-cyan/40 to-cyan/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>
                </motion.div>

                {/* Connector */}
                {index < phases.length - 1 && (
                  <motion.div
                    variants={connectorVariants}
                    className="flex items-center justify-center self-center px-2 origin-left"
                  >
                    <div className="flex items-center">
                      <div className="h-px w-8 bg-gradient-to-r from-cyan/40 to-cyan/20" />
                      <svg className="h-3 w-3 text-cyan/40" viewBox="0 0 12 12" fill="currentColor">
                        <path d="M2 1l8 5-8 5V1z" />
                      </svg>
                    </div>
                  </motion.div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Mobile/Tablet: Vertical flow */}
          <div className="lg:hidden space-y-4">
            {phases.map((phase, index) => (
              <motion.div key={phase.title} variants={phaseVariants}>
                <div className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-bg-surface p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan/[0.1] text-cyan">
                      {phase.icon}
                    </span>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">
                        Phase {phase.number}
                      </span>
                      <h3 className="text-lg font-semibold text-text-primary leading-tight">
                        {phase.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-sm font-medium text-cyan mb-3">{phase.subtitle}</p>
                  <p className="text-[13px] leading-relaxed text-text-secondary mb-4">
                    {phase.description}
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.08em] text-text-muted mb-4 italic">
                    {phase.principleSource}
                  </p>

                  <div className="border-t border-white/[0.06] pt-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted mb-3">
                      Deliverables
                    </p>
                    <ul className="space-y-2">
                      {phase.deliverables.map((item) => (
                        <li key={item} className="flex items-start gap-2.5">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan/60" />
                          <span className="text-xs leading-relaxed text-text-secondary">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {index < phases.length - 1 && (
                  <div className="flex justify-center py-2">
                    <div className="flex flex-col items-center">
                      <div className="h-4 w-px bg-gradient-to-b from-cyan/40 to-cyan/20" />
                      <svg className="h-3 w-3 text-cyan/40 rotate-90" viewBox="0 0 12 12" fill="currentColor">
                        <path d="M2 1l8 5-8 5V1z" />
                      </svg>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Engagement Parameters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-6 rounded-xl border border-white/[0.06] bg-bg-surface/50 px-6 py-4"
        >
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 text-cyan" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-text-secondary">
              <span className="font-semibold text-text-primary">6–16 weeks</span> typical engagement
            </span>
          </div>
          <span className="hidden sm:inline text-white/10">|</span>
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 text-cyan" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-text-secondary">
              <span className="font-semibold text-text-primary">Fixed scope</span> — weekly production cadence
            </span>
          </div>
          <span className="hidden sm:inline text-white/10">|</span>
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 text-cyan" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            <span className="text-sm text-text-secondary">
              <span className="font-semibold text-text-primary">Principal-led</span> — one person, full context, no handoffs
            </span>
          </div>
        </motion.div>

        {/* ── Influences & Foundations ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16"
        >
          <div className="rounded-xl border border-white/[0.06] bg-bg-surface/30 p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-1">
              <svg className="h-4 w-4 text-text-muted" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
              <h3 className="text-sm font-semibold text-text-primary">
                Influences &amp; Foundations
              </h3>
            </div>
            <p className="text-xs leading-relaxed text-text-tertiary mb-5">
              The Revelate Method builds on established frameworks adapted for revenue systems engineering.
              We stand on the shoulders of giants — that transparency is the credibility.
            </p>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
            >
              {foundations.map((f) => (
                <motion.div
                  key={f.name}
                  variants={foundationVariants}
                  className="rounded-lg border border-white/[0.04] bg-white/[0.02] p-3 transition-colors hover:border-white/[0.08]"
                >
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-xs font-semibold text-text-primary">{f.name}</span>
                    <span className="text-[10px] text-text-muted">— {f.author}</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-text-tertiary">
                    {f.application}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
