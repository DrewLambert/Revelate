'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import type { AssessmentResult, LeadCapture } from '@/types/assessment';
import { tierInfo } from '@/lib/assessment/scoring';
import RadarChart from './RadarChart';

interface ResultsPageProps {
  result: AssessmentResult;
  lead: LeadCapture;
  onStartOver: () => void;
}

export default function ResultsPage({ result, lead, onStartOver }: ResultsPageProps) {
  const tier = tierInfo[result.tier];

  const handleShare = () => {
    const text = `I just scored ${result.overallScore}/100 on the RevOps Health Assessment by @revelateops. How healthy is your revenue operation?`;
    const url = 'https://www.revelateops.com/assessment';
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&summary=${encodeURIComponent(text)}`;
    window.open(linkedInUrl, '_blank', 'width=600,height=400');
  };

  return (
    <div className="mx-auto w-full max-w-4xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10 text-center"
      >
        <p className="text-sm font-medium text-text-tertiary mb-2">
          Results for {lead.name} at {lead.company}
        </p>
        <h1 className="font-heading text-3xl font-semibold text-text-primary sm:text-4xl">
          Your RevOps Health Score
        </h1>
      </motion.div>

      {/* Score + Tier */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-10 rounded-2xl border p-8 text-center sm:p-10"
        style={{
          borderColor: tier.borderColor,
          background: tier.bgColor,
        }}
      >
        <div className="mb-4">
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
            className="inline-block text-7xl font-bold sm:text-8xl"
            style={{ color: tier.color }}
          >
            {result.overallScore}
          </motion.span>
          <span className="text-2xl text-text-muted">/100</span>
        </div>

        <div
          className="mb-3 inline-block rounded-full px-4 py-1.5 text-sm font-semibold"
          style={{ backgroundColor: tier.bgColor, color: tier.color, border: `1px solid ${tier.borderColor}` }}
        >
          {tier.label} ({tier.range})
        </div>

        <p className="mx-auto max-w-2xl text-text-secondary leading-relaxed">
          {tier.description}
        </p>
      </motion.div>

      {/* Radar Chart + Dimension Breakdown */}
      <div className="mb-10 grid gap-8 lg:grid-cols-2">
        {/* Radar Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="rounded-2xl border border-white/10 bg-bg-deep p-6 sm:p-8"
        >
          <h3 className="mb-6 text-center font-heading text-lg font-semibold text-text-primary">
            Dimension Breakdown
          </h3>
          <RadarChart scores={result.dimensionScores} />
        </motion.div>

        {/* Dimension Bars */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="rounded-2xl border border-white/10 bg-bg-deep p-6 sm:p-8"
        >
          <h3 className="mb-6 font-heading text-lg font-semibold text-text-primary">
            Score by Dimension
          </h3>
          <div className="space-y-5">
            {[...result.dimensionScores]
              .sort((a, b) => b.score - a.score)
              .map((ds, i) => {
                const barColor =
                  ds.score <= 40
                    ? '#f87171'
                    : ds.score <= 60
                    ? '#fbbf24'
                    : ds.score <= 80
                    ? '#22d3ee'
                    : '#4ade80';
                return (
                  <motion.div
                    key={ds.dimension}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                  >
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="text-sm font-medium text-text-secondary">
                        {ds.label}
                      </span>
                      <span className="text-sm font-bold" style={{ color: barColor }}>
                        {ds.score}
                      </span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-bg-surface">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: barColor }}
                        initial={{ width: 0 }}
                        animate={{ width: `${ds.score}%` }}
                        transition={{ duration: 0.8, delay: 0.7 + i * 0.1, ease: 'easeOut' }}
                      />
                    </div>
                  </motion.div>
                );
              })}
          </div>
        </motion.div>
      </div>

      {/* Recommendations */}
      {result.recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mb-10"
        >
          <h3 className="mb-6 font-heading text-2xl font-semibold text-text-primary">
            Personalized Recommendations
          </h3>
          <div className="space-y-4">
            {result.recommendations.map((rec, i) => {
              const priorityColors = {
                critical: { bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.3)', text: '#f87171' },
                high: { bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.3)', text: '#fbbf24' },
                medium: { bg: 'rgba(34,211,238,0.1)', border: 'rgba(34,211,238,0.3)', text: '#22d3ee' },
                low: { bg: 'rgba(74,222,128,0.1)', border: 'rgba(74,222,128,0.3)', text: '#4ade80' },
              };
              const colors = priorityColors[rec.priority];

              return (
                <motion.div
                  key={`${rec.dimension}-${i}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                  className="rounded-xl border p-6"
                  style={{ borderColor: colors.border, backgroundColor: colors.bg }}
                >
                  <div className="mb-2 flex items-center gap-3">
                    <span
                      className="inline-block rounded-md px-2 py-0.5 text-xs font-bold uppercase tracking-wider"
                      style={{ color: colors.text, backgroundColor: `${colors.text}20` }}
                    >
                      {rec.priority}
                    </span>
                    <h4 className="font-heading text-lg font-semibold text-text-primary">
                      {rec.title}
                    </h4>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed">{rec.description}</p>
                  <p className="mt-3 text-sm font-medium" style={{ color: colors.text }}>
                    💡 Impact: {rec.impact}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Urgency messaging */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.9 }}
        className="mb-10 rounded-2xl border border-white/10 bg-bg-deep p-8 text-center"
      >
        <p className="text-text-secondary leading-relaxed italic">&ldquo;{tier.urgency}&rdquo;</p>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="rounded-2xl border border-magenta/30 bg-gradient-to-br from-magenta/10 via-bg-deep to-bg-deep p-8 text-center sm:p-10"
      >
        <h3 className="font-heading text-2xl font-semibold text-text-primary sm:text-3xl">
          Ready to Fix What&apos;s Broken?
        </h3>
        <p className="mx-auto mt-3 max-w-lg text-text-secondary leading-relaxed">
          Get a personalized action plan in a free 45-minute diagnostic call. We&apos;ll review your
          results and identify the highest-impact improvements.
        </p>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/book"
            className="rounded-lg bg-magenta px-8 py-3.5 text-sm font-semibold text-white shadow-[0_4px_12px_rgba(217,70,239,0.3)] transition-all hover:bg-magenta/90 hover:shadow-[0_6px_16px_rgba(217,70,239,0.4)]"
          >
            {tier.cta}
          </Link>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-medium text-text-secondary transition-all hover:border-white/40 hover:text-text-primary"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
            </svg>
            Share on LinkedIn
          </button>
        </div>
      </motion.div>

      {/* Start Over */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-8 text-center"
      >
        <button
          onClick={onStartOver}
          className="text-sm text-text-muted transition hover:text-text-secondary"
        >
          ← Take the assessment again
        </button>
      </motion.div>
    </div>
  );
}
