'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { LANGUAGE_GROUPS, LanguageGroup } from '../data/languages';

interface MapComponentProps {
  selectedLanguage: LanguageGroup | null;
  onSelectLanguage: (lang: LanguageGroup | null) => void;
  filteredLanguages: LanguageGroup[];
}

const FAMILY_COLORS: Record<string, string> = {
  'Austronesian': '#0891b2',
  'Trans-New Guinea': '#d97706',
  'Papuan': '#7c3aed',
  'Creole': '#6b7280',
};

const MAX_SPEAKERS = Math.max(...LANGUAGE_GROUPS.map(l => l.speakers));

export default function MapComponent({ selectedLanguage, onSelectLanguage, filteredLanguages }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const selectedRingRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Store the latest callback in a ref so markers always have the current version
  const onSelectRef = useRef(onSelectLanguage);
  onSelectRef.current = onSelectLanguage;

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

    // Zoom control top-right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Light CartoDB Voyager tiles (clean, Apple Maps-like)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20,
    }).addTo(map);

    leafletMapRef.current = map;
    addMarkers(L, map, LANGUAGE_GROUPS);
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

  // Update markers on filter change
  useEffect(() => {
    if (!leafletMapRef.current || !isLoaded) return;

    const update = async () => {
      const L = (await import('leaflet')).default;
      const map = leafletMapRef.current;

      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];

      const filteredIds = new Set(filteredLanguages.map(l => l.id));
      const visible = LANGUAGE_GROUPS.filter(l => filteredIds.has(l.id));
      addMarkers(L, map, visible);
    };
    update();
  }, [filteredLanguages, isLoaded]);

  function addMarkers(L: any, map: any, languages: LanguageGroup[]) {
    // Sort: large first so small ones render on top and are clickable
    const sorted = [...languages].sort((a, b) => b.speakers - a.speakers);

    sorted.forEach(lang => {
      const color = FAMILY_COLORS[lang.family] || '#16a34a';

      // Proportional pixel radius (8-28px range), sqrt-scaled for area perception
      const ratio = Math.sqrt(lang.speakers / MAX_SPEAKERS);
      const pxRadius = 7 + ratio * 21;

      const marker = L.circleMarker([lang.lat, lang.lng], {
        radius: pxRadius,
        fillColor: color,
        fillOpacity: 0.5,
        color: '#ffffff',
        weight: 2,
        opacity: 1,
      });

      // CORA: green ring indicator
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

      // Text label
      const fontSize = lang.speakers > 100000 ? 12 : lang.speakers > 30000 ? 11 : 10;
      const label = L.divIcon({
        html: `<div style="
          color: #1e293b;
          font-size: ${fontSize}px;
          font-weight: 600;
          white-space: nowrap;
          pointer-events: none;
          text-align: center;
          text-shadow: 0 0 4px #fff, 0 0 4px #fff, 0 0 8px #fff;
          line-height: 1;
        ">${lang.name}</div>`,
        className: '',
        iconAnchor: [0, -(pxRadius + 6)],
      });
      const labelMarker = L.marker([lang.lat, lang.lng], { icon: label, interactive: false });

      // Interactions
      marker.on('click', () => {
        onSelectRef.current(lang);
      });

      marker.on('mouseover', () => {
        marker.setStyle({ fillOpacity: 0.8, weight: 3, color: color });
      });

      marker.on('mouseout', () => {
        marker.setStyle({ fillOpacity: 0.5, weight: 2, color: '#ffffff' });
      });

      marker.addTo(map);
      labelMarker.addTo(map);
      markersRef.current.push(marker, labelMarker);
    });
  }

  // Fly to selected language + highlight ring
  useEffect(() => {
    if (!leafletMapRef.current || !isLoaded) return;

    const update = async () => {
      const L = (await import('leaflet')).default;
      const map = leafletMapRef.current;

      // Remove previous selection ring
      if (selectedRingRef.current) {
        selectedRingRef.current.remove();
        selectedRingRef.current = null;
      }

      if (selectedLanguage) {
        map.flyTo(
          [selectedLanguage.lat, selectedLanguage.lng],
          8,
          { duration: 0.6 }
        );

        // Selection highlight ring
        const ratio = Math.sqrt(selectedLanguage.speakers / MAX_SPEAKERS);
        const pxRadius = 7 + ratio * 21;
        const ring = L.circleMarker([selectedLanguage.lat, selectedLanguage.lng], {
          radius: pxRadius + 4,
          fillColor: '#16a34a',
          fillOpacity: 0.15,
          color: '#16a34a',
          weight: 3,
          opacity: 0.9,
          interactive: false,
        });
        ring.addTo(map);
        selectedRingRef.current = ring;
      }
    };
    update();
  }, [selectedLanguage, isLoaded]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full" />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-surface-50">
          <div className="text-center">
            <div className="w-10 h-10 border-3 border-surface-200 border-t-brand-500 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-surface-400 text-sm">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
}
