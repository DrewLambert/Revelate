import CustomBooking from '@/components/CustomBooking';

export const metadata = {
  title: 'Book a Discovery Call | Revelate Operations',
  description: 'Schedule a discovery call with Drew Lambert to discuss your Salesforce challenges and see if modernizing your existing org is the right move.',
};

export default function BookPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#1f264b] via-[#1b2142] to-[#131937]">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* Gradient Orbs */}
        {/* Signature Magenta Gradient - Top Center */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[580px] w-[580px] rounded-full bg-magenta/14 blur-[70px]" />

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_80%)]" />

        {/* Noise Texture */}
        <div className="absolute inset-0 opacity-[0.005] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#11152d] via-transparent to-transparent" />
      </div>

      {/* Hero Section */}
      <section className="relative py-16 sm:py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-navy/30 to-[#151b38]/80" />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2 text-sm font-medium text-cyan shadow-[0_10px_40px_rgba(0,0,0,0.35)] mb-6 backdrop-blur">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Free 15-Minute Consultation
            </span>

            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl mb-6 font-heading">
              Let&apos;s Fix What&apos;s Breaking
            </h1>

            <p className="text-lg leading-8 text-white/80 sm:text-xl max-w-3xl mx-auto">
              No pressure, no sales pitch—just an honest conversation about your Salesforce challenges and whether modernizing your existing org is the right move.
            </p>
          </div>

          <div className="relative mt-14 sm:mt-16 rounded-2xl border border-white/10 bg-white/[0.04] p-6 sm:p-8 backdrop-blur">
            <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_top_right,rgba(0,217,255,0.18)_0%,transparent_65%)]" />
            <div className="relative grid gap-5 sm:grid-cols-3">
              <div className="rounded-xl border border-white/15 bg-white/[0.06] px-5 py-6 text-left shadow-[0_18px_36px_rgba(18,24,46,0.28)]">
                <p className="text-sm uppercase tracking-[0.2em] text-white/50 mb-2">Experience</p>
                <p className="text-3xl font-semibold text-white mb-1">45+</p>
                <p className="text-sm text-white/70">Salesforce orgs stabilized and scaled.</p>
              </div>
              <div className="rounded-xl border border-white/15 bg-white/[0.06] px-5 py-6 text-left shadow-[0_18px_36px_rgba(18,24,46,0.28)]">
                <p className="text-sm uppercase tracking-[0.2em] text-white/50 mb-2">Response Time</p>
                <p className="text-3xl font-semibold text-white mb-1">24 hrs</p>
                <p className="text-sm text-white/70">Expect a follow-up recap within one business day.</p>
              </div>
              <div className="rounded-xl border border-white/15 bg-white/[0.06] px-5 py-6 text-left shadow-[0_18px_36px_rgba(18,24,46,0.28)]">
                <p className="text-sm uppercase tracking-[0.2em] text-white/50 mb-2">Partnerships</p>
                <p className="text-3xl font-semibold text-white mb-1">93%</p>
                <p className="text-sm text-white/70">Of discovery calls lead to long-term retainers.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Booking Section */}
      <section className="relative py-20 sm:py-28 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-[#131937]/90 via-transparent to-[#11152d]" />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid items-start gap-12 lg:gap-14 lg:grid-cols-2">
            {/* Left Column - Info Cards */}
            <div className="space-y-7">
              {/* Session Flow */}
              <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.05] p-8 backdrop-blur-md shadow-[0_16px_44px_rgba(15,20,44,0.32)]">
                <div className="pointer-events-none absolute inset-0 rounded-xl bg-[radial-gradient(circle_at_top_left,rgba(217,70,239,0.16)_0%,transparent_68%)]" />
                <div className="relative">
                  <div className="flex items-center justify-between gap-3 mb-6">
                    <h2 className="text-xl font-semibold text-white">How We Spend the 15 Minutes</h2>
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 text-xs uppercase text-white/60 tracking-wide">
                      <span className="inline-block h-2 w-2 rounded-full bg-cyan animate-pulse" />
                      Fast, Focused, Actionable
                    </span>
                  </div>
                  <ol className="space-y-5">
                    <li className="flex items-start gap-4">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-cyan/40 bg-cyan/10 text-sm font-semibold text-cyan">
                        01
                      </div>
                      <div>
                        <p className="font-medium text-white mb-1">Context Download</p>
                        <p className="text-sm text-white/70 leading-relaxed">You share where things are breaking and what success should look like.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-magenta/40 bg-magenta/10 text-sm font-semibold text-magenta">
                        02
                      </div>
                      <div>
                        <p className="font-medium text-white mb-1">Quick Assessment</p>
                        <p className="text-sm text-white/70 leading-relaxed">I outline immediate wins and structural fixes based on similar scaling teams.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/5 text-sm font-semibold text-white">
                        03
                      </div>
                      <div>
                        <p className="font-medium text-white mb-1">Next-Step Playbook</p>
                        <p className="text-sm text-white/70 leading-relaxed">If we&apos;re aligned, you leave with a delivery plan, engagement model, and timeline.</p>
                      </div>
                    </li>
                  </ol>
                </div>
              </div>

              {/* What to Expect Card */}
              <div className="relative rounded-xl border border-white/10 bg-white/[0.05] p-8 backdrop-blur-md shadow-[0_14px_40px_rgba(16,22,48,0.32)]">
                <div className="pointer-events-none absolute inset-0 rounded-xl bg-[radial-gradient(circle_at_top_left,rgba(0,217,255,0.12)_0%,transparent_72%)]" />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                      <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-white">What to Expect</h2>
                  </div>

                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <span className="inline-flex h-1.5 w-1.5 rounded-full bg-cyan mt-2 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-white mb-1">15-Minute Consultation</p>
                        <p className="text-sm text-white/70 leading-relaxed">Quick but thorough discussion of your current challenges and goals</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="inline-flex h-1.5 w-1.5 rounded-full bg-cyan mt-2 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-white mb-1">No Sales Pressure</p>
                        <p className="text-sm text-white/70 leading-relaxed">Honest assessment of whether I can help. If we&apos;re not a fit, I&apos;ll tell you upfront</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="inline-flex h-1.5 w-1.5 rounded-full bg-cyan mt-2 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-white mb-1">Clear Next Steps</p>
                        <p className="text-sm text-white/70 leading-relaxed">If we decide to work together, I&apos;ll outline recommended approach and pricing</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Come Prepared Card */}
              <div className="relative rounded-xl border border-white/10 bg-white/[0.05] p-8 backdrop-blur-md shadow-[0_14px_40px_rgba(16,22,48,0.32)]">
                <div className="pointer-events-none absolute inset-0 rounded-xl bg-[radial-gradient(circle_at_top_left,rgba(0,217,255,0.12)_0%,transparent_72%)]" />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan/15">
                      <svg className="h-5 w-5 text-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-white">Come Prepared</h2>
                  </div>

                  <p className="text-sm text-white/70 mb-5 leading-relaxed">
                    To make the most of our time together, it&apos;s helpful if you can briefly describe:
                  </p>

                  <ul className="space-y-3 text-sm text-white/80">
                    <li className="flex items-start gap-3">
                      <span className="text-cyan flex-shrink-0 mt-0.5">→</span>
                      <span className="leading-relaxed">Your current Salesforce challenges (what&apos;s breaking as you scale?)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-cyan flex-shrink-0 mt-0.5">→</span>
                      <span className="leading-relaxed">What vendors or consultants have recommended (if applicable)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-cyan flex-shrink-0 mt-0.5">→</span>
                      <span className="leading-relaxed">Your current tech stack and integrations</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-cyan flex-shrink-0 mt-0.5">→</span>
                      <span className="leading-relaxed">Timeline and budget constraints</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Note Card */}
              <div className="relative rounded-xl border border-cyan/25 bg-cyan/[0.12] p-6 backdrop-blur-md shadow-[0_12px_32px_rgba(12,62,92,0.25)]">
                <div className="flex items-start gap-3">
                  <svg className="h-5 w-5 text-cyan flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-white/80 leading-relaxed">
                    <strong className="text-white">Note:</strong> I manage 2-3 active projects at a time to ensure quality and deep focus. If my calendar is full, I&apos;ll recommend other qualified Salesforce consultants.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Booking Widget */}
            <div className="lg:sticky lg:top-24">
              <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-white/[0.12] p-0 shadow-[0_22px_70px_rgba(12,18,40,0.4)] backdrop-blur-xl">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,217,255,0.16)_0%,transparent_68%)]" />
                <div className="relative p-6 sm:p-8">
                  <CustomBooking />
                </div>
              </div>
              <p className="text-center text-white/60 text-sm mt-4">
                All times shown in your local timezone
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Alternative Contact Section */}
      <section className="relative py-20 sm:py-24 border-t border-white/10">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.08] mb-6 shadow-[0_12px_34px_rgba(14,20,42,0.32)]">
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          <h3 className="text-2xl font-semibold text-white mb-4">
            Prefer Email?
          </h3>

          <p className="text-white/70 mb-6 leading-relaxed">
            Not ready to schedule a call yet? Have questions first? Send me an email and I&apos;ll get back to you within 24 hours.
          </p>

          <a
            href="mailto:drew@revelateops.com"
            className="inline-flex items-center gap-2 rounded-xl border-2 border-white/15 bg-white/[0.06] px-8 py-4 text-base font-semibold text-white transition-all duration-200 hover:bg-white/12 hover:border-white/30 hover:shadow-[0_18px_40px_rgba(0,217,255,0.3)]"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            drew@revelateops.com
          </a>
        </div>
      </section>
    </div>
  );
}
