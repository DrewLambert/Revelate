'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { LeadCapture } from '@/types/assessment';

interface LeadCaptureFormProps {
  onSubmit: (data: LeadCapture) => void;
  overallScore: number;
}

export default function LeadCaptureForm({ onSubmit, overallScore }: LeadCaptureFormProps) {
  const [formData, setFormData] = useState<LeadCapture>({
    name: '',
    email: '',
    company: '',
    role: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate brief delay for UX
    await new Promise((resolve) => setTimeout(resolve, 400));
    onSubmit(formData);
    setIsSubmitting(false);
  };

  const isValid = formData.name.trim() && formData.email.trim() && formData.company.trim();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto w-full max-w-lg"
    >
      <div className="rounded-2xl border border-white/10 bg-bg-deep p-8 sm:p-10">
        {/* Score preview teaser */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border-2 border-accent-primary/30 bg-accent-primary/10">
            <span className="text-3xl font-bold text-accent-primary">{overallScore}</span>
          </div>
          <h2 className="font-heading text-2xl font-semibold text-text-primary">
            Your Results Are Ready
          </h2>
          <p className="mt-2 text-sm text-text-tertiary leading-relaxed">
            Enter your details to unlock your personalized RevOps Health Report with
            dimension scores, radar chart, and tailored recommendations.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-text-secondary">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-bg-surface px-4 py-3 text-sm text-text-primary placeholder-text-muted outline-none transition focus:border-accent-primary focus:ring-1 focus:ring-accent-primary"
              placeholder="Jane Smith"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-text-secondary">
              Work Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-bg-surface px-4 py-3 text-sm text-text-primary placeholder-text-muted outline-none transition focus:border-accent-primary focus:ring-1 focus:ring-accent-primary"
              placeholder="jane@company.com"
            />
          </div>

          <div>
            <label htmlFor="company" className="mb-1.5 block text-sm font-medium text-text-secondary">
              Company
            </label>
            <input
              id="company"
              type="text"
              required
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-bg-surface px-4 py-3 text-sm text-text-primary placeholder-text-muted outline-none transition focus:border-accent-primary focus:ring-1 focus:ring-accent-primary"
              placeholder="Acme Inc."
            />
          </div>

          <div>
            <label htmlFor="role" className="mb-1.5 block text-sm font-medium text-text-secondary">
              Role <span className="text-text-muted">(optional)</span>
            </label>
            <input
              id="role"
              type="text"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-bg-surface px-4 py-3 text-sm text-text-primary placeholder-text-muted outline-none transition focus:border-accent-primary focus:ring-1 focus:ring-accent-primary"
              placeholder="VP Revenue Operations"
            />
          </div>

          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="mt-2 w-full rounded-lg bg-magenta px-6 py-3.5 text-sm font-semibold text-white shadow-[0_4px_12px_rgba(217,70,239,0.3)] transition-all hover:bg-magenta/90 hover:shadow-[0_6px_16px_rgba(217,70,239,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Generating Report...
              </span>
            ) : (
              'Get My Personalized Report'
            )}
          </button>

          <p className="text-center text-xs text-text-muted">
            No spam. We&apos;ll use this to personalize your report and follow up if you&apos;d like.
          </p>
        </form>
      </div>
    </motion.div>
  );
}
