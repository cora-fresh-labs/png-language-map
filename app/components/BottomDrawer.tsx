'use client';

import { useEffect, useState } from 'react';
import { LanguageGroup, LANGUAGE_GROUPS } from '../data/languages';
import { PinCategory, MedicinePin, FoodPin } from '../data/pins';

// Union type for any drawer content
export type DrawerItem =
  | { type: 'language'; data: LanguageGroup }
  | { type: 'medicine'; data: MedicinePin }
  | { type: 'food'; data: FoodPin };

interface BottomDrawerProps {
  item: DrawerItem | null;
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

const CATEGORY_THEME: Record<PinCategory, { badge: string; accent: string; icon: string }> = {
  language: { badge: 'bg-amber-50 text-amber-700', accent: 'text-amber-600', icon: '💬' },
  medicine: { badge: 'bg-emerald-50 text-emerald-700', accent: 'text-emerald-600', icon: '🌿' },
  food: { badge: 'bg-orange-50 text-orange-700', accent: 'text-orange-600', icon: '🍲' },
};

export default function BottomDrawer({ item, onClose, onOpenLeadForm }: BottomDrawerProps) {
  const [copied, setCopied] = useState(false);
  const isOpen = !!item;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape' && isOpen) onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleShare = () => {
    if (!item) return;
    const url = new URL(window.location.origin);
    url.searchParams.set('lang', item.data.id);
    navigator.clipboard.writeText(url.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <>
      {isOpen && <div className="drawer-backdrop fixed inset-0 bg-black/20 z-40" onClick={onClose} />}

      <div
        className="drawer-sheet fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-drawer safe-bottom"
        style={{ maxHeight: '85vh', transform: isOpen ? 'translateY(0)' : 'translateY(100%)' }}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-surface-200" />
        </div>

        {item && (
          <div className="overflow-y-auto px-5 pb-6" style={{ maxHeight: 'calc(85vh - 20px)' }}>

            {/* ── Render by type ── */}
            {item.type === 'language' && <LanguageContent data={item.data} />}
            {item.type === 'medicine' && <MedicineContent data={item.data} />}
            {item.type === 'food' && <FoodContent data={item.data} />}

            {/* ── Wisdom Section (Tumbuna Story) ── */}
            <WisdomSection item={item} />

            {/* ── Species of Significance ── */}
            {(item.type === 'medicine' || item.type === 'food') && item.data.speciesIcon && (
              <div className="mb-5 flex items-center gap-3 p-3.5 bg-stone-50 border border-stone-100 rounded-2xl">
                <div className="w-12 h-12 bg-stone-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                  {item.data.speciesIcon}
                </div>
                <div>
                  <p className="text-stone-400 text-[10px] uppercase tracking-wider font-medium">Species of Significance</p>
                  <p className="text-stone-700 text-sm font-medium">
                    {item.type === 'medicine' ? (item.data as MedicinePin).plantName : item.data.name}
                  </p>
                </div>
              </div>
            )}

            {/* ── Image Gallery Placeholder ── */}
            {(item.type === 'medicine' || item.type === 'food') && (
              <div className="mb-5">
                <p className="text-surface-400 text-[11px] uppercase tracking-wider font-medium mb-2 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                  </svg>
                  Gallery
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="aspect-square bg-surface-100 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-surface-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                      </svg>
                    </div>
                  ))}
                </div>
                <p className="text-surface-300 text-[10px] text-center mt-1.5 italic">Community photos coming soon</p>
              </div>
            )}

            {/* ── CTA ── */}
            <button
              onClick={onOpenLeadForm}
              className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white rounded-2xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {item.type === 'language'
                ? 'Is this your home? Connect with us'
                : `Share your ${item.type === 'medicine' ? 'healing' : 'food'} knowledge`
              }
            </button>

            {/* Share */}
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
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  Link copied!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                  Share this
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </>
  );
}

