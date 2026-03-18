'use client';

import { CROP_COLORS } from '../data/cropZones';

const FAMILY_ITEMS = [
  { label: 'Trans-New Guinea', color: '#f59e0b' },
  { label: 'Austronesian', color: '#06b6d4' },
  { label: 'Papuan', color: '#a78bfa' },
  { label: 'Tok Pisin (Creole)', color: '#ffffff' },
];

interface LegendProps {
  showCropZones: boolean;
}

export default function Legend({ showCropZones }: LegendProps) {
  return (
    <div className="absolute bottom-20 left-3 z-30 bg-cora-dark/90 backdrop-blur-sm border border-forest-800 rounded-xl p-2.5 shadow-xl max-w-[160px]">
      <p className="text-forest-500 text-[9px] uppercase tracking-wider font-semibold mb-1.5">Language Family</p>
      <div className="space-y-1">
        {FAMILY_ITEMS.map(item => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: item.color, boxShadow: `0 0 6px ${item.color}40` }}
            />
            <span className="text-forest-300 text-[10px] leading-tight">{item.label}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5 pt-1 border-t border-forest-800 mt-1">
          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0 bg-green-400" style={{ boxShadow: '0 0 8px #4ade8060' }} />
          <span className="text-green-400 text-[10px]">🍃 CORA Active</span>
        </div>
      </div>

      {/* Crop zone legend */}
      {showCropZones && (
        <div className="mt-2 pt-2 border-t border-forest-800">
          <p className="text-forest-500 text-[9px] uppercase tracking-wider font-semibold mb-1.5">Crop Zones</p>
          <div className="space-y-1">
            {Object.entries(CROP_COLORS).map(([key, val]) => (
              <div key={key} className="flex items-center gap-1.5">
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: val.fill, opacity: 0.7 }}
                />
                <span className="text-forest-400 text-[10px] leading-tight">{val.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
