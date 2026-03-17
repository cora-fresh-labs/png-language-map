'use client';

import { useState } from 'react';
import { LANGUAGE_GROUPS, PROVINCES, CROPS, FAMILIES, LanguageGroup } from '../data/languages';

interface SearchFiltersProps {
  onFilter: (languages: LanguageGroup[]) => void;
  onSelectLanguage: (lang: LanguageGroup) => void;
}

export default function SearchFilters({ onFilter, onSelectLanguage }: SearchFiltersProps) {
  const [search, setSearch] = useState('');
  const [province, setProvince] = useState('');
  const [crop, setCrop] = useState('');
  const [family, setFamily] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const applyFilters = (s: string, p: string, c: string, f: string) => {
    const filtered = LANGUAGE_GROUPS.filter(lang => {
      const matchSearch = !s || lang.name.toLowerCase().includes(s.toLowerCase());
      const matchProvince = !p || lang.province === p;
      const matchCrop = !c || lang.crops.includes(c);
      const matchFamily = !f || lang.family === f;
      return matchSearch && matchProvince && matchCrop && matchFamily;
    });
    onFilter(filtered);
  };

  const suggestions = search.length > 1
    ? LANGUAGE_GROUPS.filter(l => l.name.toLowerCase().includes(search.toLowerCase())).slice(0, 5)
    : [];

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setShowSuggestions(true);
    applyFilters(val, province, crop, family);
  };

  const handleSelectSuggestion = (lang: LanguageGroup) => {
    setSearch(lang.name);
    setShowSuggestions(false);
    onSelectLanguage(lang);
    applyFilters(lang.name, province, crop, family);
  };

  const handleProvinceChange = (val: string) => {
    setProvince(val);
    applyFilters(search, val, crop, family);
  };

  const handleCropChange = (val: string) => {
    setCrop(val);
    applyFilters(search, province, val, family);
  };

  const handleFamilyChange = (val: string) => {
    setFamily(val);
    applyFilters(search, province, crop, val);
  };

  const clearFilters = () => {
    setSearch('');
    setProvince('');
    setCrop('');
    setFamily('');
    onFilter(LANGUAGE_GROUPS);
  };

  const hasFilters = search || province || crop || family;

  const selectStyle = "bg-forest-900/80 border border-forest-700 text-forest-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-cora-accent appearance-none cursor-pointer";

  return (
    <div className="relative z-40 px-4 py-3 bg-cora-dark/95 backdrop-blur-sm border-b border-forest-800">
      <div className="flex flex-wrap gap-2 items-center max-w-6xl mx-auto">
        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-forest-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search language..."
            value={search}
            onChange={e => handleSearchChange(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="w-full pl-9 pr-3 py-2 bg-forest-900/80 border border-forest-700 text-white text-sm rounded-lg focus:outline-none focus:border-cora-accent placeholder-forest-500"
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-cora-dark border border-forest-700 rounded-lg shadow-xl overflow-hidden">
              {suggestions.map(lang => (
                <button
                  key={lang.id}
                  onClick={() => handleSelectSuggestion(lang)}
                  className="w-full px-3 py-2 text-left text-sm text-forest-200 hover:bg-forest-800 flex items-center justify-between"
                >
                  <span>{lang.name}</span>
                  <span className="text-forest-500 text-xs">{lang.province}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Province filter */}
        <select value={province} onChange={e => handleProvinceChange(e.target.value)} className={selectStyle}>
          <option value="">All Provinces</option>
          {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
        </select>

        {/* Crop filter */}
        <select value={crop} onChange={e => handleCropChange(e.target.value)} className={selectStyle}>
          <option value="">All Crops</option>
          {CROPS.map(c => <option key={c} value={c} className="capitalize">{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
        </select>

        {/* Family filter */}
        <select value={family} onChange={e => handleFamilyChange(e.target.value)} className={selectStyle}>
          <option value="">All Families</option>
          {FAMILIES.map(f => <option key={f} value={f}>{f}</option>)}
        </select>

        {/* Clear */}
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="px-3 py-2 text-xs text-forest-400 hover:text-white border border-forest-700 hover:border-forest-500 rounded-lg transition-colors"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