/* ── Language Sub-content ── */
function LanguageContent({ data }: { data: LanguageGroup }) {
  const fam = FAMILY_COLORS[data.family] || FAMILY_COLORS['Creole'];
  const speakerPct = Math.max(4, (data.speakers / MAX_SPEAKERS) * 100);

  const formatSpeakers = (n: number) => {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
    return n.toString();
  };

  return (
    <>
      {/* Header */}
      <div className="pt-2 mb-1">
        <h2 className="text-2xl font-bold text-surface-900 leading-tight">{data.name}</h2>
        {data.isoCode && <p className="text-surface-400 text-xs mt-0.5 font-mono">{data.isoCode.toUpperCase()}</p>}
      </div>
      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold mb-4 ${fam.bg} ${fam.text}`}>{data.family}</span>

      {data.cora && (
        <div className="mb-4 p-3.5 bg-brand-50 border border-brand-200 rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center text-lg flex-shrink-0">🌱</div>
          <div>
            <p className="text-brand-800 font-semibold text-sm">CORA is Active Here</p>
            <p className="text-brand-600 text-xs">Biochar soil health & carbon income programs</p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-surface-50 rounded-2xl p-3.5">
          <p className="text-surface-400 text-[11px] uppercase tracking-wider font-medium mb-1">Population</p>
          <p className="text-surface-900 text-xl font-bold">{formatSpeakers(data.speakers)}+</p>
          <div className="w-full h-1.5 bg-surface-200 rounded-full mt-2 overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${speakerPct}%`, backgroundColor: fam.dot }} />
          </div>
          <p className="text-surface-300 text-[10px] mt-1">speakers</p>
        </div>
        <div className="bg-surface-50 rounded-2xl p-3.5">
          <p className="text-surface-400 text-[11px] uppercase tracking-wider font-medium mb-1">Province</p>
          <p className="text-surface-900 text-base font-semibold leading-snug mt-1">{data.province}</p>
        </div>
      </div>

      {data.dialects && data.dialects.length > 0 && (
        <div className="mb-5">
          <p className="text-surface-400 text-[11px] uppercase tracking-wider font-medium mb-2">Key Dialects</p>
          <div className="flex flex-wrap gap-1.5">
            {data.dialects.map(d => <span key={d} className="px-2.5 py-1 bg-surface-100 text-surface-600 text-xs rounded-full">{d}</span>)}
          </div>
        </div>
      )}

      {/* Crops */}
      <div className="mb-5">
        <p className="text-surface-400 text-[11px] uppercase tracking-wider font-medium mb-2">Crops & Livelihoods</p>
        <div className="flex flex-wrap gap-1.5">
          {data.crops.map(crop => (
            <span key={crop} className="flex items-center gap-1 px-2.5 py-1.5 bg-surface-50 border border-surface-100 rounded-full text-xs text-surface-700">
              <span>{CROP_EMOJI[crop] || '🌿'}</span>
              <span className="capitalize">{crop}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Cultural Fact */}
      <div className="mb-5 p-4 bg-surface-50 rounded-2xl">
        <p className="text-surface-400 text-[11px] uppercase tracking-wider font-medium mb-2 flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          Cultural Fact
        </p>
        <p className="text-surface-600 text-sm leading-relaxed">{data.culturalFact}</p>
      </div>
    </>
  );
}

