'use client';

import { useState } from 'react';
import { LANGUAGE_GROUPS, LanguageGroup } from '../data/languages';

interface SidePanelProps {
  language: LanguageGroup | null;
  onClose: () => void;
}

const MAX_SPEAKERS = Math.max(...LANGUAGE_GROUPS.map(l => l.speakers));

const FAMILY_COLORS: Record<string, string> = {
  'Austronesian': 'text-cyan-400 bg-cyan-900/30 border-cyan-700',
  'Trans-New Guinea': 'text-amber-400 bg-amber-900/30 border-amber-700',
  'Papuan': 'text-violet-400 bg-violet-900/30 border-violet-700',
  'Creole': 'text-gray-200 bg-gray-800/40 border-gray-600',
};

const FAMILY_BAR_COLORS: Record<string, string> = {
  'Austronesian': '#06b6d4',
  'Trans-New Guinea': '#f59e0b',
  'Papuan': '#a78bfa',
  'Creole': '#e5e7eb',
};

const CROP_EMOJI: Record<string, string> = {
  'coconut': '🥥',
  'coffee': '☕',
  'cocoa': '🍫',
  'vanilla': '🌿',
  'betel nut': '🌰',
  'sweet potato': '🍠',
  'taro': '🌱',
  'sago': '🌾',
  'pyrethrum': '🌼',
  'fish': '🐟',
  'yam': '🍠',
  'pigs': '🐷',
  'vegetables': '🥦',
  'tea': '🍵',
};

export default function SidePanel({ language, onClose }: SidePanelProps) {
  const [copied, setCopied] = useState(false);

  const formatSpeakers = (n: number) => {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
    return n.toString();
  };

  const speakerBarWidth = language ? Math.max(4, (language.speakers / MAX_SPEAKERS) * 100) : 0;
  const barColor = language ? (FAMILY_BAR_COLORS[language.family] || '#4ade80') : '#4ade80';

  const handleShare = () => {
    if (!language) return;
    const url = new URL(window.location.origin);
    url.searchParams.set('lang', language.id);
    navigator.clipboard.writeText(url.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      className="slide-panel fixed top-0 right-0 h-full w-full sm:w-[380px] bg-cora-dark/98 backdrop-blur-md border-l border-forest-800 z-50 overflow-y-auto shadow-2xl"
      style={{ transform: language ? 'translateX(0)' : 'translateX(100%)' }}
    >
      {language && (
        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-5">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white mb-1 leading-tight">{language.name}</h2>
              {language.isoCode && (
                <span className="text-[10px] font-mono text-forest-500 uppercase tracking-[0.2em]">
                  ISO 639-3: {language.isoCode}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="ml-3 p-1.5 text-forest-500 hover:text-white hover:bg-forest-800 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* CORA Badge */}
          {language.cora && (
            <div className="mb-4 p-3 bg-green-900/40 border border-green-600/60 rounded-xl flex items-center gap-3">
              <span className="text-xl">🍃</span>
              <div>
                <p className="text-green-400 font-semibold text-xs">CORA is Active in This Region</p>
                <p className="text-green-300/60 text-[10px] mt-0.5">Biochar soil health + carbon income for smallholder farmers</p>
              </div>
            </div>
          )}

          {/* Language Family */}
          <div className={`mb-4 px-2.5 py-1.5 rounded-lg border text-[10px] font-semibold uppercase tracking-wider inline-block ${FAMILY_COLORS[language.family] || 'text-forest-400 bg-forest-900/30 border-forest-700'}`}>
            {language.family}
          </div>

          {/* Speaker Count with Bar */}
          <div className="mb-4 bg-forest-900/40 rounded-xl p-4 border border-forest-800">
            <div className="flex items-baseline justify-between mb-2">
              <p className="text-forest-500 text-[10px] uppercase tracking-wider">Speakers</p>
              <p className="text-white text-lg font-bold tabular-nums">{formatSpeakers(language.speakers)}</p>
            </div>
            <div className="w-full h-2 bg-forest-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${speakerBarWidth}%`,
                  backgroundColor: barColor,
                  boxShadow: `0 0 8px ${barColor}60`,
                }}
              />
            </div>
            <p className="text-forest-600 text-[9px] mt-1.5">Relative to largest group ({formatSpeakers(MAX_SPEAKERS)})</p>
          </div>

          {/* Province + Region */}
          <div className="mb-4 bg-forest-900/40 rounded-xl p-4 border border-forest-800">
            <p className="text-forest-500 text-[10px] uppercase tracking-wider mb-1">Province</p>
            <p className="text-white text-sm font-semibold">{language.province}</p>
          </div>

          {/* Crops */}
          <div className="mb-4">
            <h3 className="text-forest-500 text-[10px] uppercase tracking-wider font-semibold mb-2">Primary Crops & Livelihoods</h3>
            <div className="flex flex-wrap gap-1.5">
              {language.crops.map(crop => (
                <span
                  key={crop}
                  className="flex items-center gap-1 px-2.5 py-1 bg-forest-900/50 border border-forest-700/60 rounded-full text-xs text-forest-200"
                >
                  <span className="text-sm">{CROP_EMOJI[crop] || '🌿'}</span>
                  <span className="capitalize">{crop}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Cultural Fact */}
          <div className="mb-4 p-3.5 bg-forest-900/30 border border-forest-800 rounded-xl">
            <h3 className="text-cora-accent text-[10px] uppercase tracking-wider font-semibold mb-2 flex items-center gap-1.5">
              Cultural Insight
            </h3>
            <p className="text-forest-300 text-xs leading-relaxed">{language.culturalFact}</p>
          </div>

          {/* External Links */}
          <div className="mb-4">
            <h3 className="text-forest-500 text-[10px] uppercase tracking-wider font-semibold mb-2">Resources</h3>
            <div className="flex flex-col gap-1.5">
              {language.isoCode && (
                <a
                  href={`https://www.ethnologue.com/language/${language.isoCode}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-3 py-2 bg-forest-900/40 border border-forest-800 rounded-lg text-xs text-forest-300 hover:text-white hover:border-forest-600 transition-colors group"
                >
                  <span>Ethnologue</span>
                  <svg className="w-3 h-3 text-forest-600 group-hover:text-forest-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
              {language.isoCode && (
                <a
                  href={`https://www.sil.org/resources/search/language/${language.isoCode}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-3 py-2 bg-forest-900/40 border border-forest-800 rounded-lg text-xs text-forest-300 hover:text-white hover:border-forest-600 transition-colors group"
                >
                  <span>SIL International</span>
                  <svg className="w-3 h-3 text-forest-600 group-hover:text-forest-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Share */}
          <button
            onClick={handleShare}
            className={`w-full py-2.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 text-xs ${
              copied
                ? 'bg-green-700 text-white'
                : 'bg-forest-700/80 hover:bg-forest-600 text-white'
            }`}
          >
            {copied ? (
              <>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Link copied!
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share this language
              </>
            )}
          </button>

          {/* CORA CTA for non-CORA regions */}
          {!language.cora && (
            <div className="mt-3 p-3 bg-green-900/15 border border-green-800/30 rounded-xl text-center">
              <p className="text-green-400/60 text-[10px]">
                CORA is expanding across PNG.{' '}
                <a href="https://coraprojects.com" target="_blank" rel="noopener noreferrer" className="text-green-400 underline hover:text-green-300">
                  Learn more
                </a>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
