'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const progress = (current / total) * 100;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-text-tertiary">
          Question {current} of {total}
        </span>
        <span className="text-sm font-medium text-accent-primary">
          {Math.round(progress)}%
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-bg-surface">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-accent-primary to-cyan"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
