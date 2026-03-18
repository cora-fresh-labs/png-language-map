'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { LANGUAGE_GROUPS, LanguageGroup } from './data/languages';
import { MEDICINE_PINS } from './data/medicines';
import { FOOD_PINS } from './data/foods';
import { PinCategory, MedicinePin, FoodPin } from './data/pins';
import SearchBar from './components/SearchBar';
import BottomDrawer, { DrawerItem } from './components/BottomDrawer';
import LeadCaptureModal from './components/LeadCaptureModal';
import CategoryToggles from './components/CategoryToggles';
import ContributeModal from './components/ContributeModal';

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
  const [drawerItem, setDrawerItem] = useState<DrawerItem | null>(null);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [showContribute, setShowContribute] = useState(false);
  const [activeCategories, setActiveCategories] = useState<Set<PinCategory>>(new Set(['language']));
  const searchParams = useSearchParams();

  // Deep link support
  useEffect(() => {
    const langId = searchParams.get('lang');
    if (langId) {
      const lang = LANGUAGE_GROUPS.find(l => l.id === langId);
      if (lang) {
        setDrawerItem({ type: 'language', data: lang });
        return;
      }
      const med = MEDICINE_PINS.find(m => m.id === langId);
      if (med) {
        setDrawerItem({ type: 'medicine', data: med });
        setActiveCategories(prev => new Set([...prev, 'medicine']));
        return;
      }
      const food = FOOD_PINS.find(f => f.id === langId);
      if (food) {
        setDrawerItem({ type: 'food', data: food });
        setActiveCategories(prev => new Set([...prev, 'food']));
      }
    }
  }, [searchParams]);

  const updateUrl = useCallback((id: string | null) => {
    if (id) {
      window.history.replaceState(null, '', `?lang=${id}`);
    } else {
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  const handleSelectLanguage = useCallback((lang: LanguageGroup) => {
    setDrawerItem({ type: 'language', data: lang });
    updateUrl(lang.id);
  }, [updateUrl]);

  const handleSelectMedicine = useCallback((pin: MedicinePin) => {
    setDrawerItem({ type: 'medicine', data: pin });
    updateUrl(pin.id);
  }, [updateUrl]);

  const handleSelectFood = useCallback((pin: FoodPin) => {
    setDrawerItem({ type: 'food', data: pin });
    updateUrl(pin.id);
  }, [updateUrl]);

  const handleCloseDrawer = useCallback(() => {
    setDrawerItem(null);
    updateUrl(null);
  }, [updateUrl]);

  const handleToggleCategory = useCallback((cat: PinCategory) => {
    setActiveCategories(prev => {
      const next = new Set(prev);
      if (next.has(cat)) {
        // Don't allow deselecting all
        if (next.size > 1) next.delete(cat);
      } else {
        next.add(cat);
      }
      return next;
    });
  }, []);

  // For the search bar — only search languages (primary use case)
  const handleSearchSelect = useCallback((lang: LanguageGroup) => {
    if (!activeCategories.has('language')) {
      setActiveCategories(prev => new Set([...prev, 'language']));
    }
    handleSelectLanguage(lang);
  }, [activeCategories, handleSelectLanguage]);

  const selectedId = drawerItem?.data.id || null;

  // Get the language data for lead form (if current item is a language)
  const leadFormLanguage = drawerItem?.type === 'language' ? drawerItem.data : null;

  return (
    <div className="relative h-screen w-screen bg-surface-50 overflow-hidden">
      {/* Full-screen map */}
      <MapComponent
        selectedId={selectedId}
        onSelectLanguage={handleSelectLanguage}
        onSelectMedicine={handleSelectMedicine}
        onSelectFood={handleSelectFood}
        activeCategories={activeCategories}
      />

      {/* Floating search bar */}
      <SearchBar onSelectLanguage={handleSearchSelect} />

      {/* CORA badge */}
      <div className="absolute top-4 left-4 z-30 hidden sm:block">
        <a
          href="https://coraprojects.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-float hover:shadow-float-lg transition-shadow group"
        >
          <div className="w-6 h-6 bg-brand-600 rounded-lg flex items-center justify-center text-[10px] font-bold text-white">C</div>
          <span className="text-surface-500 text-xs font-medium group-hover:text-surface-700 transition-colors">CORA Project</span>
        </a>
      </div>

      {/* Pin count */}
      <div className="absolute bottom-20 left-3 z-30">
        <div className="bg-white/85 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-float flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-pulse" />
          <span className="text-surface-500 text-[11px]">
            <span className="font-semibold text-surface-700">
              {(activeCategories.has('language') ? LANGUAGE_GROUPS.length : 0) +
               (activeCategories.has('medicine') ? MEDICINE_PINS.length : 0) +
               (activeCategories.has('food') ? FOOD_PINS.length : 0)}
            </span> pins on map
          </span>
        </div>
      </div>

      {/* Category toggles + Contribute button */}
      <CategoryToggles
        active={activeCategories}
        onToggle={handleToggleCategory}
        onContribute={() => setShowContribute(true)}
      />

      {/* Bottom drawer */}
      <BottomDrawer
        item={drawerItem}
        onClose={handleCloseDrawer}
        onOpenLeadForm={() => setShowLeadForm(true)}
      />

      {/* Lead capture modal */}
      <LeadCaptureModal
        isOpen={showLeadForm}
        onClose={() => setShowLeadForm(false)}
        language={leadFormLanguage}
      />

      {/* Contribute modal */}
      <ContributeModal
        isOpen={showContribute}
        onClose={() => setShowContribute(false)}
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
