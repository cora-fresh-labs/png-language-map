export interface LanguageGroup {
  id: string;
  name: string;
  isoCode?: string;
  family: 'Austronesian' | 'Papuan' | 'Creole' | 'Trans-New Guinea';
  speakers: number;
  province: string;
  lat: number;
  lng: number;
  radius: number; // in km, proportional to speakers
  crops: string[];
  cora: boolean;
  culturalFact: string;
  color?: string;
}

export const LANGUAGE_GROUPS: LanguageGroup[] = [
  {
    id: 'tok-pisin',
    name: 'Tok Pisin',
    isoCode: 'tpi',
    family: 'Creole',
    speakers: 4000000,
    province: 'Nationwide',
    lat: -6.315,
    lng: 143.955,
    radius: 80,
    crops: ['coconut', 'coffee', 'cocoa'],
    cora: false,
    culturalFact: 'Tok Pisin is the most widely spoken language in PNG, serving as a lingua franca across all 22 provinces. It evolved from 19th-century plantation pidgin English.'
  },
  {
    id: 'huli',
    name: 'Huli',
    isoCode: 'hui',
    family: 'Trans-New Guinea',
    speakers: 150000,
    province: 'Hela',
    lat: -5.95,
    lng: 143.12,
    radius: 45,
    crops: ['sweet potato', 'coffee', 'pigs'],
    cora: false,
    culturalFact: 'Huli wigmen are famous for their elaborate human-hair wigs decorated with flowers and feathers. Young men spend years growing and shaping their wigs as a mark of manhood.'
  },
  {
    id: 'enga',
    name: 'Enga',
    isoCode: 'enq',
    family: 'Trans-New Guinea',
    speakers: 230000,
    province: 'Enga',
    lat: -5.65,
    lng: 143.75,
    radius: 55,
    crops: ['sweet potato', 'coffee'],
    cora: false,
    culturalFact: 'The Enga people hold the Tee ceremonial exchange cycle — a vast network of pig exchanges that binds communities across the highlands in reciprocal obligation and alliance.'
  },
  {
    id: 'melpa',
    name: 'Melpa',
    isoCode: 'med',
    family: 'Trans-New Guinea',
    speakers: 130000,
    province: 'Western Highlands',
    lat: -5.83,
    lng: 144.22,
    radius: 42,
    crops: ['coffee', 'sweet potato', 'vegetables'],
    cora: true,
    culturalFact: 'Melpa-speaking people of Mt. Hagen host the famous Hagen Show — one of the largest cultural festivals in the Pacific, with thousands of performers in full ceremonial dress.'
  },
  {
    id: 'kuman',
    name: 'Kuman',
    isoCode: 'kue',
    family: 'Trans-New Guinea',
    speakers: 80000,
    province: 'Simbu',
    lat: -6.05,
    lng: 144.65,
    radius: 35,
    crops: ['coffee', 'sweet potato'],
    cora: false,
    culturalFact: 'Simbu people are renowned climbers and have played a prominent role in PNG\'s mountaineering history. Their terraced garden systems are visible from the air across steep valley walls.'
  },
  {
    id: 'yabem',
    name: 'Yabem',
    isoCode: 'jae',
    family: 'Austronesian',
    speakers: 10000,
    province: 'Morobe',
    lat: -6.55,
    lng: 147.35,
    radius: 18,
    crops: ['coconut', 'cocoa', 'betel nut'],
    cora: false,
    culturalFact: 'Yabem was one of the first PNG languages reduced to writing by Lutheran missionaries in the 1880s, and served as a church lingua franca across Morobe and Madang provinces for over a century.'
  },
  {
    id: 'tolai',
    name: 'Tolai',
    isoCode: 'ksd',
    family: 'Austronesian',
    speakers: 120000,
    province: 'East New Britain',
    lat: -4.2,
    lng: 152.18,
    radius: 40,
    crops: ['coconut', 'cocoa', 'vanilla'],
    cora: false,
    culturalFact: 'The Tolai use tambu — coils of tiny cowrie shells — as a traditional currency still exchanged at bride prices, mortuary feasts, and markets. One full coil can buy a pig.'
  },
  {
    id: 'motu',
    name: 'Motu',
    isoCode: 'meu',
    family: 'Austronesian',
    speakers: 30000,
    province: 'Central',
    lat: -9.45,
    lng: 147.18,
    radius: 22,
    crops: ['sago', 'fish', 'coconut'],
    cora: false,
    culturalFact: 'Motu people launched the annual Hiri trade voyage — large lagatoi canoes sailing hundreds of kilometers to trade clay pots for sago with Gulf Province peoples, a tradition maintained for centuries.'
  },
  {
    id: 'kuanua',
    name: 'Kuanua',
    isoCode: 'ksd',
    family: 'Austronesian',
    speakers: 60000,
    province: 'East New Britain',
    lat: -4.35,
    lng: 151.95,
    radius: 30,
    crops: ['coconut', 'cocoa'],
    cora: false,
    culturalFact: 'East New Britain\'s Tolai/Kuanua people developed some of the most elaborate secret society traditions in Melanesia, including the Dukduk masked figures that enforced social law.'
  },
  {
    id: 'bena-bena',
    name: 'Bena Bena',
    isoCode: 'bef',
    family: 'Trans-New Guinea',
    speakers: 50000,
    province: 'Eastern Highlands',
    lat: -6.08,
    lng: 145.38,
    radius: 28,
    crops: ['coffee', 'sweet potato', 'pyrethrum'],
    cora: false,
    culturalFact: 'The Eastern Highlands was site of one of history\'s most dramatic first contacts — when prospectors Michael Leahy and Daniel Leahy walked into the Goroka valley in 1930, encountering a million people previously unknown to the outside world.'
  },
  {
    id: 'wahgi',
    name: 'Wahgi',
    isoCode: 'wgb',
    family: 'Trans-New Guinea',
    speakers: 100000,
    province: 'Western Highlands',
    lat: -5.72,
    lng: 144.45,
    radius: 38,
    crops: ['coffee', 'tea', 'vegetables'],
    cora: true,
    culturalFact: 'The Wahgi Valley is the breadbasket of the PNG highlands — fertile volcanic soils produce some of the finest Arabica coffee in the world at elevations above 1,600 meters.'
  },
  {
    id: 'orokaiva',
    name: 'Orokaiva',
    isoCode: 'okv',
    family: 'Papuan',
    speakers: 40000,
    province: 'Oro',
    lat: -8.6,
    lng: 148.05,
    radius: 25,
    crops: ['cocoa', 'coconut', 'taro'],
    cora: false,
    culturalFact: 'The Orokaiva taro initiations involve weeks of ritual where young people are symbolically "killed" and "reborn" as adults — the taro plant itself represents life, death, and renewal.'
  },
  {
    id: 'gogodala',
    name: 'Gogodala',
    isoCode: 'ggw',
    family: 'Papuan',
    speakers: 25000,
    province: 'Western',
    lat: -7.32,
    lng: 141.28,
    radius: 22,
    crops: ['sago', 'fish', 'coconut'],
    cora: false,
    culturalFact: 'Gogodala longhouses — called alé — once stretched up to 100 meters long, housing entire clan groups. Intricate geometric designs painted on canoe prows and shields are among PNG\'s finest traditional art forms.'
  },
  {
    id: 'kiwai',
    name: 'Kiwai',
    isoCode: 'kiw',
    family: 'Papuan',
    speakers: 30000,
    province: 'Western',
    lat: -8.55,
    lng: 143.28,
    radius: 22,
    crops: ['sago', 'coconut', 'yam'],
    cora: false,
    culturalFact: 'Kiwai Island people are master dugout canoe builders. Their elaborate initiation ceremonies once involved the construction of massive communal houses that took entire villages months to complete.'
  },
  {
    id: 'chimbu',
    name: 'Chimbu',
    isoCode: 'cbu',
    family: 'Trans-New Guinea',
    speakers: 100000,
    province: 'Simbu',
    lat: -6.15,
    lng: 144.88,
    radius: 38,
    crops: ['coffee', 'sweet potato'],
    cora: false,
    culturalFact: 'Chimbu skull houses hold the bones of ancestors, consulted for guidance before important decisions. Ancestor veneration remains central to Chimbu identity despite over a century of missionary contact.'
  },
  {
    id: 'sepik',
    name: 'Iatmul (Sepik)',
    isoCode: 'ian',
    family: 'Papuan',
    speakers: 15000,
    province: 'East Sepik',
    lat: -4.05,
    lng: 143.55,
    radius: 20,
    crops: ['sago', 'fish', 'yam'],
    cora: false,
    culturalFact: 'The Sepik River men\'s houses (Haus Tambaran) are among the world\'s most extraordinary architectural achievements — towering facades covered in painted carvings reaching 25 meters high.'
  },
  {
    id: 'karo',
    name: 'Kaironk',
    isoCode: 'kbg',
    family: 'Trans-New Guinea',
    speakers: 8000,
    province: 'Madang',
    lat: -5.45,
    lng: 144.95,
    radius: 15,
    crops: ['coffee', 'betel nut', 'taro'],
    cora: false,
    culturalFact: 'Madang Province is known as the "prettiest town in the Pacific" — its people have maintained strong maritime traditions blending Austronesian and Papuan cultural elements for millennia.'
  },
  {
    id: 'managalas',
    name: 'Managalas',
    isoCode: 'mls',
    family: 'Papuan',
    speakers: 12000,
    province: 'Oro',
    lat: -8.2,
    lng: 147.6,
    radius: 18,
    crops: ['cocoa', 'taro', 'yam'],
    cora: false,
    culturalFact: 'The Managalas plateau is one of PNG\'s most isolated regions, reached only by small aircraft. Communities here have maintained traditional land management practices that have kept forests intact for generations.'
  },
  {
    id: 'dobu',
    name: 'Dobu',
    isoCode: 'dob',
    family: 'Austronesian',
    speakers: 8000,
    province: 'Milne Bay',
    lat: -9.75,
    lng: 150.85,
    radius: 15,
    crops: ['yam', 'sago', 'coconut'],
    cora: false,
    culturalFact: 'Dobu islanders are renowned participants in the Kula Ring — a vast ceremonial exchange of shell valuables circulating clockwise and counter-clockwise across hundreds of islands in Milne Bay.'
  },
  {
    id: 'mekeo',
    name: 'Mekeo',
    isoCode: 'mek',
    family: 'Austronesian',
    speakers: 18000,
    province: 'Central',
    lat: -8.42,
    lng: 146.55,
    radius: 20,
    crops: ['sago', 'betel nut', 'coconut'],
    cora: false,
    culturalFact: 'Mekeo chiefs (ugauga) are one of the few hereditary chieftainships in PNG. Their regalia — elaborate headdresses and bark cloth robes — can only be worn during prescribed ceremonies.'
  }
];

export const PROVINCES = [...new Set(LANGUAGE_GROUPS.map(l => l.province))].sort();
export const CROPS = [...new Set(LANGUAGE_GROUPS.flatMap(l => l.crops))].sort();
export const FAMILIES = [...new Set(LANGUAGE_GROUPS.map(l => l.family))].sort();
