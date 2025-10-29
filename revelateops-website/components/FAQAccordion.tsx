'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string | React.ReactNode;
}

interface FAQAccordionProps {
  items: FAQItem[];
  className?: string;
}

export default function FAQAccordion({ items, className = '' }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <dl className={`space-y-4 ${className}`}>
      {items.map((item, index) => (
        <div
          key={index}
          className="rounded-xl border border-[#dbe3f0] bg-[#f8fafc] shadow-[0_6px_12px_rgba(17,27,58,0.12)] overflow-hidden transition-shadow duration-200 hover:shadow-[0_8px_16px_rgba(17,27,58,0.16)]"
        >
          <dt>
            <button
              onClick={() => toggleItem(index)}
              className="flex w-full items-center justify-between gap-4 p-6 text-left transition-colors duration-200 hover:bg-[#f1f5f9]"
              aria-expanded={openIndex === index}
              aria-controls={`faq-answer-${index}`}
            >
              <span className="text-sm font-semibold uppercase tracking-[0.05em] text-cyan">
                {item.question}
              </span>
              <motion.svg
                animate={{ rotate: openIndex === index ? 180 : 0 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                className="h-5 w-5 flex-shrink-0 text-cyan"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </motion.svg>
            </button>
          </dt>
          <AnimatePresence initial={false}>
            {openIndex === index && (
              <motion.dd
                id={`faq-answer-${index}`}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-6 pt-0 text-sm leading-7 text-[#334155]">
                  {item.answer}
                </div>
              </motion.dd>
            )}
          </AnimatePresence>
        </div>
      ))}
    </dl>
  );
}
