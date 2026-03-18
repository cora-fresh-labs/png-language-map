'use client';

import { useEffect, useState } from 'react';
import { LanguageGroup, LANGUAGE_GROUPS } from '../data/languages';
import { MedicinePin, FoodPin } from '../data/pins';
import { getProvinceById, REGION_COLORS } from '../data/provinces';
import { PROVINCE_INDEX, ProvinceData } from '../data/provinceIndex';

export type DrawerItem =
  | { type: 'language'; data: LanguageGroup }
  | { type: 'medicine'; data: MedicinePin }
  | { type: 'food'; data: FoodPin };

interface ProvincePanelProps {
  provinceId: string | null;
  selectedItem: DrawerItem | null;
  onClose: () => void;
  onSelectItem: (item: DrawerItem) => void;
  onBackToProvince: () => void;
  onOpenLeadForm: () => void;
  onContribute: () => void;
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

export default function ProvincePanel({
  provinceId,
  selectedItem,
  onClose,
  onSelectItem,
  onBackToProvince,
  onOpenLeadForm,
  onContribute,
}: ProvincePanelProps) {
  const [copied, setCopied] = useState(false);
  const isOpen = !!provinceId;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedItem) onBackToProvince();
        else if (isOpen) onClose();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, selectedItem, onClose, onBackToProvince]);

  // Lock body scroll on mobile when open
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isMobile = window.innerWidth < 640;
    document.body.style.overflow = (isOpen && isMobile) ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleShare = () => {
    const url = new URL(window.location.href);
    navigator.clipboard.writeText(url.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!isOpen || !provinceId) return null;

  const province = getProvinceById(provinceId);
  const data = PROVINCE_INDEX[provinceId];

  if (!province) return null;

  const regionColor = REGION_COLORS[province.region];

  return (
    <>
      {/* Mobile backdrop */}
      <div className="sm:hidden fixed inset-0 bg-black/20 z-40" onClick={() => selectedItem ? onBackToProvince() : onClose()} />

      {/* Panel — bottom sheet on mobile, right panel on desktop */}
      <div className={`
        fixed z-50 bg-white overflow-hidden
        bottom-0 left-0 right-0 rounded-t-3xl shadow-drawer max-h-[85vh]
        sm:top-0 sm:right-0 sm:bottom-0 sm:left-auto sm:rounded-t-none sm:rounded-l-3xl sm:w-[420px] sm:max-h-full sm:shadow-[-4px_0_32px_rgba(0,0,0,0.12)]
        panel-slide
      `}>
        <div className="overflow-y-auto h-full">
          {/* Mobile drag handle */}
          <div className="flex justify-center pt-3 pb-1 sm:hidden">
            <div className="w-10 h-1 rounded-full bg-surface-200" />
          </div>

          {selectedItem ? (
            /* ── Item Detail View ── */
            <div className="px-5 pb-6">
              {/* Back button */}
              <div className="flex items-center gap-2 py-3 mb-1">
                <button
                  onClick={onBackToProvince}
                  className="flex items-center gap-1.5 text-surface-500 hover:text-surface-700 text-sm transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                  {province.name}
                </button>
                <div className="flex-1" />
                <button onClick={onClose} className="p-1.5 text-surface-300 hover:text-surface-600 rounded-full hover:bg-surface-50 transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              {/* Render content by type */}
              {selectedItem.type === 'language' && <LanguageContent data={selectedItem.data} />}
              {selectedItem.type === 'medicine' && <MedicineContent data={selectedItem.data} />}
              {selectedItem.type === 'food' && <FoodContent data={selectedItem.data} />}

              {/* Tumbuna / Wisdom */}
              <WisdomSection item={selectedItem} />

              {/* Species */}
              {(selectedItem.type === 'medicine' || selectedItem.type === 'food') && selectedItem.data.speciesIcon && (
                <div className="mb-5 flex items-center gap-3 p-3.5 bg-stone-50 border border-stone-100 rounded-2xl">
                  <div className="w-12 h-12 bg-stone-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                    {selectedItem.data.speciesIcon}
                  </div>
                  <div>
                    <p className="text-stone-400 text-[10px] uppercase tracking-wider font-medium">Species of Significance</p>
                    <p className="text-stone-700 text-sm font-medium">
                      {selectedItem.type === 'medicine' ? (selectedItem.data as MedicinePin).plantName : selectedItem.data.name}
                    </p>
                  </div>
                </div>
              )}

              {/* CTA */}
              <button
                onClick={onOpenLeadForm}
                className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white rounded-2xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {selectedItem.type === 'language'
                  ? 'Is this your home? Connect with us'
                  : `Share your ${selectedItem.type === 'medicine' ? 'healing' : 'food'} knowledge`
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
          ) : (
            /* ── Province Overview ── */
            <div className="px-5 pb-6">
              {/* Header */}
              <div className="flex items-start justify-between pt-3 mb-4">
                <div>
                  <h2 className="text-xl font-bold text-surface-900">{province.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold text-white"
                      style={{ backgroundColor: regionColor }}
                    >
                      {province.region} Region
                    </span>
                    {data && (
                      <span className="text-surface-400 text-xs">
                        {data.totalItems} item{data.totalItems !== 1 ? 's' : ''} documented
                      </span>
                    )}
                  </div>
                </div>
                <button onClick={onClose} className="p-1.5 -mr-1 text-surface-300 hover:text-surface-600 rounded-full hover:bg-surface-50 transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              {/* CORA badge */}
              {data?.hasCora && (
                <div className="mb-4 p-3 bg-brand-50 border border-brand-200 rounded-2xl flex items-center gap-3">
                  <div className="w-9 h-9 bg-brand-100 rounded-xl flex items-center justify-center text-lg flex-shrink-0">🌱</div>
                  <div>
                    <p className="text-brand-800 font-semibold text-xs">CORA Active Province</p>
                    <p className="text-brand-600 text-[11px]">Biochar & carbon income programs</p>
                  </div>
                </div>
              )}

              {/* Languages */}
              {data && data.languages.length > 0 && (
                <CategorySection title="Languages" count={data.languages.length} icon="💬" accentColor="amber">
                  {data.languages.map(lang => {
                    const fam = FAMILY_COLORS[lang.family] || FAMILY_COLORS['Creole'];
                    return (
                      <ItemCard
                        key={lang.id}
                        onClick={() => onSelectItem({ type: 'language', data: lang })}
                        icon={<div className="w-3 h-3 rounded-full" style={{ backgroundColor: fam.dot }} />}
                        title={lang.name}
                        subtitle={`${formatSpeakers(lang.speakers)} speakers`}
                        badge={lang.cora ? '🌱 CORA' : undefined}
                      />
                    );
                  })}
                </CategorySection>
              )}

              {/* Medicines */}
              {data && data.medicines.length > 0 && (
                <CategorySection title="Traditional Medicine" count={data.medicines.length} icon="🌿" accentColor="emerald">
                  {data.medicines.map(med => (
                    <ItemCard
                      key={med.id}
                      onClick={() => onSelectItem({ type: 'medicine', data: med })}
                      icon={<span className="text-base">{med.speciesIcon || '🌿'}</span>}
                      title={med.name}
                      subtitle={med.plantName}
                    />
                  ))}
                </CategorySection>
              )}

              {/* Foods */}
              {data && data.foods.length > 0 && (
                <CategorySection title="Traditional Food" count={data.foods.length} icon="🍲" accentColor="orange">
                  {data.foods.map(food => (
                    <ItemCard
                      key={food.id}
                      onClick={() => onSelectItem({ type: 'food', data: food })}
                      icon={<span className="text-base">{food.speciesIcon || '🍲'}</span>}
                      title={food.name}
                      subtitle={food.season || food.method?.slice(0, 50) || ''}
                    />
                  ))}
                </CategorySection>
              )}

              {/* Empty state */}
              {(!data || data.totalItems === 0) && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-surface-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-8 h-8 text-surface-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                  </div>
                  <p className="text-surface-500 text-sm font-medium mb-1">No data documented yet</p>
                  <p className="text-surface-400 text-xs mb-4">Be the first to share knowledge from this province</p>
                </div>
              )}

              {/* Contribute CTA */}
              <button
                onClick={onContribute}
                className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white rounded-2xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm mt-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Know something from {province.name}?
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/* ── Helper components ── */

function CategorySection({ title, count, icon, accentColor, children }: {
  title: string;
  count: number;
  icon: string;
  accentColor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-2.5">
        <span className="text-sm">{icon}</span>
        <h3 className="text-surface-700 text-xs font-semibold uppercase tracking-wider">{title}</h3>
        <span className={`text-${accentColor}-600 text-[11px] font-medium`}>({count})</span>
      </div>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function ItemCard({ onClick, icon, title, subtitle, badge }: {
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  badge?: string;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 bg-surface-50 hover:bg-surface-100 active:bg-surface-200 rounded-xl transition-colors text-left group"
    >
      <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-surface-800 text-sm font-semibold truncate">{title}</p>
        <p className="text-surface-400 text-xs truncate">{subtitle}</p>
      </div>
      {badge && (
        <span className="px-2 py-0.5 bg-brand-50 text-brand-700 text-[10px] font-medium rounded-full flex-shrink-0">{badge}</span>
      )}
      <svg className="w-4 h-4 text-surface-300 group-hover:text-surface-500 flex-shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
      </svg>
    </button>
  );
}

function formatSpeakers(n: number) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return n.toString();
}

/* ── Language Content ── */
function LanguageContent({ data }: { data: LanguageGroup }) {
  const fam = FAMILY_COLORS[data.family] || FAMILY_COLORS['Creole'];
  const speakerPct = Math.max(4, (data.speakers / MAX_SPEAKERS) * 100);

  return (
    <>
      <div className="mb-1">
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

/* ── Medicine Content ── */
function MedicineContent({ data }: { data: MedicinePin }) {
  return (
    <>
      <div className="mb-1">
        <h2 className="text-2xl font-bold text-surface-900 leading-tight">{data.name}</h2>
        <p className="text-emerald-600 text-xs font-medium mt-0.5 italic">{data.plantName}</p>
      </div>
      <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold mb-4 bg-emerald-50 text-emerald-700">Traditional Medicine</span>

      <p className="text-surface-600 text-sm leading-relaxed mb-5">{data.description}</p>

      {data.localNames.length > 0 && (
        <div className="mb-5">
          <p className="text-surface-400 text-[11px] uppercase tracking-wider font-medium mb-2">Local Names</p>
          <div className="flex flex-wrap gap-1.5">
            {data.localNames.map(n => <span key={n} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-full">{n}</span>)}
          </div>
        </div>
      )}

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

/* ── Food Content ── */
function FoodContent({ data }: { data: FoodPin }) {
  return (
    <>
      <div className="mb-1">
        <h2 className="text-2xl font-bold text-surface-900 leading-tight">{data.name}</h2>
        <p className="text-orange-600 text-xs font-medium mt-0.5">{data.province}</p>
      </div>
      <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold mb-4 bg-orange-50 text-orange-700">Traditional Food</span>

      <p className="text-surface-600 text-sm leading-relaxed mb-5">{data.description}</p>

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

      {data.method && (
        <div className="mb-5 p-4 bg-orange-50/50 border border-orange-100 rounded-2xl">
          <p className="text-orange-700 text-[11px] uppercase tracking-wider font-medium mb-2 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" /></svg>
            Cooking Method
          </p>
          <p className="text-orange-800 text-sm leading-relaxed">{data.method}</p>
        </div>
      )}

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

/* ── Wisdom / Tumbuna ── */
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
