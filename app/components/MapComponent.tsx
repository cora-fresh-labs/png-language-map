'use client';

import { useEffect, useRef, useState } from 'react';
import { LANGUAGE_GROUPS, LanguageGroup } from '../data/languages';
import { CROP_ZONES, CROP_COLORS } from '../data/cropZones';

interface MapComponentProps {
  selectedLanguage: LanguageGroup | null;
  onSelectLanguage: (lang: LanguageGroup | null) => void;
  filteredLanguages: LanguageGroup[];
  showCropZones: boolean;
}

const FAMILY_COLORS: Record<string, string> = {
  'Austronesian': '#06b6d4',
  'Trans-New Guinea': '#f59e0b',
  'Papuan': '#a78bfa',
  'Creole': '#ffffff',
};

const MAX_SPEAKERS = Math.max(...LANGUAGE_GROUPS.map(l => l.speakers));

export default function MapComponent({ selectedLanguage, onSelectLanguage, filteredLanguages, showCropZones }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const cropLayersRef = useRef<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!mapRef.current || leafletMapRef.current) return;

    const initMap = async () => {
      const L = (await import('leaflet')).default;

      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });

      const map = L.map(mapRef.current!, {
        center: [-6.0, 147.0],
        zoom: 6,
        zoomControl: false,
        attributionControl: true,
        minZoom: 5,
        maxZoom: 12,
      });

      L.control.zoom({ position: 'topright' }).addTo(map);

      // Dark CartoDB base
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20,
      }).addTo(map);

      // Subtle terrain overlay for topographic context
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri',
        opacity: 0.12,
      }).addTo(map);

      leafletMapRef.current = map;
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

  // Update markers on filter change
  useEffect(() => {
    if (!leafletMapRef.current || !isLoaded) return;

    const updateMarkers = async () => {
      const L = (await import('leaflet')).default;
      const map = leafletMapRef.current;

      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];

      const filteredIds = new Set(filteredLanguages.map(l => l.id));
      const visibleLanguages = LANGUAGE_GROUPS.filter(l => filteredIds.has(l.id));
      addMarkers(L, map, visibleLanguages, onSelectLanguage);
    };

    updateMarkers();
  }, [filteredLanguages, isLoaded]);

  // Crop zone overlay toggle
  useEffect(() => {
    if (!leafletMapRef.current || !isLoaded) return;

    const updateCropZones = async () => {
      const L = (await import('leaflet')).default;
      const map = leafletMapRef.current;

      // Remove existing crop layers
      cropLayersRef.current.forEach(l => l.remove());
      cropLayersRef.current = [];

      if (showCropZones) {
        CROP_ZONES.forEach(zone => {
          const circle = L.circle([zone.lat, zone.lng], {
            radius: zone.radius,
            fillColor: zone.fillColor,
            fillOpacity: 0.18,
            color: zone.color,
            weight: 1,
            opacity: 0.35,
            dashArray: '6 4',
            interactive: false,
          });
          circle.addTo(map);
          cropLayersRef.current.push(circle);

          // Zone label
          const label = L.divIcon({
            html: `<div style="
              color: ${zone.color};
              font-size: 9px;
              font-weight: 600;
              text-shadow: 0 1px 4px rgba(0,0,0,0.95);
              white-space: nowrap;
              pointer-events: none;
              text-align: center;
              opacity: 0.7;
              letter-spacing: 0.05em;
              text-transform: uppercase;
            ">${zone.crop}</div>`,
            className: '',
            iconAnchor: [15, 0],
          });
          const labelMarker = L.marker([zone.lat + 0.15, zone.lng], { icon: label, interactive: false });
          labelMarker.addTo(map);
          cropLayersRef.current.push(labelMarker);
        });
      }
    };

    updateCropZones();
  }, [showCropZones, isLoaded]);

  function addMarkers(L: any, map: any, languages: LanguageGroup[], onSelect: (lang: LanguageGroup | null) => void) {
    // Sort so smaller circles render on top of larger ones
    const sorted = [...languages].sort((a, b) => b.speakers - a.speakers);

    sorted.forEach(lang => {
      const color = FAMILY_COLORS[lang.family] || '#4ade80';
      // Proportional radius: sqrt-scaled for area perception
      const minR = 12000;
      const maxR = 85000;
      const ratio = Math.sqrt(lang.speakers / MAX_SPEAKERS);
      const radius = minR + ratio * (maxR - minR);

      // CORA outer pulse ring
      if (lang.cora) {
        // Dashed outer ring
        const outerRing = L.circle([lang.lat, lang.lng], {
          radius: radius * 1.8,
          fillColor: '#4ade80',
          fillOpacity: 0.06,
          color: '#4ade80',
          weight: 2,
          opacity: 0.4,
          dashArray: '8 6',
          interactive: false,
        });
        outerRing.addTo(map);
        markersRef.current.push(outerRing);

        // Inner glow ring
        const glowRing = L.circle([lang.lat, lang.lng], {
          radius: radius * 1.35,
          fillColor: '#4ade80',
          fillOpacity: 0.1,
          color: '#4ade80',
          weight: 1.5,
          opacity: 0.6,
          interactive: false,
        });
        glowRing.addTo(map);
        markersRef.current.push(glowRing);
      }

      // Main circle
      const circle = L.circle([lang.lat, lang.lng], {
        radius,
        fillColor: color,
        fillOpacity: lang.cora ? 0.55 : 0.35,
        color: lang.cora ? '#4ade80' : color,
        weight: lang.cora ? 2.5 : 1.5,
        opacity: 0.8,
      });

      // Label
      const fontSize = lang.speakers > 100000 ? '11px' : lang.speakers > 30000 ? '10px' : '9px';
      const labelHtml = lang.cora
        ? `<div style="display:flex;align-items:center;gap:3px;justify-content:center;">
             <span style="font-size:12px;">🍃</span>
             <span>${lang.name}</span>
           </div>`
        : `<span>${lang.name}</span>`;

      const label = L.divIcon({
        html: `<div style="
          color: white;
          font-size: ${fontSize};
          font-weight: 600;
          text-shadow: 0 1px 4px rgba(0,0,0,0.95), 0 0 8px rgba(0,0,0,0.8);
          white-space: nowrap;
          pointer-events: none;
          text-align: center;
        ">${labelHtml}</div>`,
        className: '',
        iconAnchor: [0, -4],
      });

      const labelMarker = L.marker([lang.lat, lang.lng], { icon: label, interactive: false });

      circle.on('click', () => onSelect(lang));
      circle.on('mouseover', () => {
        circle.setStyle({ fillOpacity: 0.7, weight: 3 });
      });
      circle.on('mouseout', () => {
        circle.setStyle({
          fillOpacity: lang.cora ? 0.55 : 0.35,
          weight: lang.cora ? 2.5 : 1.5,
        });
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
        8,
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
