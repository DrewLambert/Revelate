'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingProps {
  fullScreen?: boolean;
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function Loading({
  fullScreen = false,
  message = 'Loading...',
  size = 'md'
}: LoadingProps) {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 400);
    return () => clearInterval(interval);
  }, []);

  const sizeClasses = {
    sm: 'h-12 w-12',
    md: 'h-20 w-20',
    lg: 'h-32 w-32'
  };

  const logoSize = {
    sm: 32,
    md: 56,
    lg: 88
  };

  const content = (
    <div className="flex flex-col items-center justify-center gap-6">
      {/* Animated Logo Container */}
      <motion.div
        className="relative"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Spinning Ring */}
        <motion.div
          className={`${sizeClasses[size]} relative flex items-center justify-center`}
          animate={{ rotate: 360 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear'
          }}
        >
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan border-r-cyan/40 shadow-[0_0_24px_rgba(0,217,255,0.4)]" />
        </motion.div>

        {/* Logo in Center */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          <div className={`relative ${sizeClasses[size]}`}>
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan/20 via-transparent to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                src="/logo.svg"
                alt="Revelate Operations"
                width={logoSize[size]}
                height={logoSize[size]}
                className="relative z-10"
                priority
              />
            </div>
          </div>
        </motion.div>

        {/* Pulsing Glow Effect */}
        <motion.div
          className={`absolute inset-0 ${sizeClasses[size]} rounded-full bg-cyan/5 blur-xl`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      </motion.div>

      {/* Loading Text */}
      <motion.div
        className="flex flex-col items-center gap-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <p className="text-lg font-medium text-white">
          {message}
          <span className="inline-block w-8 text-left">{dots}</span>
        </p>
        <p className="text-sm text-white/60">Revelate Operations</p>
      </motion.div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-b from-[#0A0F1E] via-[#1a1f3a] to-[#0A0F1E]">
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      {content}
    </div>
  );
}

// Loading Overlay Component (for use over existing content)
export function LoadingOverlay({
  show,
  message = 'Processing...'
}: {
  show: boolean;
  message?: string;
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm"
        >
          <Loading message={message} size="lg" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Mini Loading Spinner (for inline use)
export function LoadingSpinner({
  className = ''
}: {
  className?: string;
}) {
  return (
    <motion.div
      className={`relative h-6 w-6 ${className}`}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'linear'
      }}
    >
      <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan border-r-cyan/40" />
      <div className="absolute inset-1 rounded-full bg-gradient-to-br from-cyan/20 to-transparent" />
    </motion.div>
  );
}
