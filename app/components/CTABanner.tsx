'use client';

import { useState } from 'react';

export default function CTABanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-r from-green-900/95 to-forest-900/95 backdrop-blur-sm border-t border-green-700/50 shadow-2xl">
      <div className="flex items-center justify-between px-4 py-3 max-w-6xl mx-auto">
        <p className="text-sm text-green-200 flex-1">
          <span className="mr-2">🌱</span>
          <strong className="text-green-400">CORA</strong> works with smallholder farmers across PNG to improve soil health and generate carbon income.{' '}
          <a
            href="https://coraprojects.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-400 underline hover:text-white transition-colors"
          >
            Learn more at coraprojects.com
          </a>
        </p>
        <button
          onClick={() => setDismissed(true)}
          className="ml-4 p-1 text-green-400/60 hover:text-green-200 transition-colors flex-shrink-0"
          aria-label="Dismiss"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
