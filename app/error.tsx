"use client";

import Link from "next/link";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-6 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange">Error</p>
      <h1 className="mt-4 text-3xl font-bold text-navy">Something Went Wrong</h1>
      <p className="mt-3 max-w-sm text-text-grey">
        An unexpected error occurred. Please try again, or return to the homepage.
      </p>
      <div className="mt-8 flex gap-4">
        <button
          onClick={reset}
          className="inline-flex items-center justify-center rounded-full bg-orange px-6 py-3 text-sm font-semibold text-white hover:bg-orange-dark"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full border border-navy/20 px-6 py-3 text-sm font-semibold text-navy hover:bg-navy/5"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
