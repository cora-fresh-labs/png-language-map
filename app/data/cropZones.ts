export interface CropZone {
  id: string;
  name: string;
  crop: string;
  color: string;
  fillColor: string;
  lat: number;
  lng: number;
  radius: number; // meters
  description: string;
}

// Crop zone overlay circles - positioned over agricultural regions
export const CROP_ZONES: CropZone[] = [
  // === COFFEE ZONES (Highlands) ===
  {
    id: 'coffee-wh',
    name: 'Western Highlands Coffee',
    crop: 'coffee',
    color: '#92400e',
    fillColor: '#92400e',
    lat: -5.82,
    lng: 144.25,
    radius: 45000,
    description: 'Premium Arabica coffee grown at 1,500-1,800m elevation',
  },
  {
    id: 'coffee-eh',
    name: 'Eastern Highlands Coffee',
    crop: 'coffee',
    color: '#92400e',
    fillColor: '#92400e',
    lat: -6.05,
    lng: 145.4,
    radius: 40000,
    description: 'Goroka Valley Arabica production zone',
  },
  {
    id: 'coffee-simbu',
    name: 'Simbu Coffee',
    crop: 'coffee',
    color: '#92400e',
    fillColor: '#92400e',
    lat: -6.1,
    lng: 144.75,
    radius: 30000,
    description: 'Terraced highland gardens with coffee cultivation',
  },
  {
    id: 'coffee-enga',
    name: 'Enga Coffee',
    crop: 'coffee',
    color: '#92400e',
    fillColor: '#92400e',
    lat: -5.6,
    lng: 143.6,
    radius: 35000,
    description: 'Enga Province highland coffee production',
  },
  {
    id: 'coffee-hela',
    name: 'Hela Coffee',
    crop: 'coffee',
    color: '#92400e',
    fillColor: '#92400e',
    lat: -5.95,
    lng: 143.0,
    radius: 30000,
    description: 'Tari Basin highland coffee zone',
  },

  // === COCONUT ZONES (Coastal) ===
  {
    id: 'coconut-enb',
    name: 'East New Britain Coconut',
    crop: 'coconut',
    color: '#ca8a04',
    fillColor: '#ca8a04',
    lat: -4.3,
    lng: 152.1,
    radius: 40000,
    description: 'Major copra and coconut production island',
  },
  {
    id: 'coconut-morobe',
    name: 'Morobe Coast Coconut',
    crop: 'coconut',
    color: '#ca8a04',
    fillColor: '#ca8a04',
    lat: -6.7,
    lng: 147.0,
    radius: 35000,
    description: 'Coastal coconut plantations along Huon Gulf',
  },
  {
    id: 'coconut-central',
    name: 'Central Province Coconut',
    crop: 'coconut',
    color: '#ca8a04',
    fillColor: '#ca8a04',
    lat: -9.0,
    lng: 147.0,
    radius: 40000,
    description: 'Port Moresby region coastal coconut production',
  },
  {
    id: 'coconut-milnebay',
    name: 'Milne Bay Coconut',
    crop: 'coconut',
    color: '#ca8a04',
    fillColor: '#ca8a04',
    lat: -9.8,
    lng: 150.8,
    radius: 35000,
    description: 'Island coconut groves across Milne Bay atolls',
  },
  {
    id: 'coconut-sepik',
    name: 'Sepik Coast Coconut',
    crop: 'coconut',
    color: '#ca8a04',
    fillColor: '#ca8a04',
    lat: -3.8,
    lng: 143.5,
    radius: 35000,
    description: 'Northern coastal coconut and copra zone',
  },

  // === COCOA ZONES (Lowlands) ===
  {
    id: 'cocoa-enb',
    name: 'East New Britain Cocoa',
    crop: 'cocoa',
    color: '#78350f',
    fillColor: '#78350f',
    lat: -4.5,
    lng: 151.8,
    radius: 35000,
    description: 'PNG\'s premier cocoa-growing region, Rabaul area',
  },
  {
    id: 'cocoa-oro',
    name: 'Oro Province Cocoa',
    crop: 'cocoa',
    color: '#78350f',
    fillColor: '#78350f',
    lat: -8.5,
    lng: 148.0,
    radius: 35000,
    description: 'Northern Province lowland cocoa production',
  },
  {
    id: 'cocoa-madang',
    name: 'Madang Cocoa',
    crop: 'cocoa',
    color: '#78350f',
    fillColor: '#78350f',
    lat: -5.2,
    lng: 145.8,
    radius: 30000,
    description: 'Madang lowland cocoa and coconut zone',
  },
  {
    id: 'cocoa-bougainville',
    name: 'Bougainville Cocoa',
    crop: 'cocoa',
    color: '#78350f',
    fillColor: '#78350f',
    lat: -6.2,
    lng: 155.5,
    radius: 35000,
    description: 'Bougainville autonomous region cocoa production',
  },
];

export const CROP_COLORS: Record<string, { fill: string; stroke: string; label: string }> = {
  coffee: { fill: '#92400e', stroke: '#b45309', label: 'Coffee (Highlands)' },
  coconut: { fill: '#ca8a04', stroke: '#eab308', label: 'Coconut (Coastal)' },
  cocoa: { fill: '#78350f', stroke: '#92400e', label: 'Cocoa (Lowlands)' },
};
