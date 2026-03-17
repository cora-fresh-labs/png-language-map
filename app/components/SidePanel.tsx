'use client';

import { LanguageGroup } from '../data/languages';

interface SidePanelProps {
  language: LanguageGroup | null;
  onClose: () => void;
}

const FAMILY_COLORS: Record<string, string> = {
  'Austronesian': 'text-cyan-400 bg-cyan-900/30 border-cyan-700',
  'Trans-New Guinea': 'text-amber-400 bg-amber-900/30 border-amber-700',
  'Papuan': 'text-violet-400 bg-violet-900/30 border-violet-700',
  'Creole': 'text-orange-400 bg-orange-900/30 border-orange-700',
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
  const formatSpeakers = (n: number) => {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
    return n.toString();
  };

  return (
    <div
      className={`slide-panel fixed top-0 right-0 h-full w-full sm:w-96 bg-cora-dark border-l border-forest-800 z-50 overflow-y-auto shadow-2xl ${
        language ? 'open' : 'closed'
      }`}
      style={{ transform: language ? 'translateX(0)' : 'translateX(100%)' }}
    >
      {language && (
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-1">{language.name}</h2>
              {language.isoCode && (
                <span className="text-xs font-mono text-forest-400 uppercase tracking-widest">
                  ISO: {language.isoCode}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="ml-4 p-2 text-forest-400 hover:text-white hover:bg-forest-800 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* CORA Badge */}
          {language.cora && (
            <div className="mb-5 p-3 bg-green-900/50 border border-green-600 rounded-xl flex items-center gap-3">
              <span className="text-2xl">🌱</span>
              <div>
                <p className="text-green-400 font-semibold text-sm">CORA is Active Here</p>
                <p className="text-green-300/70 text-xs mt-0.5">Supporting smallholder farmers with soil health & carbon income</p>
              </div>
            </div>
          )}

          {/* Language Family */}
          <div className={`mb-4 px-3 py-2 rounded-lg border text-xs font-semibold uppercase tracking-wider inline-block ${FAMILY_COLORS[language.family] || 'text-forest-400 bg-forest-900/30 border-forest-700'}`}>
            {language.family}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-forest-900/40 rounded-xl p-4 border border-forest-800">
              <p className="text-forest-400 text-xs mb-1">Speakers</p>
              <p className="text-white text-2xl font-bold">{formatSpeakers(language.speakers)}</p>
            </div>
            <div className="bg-forest-900/40 rounded-xl p-4 border border-forest-800">
              <p className="text-forest-400 text-xs mb-1">Province</p>
              <p className="text-white text-sm font-semibold leading-tight mt-1">{language.province}</p>
            </div>
          </div>

          {/* Crops */}
          <div className="mb-6">
            <h3 className="text-forest-400 text-xs uppercase tracking-wider font-semibold mb-3">Primary Crops & Livelihoods</h3>
            <div className="flex flex-wrap gap-2">
              {language.crops.map(crop => (
                <span
                  key={crop}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-forest-900/50 border border-forest-700 rounded-full text-sm text-forest-200"
                >
                  <span>{CROP_EMOJI[crop] || '🌿'}</span>
                  <span className="capitalize">{crop}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Cultural Fact */}
          <div className="mb-6 p-4 bg-forest-900/30 border border-forest-800 rounded-xl">
            <h3 className="text-cora-accent text-xs uppercase tracking-wider font-semibold mb-2 flex items-center gap-2">
              <span>✨</span> Cultural Fact
            </h3>
            <p className="text-forest-200 text-sm leading-relaxed">{language.culturalFact}</p>
          </div>

          {/* Share */}
          <button
            onClick={() => {
              const url = new URL(window.location.href);
              url.searchParams.set('lang', language.id);
              navigator.clipboard.writeText(url.toString());
              alert('Link copied! Share on WhatsApp or Facebook 📱');
            }}
            className="w-full py-3 bg-forest-700 hover:bg-forest-600 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share this language
          </button>

          {/* CORA CTA for non-CORA regions */}
          {!language.cora && (
            <div className="mt-4 p-3 bg-green-900/20 border border-green-800/50 rounded-xl text-center">
              <p className="text-green-400/70 text-xs">
                CORA is expanding into new PNG regions. Learn more at{' '}
                <a href="https://coraprojects.com" target="_blank" rel="noopener noreferrer" className="text-green-400 underline">
                  coraprojects.com
                </a>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
