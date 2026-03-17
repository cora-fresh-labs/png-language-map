'use client';

import { useEffect, useRef, useState } from 'react';
import { LANGUAGE_GROUPS, LanguageGroup } from '../data/languages';

interface MapComponentProps {
  selectedLanguage: LanguageGroup | null;
  onSelectLanguage: (lang: LanguageGroup | null) => void;
  filteredLanguages: LanguageGroup[];
}

const FAMILY_COLORS: Record<string, string> = {
  'Austronesian': '#06b6d4',      // cyan
  'Trans-New Guinea': '#f59e0b',  // amber
  'Papuan': '#a78bfa',            // violet
  'Creole': '#fb923c',            // orange
};

export default function MapComponent({ selectedLanguage, onSelectLanguage, filteredLanguages }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!mapRef.current || leafletMapRef.current) return;

    const initMap = async () => {
      const L = (await import('leaflet')).default;

      // Fix default icon
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });

      const map = L.map(mapRef.current!, {
        center: [-6.315, 143.955],
        zoom: 6,
        zoomControl: false,
        attributionControl: true,
        minZoom: 4,
        maxZoom: 12,
      });

      // Add zoom control to top-right
      L.control.zoom({ position: 'topright' }).addTo(map);

      // Dark tile layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(map);

      // Alternatively try a terrain layer
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri',
        opacity: 0.15,
      }).addTo(map);

      leafletMapRef.current = map;

      // Add markers
      addMarkers(L, map, LANGUAGE_GROUPS, onSelectLanguage);
      setIsLoaded(true);
    };

    initMap();

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  // Update marker visibility based on filters
  useEffect(() => {
    if (!leafletMapRef.current || !isLoaded) return;

    const updateMarkers = async () => {
      const L = (await import('leaflet')).default;
      const map = leafletMapRef.current;

      // Clear existing markers
      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];

      const filteredIds = new Set(filteredLanguages.map(l => l.id));
      const visibleLanguages = LANGUAGE_GROUPS.filter(l => filteredIds.has(l.id));

      addMarkers(L, map, visibleLanguages, onSelectLanguage);
    };

    updateMarkers();
  }, [filteredLanguages, isLoaded]);

  function addMarkers(L: any, map: any, languages: LanguageGroup[], onSelect: (lang: LanguageGroup | null) => void) {
    languages.forEach(lang => {
      const color = FAMILY_COLORS[lang.family] || '#4ade80';
      const radius = Math.max(20000, Math.min(lang.speakers * 0.35, 120000));

      // Create circle marker
      const circle = L.circle([lang.lat, lang.lng], {
        radius,
        fillColor: color,
        fillOpacity: lang.cora ? 0.75 : 0.45,
        color: lang.cora ? '#4ade80' : color,
        weight: lang.cora ? 3 : 1.5,
        opacity: 0.9,
      });

      // CORA pulse effect
      if (lang.cora) {
        const pulseCircle = L.circle([lang.lat, lang.lng], {
          radius: radius * 1.4,
          fillColor: '#4ade80',
          fillOpacity: 0.12,
          color: '#4ade80',
          weight: 2,
          opacity: 0.5,
          dashArray: '4 8',
        });
        pulseCircle.addTo(map);
        markersRef.current.push(pulseCircle);
      }

      // Label
      const label = L.divIcon({
        html: `<div style="
          color: white;
          font-size: ${lang.speakers > 100000 ? '11px' : '9px'};
          font-weight: 600;
          text-shadow: 0 1px 3px rgba(0,0,0,0.9), 0 0 6px rgba(0,0,0,0.8);
          white-space: nowrap;
          pointer-events: none;
          text-align: center;
        ">${lang.name}${lang.cora ? ' 🌱' : ''}</div>`,
        className: '',
        iconAnchor: [0, 0],
      });

      const labelMarker = L.marker([lang.lat, lang.lng], { icon: label, interactive: false });

      circle.on('click', () => onSelect(lang));
      circle.on('mouseover', () => {
        circle.setStyle({ fillOpacity: 0.85, weight: 3 });
      });
      circle.on('mouseout', () => {
        circle.setStyle({ fillOpacity: lang.cora ? 0.75 : 0.45, weight: lang.cora ? 3 : 1.5 });
      });

      circle.addTo(map);
      labelMarker.addTo(map);
      markersRef.current.push(circle, labelMarker);
    });
  }

  // Pan to selected language
  useEffect(() => {
    if (selectedLanguage && leafletMapRef.current) {
      leafletMapRef.current.flyTo(
        [selectedLanguage.lat, selectedLanguage.lng],
        7,
        { duration: 0.8 }
      );
    }
  }, [selectedLanguage]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full" />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-cora-dark">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-forest-600 border-t-cora-accent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-forest-400 text-sm">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
}
