'use client';

import { useState, useRef, useEffect } from 'react';
import { LANGUAGE_GROUPS, LanguageGroup } from '../data/languages';

const FAMILY_DOTS: Record<string, string> = {
  'Austronesian': '#0891b2',
  'Trans-New Guinea': '#d97706',
  'Papuan': '#7c3aed',
  'Creole': '#6b7280',
};

interface SearchBarProps {
  onSelectLanguage: (lang: LanguageGroup) => void;
}

export default function SearchBar({ onSelectLanguage }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = query.length > 0
    ? LANGUAGE_GROUPS.filter(l =>
        l.name.toLowerCase().includes(query.toLowerCase()) ||
        l.province.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 6)
    : [];

  const showDropdown = focused && suggestions.length > 0;

  const handleSelect = (lang: LanguageGroup) => {
    setQuery('');
    setFocused(false);
    inputRef.current?.blur();
    onSelectLanguage(lang);
  };

  // Close on escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setFocused(false);
        inputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="absolute top-4 left-4 right-4 z-40 max-w-md mx-auto">
      <div className={`relative bg-white rounded-2xl shadow-float transition-shadow ${focused ? 'shadow-float-lg ring-1 ring-brand-200' : ''}`}>
        {/* Search icon */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          placeholder="Find my village or language"
          className="w-full pl-12 pr-4 py-3.5 bg-transparent text-surface-800 text-sm rounded-2xl focus:outline-none placeholder-surface-400"
        />

        {/* Clear button */}
        {query && (
          <button
            onClick={() => { setQuery(''); inputRef.current?.focus(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-300 hover:text-surface-500 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Autocomplete dropdown */}
      {showDropdown && (
        <div className="mt-2 bg-white rounded-2xl shadow-float-lg overflow-hidden border border-surface-100">
          {suggestions.map(lang => (
            <button
              key={lang.id}
              onMouseDown={() => handleSelect(lang)}
              className="w-full px-4 py-3 text-left hover:bg-surface-50 flex items-center gap-3 transition-colors active:bg-surface-100"
            >
              <span
                className="w-3 h-3 rounded-full flex-shrink-0 shadow-sm"
                style={{ backgroundColor: FAMILY_DOTS[lang.family] || '#6b7280' }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-surface-800 text-sm font-medium truncate">{lang.name}</p>
                <p className="text-surface-400 text-xs">{lang.province} &middot; {lang.family}</p>
              </div>
              {lang.cora && (
                <span className="text-xs bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full font-medium flex-shrink-0">CORA</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
