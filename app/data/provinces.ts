export type ProvinceRegion = 'Highlands' | 'Momase' | 'Southern' | 'Islands';

export interface ProvinceInfo {
  id: string;
  name: string;
  center: [number, number]; // [lat, lng]
  region: ProvinceRegion;
}

export const PROVINCES: ProvinceInfo[] = [
  // Highlands
  { id: 'western-highlands', name: 'Western Highlands', center: [-5.86, 144.23], region: 'Highlands' },
  { id: 'eastern-highlands', name: 'Eastern Highlands', center: [-6.08, 145.38], region: 'Highlands' },
  { id: 'simbu', name: 'Simbu', center: [-6.05, 144.65], region: 'Highlands' },
  { id: 'enga', name: 'Enga', center: [-5.50, 143.60], region: 'Highlands' },
  { id: 'hela', name: 'Hela', center: [-5.95, 142.80], region: 'Highlands' },
  { id: 'jiwaka', name: 'Jiwaka', center: [-5.85, 144.70], region: 'Highlands' },
  { id: 'southern-highlands', name: 'Southern Highlands', center: [-6.30, 143.55], region: 'Highlands' },
  // Momase
  { id: 'morobe', name: 'Morobe', center: [-6.73, 147.00], region: 'Momase' },
  { id: 'madang', name: 'Madang', center: [-5.22, 145.79], region: 'Momase' },
  { id: 'east-sepik', name: 'East Sepik', center: [-4.05, 143.13], region: 'Momase' },
  { id: 'sandaun', name: 'Sandaun', center: [-3.70, 141.80], region: 'Momase' },
  // Southern
  { id: 'central', name: 'Central', center: [-8.45, 147.00], region: 'Southern' },
  { id: 'ncd', name: 'National Capital District', center: [-9.48, 147.15], region: 'Southern' },
  { id: 'oro', name: 'Oro', center: [-8.50, 148.10], region: 'Southern' },
  { id: 'gulf', name: 'Gulf', center: [-7.50, 145.50], region: 'Southern' },
  { id: 'western', name: 'Western', center: [-7.50, 141.50], region: 'Southern' },
  { id: 'milne-bay', name: 'Milne Bay', center: [-9.75, 150.85], region: 'Southern' },
  // Islands
  { id: 'east-new-britain', name: 'East New Britain', center: [-4.35, 152.10], region: 'Islands' },
  { id: 'west-new-britain', name: 'West New Britain', center: [-5.60, 150.50], region: 'Islands' },
  { id: 'new-ireland', name: 'New Ireland', center: [-3.30, 152.00], region: 'Islands' },
  { id: 'manus', name: 'Manus', center: [-2.05, 147.00], region: 'Islands' },
  { id: 'bougainville', name: 'Bougainville', center: [-6.20, 155.50], region: 'Islands' },
];

// Map GeoJSON feature names (from the downloaded boundary file) to our province IDs
export const GEOJSON_NAME_MAP: Record<string, string> = {
  'Autonomous Region of Bougainville': 'bougainville',
  'Central Province': 'central',
  'Chimbu (Simbu) Province': 'simbu',
  'East New Britain Province': 'east-new-britain',
  'East Sepik Province': 'east-sepik',
  'Eastern Highlands Province': 'eastern-highlands',
  'Enga Province': 'enga',
  'Gulf Province': 'gulf',
  'Hela Province': 'hela',
  'Jiwaka Province': 'jiwaka',
  'Madang Province': 'madang',
  'Manus Province': 'manus',
  'Milne Bay Province': 'milne-bay',
  'Morobe Province': 'morobe',
  'National Capital District': 'ncd',
  'New Ireland Province': 'new-ireland',
  'Northern (Oro) Province': 'oro',
  'Southern Highlands Province': 'southern-highlands',
  'West New Britain Province': 'west-new-britain',
  'West Sepik (Sandaun) Province': 'sandaun',
  'Western Highlands Province': 'western-highlands',
  'Western Province': 'western',
};

export const REGION_COLORS: Record<ProvinceRegion, string> = {
  'Highlands': '#d97706',  // amber
  'Momase': '#0891b2',     // cyan
  'Southern': '#7c3aed',   // violet
  'Islands': '#0d9488',    // teal
};

export function getProvinceById(id: string): ProvinceInfo | undefined {
  return PROVINCES.find(p => p.id === id);
}
