'use client';

import 'leaflet/dist/leaflet.css';
import { useEffect, useRef, useState, useCallback } from 'react';
import { LANGUAGE_GROUPS, LanguageGroup } from '../data/languages';
import { MEDICINE_PINS } from '../data/medicines';
import { FOOD_PINS } from '../data/foods';
import { PinCategory, MapPin, MedicinePin, FoodPin } from '../data/pins';

interface MapComponentProps {
  selectedId: string | null;
  onSelectLanguage: (lang: LanguageGroup) => void;
  onSelectMedicine: (pin: MedicinePin) => void;
  onSelectFood: (pin: FoodPin) => void;
  activeCategories: Set<PinCategory>;
}

const FAMILY_COLORS: Record<string, string> = {
  'Austronesian': '#0891b2',
  'Trans-New Guinea': '#d97706',
  'Papuan': '#7c3aed',
  'Creole': '#6b7280',
};

const MAX_SPEAKERS = Math.max(...LANGUAGE_GROUPS.map(l => l.speakers));

export default function MapComponent({
  selectedId,
  onSelectLanguage,
  onSelectMedicine,
  onSelectFood,
  activeCategories,
}: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const selectedRingRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Store latest callbacks in refs
  const onSelectLangRef = useRef(onSelectLanguage);
  onSelectLangRef.current = onSelectLanguage;
  const onSelectMedRef = useRef(onSelectMedicine);
  onSelectMedRef.current = onSelectMedicine;
  const onSelectFoodRef = useRef(onSelectFood);
  onSelectFoodRef.current = onSelectFood;

  const initMap = useCallback(async () => {
    if (!mapRef.current || leafletMapRef.current) return;

    const L = (await import('leaflet')).default;
    delete (L.Icon.Default.prototype as any)._getIconUrl;

    const map = L.map(mapRef.current, {
      center: [-6.3, 147.5],
      zoom: 6,
      zoomControl: false,
      attributionControl: true,
      minZoom: 5,
      maxZoom: 12,
    });

    L.control.zoom({ position: 'topright' }).addTo(map);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20,
    }).addTo(map);

    leafletMapRef.current = map;
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    initMap();
    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [initMap]);

  // Render pins whenever categories change
  useEffect(() => {
    if (!leafletMapRef.current || !isLoaded) return;

    const renderPins = async () => {
      const L = (await import('leaflet')).default;
      const map = leafletMapRef.current;

      // Clear existing
      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];

      // Languages
      if (activeCategories.has('language')) {
        addLanguageMarkers(L, map);
      }

      // Medicines
      if (activeCategories.has('medicine')) {
        addCategoryMarkers(L, map, MEDICINE_PINS, '#059669', '🌿', (pin) => {
          onSelectMedRef.current(pin as MedicinePin);
        });
      }

      // Foods
      if (activeCategories.has('food')) {
        addCategoryMarkers(L, map, FOOD_PINS, '#ea580c', '🍲', (pin) => {
          onSelectFoodRef.current(pin as FoodPin);
        });
      }
    };

    renderPins();
  }, [activeCategories, isLoaded]);

  function addLanguageMarkers(L: any, map: any) {
    const sorted = [...LANGUAGE_GROUPS].sort((a, b) => b.speakers - a.speakers);

    sorted.forEach(lang => {
      const color = FAMILY_COLORS[lang.family] || '#16a34a';
      const ratio = Math.sqrt(lang.speakers / MAX_SPEAKERS);
      const pxRadius = 7 + ratio * 21;

      // CORA ring
      if (lang.cora) {
        const coraRing = L.circleMarker([lang.lat, lang.lng], {
          radius: pxRadius + 5,
          fillColor: 'transparent',
          fillOpacity: 0,
          color: '#16a34a',
          weight: 2.5,
          opacity: 0.7,
          dashArray: '6 4',
          interactive: false,
        });
        coraRing.addTo(map);
        markersRef.current.push(coraRing);
      }

      const marker = L.circleMarker([lang.lat, lang.lng], {
        radius: pxRadius,
        fillColor: color,
        fillOpacity: 0.5,
        color: '#ffffff',
        weight: 2,
        opacity: 1,
      });

      // Label
      const fontSize = lang.speakers > 100000 ? 12 : lang.speakers > 30000 ? 11 : 10;
      const label = L.divIcon({
        html: `<div style="color:#1e293b;font-size:${fontSize}px;font-weight:600;white-space:nowrap;pointer-events:none;text-align:center;text-shadow:0 0 4px #fff,0 0 4px #fff,0 0 8px #fff;line-height:1;">${lang.name}</div>`,
        className: '',
        iconAnchor: [0, -(pxRadius + 6)],
      });
      const labelMarker = L.marker([lang.lat, lang.lng], { icon: label, interactive: false });

      marker.on('click', () => onSelectLangRef.current(lang));
      marker.on('mouseover', () => marker.setStyle({ fillOpacity: 0.8, weight: 3, color }));
      marker.on('mouseout', () => marker.setStyle({ fillOpacity: 0.5, weight: 2, color: '#ffffff' }));

      marker.addTo(map);
      labelMarker.addTo(map);
      markersRef.current.push(marker, labelMarker);
    });
  }

  function addCategoryMarkers(L: any, map: any, pins: MapPin[], color: string, emoji: string, onClick: (pin: MapPin) => void) {
    pins.forEach(pin => {
      // Custom icon marker using HTML div
      const icon = L.divIcon({
        html: `<div style="
          width: 36px; height: 36px;
          background: ${color};
          border: 2.5px solid white;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          cursor: pointer;
          transition: transform 0.15s ease;
        ">${pin.speciesIcon || emoji}</div>`,
        className: '',
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const marker = L.marker([pin.lat, pin.lng], { icon });

      // Label
      const label = L.divIcon({
        html: `<div style="color:#1e293b;font-size:10px;font-weight:600;white-space:nowrap;pointer-events:none;text-align:center;text-shadow:0 0 4px #fff,0 0 4px #fff,0 0 8px #fff;line-height:1;">${pin.name}</div>`,
        className: '',
        iconAnchor: [0, -24],
      });
      const labelMarker = L.marker([pin.lat, pin.lng], { icon: label, interactive: false });

      marker.on('click', () => onClick(pin));

      marker.addTo(map);
      labelMarker.addTo(map);
      markersRef.current.push(marker, labelMarker);
    });
  }

  // Fly to selected pin
  useEffect(() => {
    if (!leafletMapRef.current || !isLoaded || !selectedId) return;

    // Find the selected item across all datasets
    const lang = LANGUAGE_GROUPS.find(l => l.id === selectedId);
    const med = MEDICINE_PINS.find(m => m.id === selectedId);
    const food = FOOD_PINS.find(f => f.id === selectedId);
    const item = lang || med || food;

    if (item) {
      leafletMapRef.current.flyTo([item.lat, item.lng], 8, { duration: 0.6 });
    }
  }, [selectedId, isLoaded]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full" />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-surface-50">
          <div className="text-center">
            <div className="w-10 h-10 border-[3px] border-surface-200 border-t-brand-500 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-surface-400 text-sm">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
}
