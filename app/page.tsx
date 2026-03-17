'use client';

import { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { LANGUAGE_GROUPS, LanguageGroup } from './data/languages';
import SearchFilters from './components/SearchFilters';
import SidePanel from './components/SidePanel';
import Legend from './components/Legend';
import CTABanner from './components/CTABanner';

// Dynamic import to avoid SSR issues with Leaflet
const MapComponent = dynamic(() => import('./components/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-cora-dark">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-forest-600 border-t-cora-accent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-forest-400 text-sm">Initialising map...</p>
      </div>
    </div>
  ),
});

function MapPageInner() {
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageGroup | null>(null);
  const [filteredLanguages, setFilteredLanguages] = useState<LanguageGroup[]>(LANGUAGE_GROUPS);
  const searchParams = useSearchParams();

  useEffect(() => {
    const langId = searchParams.get('lang');
    if (langId) {
      const lang = LANGUAGE_GROUPS.find(l => l.id === langId);
      if (lang) setSelectedLanguage(lang);
    }
  }, [searchParams]);

  return (
    <div className="flex flex-col h-screen w-screen bg-cora-dark overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 bg-cora-dark border-b border-forest-800 px-4 py-3 z-40">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-sm font-bold text-white shadow-lg">
              C
            </div>
            <div>
              <h1 className="text-white font-bold text-sm sm:text-base leading-tight">
                Papua New Guinea — Languages &amp; Communities
              </h1>
              <p className="text-forest-500 text-xs hidden sm:block">
                {LANGUAGE_GROUPS.length} language groups · 800+ total languages · 22 provinces
              </p>
            </div>
          </div>
          <a
            href="https://coraprojects.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 text-forest-400 hover:text-forest-200 text-xs transition-colors"
          >
            <span>Powered by CORA</span>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </header>

      {/* Filters */}
      <SearchFilters
        onFilter={setFilteredLanguages}
        onSelectLanguage={(lang) => setSelectedLanguage(lang)}
      />

      {/* Map area */}
      <div className="flex-1 relative overflow-hidden">
        <MapComponent
          selectedLanguage={selectedLanguage}
          onSelectLanguage={setSelectedLanguage}
          filteredLanguages={filteredLanguages}
        />

        {/* Legend */}
        <Legend />

        {/* Stats overlay */}
        <div className="absolute top-4 left-4 z-30 bg-cora-dark/80 backdrop-blur-sm border border-forest-800 rounded-xl px-3 py-2">
          <p className="text-forest-400 text-xs">
            Showing <span className="text-white font-semibold">{filteredLanguages.length}</span> languages
          </p>
          <p className="text-forest-600 text-xs mt-0.5">Click a region to explore</p>
        </div>

        {/* Side Panel */}
        <SidePanel
          language={selectedLanguage}
          onClose={() => setSelectedLanguage(null)}
        />

        {/* CTA Banner */}
        <CTABanner />
      </div>

      {/* Footer */}
      <footer className="flex-shrink-0 bg-cora-dark border-t border-forest-900 px-4 py-2">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <p className="text-forest-700 text-xs">
            Data sourced from SIL Ethnologue, UN HDX, and community knowledge
          </p>
          <a
            href="https://coraprojects.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-forest-600 hover:text-forest-400 text-xs transition-colors"
          >
            coraprojects.com
          </a>
        </div>
      </footer>
    </div>
  );
}

export default function MapPage() {
  return (
    <Suspense fallback={
      <div className="w-screen h-screen flex items-center justify-center bg-cora-dark">
        <div className="w-12 h-12 border-4 border-forest-600 border-t-cora-accent rounded-full animate-spin" />
      </div>
    }>
      <MapPageInner />
    </Suspense>
  );
}
