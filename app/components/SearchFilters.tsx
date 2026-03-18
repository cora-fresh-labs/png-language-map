'use client';

import { useState } from 'react';
import { LANGUAGE_GROUPS, PROVINCES, CROPS, FAMILIES, LanguageGroup } from '../data/languages';

interface SearchFiltersProps {
  onFilter: (languages: LanguageGroup[]) => void;
  onSelectLanguage: (lang: LanguageGroup) => void;
  filteredCount: number;
}

export default function SearchFilters({ onFilter, onSelectLanguage, filteredCount }: SearchFiltersProps) {
  const [search, setSearch] = useState('');
  const [province, setProvince] = useState('');
  const [crop, setCrop] = useState('');
  const [family, setFamily] = useState('');
  const [coraOnly, setCoraOnly] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const applyFilters = (s: string, p: string, c: string, f: string, cora: boolean) => {
    const filtered = LANGUAGE_GROUPS.filter(lang => {
      const matchSearch = !s || lang.name.toLowerCase().includes(s.toLowerCase());
      const matchProvince = !p || lang.province === p;
      const matchCrop = !c || lang.crops.includes(c);
      const matchFamily = !f || lang.family === f;
      const matchCora = !cora || lang.cora;
      return matchSearch && matchProvince && matchCrop && matchFamily && matchCora;
    });
    onFilter(filtered);
  };

  const suggestions = search.length > 0
    ? LANGUAGE_GROUPS.filter(l => l.name.toLowerCase().includes(search.toLowerCase())).slice(0, 6)
    : [];

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setShowSuggestions(true);
    applyFilters(val, province, crop, family, coraOnly);
  };

  const handleSelectSuggestion = (lang: LanguageGroup) => {
    setSearch(lang.name);
    setShowSuggestions(false);
    onSelectLanguage(lang);
    applyFilters(lang.name, province, crop, family, coraOnly);
  };

  const handleProvinceChange = (val: string) => {
    setProvince(val);
    applyFilters(search, val, crop, family, coraOnly);
  };

  const handleCropChange = (val: string) => {
    setCrop(val);
    applyFilters(search, province, val, family, coraOnly);
  };

  const handleFamilyChange = (val: string) => {
    setFamily(val);
    applyFilters(search, province, crop, val, coraOnly);
  };

  const handleCoraToggle = () => {
    const newVal = !coraOnly;
    setCoraOnly(newVal);
    applyFilters(search, province, crop, family, newVal);
  };

  const clearFilters = () => {
    setSearch('');
    setProvince('');
    setCrop('');
    setFamily('');
    setCoraOnly(false);
    onFilter(LANGUAGE_GROUPS);
  };

  const hasFilters = search || province || crop || family || coraOnly;

  const selectStyle = "bg-forest-900/80 border border-forest-700 text-forest-200 text-xs rounded-lg px-2.5 py-2 focus:outline-none focus:border-cora-accent appearance-none cursor-pointer hover:border-forest-500 transition-colors";

  return (
    <div className="relative z-40 px-4 py-2.5 bg-cora-dark/95 backdrop-blur-sm border-b border-forest-800">
      <div className="flex flex-wrap gap-2 items-center max-w-7xl mx-auto">
        {/* Search */}
        <div className="relative flex-1 min-w-44">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-forest-500">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search language name..."
            value={search}
            onChange={e => handleSearchChange(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="w-full pl-8 pr-3 py-2 bg-forest-900/80 border border-forest-700 text-white text-xs rounded-lg focus:outline-none focus:border-cora-accent placeholder-forest-600 hover:border-forest-500 transition-colors"
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-cora-dark border border-forest-700 rounded-lg shadow-2xl overflow-hidden">
              {suggestions.map(lang => (
                <button
                  key={lang.id}
                  onClick={() => handleSelectSuggestion(lang)}
                  className="w-full px-3 py-2 text-left text-xs text-forest-200 hover:bg-forest-800/80 flex items-center justify-between gap-2 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: lang.family === 'Austronesian' ? '#06b6d4' : lang.family === 'Trans-New Guinea' ? '#f59e0b' : lang.family === 'Papuan' ? '#a78bfa' : '#ffffff' }}
                    />
                    <span className="font-medium">{lang.name}</span>
                    {lang.cora && <span className="text-green-400 text-[10px]">CORA</span>}
                  </div>
                  <span className="text-forest-600 text-[10px]">{lang.province}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Province filter */}
        <select value={province} onChange={e => handleProvinceChange(e.target.value)} className={selectStyle}>
          <option value="">Province</option>
          {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
        </select>

        {/* Crop filter */}
        <select value={crop} onChange={e => handleCropChange(e.target.value)} className={selectStyle}>
          <option value="">Crop</option>
          {CROPS.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
        </select>

        {/* Family filter */}
        <select value={family} onChange={e => handleFamilyChange(e.target.value)} className={selectStyle}>
          <option value="">Family</option>
          {FAMILIES.map(f => <option key={f} value={f}>{f}</option>)}
        </select>

        {/* CORA Active chip */}
        <button
          onClick={handleCoraToggle}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
            coraOnly
              ? 'bg-green-800/60 border border-green-500 text-green-300 shadow-sm shadow-green-900/50'
              : 'bg-forest-900/80 border border-forest-700 text-forest-400 hover:border-forest-500'
          }`}
        >
          <span className="text-sm leading-none">🌱</span>
          <span>CORA</span>
        </button>

        {/* Result count */}
        <div className="text-forest-500 text-[10px] tabular-nums hidden sm:block">
          <span className="text-forest-300 font-semibold">{filteredCount}</span>
          <span> / {LANGUAGE_GROUPS.length}</span>
        </div>

        {/* Clear */}
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="px-2.5 py-2 text-[10px] text-forest-500 hover:text-white border border-forest-700 hover:border-forest-500 rounded-lg transition-colors"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
