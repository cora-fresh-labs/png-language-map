'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams, useRouter } from 'next/navigation';
import { LANGUAGE_GROUPS, LanguageGroup } from './data/languages';
import SearchBar from './components/SearchBar';
import BottomDrawer from './components/BottomDrawer';
import LeadCaptureModal from './components/LeadCaptureModal';

const MapComponent = dynamic(() => import('./components/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-surface-50">
      <div className="text-center">
        <div className="w-10 h-10 border-[3px] border-surface-200 border-t-brand-500 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-surface-400 text-sm">Loading map...</p>
      </div>
    </div>
  ),
});

function MapPageInner() {
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageGroup | null>(null);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  // Deep link support: ?lang=melpa
  useEffect(() => {
    const langId = searchParams.get('lang');
    if (langId) {
      const lang = LANGUAGE_GROUPS.find(l => l.id === langId);
      if (lang) setSelectedLanguage(lang);
    }
  }, [searchParams]);

  // Update URL when language is selected
  const handleSelectLanguage = useCallback((lang: LanguageGroup | null) => {
    setSelectedLanguage(lang);
    if (lang) {
      window.history.replaceState(null, '', `?lang=${lang.id}`);
    } else {
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setSelectedLanguage(null);
    window.history.replaceState(null, '', window.location.pathname);
  }, []);

  return (
    <div className="relative h-screen w-screen bg-surface-50 overflow-hidden">
      {/* Full-screen map */}
      <MapComponent
        selectedLanguage={selectedLanguage}
        onSelectLanguage={handleSelectLanguage}
        filteredLanguages={LANGUAGE_GROUPS}
      />

      {/* Floating search bar */}
      <SearchBar onSelectLanguage={handleSelectLanguage} />

      {/* CORA badge - top left */}
      <div className="absolute top-4 left-4 z-30 hidden sm:block">
        <a
          href="https://coraprojects.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-float hover:shadow-float-lg transition-shadow group"
        >
          <div className="w-6 h-6 bg-brand-600 rounded-lg flex items-center justify-center text-[10px] font-bold text-white">C</div>
          <span className="text-surface-500 text-xs font-medium group-hover:text-surface-700 transition-colors">Powered by CORA</span>
        </a>
      </div>

      {/* Language count pill - bottom left (above attribution) */}
      <div className="absolute bottom-8 left-3 z-30">
        <div className="bg-white/85 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-float flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-pulse" />
          <span className="text-surface-500 text-[11px]">
            <span className="font-semibold text-surface-700">{LANGUAGE_GROUPS.length}</span> of 800+ languages mapped
          </span>
        </div>
      </div>

      {/* Bottom drawer */}
      <BottomDrawer
        language={selectedLanguage}
        onClose={handleCloseDrawer}
        onOpenLeadForm={() => setShowLeadForm(true)}
      />

      {/* Lead capture modal */}
      <LeadCaptureModal
        isOpen={showLeadForm}
        onClose={() => setShowLeadForm(false)}
        language={selectedLanguage}
      />
    </div>
  );
}

export default function MapPage() {
  return (
    <Suspense fallback={
      <div className="w-screen h-screen flex items-center justify-center bg-surface-50">
        <div className="w-10 h-10 border-[3px] border-surface-200 border-t-brand-500 rounded-full animate-spin" />
      </div>
    }>
      <MapPageInner />
    </Suspense>
  );
}
