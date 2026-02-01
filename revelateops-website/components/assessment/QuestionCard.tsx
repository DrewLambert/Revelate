'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { Question } from '@/types/assessment';
import { dimensions } from '@/lib/assessment/questions';

interface QuestionCardProps {
  question: Question;
  selectedValue: number | undefined;
  onSelect: (value: number) => void;
  direction: number; // 1 = forward, -1 = backward
}

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -80 : 80,
    opacity: 0,
  }),
};

export default function QuestionCard({
  question,
  selectedValue,
  onSelect,
  direction,
}: QuestionCardProps) {
  const dimension = dimensions.find((d) => d.key === question.dimension);

  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={question.id}
        custom={direction}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="w-full"
      >
        {/* Dimension badge */}
        {dimension && (
          <div className="mb-6 flex items-center gap-2">
            <svg
              className="h-4 w-4 text-accent-primary"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d={dimension.icon} />
            </svg>
            <span className="text-xs font-semibold uppercase tracking-wider text-accent-primary">
              {dimension.label}
            </span>
          </div>
        )}

        {/* Question text */}
        <h2 className="font-heading text-xl font-semibold leading-tight text-text-primary sm:text-2xl md:text-3xl">
          {question.text}
        </h2>
        {question.subtext && (
          <p className="mt-3 text-sm text-text-tertiary leading-relaxed sm:text-base">
            {question.subtext}
          </p>
        )}

        {/* Answer options */}
        <div className="mt-8 space-y-3">
          {question.options.map((option, index) => {
            const isSelected = selectedValue === option.value;
            return (
              <motion.button
                key={`${question.id}-${index}`}
                onClick={() => onSelect(option.value)}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05, duration: 0.3 }}
                className={`group w-full rounded-xl border p-4 text-left transition-all duration-200 sm:p-5 ${
                  isSelected
                    ? 'border-accent-primary bg-accent-primary/10 shadow-[0_0_20px_rgba(34,211,238,0.1)]'
                    : 'border-white/10 bg-bg-deep hover:border-white/25 hover:bg-bg-surface'
                }`}
                aria-pressed={isSelected}
              >
                <div className="flex items-center gap-4">
                  {/* Radio indicator */}
                  <div
                    className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                      isSelected
                        ? 'border-accent-primary bg-accent-primary'
                        : 'border-white/30 group-hover:border-white/50'
                    }`}
                  >
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        className="h-2 w-2 rounded-full bg-bg-deepest"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <span
                      className={`text-sm font-medium sm:text-base ${
                        isSelected ? 'text-text-primary' : 'text-text-secondary'
                      }`}
                    >
                      {option.label}
                    </span>
                    {option.detail && (
                      <span className="ml-2 text-xs text-text-muted">({option.detail})</span>
                    )}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
