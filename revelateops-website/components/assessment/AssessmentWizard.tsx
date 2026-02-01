'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { questions } from '@/lib/assessment/questions';
import { calculateResults } from '@/lib/assessment/scoring';
import type { AssessmentAnswers, AssessmentResult, LeadCapture } from '@/types/assessment';
import ProgressBar from './ProgressBar';
import QuestionCard from './QuestionCard';
import LeadCaptureForm from './LeadCaptureForm';
import ResultsPage from './ResultsPage';

type Stage = 'intro' | 'quiz' | 'capture' | 'results';

export default function AssessmentWizard() {
  const [stage, setStage] = useState<Stage>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AssessmentAnswers>({});
  const [direction, setDirection] = useState(1);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [lead, setLead] = useState<LeadCapture | null>(null);

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;

  const handleSelect = useCallback(
    (value: number) => {
      setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
      // Auto-advance after brief delay
      setTimeout(() => {
        if (currentIndex < totalQuestions - 1) {
          setDirection(1);
          setCurrentIndex((prev) => prev + 1);
        } else {
          // Calculate results and move to lead capture
          const newAnswers = { ...answers, [currentQuestion.id]: value };
          const calculatedResult = calculateResults(newAnswers);
          setResult(calculatedResult);
          setStage('capture');
        }
      }, 350);
    },
    [currentIndex, totalQuestions, answers, currentQuestion]
  );

  const handleBack = useCallback(() => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  const handleLeadSubmit = useCallback(
    async (data: LeadCapture) => {
      setLead(data);

      // Log submission (server-side)
      try {
        await fetch('/api/assessment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lead: data,
            result,
            answers,
            submittedAt: new Date().toISOString(),
          }),
        });
      } catch {
        // Non-blocking — don't prevent results from showing
        console.warn('Failed to log assessment submission');
      }

      // Track in analytics
      if (typeof window !== 'undefined' && (window as any).plausible) {
        (window as any).plausible('Assessment Completed', {
          props: {
            score: result?.overallScore,
            tier: result?.tier,
            company: data.company,
          },
        });
      }

      setStage('results');
    },
    [result, answers]
  );

  const handleStartOver = useCallback(() => {
    setStage('intro');
    setCurrentIndex(0);
    setAnswers({});
    setResult(null);
    setLead(null);
    setDirection(1);
  }, []);

  return (
    <div className="min-h-screen bg-bg-deepest">
      {/* Background decoration */}
      <div className="pointer-events-none fixed inset-0" aria-hidden="true">
        <div className="absolute right-[10%] top-[-10%] h-[50vh] w-[50vh] rounded-full bg-accent-primary/5 blur-[100px]" />
        <div className="absolute left-[5%] bottom-[10%] h-[30vh] w-[30vh] rounded-full bg-magenta/5 blur-[80px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-6 pb-20 pt-32 sm:pt-40">
        <AnimatePresence mode="wait">
          {/* INTRO */}
          {stage === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-accent-primary/30 bg-accent-primary/10">
                <svg
                  className="h-8 w-8 text-accent-primary"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                  />
                </svg>
              </div>

              <h1 className="font-heading text-3xl font-bold text-text-primary sm:text-4xl md:text-5xl">
                RevOps Health Assessment
              </h1>

              <p className="mx-auto mt-4 max-w-xl text-text-secondary leading-relaxed sm:text-lg">
                Discover where your revenue operations stand across 5 critical dimensions.
                Get a personalized score, visual breakdown, and actionable recommendations
                in under 3 minutes.
              </p>

              <div className="mx-auto mt-8 grid max-w-md gap-3 text-left sm:grid-cols-2">
                {[
                  { icon: '⏱️', text: '10 questions, ~3 minutes' },
                  { icon: '📊', text: '5-dimension radar analysis' },
                  { icon: '🎯', text: 'Personalized recommendations' },
                  { icon: '📋', text: 'Detailed health report' },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-2 rounded-lg border border-white/5 bg-bg-deep p-3">
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-sm text-text-secondary">{item.text}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setStage('quiz')}
                className="mt-10 rounded-lg bg-magenta px-10 py-4 text-base font-semibold text-white shadow-[0_4px_12px_rgba(217,70,239,0.3)] transition-all hover:bg-magenta/90 hover:shadow-[0_6px_16px_rgba(217,70,239,0.4)]"
              >
                Start Assessment
              </button>

              <p className="mt-4 text-xs text-text-muted">
                Free • No account required • Results in 3 minutes
              </p>
            </motion.div>
          )}

          {/* QUIZ */}
          {stage === 'quiz' && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <ProgressBar current={currentIndex + 1} total={totalQuestions} />
              <div className="mt-8">
                <QuestionCard
                  question={currentQuestion}
                  selectedValue={answers[currentQuestion.id]}
                  onSelect={handleSelect}
                  direction={direction}
                />
              </div>

              {/* Navigation */}
              <div className="mt-8 flex items-center justify-between">
                <button
                  onClick={handleBack}
                  disabled={currentIndex === 0}
                  className="flex items-center gap-1 text-sm text-text-muted transition hover:text-text-secondary disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>

                <span className="text-xs text-text-muted">
                  Select an answer to continue
                </span>
              </div>
            </motion.div>
          )}

          {/* LEAD CAPTURE */}
          {stage === 'capture' && result && (
            <motion.div
              key="capture"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <LeadCaptureForm
                onSubmit={handleLeadSubmit}
                overallScore={result.overallScore}
              />
            </motion.div>
          )}

          {/* RESULTS */}
          {stage === 'results' && result && lead && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <ResultsPage result={result} lead={lead} onStartOver={handleStartOver} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
