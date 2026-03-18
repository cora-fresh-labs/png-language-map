// Shared types for all map pin categories

export type PinCategory = 'language' | 'medicine' | 'food';

export interface MapPin {
  id: string;
  category: PinCategory;
  name: string;
  lat: number;
  lng: number;
  province: string;
  description: string;
  relatedLanguage?: string; // language group id
  imageUrl?: string;        // placeholder for gallery
  speciesIcon?: string;     // emoji or icon identifier
  tumbuna?: {
    title: string;
    excerpt: string;
  };
}

export interface MedicinePin extends MapPin {
  category: 'medicine';
  plantName: string;
  localNames: string[];
  uses: string[];
  preparation?: string;
}

export interface FoodPin extends MapPin {
  category: 'food';
  ingredients?: string[];
  season?: string;
  method?: string;
}
