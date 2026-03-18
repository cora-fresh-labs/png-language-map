'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { LANGUAGE_GROUPS, LanguageGroup } from './data/languages';
import { MEDICINE_PINS } from './data/medicines';
import { FOOD_PINS } from './data/foods';
import { MedicinePin, FoodPin } from './data/pins';
import { PROVINCES } from './data/provinces';
import { PROVINCE_INDEX } from './data/provinceIndex';
import UnifiedSearch from './components/UnifiedSearch';
import ProvincePanel, { DrawerItem } from './components/ProvincePanel';
import LeadCaptureModal from './components/LeadCaptureModal';
import ContributeModal from './components/ContributeModal';

const ProvinceMap = dynamic(() => import('./components/ProvinceMap'), {
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

// Resolve a province name to province ID
function resolveProvinceIdFromName(name: string): string | null {
  const lower = name.toLowerCase().trim();
  const aliases: Record<string, string> = {
    'chimbu': 'simbu', 'northern': 'oro', 'west sepik': 'sandaun',
  };
  const normalized = aliases[lower] || lower;
  return PROVINCES.find(p => p.name.toLowerCase() === normalized || p.id === normalized)?.id || null;
}

function MapPageInner() {
  const [selectedProvinceId, setSelectedProvinceId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<DrawerItem | null>(null);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [showContribute, setShowContribute] = useState(false);
  const searchParams = useSearchParams();

  // Deep link support
  useEffect(() => {
    const provinceParam = searchParams.get('province');
    const itemParam = searchParams.get('item');
    const legacyLang = searchParams.get('lang');

    if (provinceParam) {
      setSelectedProvinceId(provinceParam);

      if (itemParam) {
        // Find item in this province
        const data = PROVINCE_INDEX[provinceParam];
        if (data) {
          const lang = data.languages.find(l => l.id === itemParam);
          if (lang) { setSelectedItem({ type: 'language', data: lang }); return; }
          const med = data.medicines.find(m => m.id === itemParam);
          if (med) { setSelectedItem({ type: 'medicine', data: med }); return; }
          const food = data.foods.find(f => f.id === itemParam);
          if (food) { setSelectedItem({ type: 'food', data: food }); return; }
        }
      }
    } else if (legacyLang) {
      // Legacy ?lang= support — resolve to province + item
      const lang = LANGUAGE_GROUPS.find(l => l.id === legacyLang);
      if (lang) {
        const pid = resolveProvinceIdFromName(lang.province);
        if (pid) {
          setSelectedProvinceId(pid);
          setSelectedItem({ type: 'language', data: lang });
          updateUrl(pid, lang.id);
          return;
        }
      }
      const med = MEDICINE_PINS.find(m => m.id === legacyLang);
      if (med) {
        const pid = resolveProvinceIdFromName(med.province);
        if (pid) {
          setSelectedProvinceId(pid);
          setSelectedItem({ type: 'medicine', data: med });
          updateUrl(pid, med.id);
          return;
        }
      }
      const food = FOOD_PINS.find(f => f.id === legacyLang);
      if (food) {
        const pid = resolveProvinceIdFromName(food.province);
        if (pid) {
          setSelectedProvinceId(pid);
          setSelectedItem({ type: 'food', data: food });
          updateUrl(pid, food.id);
          return;
        }
      }
    }
  }, [searchParams]);

  const updateUrl = useCallback((provinceId: string | null, itemId?: string | null) => {
    if (provinceId) {
      const params = new URLSearchParams();
      params.set('province', provinceId);
      if (itemId) params.set('item', itemId);
      window.history.replaceState(null, '', `?${params.toString()}`);
    } else {
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  const handleSelectProvince = useCallback((provinceId: string) => {
    setSelectedProvinceId(provinceId);
    setSelectedItem(null);
    updateUrl(provinceId);
  }, [updateUrl]);

  const handleSelectItem = useCallback((item: DrawerItem) => {
    setSelectedItem(item);
    if (selectedProvinceId) {
      updateUrl(selectedProvinceId, item.data.id);
    }
  }, [selectedProvinceId, updateUrl]);

  const handleBackToProvince = useCallback(() => {
    setSelectedItem(null);
    if (selectedProvinceId) {
      updateUrl(selectedProvinceId);
    }
  }, [selectedProvinceId, updateUrl]);

  const handleClosePanel = useCallback(() => {
    setSelectedProvinceId(null);
    setSelectedItem(null);
    updateUrl(null);
  }, [updateUrl]);

  // Search handlers
  const handleSearchProvince = useCallback((provinceId: string) => {
    handleSelectProvince(provinceId);
  }, [handleSelectProvince]);

  const handleSearchItem = useCallback((provinceId: string, item: DrawerItem) => {
    setSelectedProvinceId(provinceId);
    setSelectedItem(item);
    updateUrl(provinceId, item.data.id);
  }, [updateUrl]);

  // Get the language data for lead form
  const leadFormLanguage = selectedItem?.type === 'language' ? selectedItem.data : null;

  // Total items across all provinces
  const totalItems = Object.values(PROVINCE_INDEX).reduce((sum, d) => sum + d.totalItems, 0);
  const provincesWithData = Object.keys(PROVINCE_INDEX).length;

  return (
    <div className="relative h-screen w-screen bg-surface-50 overflow-hidden">
      {/* Map — adjusts width on desktop when panel is open */}
      <div className={`h-full transition-all duration-300 ease-out ${selectedProvinceId ? 'sm:mr-[420px]' : ''}`}>
        <ProvinceMap
          selectedProvinceId={selectedProvinceId}
          onSelectProvince={handleSelectProvince}
        />
      </div>

      {/* Floating search bar */}
      <UnifiedSearch
        onSelectProvince={handleSearchProvince}
        onSelectItem={handleSearchItem}
      />

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

      {/* Stats badge */}
      <div className="absolute bottom-6 left-3 z-30">
        <div className="bg-white/85 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-float flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-pulse" />
          <span className="text-surface-500 text-[11px]">
            <span className="font-semibold text-surface-700">{totalItems}</span> items &middot; <span className="font-semibold text-surface-700">{provincesWithData}</span> provinces
          </span>
        </div>
      </div>

      {/* Contribute FAB (when no panel open) */}
      {!selectedProvinceId && (
        <div className="absolute bottom-6 right-3 z-30">
          <button
            onClick={() => setShowContribute(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white rounded-2xl text-xs font-semibold shadow-float-lg transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Contribute
          </button>
        </div>
      )}

      {/* Province panel */}
      <ProvincePanel
        provinceId={selectedProvinceId}
        selectedItem={selectedItem}
        onClose={handleClosePanel}
        onSelectItem={handleSelectItem}
        onBackToProvince={handleBackToProvince}
        onOpenLeadForm={() => setShowLeadForm(true)}
        onContribute={() => setShowContribute(true)}
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