/* ── Medicine Sub-content ── */
function MedicineContent({ data }: { data: MedicinePin }) {
  return (
    <>
      <div className="pt-2 mb-1">
        <h2 className="text-2xl font-bold text-surface-900 leading-tight">{data.name}</h2>
        <p className="text-emerald-600 text-xs font-medium mt-0.5 italic">{data.plantName}</p>
      </div>
      <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold mb-4 bg-emerald-50 text-emerald-700">Traditional Medicine</span>

      <p className="text-surface-600 text-sm leading-relaxed mb-5">{data.description}</p>

      {/* Local Names */}
      {data.localNames.length > 0 && (
        <div className="mb-5">
          <p className="text-surface-400 text-[11px] uppercase tracking-wider font-medium mb-2">Local Names</p>
          <div className="flex flex-wrap gap-1.5">
            {data.localNames.map(n => <span key={n} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-full">{n}</span>)}
          </div>
        </div>
      )}

      {/* Uses */}
      <div className="mb-5">
        <p className="text-surface-400 text-[11px] uppercase tracking-wider font-medium mb-2 flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          Traditional Uses
        </p>
        <div className="flex flex-wrap gap-1.5">
          {data.uses.map(u => (
            <span key={u} className="flex items-center gap-1 px-2.5 py-1.5 bg-surface-50 border border-surface-100 rounded-full text-xs text-surface-700">
              <span className="text-emerald-500">+</span> {u}
            </span>
          ))}
        </div>
      </div>

      {/* Preparation */}
      {data.preparation && (
        <div className="mb-5 p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl">
          <p className="text-emerald-700 text-[11px] uppercase tracking-wider font-medium mb-2 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" /></svg>
            How It&apos;s Prepared
          </p>
          <p className="text-emerald-800 text-sm leading-relaxed">{data.preparation}</p>
        </div>
      )}
    </>
  );
}

/* ── Food Sub-content ── */
function FoodContent({ data }: { data: FoodPin }) {
  return (
    <>
      <div className="pt-2 mb-1">
        <h2 className="text-2xl font-bold text-surface-900 leading-tight">{data.name}</h2>
        <p className="text-orange-600 text-xs font-medium mt-0.5">{data.province}</p>
      </div>
      <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold mb-4 bg-orange-50 text-orange-700">Traditional Food</span>

      <p className="text-surface-600 text-sm leading-relaxed mb-5">{data.description}</p>

      {/* Ingredients */}
      {data.ingredients && data.ingredients.length > 0 && (
        <div className="mb-5">
          <p className="text-surface-400 text-[11px] uppercase tracking-wider font-medium mb-2 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" /></svg>
            Ingredients
          </p>
          <div className="flex flex-wrap gap-1.5">
            {data.ingredients.map(ing => (
              <span key={ing} className="px-2.5 py-1.5 bg-orange-50 border border-orange-100 text-orange-700 text-xs rounded-full">{ing}</span>
            ))}
          </div>
        </div>
      )}

      {/* Method */}
      {data.method && (
        <div className="mb-5 p-4 bg-orange-50/50 border border-orange-100 rounded-2xl">
          <p className="text-orange-700 text-[11px] uppercase tracking-wider font-medium mb-2 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" /></svg>
            Cooking Method
          </p>
          <p className="text-orange-800 text-sm leading-relaxed">{data.method}</p>
        </div>
      )}

      {/* Season */}
      {data.season && (
        <div className="mb-5 flex items-center gap-3 p-3.5 bg-surface-50 rounded-2xl">
          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-lg flex-shrink-0">🗓️</div>
          <div>
            <p className="text-surface-400 text-[10px] uppercase tracking-wider font-medium">Season</p>
            <p className="text-surface-700 text-sm">{data.season}</p>
          </div>
        </div>
      )}
    </>
  );
}

/* ── Wisdom / Tumbuna Section ── */
function WisdomSection({ item }: { item: DrawerItem }) {
  const tumbuna = item.type === 'language'
    ? (item.data.storyTitle ? { title: item.data.storyTitle, excerpt: item.data.storyExcerpt! } : null)
    : (item.data as MedicinePin | FoodPin).tumbuna || null;

  return (
    <div className="mb-5 p-4 bg-amber-50/60 border border-amber-100 rounded-2xl">
      <div className="flex items-center gap-2 mb-2">
        <svg className="w-4 h-4 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
        </svg>
        <p className="text-amber-800 text-[11px] uppercase tracking-wider font-semibold">Tumbuna Story Vault</p>
      </div>
      {tumbuna ? (
        <>
          <p className="text-amber-900 font-semibold text-sm mb-1">{tumbuna.title}</p>
          <p className="text-amber-700 text-sm leading-relaxed italic">&ldquo;{tumbuna.excerpt}&rdquo;</p>
        </>
      ) : (
        <p className="text-amber-600 text-sm italic">No stories collected yet. Be the first to share your family&apos;s Tumbuna wisdom.</p>
      )}
    </div>
  );
}
