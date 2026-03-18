'use client';

import { PinCategory } from '../data/pins';

interface CategoryTogglesProps {
  active: Set<PinCategory>;
  onToggle: (category: PinCategory) => void;
  onContribute: () => void;
}

const CATEGORIES: { key: PinCategory; label: string; icon: JSX.Element; activeClass: string }[] = [
  {
    key: 'language',
    label: 'Languages',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    activeClass: 'bg-amber-50 border-amber-300 text-amber-700',
  },
  {
    key: 'medicine',
    label: 'Medicines',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
    activeClass: 'bg-emerald-50 border-emerald-300 text-emerald-700',
  },
  {
    key: 'food',
    label: 'Foods',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.87c1.355 0 2.697.055 4.024.165C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m15-3.38a48.474 48.474 0 00-6-.37c-2.032 0-4.034.126-6 .37m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.17c0 .62-.504 1.124-1.125 1.124H4.125A1.125 1.125 0 013 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 016 13.12m12 0c-.39.049-.777.102-1.163.16" />
      </svg>
    ),
    activeClass: 'bg-orange-50 border-orange-300 text-orange-700',
  },
];

export default function CategoryToggles({ active, onToggle, onContribute }: CategoryTogglesProps) {
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
      {/* Category pills */}
      <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-2xl p-1.5 shadow-float-lg">
        {CATEGORIES.map(cat => {
          const isActive = active.has(cat.key);
          return (
            <button
              key={cat.key}
              onClick={() => onToggle(cat.key)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? cat.activeClass + ' border shadow-sm'
                  : 'text-surface-400 hover:text-surface-600 hover:bg-surface-50 border border-transparent'
              }`}
            >
              {cat.icon}
              <span className="hidden sm:inline">{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Contribute FAB */}
      <button
        onClick={onContribute}
        className="flex items-center gap-1.5 px-3.5 py-2.5 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white rounded-2xl text-xs font-semibold shadow-float-lg transition-colors"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        <span className="hidden sm:inline">Contribute</span>
      </button>
    </div>
  );
}
