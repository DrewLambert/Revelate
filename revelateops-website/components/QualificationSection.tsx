'use client';

import { motion, type Variants } from 'framer-motion';

const goodFit = [
  'Your Salesforce instance has grown faster than your team can manage',
  "You're preparing for a board meeting and don't trust your pipeline numbers",
  "You've been quoted $150K+ for a 9-month agency rebuild",
  "You're a seed-stage founder setting up your first revenue stack",
  'Your lead routing takes hours instead of minutes',
  'You have integrations breaking and nobody knows why',
];

const notFit = [
  { text: 'You need a full-time hire', note: "we'll help you find one after the sprint" },
  { text: 'You need HubSpot-only work', note: "we're Salesforce-ecosystem focused" },
  { text: 'You want a multi-year retainer', note: 'we do fixed-scope sprints' },
  { text: 'You need someone to "just admin" Salesforce', note: 'we architect revenue systems' },
];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
};

export default function QualificationSection() {
  return (
    <section
      id="qualification"
      className="relative overflow-hidden py-24 bg-bg-deepest"
      aria-labelledby="qualification-heading"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute right-[20%] top-[10%] h-[350px] w-[350px] rounded-full bg-cyan/[0.03] blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-xs font-bold uppercase tracking-[0.12em] text-cyan">
            Mutual fit
          </span>
          <h2
            id="qualification-heading"
            className="mt-4 text-2xl font-semibold leading-[1.15] sm:text-3xl md:text-4xl text-text-primary"
          >
            Is Revelate right for you?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-text-secondary">
            We&apos;re selective about who we work with — because the best outcomes
            come from the right fit.
          </p>
        </motion.div>

        {/* Two-column layout */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Good fit column */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="rounded-xl border border-white/[0.08] bg-bg-surface p-6 sm:p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
                <svg className="h-4 w-4 text-emerald-400" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </span>
              <h3 className="text-lg font-semibold text-text-primary">
                Revelate is built for you if…
              </h3>
            </div>

            <ul className="space-y-4">
              {goodFit.map((item) => (
                <motion.li
                  key={item}
                  variants={itemVariants}
                  className="flex items-start gap-3"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
                    <svg className="h-3 w-3 text-emerald-400" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </span>
                  <span className="text-sm leading-relaxed text-text-secondary">
                    {item}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Not fit column */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="rounded-xl border border-white/[0.06] bg-bg-surface/50 p-6 sm:p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.06]">
                <svg className="h-4 w-4 text-text-muted" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </span>
              <h3 className="text-lg font-semibold text-text-primary">
                We&apos;re probably not the right fit if…
              </h3>
            </div>

            <ul className="space-y-4">
              {notFit.map((item) => (
                <motion.li
                  key={item.text}
                  variants={itemVariants}
                  className="flex items-start gap-3"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/[0.05]">
                    <svg className="h-3 w-3 text-text-muted" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </span>
                  <span className="text-sm leading-relaxed text-text-tertiary">
                    {item.text}{' '}
                    <span className="text-text-muted">— {item.note}</span>
                  </span>
                </motion.li>
              ))}
            </ul>

            {/* Reassuring note */}
            <div className="mt-6 rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
              <p className="text-xs leading-relaxed text-text-tertiary">
                If you&apos;re not the right fit, we&apos;ll tell you honestly and point you in a
                better direction. No wasted calls.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
