'use client';

import { useState } from 'react';
import { LANGUAGE_GROUPS } from '../data/languages';

const totalSpeakers = LANGUAGE_GROUPS.reduce((sum, l) => sum + l.speakers, 0);
const provincesCount = new Set(LANGUAGE_GROUPS.map(l => l.province)).size;
const coraCount = LANGUAGE_GROUPS.filter(l => l.cora).length;

const formatNumber = (n: number) => {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${Math.round(n / 1000)}K`;
  return n.toString();
};

export default function StatsPanel() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="absolute top-3 left-3 z-30">
      <button
        onClick={() => setExpanded(!expanded)}
        className="bg-cora-dark/85 backdrop-blur-sm border border-forest-800 rounded-xl px-3 py-2 hover:border-forest-600 transition-all group cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-cora-accent animate-pulse" />
            <span className="text-white font-semibold text-xs">800+</span>
            <span className="text-forest-500 text-[10px]">languages</span>
          </div>
          <svg
            className={`w-3 h-3 text-forest-500 transition-transform ${expanded ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {expanded && (
        <div className="mt-2 bg-cora-dark/90 backdrop-blur-sm border border-forest-800 rounded-xl p-3 shadow-xl min-w-[180px] animate-in">
          <div className="space-y-3">
            <div>
              <p className="text-forest-600 text-[9px] uppercase tracking-wider">Total Languages</p>
              <p className="text-white text-lg font-bold leading-tight">800+</p>
              <p className="text-forest-500 text-[9px]">{LANGUAGE_GROUPS.length} mapped here</p>
            </div>

            <div className="border-t border-forest-800 pt-3">
              <p className="text-forest-600 text-[9px] uppercase tracking-wider">Speakers Mapped</p>
              <p className="text-white text-lg font-bold leading-tight">{formatNumber(totalSpeakers)}</p>
            </div>

            <div className="border-t border-forest-800 pt-3">
              <p className="text-forest-600 text-[9px] uppercase tracking-wider">Provinces</p>
              <p className="text-white text-lg font-bold leading-tight">{provincesCount}</p>
              <p className="text-forest-500 text-[9px]">of 22 total</p>
            </div>

            <div className="border-t border-forest-800 pt-3">
              <p className="text-forest-600 text-[9px] uppercase tracking-wider">CORA Active</p>
              <div className="flex items-center gap-2">
                <p className="text-green-400 text-lg font-bold leading-tight">{coraCount}</p>
                <span className="text-green-500 text-sm">🍃</span>
              </div>
              <p className="text-forest-500 text-[9px]">communities with biochar programs</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
