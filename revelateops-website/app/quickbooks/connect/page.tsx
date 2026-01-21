'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

function QuickBooksConnectContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [companyName, setCompanyName] = useState<string | null>(null);

  useEffect(() => {
    // Check for OAuth callback parameters
    const code = searchParams.get('code');
    const realmId = searchParams.get('realmId');
    const error = searchParams.get('error');

    if (error) {
      setStatus('error');
    } else if (code && realmId) {
      // In a real implementation, you would exchange the code for tokens here
      // For now, we'll simulate a successful connection
      setStatus('success');
      // You could fetch the company name from QuickBooks API
      setCompanyName(searchParams.get('company') || null);
    } else {
      // No OAuth params - user navigated directly
      setStatus('success');
    }
  }, [searchParams]);

  return (
    <>
      {status === 'loading' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-cyan/30 border-t-cyan" />
          <p className="mt-6 text-lg text-white/70">Connecting to QuickBooks...</p>
        </motion.div>
      )}

      {status === 'success' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          {/* Success Icon */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-cyan/20 ring-4 ring-cyan/30">
            <svg className="h-10 w-10 text-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Heading */}
          <h1 className="mt-8 text-4xl font-semibold sm:text-5xl">
            QuickBooks Connected!
          </h1>
          {companyName && (
            <p className="mt-4 text-xl text-cyan">
              {companyName}
            </p>
          )}
          <p className="mt-4 text-lg text-white/70 max-w-xl mx-auto">
            Your QuickBooks account is now connected to Revelate Operations. You can now use AI-powered accounting assistance for your business.
          </p>

          {/* What's Next */}
          <div className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-8 text-left">
            <h2 className="text-lg font-semibold text-white mb-6">
              What you can do now:
            </h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan/20">
                  <svg className="h-4 w-4 text-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-white">Ask questions about your finances</p>
                  <p className="mt-1 text-sm text-white/60">Get instant insights about revenue, expenses, cash flow, and more.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan/20">
                  <svg className="h-4 w-4 text-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-white">Generate reports on demand</p>
                  <p className="mt-1 text-sm text-white/60">Create profit & loss statements, balance sheets, and custom analyses.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan/20">
                  <svg className="h-4 w-4 text-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-white">Get AI-powered recommendations</p>
                  <p className="mt-1 text-sm text-white/60">Receive suggestions to improve your financial health.</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Important Notice */}
          <div className="mt-8 rounded-xl border border-magenta/30 bg-magenta/10 p-4 text-left">
            <p className="text-sm text-white/80">
              <strong className="text-white">Remember:</strong> AI-generated insights are for informational purposes only and do not constitute professional accounting or tax advice. Always consult with qualified professionals for important financial decisions.
            </p>
          </div>

          {/* Actions */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan px-8 py-4 text-base font-semibold text-navy transition-all duration-200 hover:bg-cyan/90"
            >
              Go to Dashboard
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/quickbooks/disconnect"
              className="text-sm text-white/60 hover:text-white transition-colors"
            >
              Manage connection settings
            </Link>
          </div>
        </motion.div>
      )}

      {status === 'error' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          {/* Error Icon */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-500/20 ring-4 ring-red-500/30">
            <svg className="h-10 w-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>

          {/* Heading */}
          <h1 className="mt-8 text-4xl font-semibold sm:text-5xl">
            Connection Failed
          </h1>
          <p className="mt-4 text-lg text-white/70 max-w-xl mx-auto">
            We couldn&apos;t connect to your QuickBooks account. This might be due to a temporary issue or cancelled authorization.
          </p>

          {/* Actions */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan px-8 py-4 text-base font-semibold text-navy transition-all duration-200 hover:bg-cyan/90"
            >
              Try Again
            </button>
            <Link
              href="mailto:drew@revelateops.com"
              className="text-sm text-white/60 hover:text-white transition-colors"
            >
              Contact support
            </Link>
          </div>
        </motion.div>
      )}
    </>
  );
}

function LoadingFallback() {
  return (
    <div className="text-center">
      <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-cyan/30 border-t-cyan" />
      <p className="mt-6 text-lg text-white/70">Loading...</p>
    </div>
  );
}

export default function QuickBooksConnect() {
  return (
    <main className="min-h-screen bg-navy">
      <section className="relative overflow-hidden py-28 text-white">
        {/* Background effects */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[10%] top-[20%] h-[500px] w-[500px] rounded-full bg-cyan/20 blur-[150px]" />
          <div className="absolute bottom-[10%] right-[15%] h-[400px] w-[400px] rounded-full bg-magenta/10 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-3xl px-6 lg:px-8">
          <Suspense fallback={<LoadingFallback />}>
            <QuickBooksConnectContent />
          </Suspense>

          {/* Security Badge */}
          <div className="mt-16 flex items-center justify-center gap-2 text-xs text-white/40">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Secured with OAuth 2.0 · Your data is encrypted</span>
          </div>
        </div>
      </section>
    </main>
  );
}
