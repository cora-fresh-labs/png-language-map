'use client';

import { useState } from 'react';

export default function CTABanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-r from-green-900/95 to-forest-900/95 backdrop-blur-sm border-t border-green-700/40">
      <div className="flex items-center justify-between px-4 py-2.5 max-w-7xl mx-auto gap-3">
        <p className="text-xs text-green-200/90 flex-1 leading-relaxed">
          <span className="mr-1.5">🍃</span>
          <strong className="text-green-400">CORA</strong> works with smallholder farmers across PNG. Learn how biochar improves soil health and generates carbon income.
        </p>
        <a
          href="https://coraprojects.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 px-4 py-1.5 bg-green-600 hover:bg-green-500 text-white text-xs font-semibold rounded-lg transition-colors"
        >
          Learn More
        </a>
        <button
          onClick={() => setDismissed(true)}
          className="p-1 text-green-400/50 hover:text-green-200 transition-colors flex-shrink-0"
          aria-label="Dismiss"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
