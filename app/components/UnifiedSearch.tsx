'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { PROVINCES, REGION_COLORS } from '../data/provinces';
import { PROVINCE_INDEX, ALL_ITEMS, TOK_PISIN } from '../data/provinceIndex';
import { LanguageGroup } from '../data/languages';
import { MedicinePin, FoodPin } from '../data/pins';

interface UnifiedSearchProps {
  onSelectProvince: (provinceId: string) => void;
  onSelectItem: (provinceId: string, item: { type: 'language'; data: LanguageGroup } | { type: 'medicine'; data: MedicinePin } | { type: 'food'; data: FoodPin }) => void;
}

const CATEGORY_ICONS: Record<string, string> = {
  language: '💬',
  medicine: '🌿',
  food: '🍲',
};

const FAMILY_DOT_COLORS: Record<string, string> = {
  'Austronesian': '#0891b2',
  'Trans-New Guinea': '#d97706',
  'Papuan': '#7c3aed',
  'Creole': '#6b7280',
};

type SearchResult =
  | { kind: 'province'; id: string; name: string; region: string; itemCount: number }
  | { kind: 'language'; data: LanguageGroup; provinceId: string }
  | { kind: 'medicine'; data: MedicinePin; provinceId: string }
  | { kind: 'food'; data: FoodPin; provinceId: string };

// Normalize province name to ID
function resolveProvinceId(provinceName: string): string {
  const match = PROVINCES.find(p => p.name.toLowerCase() === provinceName.toLowerCase());
  return match?.id || '';
}

export default function UnifiedSearch({ onSelectProvince, onSelectItem }: UnifiedSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const search = useCallback((q: string) => {
    if (q.length < 2) {
      setResults([]);
      return;
    }

    const lower = q.toLowerCase();
    const found: SearchResult[] = [];

    // Search provinces
    PROVINCES.forEach(prov => {
      if (prov.name.toLowerCase().includes(lower)) {
        const data = PROVINCE_INDEX[prov.id];
        found.push({
          kind: 'province',
          id: prov.id,
          name: prov.name,
          region: prov.region,
          itemCount: data?.totalItems || 0,
        });
      }
    });

    // Search items
    ALL_ITEMS.forEach(item => {
      const name = item.data.name.toLowerCase();
      const province = item.province.toLowerCase();
      const provinceId = resolveProvinceId(item.province);

      if (name.includes(lower) || province.includes(lower)) {
        if (item.type === 'language') {
          // Also search by family, dialects
          found.push({ kind: 'language', data: item.data as LanguageGroup, provinceId });
        } else if (item.type === 'medicine') {
          found.push({ kind: 'medicine', data: item.data as MedicinePin, provinceId });
        } else {
          found.push({ kind: 'food', data: item.data as FoodPin, provinceId });
        }
      }
    });

    // Also check medicine-specific fields
    if (found.length < 8) {
      ALL_ITEMS.forEach(item => {
        if (item.type === 'medicine') {
          const med = item.data as MedicinePin;
          const matches = med.plantName.toLowerCase().includes(lower) ||
            med.localNames.some(n => n.toLowerCase().includes(lower)) ||
            med.uses.some(u => u.toLowerCase().includes(lower));
          if (matches && !found.some(r => r.kind === 'medicine' && (r as any).data.id === med.id)) {
            found.push({ kind: 'medicine', data: med, provinceId: resolveProvinceId(item.province) });
          }
        }
      });
    }

    // Tok Pisin special case
    if ('tok pisin'.includes(lower) || 'nationwide'.includes(lower)) {
      found.push({ kind: 'language', data: TOK_PISIN, provinceId: '' });
    }

    setResults(found.slice(0, 8));
  }, []);

  useEffect(() => {
    search(query);
  }, [query, search]);

  // Click outside to close
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Escape to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleSelect = (result: SearchResult) => {
    setIsOpen(false);
    setQuery('');

    if (result.kind === 'province') {
      onSelectProvince(result.id);
    } else if (result.kind === 'language') {
      if (result.provinceId) {
        onSelectItem(result.provinceId, { type: 'language', data: result.data });
      }
    } else if (result.kind === 'medicine') {
      if (result.provinceId) {
        onSelectItem(result.provinceId, { type: 'medicine', data: result.data });
      }
    } else if (result.kind === 'food') {
      if (result.provinceId) {
        onSelectItem(result.provinceId, { type: 'food', data: result.data });
      }
    }
  };

  return (
    <div ref={containerRef} className="absolute top-4 left-1/2 -translate-x-1/2 z-30 w-[calc(100%-2rem)] max-w-md">
      {/* Search input */}
      <div className="relative">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder="Search provinces, languages, foods..."
          className="w-full pl-11 pr-4 py-3 bg-white/95 backdrop-blur-sm rounded-2xl text-sm text-surface-800 placeholder-surface-400 shadow-float-lg border border-white/50 focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-300 transition-all"
        />
      </div>

      {/* Results dropdown */}
      {isOpen && results.length > 0 && (
        <div className="mt-2 bg-white rounded-2xl shadow-float-lg border border-surface-100 overflow-hidden max-h-[60vh] overflow-y-auto">
          {results.map((result, i) => (
            <button
              key={i}
              onClick={() => handleSelect(result)}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-surface-50 active:bg-surface-100 transition-colors text-left border-b border-surface-50 last:border-0"
            >
              {result.kind === 'province' ? (
                <>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: REGION_COLORS[result.region as keyof typeof REGION_COLORS] + '20' }}>
                    <svg className="w-4 h-4" style={{ color: REGION_COLORS[result.region as keyof typeof REGION_COLORS] }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-surface-800 text-sm font-semibold truncate">{result.name}</p>
                    <p className="text-surface-400 text-xs">{result.region} Region &middot; {result.itemCount} items</p>
                  </div>
                </>
              ) : result.kind === 'language' ? (
                <>
                  <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: FAMILY_DOT_COLORS[result.data.family] || '#6b7280' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-surface-800 text-sm font-semibold truncate">{result.data.name}</p>
                    <p className="text-surface-400 text-xs">{result.data.province} &middot; {result.data.family}</p>
                  </div>
                  <span className="text-[10px] text-amber-600 font-medium">💬</span>
                </>
              ) : (
                <>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-base" style={{
                    backgroundColor: result.kind === 'medicine' ? '#ecfdf5' : '#fff7ed'
                  }}>
                    {result.kind === 'medicine' ? (result.data as MedicinePin).speciesIcon || '🌿' : (result.data as FoodPin).speciesIcon || '🍲'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-surface-800 text-sm font-semibold truncate">{result.data.name}</p>
                    <p className="text-surface-400 text-xs">{result.data.province}</p>
                  </div>
                  <span className="text-[10px] font-medium" style={{ color: result.kind === 'medicine' ? '#059669' : '#ea580c' }}>
                    {CATEGORY_ICONS[result.kind]}
                  </span>
                </>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
