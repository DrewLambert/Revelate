'use client';

import { motion, type Variants } from 'framer-motion';

interface ComparisonRow {
  label: string;
  agency: string;
  freelancer: string;
  revelate: string;
}

const rows: ComparisonRow[] = [
  {
    label: 'Cost',
    agency: '$150K–$200K',
    freelancer: '$50–$150/hr, variable',
    revelate: 'Fixed-scope packages',
  },
  {
    label: 'Timeline',
    agency: '6–9 months',
    freelancer: 'Unpredictable',
    revelate: '6–16 weeks',
  },
  {
    label: 'Who does the work',
    agency: 'Junior devs, offshore teams',
    freelancer: 'Varies with each hire',
    revelate: 'One principal, start to finish',
  },
  {
    label: 'Architecture',
    agency: 'Rip-and-replace rebuild',
    freelancer: 'Ticket-by-ticket, no blueprint',
    revelate: 'Incremental, regression-tested',
  },
  {
    label: 'Knowledge transfer',
    agency: 'Thick PDF, good luck',
    freelancer: 'Rarely documented',
    revelate: 'Runbooks, Looms, enablement sessions',
  },
  {
    label: 'Accountability',
    agency: 'Account manager layer',
    freelancer: 'Disappears between gigs',
    revelate: 'Direct Slack line to principal',
  },
];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
};

export default function ComparisonSection() {
  return (
    <section
      id="comparison"
      className="relative overflow-hidden py-24 bg-bg-deepest"
      aria-labelledby="comparison-heading"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute right-[12%] top-[-20%] h-[400px] w-[400px] rounded-full bg-cyan/[0.04] blur-[120px]" />
        <div className="absolute left-[5%] bottom-[-10%] h-[300px] w-[300px] rounded-full bg-magenta/[0.02] blur-[80px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center mb-14"
        >
          <span className="text-xs font-bold uppercase tracking-[0.12em] text-cyan">
            Three paths forward
          </span>
          <h2
            id="comparison-heading"
            className="mt-4 text-2xl font-semibold leading-[1.15] sm:text-3xl md:text-4xl text-text-primary"
          >
            How Revelate compares
          </h2>
          <p className="mt-4 text-base leading-7 text-text-secondary md:text-lg">
            Every RevOps leader faces this choice. Here&apos;s what each path actually looks like.
          </p>
        </motion.div>

        {/* Desktop comparison table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="hidden lg:block"
        >
          <div className="overflow-hidden rounded-xl border border-white/[0.08]">
            {/* Column headers */}
            <div className="grid grid-cols-[1.2fr_1fr_1fr_1fr] border-b border-white/[0.06]">
              <div className="p-5 bg-bg-surface" />
              <div className="p-5 bg-bg-surface text-center">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-text-muted mb-1">
                  Big Agency
                </p>
                <p className="text-sm font-semibold text-text-tertiary">
                  $150K–$200K / 9 months
                </p>
              </div>
              <div className="p-5 bg-bg-surface text-center">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-text-muted mb-1">
                  Freelancer Marketplace
                </p>
                <p className="text-sm font-semibold text-text-tertiary">
                  Inconsistent / no architecture
                </p>
              </div>
              <div className="p-5 bg-cyan/[0.06] text-center relative">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan/0 via-cyan to-cyan/0" />
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-cyan mb-1">
                  Revelate
                </p>
                <p className="text-sm font-semibold text-text-primary">
                  Fixed scope / 6–16 weeks
                </p>
              </div>
            </div>

            {/* Data rows */}
            {rows.map((row, index) => (
              <div
                key={row.label}
                className={`grid grid-cols-[1.2fr_1fr_1fr_1fr] ${
                  index < rows.length - 1 ? 'border-b border-white/[0.04]' : ''
                }`}
              >
                <div className="p-4 bg-bg-surface/50">
                  <p className="text-sm font-semibold text-text-primary">{row.label}</p>
                </div>
                <div className="p-4 flex items-center justify-center text-center">
                  <p className="text-sm text-text-tertiary">{row.agency}</p>
                </div>
                <div className="p-4 flex items-center justify-center text-center">
                  <p className="text-sm text-text-tertiary">{row.freelancer}</p>
                </div>
                <div className="p-4 bg-cyan/[0.03] flex items-center justify-center text-center">
                  <p className="text-sm font-medium text-text-primary">{row.revelate}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Mobile: Card layout */}
        <div className="lg:hidden space-y-6">
          {/* Revelate card first on mobile — highlight */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-xl border border-cyan/30 bg-bg-surface p-6"
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan/0 via-cyan to-cyan/0" />
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-cyan">
                  Revelate
                </p>
                <p className="mt-1 text-sm font-semibold text-text-primary">
                  Fixed scope · 6–16 weeks · Principal-led
                </p>
              </div>
              <span className="rounded-full bg-cyan/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-cyan">
                Recommended
              </span>
            </div>
            <ul className="space-y-3">
              {rows.map((row) => (
                <li key={row.label} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan/10">
                    <svg className="h-3 w-3 text-cyan" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-text-muted">{row.label}</p>
                    <p className="text-sm text-text-primary">{row.revelate}</p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Big Agency card */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="rounded-xl border border-white/[0.06] bg-bg-surface/50 p-6"
          >
            <div className="mb-5">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-text-muted">
                Big Agency
              </p>
              <p className="mt-1 text-sm font-semibold text-text-tertiary">
                $150K–$200K · 6–9 months · Offshore teams
              </p>
            </div>
            <ul className="space-y-3">
              {rows.map((row) => (
                <li key={row.label} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/[0.05]">
                    <svg className="h-3 w-3 text-text-muted" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-text-muted">{row.label}</p>
                    <p className="text-sm text-text-tertiary">{row.agency}</p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Freelancer card */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="rounded-xl border border-white/[0.06] bg-bg-surface/50 p-6"
          >
            <div className="mb-5">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-text-muted">
                Freelancer Marketplace
              </p>
              <p className="mt-1 text-sm font-semibold text-text-tertiary">
                Inconsistent · No architecture · Variable rates
              </p>
            </div>
            <ul className="space-y-3">
              {rows.map((row) => (
                <li key={row.label} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/[0.05]">
                    <svg className="h-3 w-3 text-text-muted" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-text-muted">{row.label}</p>
                    <p className="text-sm text-text-tertiary">{row.freelancer}</p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
