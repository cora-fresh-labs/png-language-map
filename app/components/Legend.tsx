'use client';

const LEGEND_ITEMS = [
  { label: 'Austronesian', color: '#06b6d4' },
  { label: 'Trans-New Guinea', color: '#f59e0b' },
  { label: 'Papuan', color: '#a78bfa' },
  { label: 'Creole', color: '#fb923c' },
];

export default function Legend() {
  return (
    <div className="absolute bottom-20 left-4 z-30 bg-cora-dark/90 backdrop-blur-sm border border-forest-800 rounded-xl p-3 shadow-xl">
      <p className="text-forest-400 text-xs uppercase tracking-wider font-semibold mb-2">Language Family</p>
      <div className="space-y-1.5">
        {LEGEND_ITEMS.map(item => (
          <div key={item.label} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: item.color, boxShadow: `0 0 6px ${item.color}60` }}
            />
            <span className="text-forest-300 text-xs">{item.label}</span>
          </div>
        ))}
        <div className="flex items-center gap-2 pt-1 border-t border-forest-800 mt-1">
          <div className="w-3 h-3 rounded-full flex-shrink-0 bg-green-400" style={{ boxShadow: '0 0 8px #4ade8080' }} />
          <span className="text-green-400 text-xs">🌱 CORA Active</span>
        </div>
      </div>
    </div>
  );
}
