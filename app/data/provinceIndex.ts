import { LANGUAGE_GROUPS, LanguageGroup } from './languages';
import { MEDICINE_PINS } from './medicines';
import { FOOD_PINS } from './foods';
import { MedicinePin, FoodPin } from './pins';
import { PROVINCES } from './provinces';

export interface ProvinceData {
  languages: LanguageGroup[];
  medicines: MedicinePin[];
  foods: FoodPin[];
  totalItems: number;
  hasCora: boolean;
}

// Normalize province names from existing data to our province IDs
const PROVINCE_NAME_TO_ID: Record<string, string> = {};
PROVINCES.forEach(p => {
  PROVINCE_NAME_TO_ID[p.name.toLowerCase()] = p.id;
});
// Aliases
PROVINCE_NAME_TO_ID['chimbu'] = 'simbu';
PROVINCE_NAME_TO_ID['northern'] = 'oro';
PROVINCE_NAME_TO_ID['west sepik'] = 'sandaun';

function resolveProvinceId(provinceName: string): string | null {
  if (provinceName === 'Nationwide') return null;
  const key = provinceName.toLowerCase().trim();
  return PROVINCE_NAME_TO_ID[key] || null;
}

function buildIndex(): Record<string, ProvinceData> {
  const index: Record<string, ProvinceData> = {};

  const getOrCreate = (id: string): ProvinceData => {
    if (!index[id]) {
      index[id] = { languages: [], medicines: [], foods: [], totalItems: 0, hasCora: false };
    }
    return index[id];
  };

  LANGUAGE_GROUPS.forEach(lang => {
    const id = resolveProvinceId(lang.province);
    if (!id) return; // Skip "Nationwide" (Tok Pisin)
    const entry = getOrCreate(id);
    entry.languages.push(lang);
    entry.totalItems++;
    if (lang.cora) entry.hasCora = true;
  });

  MEDICINE_PINS.forEach(med => {
    const id = resolveProvinceId(med.province);
    if (!id) return;
    const entry = getOrCreate(id);
    entry.medicines.push(med);
    entry.totalItems++;
  });

  FOOD_PINS.forEach(food => {
    const id = resolveProvinceId(food.province);
    if (!id) return;
    const entry = getOrCreate(id);
    entry.foods.push(food);
    entry.totalItems++;
  });

  return index;
}

export const PROVINCE_INDEX = buildIndex();

// Tok Pisin — special case for nationwide language
export const TOK_PISIN = LANGUAGE_GROUPS.find(l => l.id === 'tok-pisin')!;

// Flat searchable list
export type SearchableItem =
  | { type: 'language'; data: LanguageGroup; province: string }
  | { type: 'medicine'; data: MedicinePin; province: string }
  | { type: 'food'; data: FoodPin; province: string };

export const ALL_ITEMS: SearchableItem[] = [
  ...LANGUAGE_GROUPS.filter(l => l.province !== 'Nationwide').map(l => ({
    type: 'language' as const,
    data: l,
    province: l.province,
  })),
  ...MEDICINE_PINS.map(m => ({
    type: 'medicine' as const,
    data: m,
    province: m.province,
  })),
  ...FOOD_PINS.map(f => ({
    type: 'food' as const,
    data: f,
    province: f.province,
  })),
];
