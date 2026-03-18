'use client';

import { useEffect, useRef, useState } from 'react';
import { LanguageGroup, LANGUAGE_GROUPS } from '../data/languages';

interface BottomDrawerProps {
  language: LanguageGroup | null;
  onClose: () => void;
  onOpenLeadForm: () => void;
}

const MAX_SPEAKERS = Math.max(...LANGUAGE_GROUPS.map(l => l.speakers));

const FAMILY_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  'Austronesian': { bg: 'bg-cyan-50', text: 'text-cyan-700', dot: '#0891b2' },
  'Trans-New Guinea': { bg: 'bg-amber-50', text: 'text-amber-700', dot: '#d97706' },
  'Papuan': { bg: 'bg-violet-50', text: 'text-violet-700', dot: '#7c3aed' },
  'Creole': { bg: 'bg-gray-100', text: 'text-gray-600', dot: '#6b7280' },
};

const CROP_EMOJI: Record<string, string> = {
  'coconut': '🥥', 'coffee': '☕', 'cocoa': '🍫', 'vanilla': '🌿',
  'betel nut': '🌰', 'sweet potato': '🍠', 'taro': '🌱', 'sago': '🌾',
  'pyrethrum': '🌼', 'fish': '🐟', 'yam': '🍠', 'pigs': '🐷',
  'vegetables': '🥦', 'tea': '🍵',
};

export default function BottomDrawer({ language, onClose, onOpenLeadForm }: BottomDrawerProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const isOpen = !!language;

  // Close on escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const formatSpeakers = (n: number) => {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
    return n.toString();
  };

  const handleShare = () => {
    if (!language) return;
    const url = new URL(window.location.origin);
    url.searchParams.set('lang', language.id);
    navigator.clipboard.writeText(url.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const fam = language ? FAMILY_COLORS[language.family] || FAMILY_COLORS['Creole'] : FAMILY_COLORS['Creole'];
  const speakerPct = language ? Math.max(4, (language.speakers / MAX_SPEAKERS) * 100) : 0;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="drawer-backdrop fixed inset-0 bg-black/20 z-40"
          onClick={onClose}
        />
      )}

      {/* Drawer sheet */}
      <div
        ref={sheetRef}
        className="drawer-sheet fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-drawer safe-bottom"
        style={{
          maxHeight: '82vh',
          transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
        }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-surface-200" />
        </div>

        {language && (
          <div className="overflow-y-auto px-5 pb-6" style={{ maxHeight: 'calc(82vh - 20px)' }}>

            {/* ── Header ── */}
            <div className="flex items-start justify-between mb-1 pt-2">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-surface-900 leading-tight">{language.name}</h2>
                {language.isoCode && (
                  <p className="text-surface-400 text-xs mt-0.5 font-mono">{language.isoCode.toUpperCase()}</p>
                )}
              </div>
              <button
                onClick={onClose}
                className="ml-3 p-2 -mr-2 text-surface-300 hover:text-surface-600 rounded-full hover:bg-surface-50 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Family badge */}
            <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold mb-4 ${fam.bg} ${fam.text}`}>
              {language.family}
            </span>

            {/* CORA badge */}
            {language.cora && (
              <div className="mb-4 p-3.5 bg-brand-50 border border-brand-200 rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-brand-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <p className="text-brand-800 font-semibold text-sm">CORA is Active Here</p>
                  <p className="text-brand-600 text-xs">Supporting farmers with biochar & carbon income</p>
                </div>
              </div>
            )}

            {/* ── Quick Stats ── */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-surface-50 rounded-2xl p-3.5">
                <p className="text-surface-400 text-[11px] uppercase tracking-wider font-medium mb-1">Population</p>
                <p className="text-surface-900 text-xl font-bold">{formatSpeakers(language.speakers)}+</p>
                <div className="w-full h-1.5 bg-surface-200 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${speakerPct}%`, backgroundColor: fam.dot }}
                  />
                </div>
                <p className="text-surface-300 text-[10px] mt-1">speakers</p>
              </div>
              <div className="bg-surface-50 rounded-2xl p-3.5">
                <p className="text-surface-400 text-[11px] uppercase tracking-wider font-medium mb-1">Province</p>
                <p className="text-surface-900 text-base font-semibold leading-snug mt-1">{language.province}</p>
              </div>
            </div>

            {/* ── Dialects ── */}
            {language.dialects && language.dialects.length > 0 && (
              <div className="mb-5">
                <p className="text-surface-400 text-[11px] uppercase tracking-wider font-medium mb-2">Key Dialects</p>
                <div className="flex flex-wrap gap-1.5">
                  {language.dialects.map(d => (
                    <span key={d} className="px-2.5 py-1 bg-surface-100 text-surface-600 text-xs rounded-full">{d}</span>
                  ))}
                </div>
              </div>
            )}

            {/* ── Crops ── */}
            <div className="mb-5">
              <p className="text-surface-400 text-[11px] uppercase tracking-wider font-medium mb-2">Crops & Livelihoods</p>
              <div className="flex flex-wrap gap-1.5">
                {language.crops.map(crop => (
                  <span
                    key={crop}
                    className="flex items-center gap-1 px-2.5 py-1.5 bg-surface-50 border border-surface-100 rounded-full text-xs text-surface-700"
                  >
                    <span>{CROP_EMOJI[crop] || '🌿'}</span>
                    <span className="capitalize">{crop}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* ── Cultural Fact ── */}
            <div className="mb-5 p-4 bg-surface-50 rounded-2xl">
              <p className="text-surface-400 text-[11px] uppercase tracking-wider font-medium mb-2 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Cultural Fact
              </p>
              <p className="text-surface-600 text-sm leading-relaxed">{language.culturalFact}</p>
            </div>

            {/* ── Story Vault ── */}
            <div className="mb-5 p-4 bg-amber-50/60 border border-amber-100 rounded-2xl">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <p className="text-amber-800 text-[11px] uppercase tracking-wider font-semibold">Story Vault</p>
              </div>
              {language.storyTitle ? (
                <>
                  <p className="text-amber-900 font-semibold text-sm mb-1">{language.storyTitle}</p>
                  <p className="text-amber-700 text-sm leading-relaxed italic">&ldquo;{language.storyExcerpt}&rdquo;</p>
                </>
              ) : (
                <p className="text-amber-600 text-sm italic">No stories collected yet for the {language.name} people. Be the first to share your family&apos;s Tumbuna story below.</p>
              )}
            </div>

            {/* ── Lead Capture CTA ── */}
            <button
              onClick={onOpenLeadForm}
              className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white rounded-2xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Is this your home? Connect with us
            </button>

            {/* Share link */}
            <button
              onClick={handleShare}
              className={`w-full mt-2.5 py-3 rounded-2xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                copied
                  ? 'bg-brand-50 text-brand-700 border border-brand-200'
                  : 'bg-surface-50 text-surface-500 hover:text-surface-700 border border-surface-200 hover:border-surface-300'
              }`}
            >
              {copied ? (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Link copied — share on Facebook or WhatsApp!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Share this language
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
