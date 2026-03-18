'use client';

import 'leaflet/dist/leaflet.css';
import { useEffect, useRef, useState, useCallback } from 'react';
import { PROVINCES, GEOJSON_NAME_MAP, REGION_COLORS, getProvinceById } from '../data/provinces';
import { PROVINCE_INDEX } from '../data/provinceIndex';

interface ProvinceMapProps {
  selectedProvinceId: string | null;
  onSelectProvince: (provinceId: string) => void;
}

export default function ProvinceMap({ selectedProvinceId, onSelectProvince }: ProvinceMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const geoLayerRef = useRef<any>(null);
  const labelsRef = useRef<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Keep callback in ref to avoid stale closures
  const onSelectRef = useRef(onSelectProvince);
  onSelectRef.current = onSelectProvince;

  const selectedRef = useRef(selectedProvinceId);
  selectedRef.current = selectedProvinceId;

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

    // Load GeoJSON
    const res = await fetch('/png-provinces.geojson');
    const geojson = await res.json();

    const getStyle = (provinceId: string, isHovered = false) => {
      const data = PROVINCE_INDEX[provinceId];
      const province = getProvinceById(provinceId);
      const itemCount = data?.totalItems || 0;
      const isSelected = selectedRef.current === provinceId;
      const regionColor = province ? REGION_COLORS[province.region] : '#94a3b8';

      const baseOpacity = itemCount > 0
        ? 0.15 + Math.min(itemCount / 10, 0.3)
        : 0.05;

      return {
        fillColor: itemCount > 0 ? regionColor : '#e2e8f0',
        fillOpacity: isSelected ? 0.5 : isHovered ? 0.4 : baseOpacity,
        color: isSelected ? '#16a34a' : isHovered ? '#475569' : '#cbd5e1',
        weight: isSelected ? 3 : isHovered ? 2 : 1,
      };
    };

    const geoLayer = L.geoJSON(geojson, {
      style: (feature: any) => {
        const name = feature.properties.name || '';
        const provinceId = GEOJSON_NAME_MAP[name] || '';
        return getStyle(provinceId);
      },
      onEachFeature: (feature: any, layer: any) => {
        const name = feature.properties.name || '';
        const provinceId = GEOJSON_NAME_MAP[name] || '';
        const data = PROVINCE_INDEX[provinceId];
        const province = getProvinceById(provinceId);
        const itemCount = data?.totalItems || 0;

        // Tooltip
        const tooltipContent = `<div style="font-size:13px;font-weight:600;color:#1e293b;">${province?.name || name}</div>` +
          (itemCount > 0
            ? `<div style="font-size:11px;color:#64748b;margin-top:2px;">${itemCount} item${itemCount !== 1 ? 's' : ''} documented</div>`
            : `<div style="font-size:11px;color:#94a3b8;margin-top:2px;">No data yet</div>`);

        layer.bindTooltip(tooltipContent, {
          sticky: true,
          direction: 'top',
          offset: [0, -10],
          className: 'province-tooltip',
        });

        layer.on('mouseover', () => {
          layer.setStyle(getStyle(provinceId, true));
          layer.bringToFront();
        });

        layer.on('mouseout', () => {
          layer.setStyle(getStyle(provinceId, false));
        });

        layer.on('click', () => {
          if (provinceId) {
            onSelectRef.current(provinceId);
          }
        });

        // Store province ID on layer for later style updates
        (layer as any)._provinceId = provinceId;
      },
    }).addTo(map);

    geoLayerRef.current = geoLayer;

    // Province labels
    PROVINCES.forEach(prov => {
      const data = PROVINCE_INDEX[prov.id];
      const itemCount = data?.totalItems || 0;
      const displayName = prov.name === 'National Capital District' ? 'NCD' : prov.name.replace(' Province', '');

      const labelHtml = `<div style="
        color: ${itemCount > 0 ? '#334155' : '#94a3b8'};
        font-size: 10px;
        font-weight: ${itemCount > 0 ? '600' : '400'};
        white-space: nowrap;
        pointer-events: none;
        text-align: center;
        text-shadow: 0 0 4px #fff, 0 0 4px #fff, 0 0 8px #fff;
        line-height: 1;
      ">${displayName}${itemCount > 0 ? ` <span style="color:#16a34a;font-size:9px;">(${itemCount})</span>` : ''}</div>`;

      const icon = L.divIcon({
        html: labelHtml,
        className: '',
        iconAnchor: [0, 0],
      });

      const marker = L.marker(prov.center, { icon, interactive: false });
      marker.addTo(map);
      labelsRef.current.push(marker);
    });

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

  // Update styles when selection changes
  useEffect(() => {
    if (!geoLayerRef.current || !isLoaded) return;

    geoLayerRef.current.eachLayer((layer: any) => {
      const provinceId = layer._provinceId;
      if (provinceId) {
        const data = PROVINCE_INDEX[provinceId];
        const province = getProvinceById(provinceId);
        const itemCount = data?.totalItems || 0;
        const isSelected = selectedProvinceId === provinceId;
        const regionColor = province ? REGION_COLORS[province.region] : '#94a3b8';
        const baseOpacity = itemCount > 0 ? 0.15 + Math.min(itemCount / 10, 0.3) : 0.05;

        layer.setStyle({
          fillColor: itemCount > 0 ? regionColor : '#e2e8f0',
          fillOpacity: isSelected ? 0.5 : baseOpacity,
          color: isSelected ? '#16a34a' : '#cbd5e1',
          weight: isSelected ? 3 : 1,
        });

        if (isSelected) layer.bringToFront();
      }
    });
  }, [selectedProvinceId, isLoaded]);

  // Fly to selected province
  useEffect(() => {
    if (!leafletMapRef.current || !isLoaded || !selectedProvinceId) return;

    const province = getProvinceById(selectedProvinceId);
    if (province) {
      leafletMapRef.current.flyTo(province.center, 8, { duration: 0.6 });
    }
  }, [selectedProvinceId, isLoaded]);

  // Fly back when deselected
  useEffect(() => {
    if (!leafletMapRef.current || !isLoaded) return;
    if (selectedProvinceId === null) {
      leafletMapRef.current.flyTo([-6.3, 147.5], 6, { duration: 0.6 });
    }
  }, [selectedProvinceId, isLoaded]);

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
