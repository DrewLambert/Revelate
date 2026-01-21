'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface Testimonial {
  quote: string;
  author: string;
  title?: string;
  company: string;
  companyLogo?: string;
}

const testimonials: Testimonial[] = [
  {
    quote: "Your expertise, creativity, and dedication have provided NHBEA with a modern and user-friendly online presence that enhances our ability to connect with educators, members, and the broader community.",
    author: "NHBEA Executive Board",
    title: "",
    company: "New Hampshire Business Education Association",
  },
];

export default function Testimonials() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="testimonials" className="relative overflow-hidden py-20 bg-surface">
      {/* Background pattern */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(0,217,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,217,255,0.02)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_80%)]" />

      <div className="relative mx-auto max-w-5xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center"
        >
          <span className="text-xs font-bold uppercase tracking-[0.08em] text-cyan">
            Client Success
          </span>
          <h2 className="mt-5 text-2xl font-semibold leading-[1.2] sm:text-3xl md:text-4xl text-navy">
            What clients are saying
          </h2>
        </motion.div>

        <div className="mt-12 grid gap-8 md:grid-cols-1 lg:max-w-3xl lg:mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.4,
                delay: prefersReducedMotion ? 0 : index * 0.1,
                ease: "easeOut"
              }}
            >
              <div className="relative rounded-2xl border border-cyan/20 bg-white p-8 lg:p-10 shadow-[0_6px_12px_rgba(17,27,58,0.12)] transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-cyan/40">
                <blockquote>
                  <p className="text-lg leading-relaxed text-charcoal italic">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                </blockquote>

                {/* Author info */}
                <div className="mt-6 flex items-center gap-4 pt-4 border-t border-border">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan to-blue">
                    <span className="text-sm font-bold text-white">
                      {testimonial.author.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-navy">{testimonial.author}</p>
                    {testimonial.title && (
                      <p className="text-xs text-slate">{testimonial.title}</p>
                    )}
                    <p className="text-xs text-cyan">{testimonial.company}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
