import type { Lang } from './i18n';

export type MapLayer =
  | 'boundaries'
  | 'ndvi'
  | 'ndmi'
  | 'ndre'
  | 'zones'
  | 'vra'
  | 'scouting';

export type EstateMapId = 'subang-jabar' | 'lampung-tengah' | 'merauke-papua';

export interface SeasonSnapshot {
  date: string;
  shortDate: string;
  cloudCover: number;
  meanNdvi: number;
  minNdvi: number;
  maxNdvi: number;
  growthStage: Record<Lang, string>;
  biomassIndex: number;
  sprayWindow: 'Optimal' | 'Marginal' | 'Hold';
  windKmh: number;
  tempC: number;
  rainMm: number;
  nitrogenKgHa: number;
  phosphorusKgHa: number;
  potassiumKgHa: number;
}

export interface ZoneConfig {
  id: 'high' | 'medium' | 'low';
  label: Record<Lang, string>;
  sharePct: number;
  areaHa: number;
  defaultRateKgHa: number;
  yieldPotentialTHa: number;
}

export interface FieldParcel {
  id: string;
  name: Record<Lang, string>;
  crop: Record<Lang, string>;
  variety: string;
  areaHa: number;
  sowingDate: string;
  soilType: Record<Lang, string>;
  uniformRateKgHa: number;
  fertilizerProduct: Record<Lang, string>;
  polygonPath: string;
  labelPos: { x: number; y: number };
  centerGeo: [number, number]; // [lng, lat] in Indonesia (Subang / Indramayu, West Java)
  snapshots: SeasonSnapshot[];
  zones: ZoneConfig[];
  ndviGradientStops: { offset: string; color: string }[];
  zoneSubPolygons: {
    high: string;
    low: string;
  };
}

export interface ScoutingNote {
  id: string;
  fieldId: string;
  x: number; // SVG 0-1000
  y: number; // SVG 0-562
  category: 'Weed Pressure' | 'Nitrogen Deficiency' | 'Pest / Disease' | 'Emergence Check';
  severity: 'Low' | 'Moderate' | 'High';
  author: string;
  date: string;
  note: Record<Lang, string>;
}

export const SEASON_DATES = [
  'Jan 15',
  'Feb 08',
  'Mar 02',
  'Mar 26',
  'Apr 18',
  'May 10',
];

export const FIELD_PARCELS: FieldParcel[] = [
  {
    id: 'blok-utara-a',
    name: { en: 'North Paddy Block A', id: 'Blok Sawah Utara A' },
    crop: { en: 'Irrigated Rice', id: 'Padi Sawah' },
    variety: 'Inpari 32 HDB',
    areaHa: 118.4,
    sowingDate: 'Jan 04',
    soilType: { en: 'Alluvial Clay', id: 'Aluvial Liat' },
    uniformRateKgHa: 175,
    fertilizerProduct: { en: 'Urea Prill (46% N)', id: 'Urea Bersubsidi / Prill (46% N)' },
    polygonPath: 'M 118 135 Q 155 88 315 68 L 474 68 L 464 246 L 104 226 Z',
    labelPos: { x: 290, y: 155 },
    centerGeo: [107.7614, -6.4182],
    ndviGradientStops: [
      { offset: '0%', color: '#059669' },
      { offset: '55%', color: '#22C55E' },
      { offset: '100%', color: '#84CC16' },
    ],
    zoneSubPolygons: {
      high: 'M 130 140 Q 170 95 315 76 L 458 76 L 450 175 Q 290 158 122 182 Z',
      low: 'M 110 198 L 456 218 L 462 246 L 104 226 Z',
    },
    zones: [
      {
        id: 'high',
        label: { en: 'Zone A · High Potential', id: 'Zona A · Potensi Tinggi' },
        sharePct: 48,
        areaHa: 56.8,
        defaultRateKgHa: 195,
        yieldPotentialTHa: 7.4,
      },
      {
        id: 'medium',
        label: { en: 'Zone B · Target Mean', id: 'Zona B · Target Sedang' },
        sharePct: 37,
        areaHa: 43.8,
        defaultRateKgHa: 155,
        yieldPotentialTHa: 6.2,
      },
      {
        id: 'low',
        label: { en: 'Zone C · Bund / Stress', id: 'Zona C · Tepi / Stres' },
        sharePct: 15,
        areaHa: 17.8,
        defaultRateKgHa: 115,
        yieldPotentialTHa: 4.8,
      },
    ],
    snapshots: [
      {
        date: '2026-01-15',
        shortDate: 'Jan 15',
        cloudCover: 8,
        meanNdvi: 0.36,
        minNdvi: 0.24,
        maxNdvi: 0.46,
        growthStage: { en: '14 DAT · Early Tillering', id: '14 HST · Anakan Awal' },
        biomassIndex: 1.8,
        sprayWindow: 'Optimal',
        windKmh: 7,
        tempC: 29,
        rainMm: 0.5,
        nitrogenKgHa: 142,
        phosphorusKgHa: 54,
        potassiumKgHa: 168,
      },
      {
        date: '2026-02-08',
        shortDate: 'Feb 08',
        cloudCover: 4,
        meanNdvi: 0.61,
        minNdvi: 0.45,
        maxNdvi: 0.72,
        growthStage: { en: '38 DAT · Active Tillering', id: '38 HST · Anakan Aktif' },
        biomassIndex: 3.9,
        sprayWindow: 'Optimal',
        windKmh: 8,
        tempC: 30,
        rainMm: 0,
        nitrogenKgHa: 164,
        phosphorusKgHa: 49,
        potassiumKgHa: 158,
      },
      {
        date: '2026-03-02',
        shortDate: 'Mar 02',
        cloudCover: 6,
        meanNdvi: 0.78,
        minNdvi: 0.62,
        maxNdvi: 0.86,
        growthStage: { en: '60 DAT · Panicle Initiation', id: '60 HST · Primordia / Bunting' },
        biomassIndex: 5.5,
        sprayWindow: 'Marginal',
        windKmh: 16,
        tempC: 31,
        rainMm: 1.8,
        nitrogenKgHa: 128,
        phosphorusKgHa: 44,
        potassiumKgHa: 141,
      },
      {
        date: '2026-03-26',
        shortDate: 'Mar 26',
        cloudCover: 2,
        meanNdvi: 0.85,
        minNdvi: 0.69,
        maxNdvi: 0.91,
        growthStage: { en: '84 DAT · Flowering & Heading', id: '84 HST · Pembungaan & Malai' },
        biomassIndex: 6.3,
        sprayWindow: 'Optimal',
        windKmh: 6,
        tempC: 31,
        rainMm: 0,
        nitrogenKgHa: 102,
        phosphorusKgHa: 38,
        potassiumKgHa: 126,
      },
      {
        date: '2026-04-18',
        shortDate: 'Apr 18',
        cloudCover: 9,
        meanNdvi: 0.66,
        minNdvi: 0.49,
        maxNdvi: 0.77,
        growthStage: { en: '107 DAT · Dough Stage', id: '107 HST · Pengisian Bulir' },
        biomassIndex: 4.7,
        sprayWindow: 'Hold',
        windKmh: 21,
        tempC: 32,
        rainMm: 7.4,
        nitrogenKgHa: 84,
        phosphorusKgHa: 34,
        potassiumKgHa: 112,
      },
      {
        date: '2026-05-10',
        shortDate: 'May 10',
        cloudCover: 0,
        meanNdvi: 0.38,
        minNdvi: 0.25,
        maxNdvi: 0.48,
        growthStage: { en: '129 DAT · Harvest Maturity', id: '129 HST · Masak Panen' },
        biomassIndex: 2.3,
        sprayWindow: 'Optimal',
        windKmh: 7,
        tempC: 30,
        rainMm: 0,
        nitrogenKgHa: 72,
        phosphorusKgHa: 31,
        potassiumKgHa: 104,
      },
    ],
  },
  {
    id: 'blok-timur-b',
    name: { en: 'East Corn Block B', id: 'Blok Jagung Timur B' },
    crop: { en: 'Hybrid Corn', id: 'Jagung Hibrida' },
    variety: 'BISI-18',
    areaHa: 134.2,
    sowingDate: 'Jan 10',
    soilType: { en: 'Sandy Loam', id: 'Lempung Berpasir' },
    uniformRateKgHa: 185,
    fertilizerProduct: { en: 'NPK Phonska (15-15-15)', id: 'NPK Phonska (15-15-15)' },
    polygonPath: 'M 505 78 Q 595 66 710 86 Q 795 102 855 90 L 875 182 L 856 248 L 512 266 L 502 152 Z',
    labelPos: { x: 690, y: 168 },
    centerGeo: [107.7728, -6.4188],
    ndviGradientStops: [
      { offset: '0%', color: '#16A34A' },
      { offset: '55%', color: '#84CC16' },
      { offset: '100%', color: '#EAB308' },
    ],
    zoneSubPolygons: {
      high: 'M 510 86 Q 600 74 712 94 L 680 250 L 516 258 Z',
      low: 'M 685 110 L 850 96 L 868 184 L 850 242 L 690 248 Z',
    },
    zones: [
      {
        id: 'high',
        label: { en: 'Zone A · High Potential', id: 'Zona A · Potensi Tinggi' },
        sharePct: 41,
        areaHa: 55.0,
        defaultRateKgHa: 210,
        yieldPotentialTHa: 9.6,
      },
      {
        id: 'medium',
        label: { en: 'Zone B · Target Mean', id: 'Zona B · Target Sedang' },
        sharePct: 39,
        areaHa: 52.3,
        defaultRateKgHa: 160,
        yieldPotentialTHa: 7.9,
      },
      {
        id: 'low',
        label: { en: 'Zone C · Sandy Ridge', id: 'Zona C · Pematang Berpasir' },
        sharePct: 20,
        areaHa: 26.9,
        defaultRateKgHa: 120,
        yieldPotentialTHa: 5.8,
      },
    ],
    snapshots: [
      {
        date: '2026-01-15',
        shortDate: 'Jan 15',
        cloudCover: 8,
        meanNdvi: 0.22,
        minNdvi: 0.16,
        maxNdvi: 0.28,
        growthStage: { en: 'VE · Emergence', id: 'Fase VE · Perkecambahan' },
        biomassIndex: 0.7,
        sprayWindow: 'Optimal',
        windKmh: 7,
        tempC: 29,
        rainMm: 0.5,
        nitrogenKgHa: 158,
        phosphorusKgHa: 62,
        potassiumKgHa: 174,
      },
      {
        date: '2026-02-08',
        shortDate: 'Feb 08',
        cloudCover: 4,
        meanNdvi: 0.41,
        minNdvi: 0.29,
        maxNdvi: 0.52,
        growthStage: { en: 'V6 · Rapid Vegetative', id: 'Fase V6 · Vegetatif Cepat' },
        biomassIndex: 2.2,
        sprayWindow: 'Optimal',
        windKmh: 8,
        tempC: 30,
        rainMm: 0,
        nitrogenKgHa: 176,
        phosphorusKgHa: 58,
        potassiumKgHa: 165,
      },
      {
        date: '2026-03-02',
        shortDate: 'Mar 02',
        cloudCover: 6,
        meanNdvi: 0.67,
        minNdvi: 0.49,
        maxNdvi: 0.77,
        growthStage: { en: 'VT · Tasseling', id: 'Fase VT · Keluar Malai Jantan' },
        biomassIndex: 4.5,
        sprayWindow: 'Marginal',
        windKmh: 16,
        tempC: 31,
        rainMm: 1.8,
        nitrogenKgHa: 138,
        phosphorusKgHa: 51,
        potassiumKgHa: 146,
      },
      {
        date: '2026-03-26',
        shortDate: 'Mar 26',
        cloudCover: 2,
        meanNdvi: 0.81,
        minNdvi: 0.64,
        maxNdvi: 0.89,
        growthStage: { en: 'R3 · Milk Stage', id: 'Fase R3 · Pengisian Tongkol' },
        biomassIndex: 5.9,
        sprayWindow: 'Optimal',
        windKmh: 6,
        tempC: 31,
        rainMm: 0,
        nitrogenKgHa: 108,
        phosphorusKgHa: 43,
        potassiumKgHa: 129,
      },
      {
        date: '2026-04-18',
        shortDate: 'Apr 18',
        cloudCover: 9,
        meanNdvi: 0.74,
        minNdvi: 0.56,
        maxNdvi: 0.83,
        growthStage: { en: 'R5 · Dent Stage', id: 'Fase R5 · Pengerasan Biji' },
        biomassIndex: 5.2,
        sprayWindow: 'Hold',
        windKmh: 21,
        tempC: 32,
        rainMm: 7.4,
        nitrogenKgHa: 89,
        phosphorusKgHa: 39,
        potassiumKgHa: 118,
      },
      {
        date: '2026-05-10',
        shortDate: 'May 10',
        cloudCover: 0,
        meanNdvi: 0.45,
        minNdvi: 0.31,
        maxNdvi: 0.56,
        growthStage: { en: 'R6 · Physiological Maturity', id: 'Fase R6 · Masak Fisiologis' },
        biomassIndex: 2.9,
        sprayWindow: 'Optimal',
        windKmh: 7,
        tempC: 30,
        rainMm: 0,
        nitrogenKgHa: 76,
        phosphorusKgHa: 36,
        potassiumKgHa: 109,
      },
    ],
  },
  {
    id: 'blok-barat-c',
    name: { en: 'West Soybean Block C', id: 'Blok Kedelai Barat C' },
    crop: { en: 'Soybeans', id: 'Kedelai' },
    variety: 'Anjasmoro',
    areaHa: 96.8,
    sowingDate: 'Jan 22',
    soilType: { en: 'Latosol Loam', id: 'Latosol Lempung' },
    uniformRateKgHa: 100,
    fertilizerProduct: { en: 'SP-36 & KCl Starter', id: 'Pupuk Dasar SP-36 & KCl' },
    polygonPath: 'M 106 266 L 468 298 L 478 468 L 105 398 Q 92 332 106 266 Z',
    labelPos: { x: 288, y: 365 },
    centerGeo: [107.7611, -6.4234],
    ndviGradientStops: [
      { offset: '0%', color: '#65A30D' },
      { offset: '55%', color: '#EAB308' },
      { offset: '100%', color: '#DC2626' },
    ],
    zoneSubPolygons: {
      high: 'M 114 274 L 385 298 L 360 398 L 110 356 Z',
      low: 'M 110 364 L 468 418 L 474 464 L 106 396 Z',
    },
    zones: [
      {
        id: 'high',
        label: { en: 'Zone A · Deep Moisture', id: 'Zona A · Kelembapan Optimal' },
        sharePct: 44,
        areaHa: 42.6,
        defaultRateKgHa: 85,
        yieldPotentialTHa: 2.9,
      },
      {
        id: 'medium',
        label: { en: 'Zone B · Target Mean', id: 'Zona B · Target Sedang' },
        sharePct: 36,
        areaHa: 34.8,
        defaultRateKgHa: 100,
        yieldPotentialTHa: 2.4,
      },
      {
        id: 'low',
        label: { en: 'Zone C · Compaction Edge', id: 'Zona C · Pemadatan Tepi' },
        sharePct: 20,
        areaHa: 19.4,
        defaultRateKgHa: 115,
        yieldPotentialTHa: 1.7,
      },
    ],
    snapshots: [
      {
        date: '2026-01-15',
        shortDate: 'Jan 15',
        cloudCover: 8,
        meanNdvi: 0.19,
        minNdvi: 0.14,
        maxNdvi: 0.24,
        growthStage: { en: 'Pre-Sowing Bed Prep', id: 'Olah Tanah Persiapan' },
        biomassIndex: 0.4,
        sprayWindow: 'Optimal',
        windKmh: 7,
        tempC: 29,
        rainMm: 0.5,
        nitrogenKgHa: 94,
        phosphorusKgHa: 58,
        potassiumKgHa: 152,
      },
      {
        date: '2026-02-08',
        shortDate: 'Feb 08',
        cloudCover: 4,
        meanNdvi: 0.31,
        minNdvi: 0.22,
        maxNdvi: 0.39,
        growthStage: { en: 'V2 · Trifoliate', id: 'Fase V2 · Daun Majemuk' },
        biomassIndex: 1.3,
        sprayWindow: 'Optimal',
        windKmh: 8,
        tempC: 30,
        rainMm: 0,
        nitrogenKgHa: 102,
        phosphorusKgHa: 53,
        potassiumKgHa: 145,
      },
      {
        date: '2026-03-02',
        shortDate: 'Mar 02',
        cloudCover: 6,
        meanNdvi: 0.54,
        minNdvi: 0.38,
        maxNdvi: 0.66,
        growthStage: { en: 'R1 · Beginning Bloom', id: 'Fase R1 · Awal Berbunga' },
        biomassIndex: 3.1,
        sprayWindow: 'Marginal',
        windKmh: 16,
        tempC: 31,
        rainMm: 1.8,
        nitrogenKgHa: 112,
        phosphorusKgHa: 46,
        potassiumKgHa: 132,
      },
      {
        date: '2026-03-26',
        shortDate: 'Mar 26',
        cloudCover: 2,
        meanNdvi: 0.73,
        minNdvi: 0.55,
        maxNdvi: 0.83,
        growthStage: { en: 'R5 · Pod Fill', id: 'Fase R5 · Pengisian Polong' },
        biomassIndex: 4.8,
        sprayWindow: 'Optimal',
        windKmh: 6,
        tempC: 31,
        rainMm: 0,
        nitrogenKgHa: 98,
        phosphorusKgHa: 39,
        potassiumKgHa: 118,
      },
      {
        date: '2026-04-18',
        shortDate: 'Apr 18',
        cloudCover: 9,
        meanNdvi: 0.68,
        minNdvi: 0.49,
        maxNdvi: 0.78,
        growthStage: { en: 'R7 · Beginning Maturity', id: 'Fase R7 · Polong Menguning' },
        biomassIndex: 4.1,
        sprayWindow: 'Hold',
        windKmh: 21,
        tempC: 32,
        rainMm: 7.4,
        nitrogenKgHa: 86,
        phosphorusKgHa: 35,
        potassiumKgHa: 106,
      },
      {
        date: '2026-05-10',
        shortDate: 'May 10',
        cloudCover: 0,
        meanNdvi: 0.28,
        minNdvi: 0.19,
        maxNdvi: 0.36,
        growthStage: { en: 'R8 · Harvest Ready', id: 'Fase R8 · Siap Panen' },
        biomassIndex: 1.2,
        sprayWindow: 'Optimal',
        windKmh: 7,
        tempC: 30,
        rainMm: 0,
        nitrogenKgHa: 82,
        phosphorusKgHa: 33,
        potassiumKgHa: 101,
      },
    ],
  },
  {
    id: 'blok-selatan-d',
    name: { en: 'South Sugarcane Block D', id: 'Blok Tebu Selatan D' },
    crop: { en: 'Sugarcane', id: 'Tebu' },
    variety: 'PS 881',
    areaHa: 152.0,
    sowingDate: 'Oct 18',
    soilType: { en: 'Fertile Regosol', id: 'Regosol Subur' },
    uniformRateKgHa: 200,
    fertilizerProduct: { en: 'ZA & Urea Blend', id: 'Campuran ZA & Urea' },
    polygonPath: 'M 510 296 L 875 268 Q 898 352 870 462 Q 705 492 512 465 Z',
    labelPos: { x: 696, y: 378 },
    centerGeo: [107.7736, -6.4239],
    ndviGradientStops: [
      { offset: '0%', color: '#059669' },
      { offset: '55%', color: '#84CC16' },
      { offset: '100%', color: '#F59E0B' },
    ],
    zoneSubPolygons: {
      high: 'M 516 302 L 735 284 L 680 462 L 518 458 Z',
      low: 'M 710 315 L 866 286 Q 888 355 862 454 L 728 468 Z',
    },
    zones: [
      {
        id: 'high',
        label: { en: 'Zone A · High Potential', id: 'Zona A · Potensi Tinggi' },
        sharePct: 46,
        areaHa: 69.9,
        defaultRateKgHa: 220,
        yieldPotentialTHa: 98.5,
      },
      {
        id: 'medium',
        label: { en: 'Zone B · Target Mean', id: 'Zona B · Target Sedang' },
        sharePct: 35,
        areaHa: 53.2,
        defaultRateKgHa: 175,
        yieldPotentialTHa: 84.0,
      },
      {
        id: 'low',
        label: { en: 'Zone C · Drainage Slope', id: 'Zona C · Lereng Drainase' },
        sharePct: 19,
        areaHa: 28.9,
        defaultRateKgHa: 130,
        yieldPotentialTHa: 64.5,
      },
    ],
    snapshots: [
      {
        date: '2026-01-15',
        shortDate: 'Jan 15',
        cloudCover: 8,
        meanNdvi: 0.65,
        minNdvi: 0.48,
        maxNdvi: 0.76,
        growthStage: { en: 'Grand Growth · Canopy Close', id: 'Fase Pertumbuhan Batang' },
        biomassIndex: 4.5,
        sprayWindow: 'Optimal',
        windKmh: 7,
        tempC: 29,
        rainMm: 0.5,
        nitrogenKgHa: 184,
        phosphorusKgHa: 68,
        potassiumKgHa: 196,
      },
      {
        date: '2026-02-08',
        shortDate: 'Feb 08',
        cloudCover: 4,
        meanNdvi: 0.74,
        minNdvi: 0.56,
        maxNdvi: 0.84,
        growthStage: { en: 'Stalk Elongation', id: 'Pemanjangan Ruas Batang' },
        biomassIndex: 5.4,
        sprayWindow: 'Optimal',
        windKmh: 8,
        tempC: 30,
        rainMm: 0,
        nitrogenKgHa: 162,
        phosphorusKgHa: 61,
        potassiumKgHa: 181,
      },
      {
        date: '2026-03-02',
        shortDate: 'Mar 02',
        cloudCover: 6,
        meanNdvi: 0.81,
        minNdvi: 0.63,
        maxNdvi: 0.89,
        growthStage: { en: 'Peak Sugar Accumulation', id: 'Akumulasi Rendemen Gula' },
        biomassIndex: 6.1,
        sprayWindow: 'Marginal',
        windKmh: 16,
        tempC: 31,
        rainMm: 1.8,
        nitrogenKgHa: 141,
        phosphorusKgHa: 54,
        potassiumKgHa: 162,
      },
      {
        date: '2026-03-26',
        shortDate: 'Mar 26',
        cloudCover: 2,
        meanNdvi: 0.76,
        minNdvi: 0.59,
        maxNdvi: 0.85,
        growthStage: { en: 'Ripening Phase', id: 'Fase Pemasakan Batang' },
        biomassIndex: 5.5,
        sprayWindow: 'Optimal',
        windKmh: 6,
        tempC: 31,
        rainMm: 0,
        nitrogenKgHa: 118,
        phosphorusKgHa: 48,
        potassiumKgHa: 144,
      },
      {
        date: '2026-04-18',
        shortDate: 'Apr 18',
        cloudCover: 9,
        meanNdvi: 0.62,
        minNdvi: 0.46,
        maxNdvi: 0.72,
        growthStage: { en: 'Pre-Harvest Drying', id: 'Pengeringan Pra-Tebang' },
        biomassIndex: 4.0,
        sprayWindow: 'Hold',
        windKmh: 21,
        tempC: 32,
        rainMm: 7.4,
        nitrogenKgHa: 96,
        phosphorusKgHa: 43,
        potassiumKgHa: 132,
      },
      {
        date: '2026-05-10',
        shortDate: 'May 10',
        cloudCover: 0,
        meanNdvi: 0.44,
        minNdvi: 0.29,
        maxNdvi: 0.54,
        growthStage: { en: 'Milling Harvest Window', id: 'Musim Giling & Tebang' },
        biomassIndex: 2.5,
        sprayWindow: 'Optimal',
        windKmh: 7,
        tempC: 30,
        rainMm: 0,
        nitrogenKgHa: 84,
        phosphorusKgHa: 40,
        potassiumKgHa: 124,
      },
    ],
  },
];

export const INITIAL_SCOUTING_NOTES: ScoutingNote[] = [
  {
    id: 'scout-1',
    fieldId: 'blok-utara-a',
    x: 238,
    y: 195,
    category: 'Nitrogen Deficiency',
    severity: 'Moderate',
    author: 'Budi Santoso, Agronomis Lapangan',
    date: 'Mar 20',
    note: {
      en: 'Mild leaf yellowing near southern irrigation inlet. Recommended +20 kg/ha Urea top-dress in Zone C.',
      id: 'Daun agak menguning di dekat saluran irigasi selatan. Disarankan susulan Urea +20 kg/ha pada Zona C.',
    },
  },
  {
    id: 'scout-2',
    fieldId: 'blok-timur-b',
    x: 755,
    y: 162,
    category: 'Emergence Check',
    severity: 'Low',
    author: 'Ahmad Fauzi, Teknisi Lahan',
    date: 'Feb 14',
    note: {
      en: 'Plant stand averaged 7.4 plants/m2 on sandy ridge. Uniform spacing confirmed after calibration.',
      id: 'Populasi tumbuh rata-rata 7,4 tanaman/m2 di pematang berpasir. Jarak tanam seragam terkonfirmasi.',
    },
  },
  {
    id: 'scout-3',
    fieldId: 'blok-barat-c',
    x: 342,
    y: 412,
    category: 'Weed Pressure',
    severity: 'High',
    author: 'Siti Rahmawati, Pengendali OPT',
    date: 'Mar 06',
    note: {
      en: 'Dense sedge & broadleaf weed patch near drainage ditch. Targeted spot-spray map sent to drone operator.',
      id: 'Rumpun gulma rumput teki cukup rapat di dekat parit drainase. Peta semprot titik sudah dikirim ke operator drone.',
    },
  },
  {
    id: 'scout-4',
    fieldId: 'blok-selatan-d',
    x: 790,
    y: 358,
    category: 'Pest / Disease',
    severity: 'Moderate',
    author: 'Siti Rahmawati, Pengendali OPT',
    date: 'Feb 24',
    note: {
      en: 'Top borer signs observed at 3.1% incidence along eastern slope. Below economic threshold; re-inspect in 5 days.',
      id: 'Gejala penggerek pucuk teramati 3,1% di lereng timur. Masih di bawah ambang ekonomi; cek ulang 5 hari lagi.',
    },
  },
];

export interface ForecastDay {
  dayOffset: number;
  dateLabel: string;
  weekday: Record<Lang, string>;
  condition: 'clear' | 'cloudy' | 'rain' | 'storm' | 'windy';
  tempMaxC: number;
  tempMinC: number;
  windKmh: number;
  rainMm: number;
  humidityPct: number;
  suitability: 'Optimal' | 'Marginal' | 'Hold';
  operationAdvice: Record<Lang, string>;
}

export interface FieldWeatherOutlook {
  historical7dAvgTempC: number;
  historical7dAvgWindKmh: number;
  historical7dRainMm: number;
  optimalDaysCount: number;
  days: ForecastDay[];
}

const WEEKDAYS: Record<Lang, string[]> = {
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  id: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'],
};

const MONTH_ABBR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function getField7DayOutlook(
  field: FieldParcel,
  snapshotIndex: number
): FieldWeatherOutlook {
  const baseSnap = field.snapshots[snapshotIndex] ?? field.snapshots[0];
  const prevSnap = field.snapshots[Math.max(0, snapshotIndex - 1)] ?? baseSnap;

  const historical7dAvgTempC = Number(
    ((baseSnap.tempC + prevSnap.tempC) / 2).toFixed(1)
  );
  const historical7dAvgWindKmh = Number(
    ((baseSnap.windKmh + prevSnap.windKmh) / 2).toFixed(1)
  );
  const historical7dRainMm = Number(
    ((baseSnap.rainMm * 2.2 + prevSnap.rainMm * 1.8) + 1.4).toFixed(1)
  );

  // Seed deterministic field+date microclimate variations
  const fieldSeed =
    field.id === 'blok-utara-a'
      ? 0
      : field.id === 'blok-timur-b'
      ? 2
      : field.id === 'blok-barat-c'
      ? 1
      : 3;

  // Tropical Subang 7-day pattern curves
  const windOffsets = [-2, 1, 5, -1, 7, -3, -2];
  const rainCurve = [0, 0.2, 2.4, 0, 5.8, 0.4, 0];
  const tempOffsets = [0, 1, -1, 1, -2, 0, 1];

  const baseDateObj = new Date(`${baseSnap.date}T12:00:00Z`);

  const days: ForecastDay[] = Array.from({ length: 7 }, (_, idx) => {
    const d = new Date(baseDateObj.getTime());
    d.setUTCDate(d.getUTCDate() + idx + 1);
    const weekdayIdx = d.getUTCDay();
    const dateLabel = `${MONTH_ABBR[d.getUTCMonth()]} ${String(d.getUTCDate()).padStart(2, '0')}`;

    const shiftedIdx = (idx + fieldSeed + snapshotIndex) % 7;
    const rawWind = Math.max(
      4,
      Math.round(baseSnap.windKmh * 0.65 + 4 + windOffsets[shiftedIdx])
    );
    const rawRain = Number(
      Math.max(0, rainCurve[shiftedIdx] + (baseSnap.rainMm > 3 && idx < 2 ? 1.5 : 0)).toFixed(1)
    );
    const tempMaxC = Math.min(34, Math.max(27, baseSnap.tempC + tempOffsets[shiftedIdx]));
    const tempMinC = tempMaxC - 7;
    const humidityPct = Math.min(92, Math.max(66, Math.round(72 + rawRain * 2.8)));

    const suitability: ForecastDay['suitability'] =
      rawWind > 18 || rawRain > 3
        ? 'Hold'
        : rawWind > 12 || rawRain > 0.5
        ? 'Marginal'
        : 'Optimal';

    const condition: ForecastDay['condition'] =
      rawRain >= 3
        ? 'storm'
        : rawRain > 0.5
        ? 'rain'
        : rawWind > 12
        ? 'windy'
        : idx % 2 === 0
        ? 'clear'
        : 'cloudy';

    const operationAdvice: Record<Lang, string> =
      suitability === 'Optimal'
        ? {
            en: `Clear window for ${field.crop.en} spraying & VRA fertilizer top-dress.`,
            id: `Jendela ideal untuk penyemprotan & pemupukan VRA ${field.crop.id}.`,
          }
        : suitability === 'Marginal'
        ? {
            en: 'Use coarse drift-reduction nozzles; prioritize ground scouting & soil sampling.',
            id: 'Gunakan nosel anti-drift; prioritaskan scouting lapangan & sampel tanah.',
          }
        : {
            en: 'Hold spraying & spreading; inspect bund drainage channels after rainfall.',
            id: 'Tunda semprot & tebar pupuk; periksa saluran drainase pematang.',
          };

    return {
      dayOffset: idx + 1,
      dateLabel,
      weekday: {
        en: WEEKDAYS.en[weekdayIdx],
        id: WEEKDAYS.id[weekdayIdx],
      },
      condition,
      tempMaxC,
      tempMinC,
      windKmh: rawWind,
      rainMm: rawRain,
      humidityPct,
      suitability,
      operationAdvice,
    };
  });

  const optimalDaysCount = days.filter((d) => d.suitability === 'Optimal').length;

  return {
    historical7dAvgTempC,
    historical7dAvgWindKmh,
    historical7dRainMm,
    optimalDaysCount,
    days,
  };
}

export interface SoilMoisturePoint {
  dayOffset: number; // -29 .. 0
  dateIso: string;
  dateLabel: string;
  surfaceMoisturePct: number;
  rootZoneMoisturePct: number;
  rainfallMm: number;
}

export interface SoilMoistureSeries {
  fieldCapacityPct: number;
  stressThresholdPct: number;
  currentSurfacePct: number;
  currentRootZonePct: number;
  avg30dSurfacePct: number;
  min30dSurfacePct: number;
  max30dSurfacePct: number;
  delta30dPct: number;
  status: 'Optimal' | 'Low Moisture' | 'Saturated';
  days: SoilMoisturePoint[];
}

export function getFieldSoilMoisture30Days(
  field: FieldParcel,
  snapshotIndex: number
): SoilMoistureSeries {
  const activeSnap = field.snapshots[snapshotIndex] ?? field.snapshots[0];
  const prevSnap = field.snapshots[Math.max(0, snapshotIndex - 1)] ?? activeSnap;

  // Soil-specific agronomic bounds (% volumetric soil moisture)
  const profileByField: Record<
    string,
    { baseline: number; fieldCapacity: number; stressThreshold: number; drainageRate: number; seed: number }
  > = {
    'blok-utara-a': {
      baseline: 58,
      fieldCapacity: 68,
      stressThreshold: 44,
      drainageRate: 0.72,
      seed: 11,
    },
    'blok-timur-b': {
      baseline: 26,
      fieldCapacity: 34,
      stressThreshold: 17,
      drainageRate: 1.25,
      seed: 23,
    },
    'blok-barat-c': {
      baseline: 31,
      fieldCapacity: 40,
      stressThreshold: 21,
      drainageRate: 0.95,
      seed: 37,
    },
    'blok-selatan-d': {
      baseline: 29,
      fieldCapacity: 38,
      stressThreshold: 19,
      drainageRate: 1.0,
      seed: 53,
    },
    'lpg-tebu-1': {
      baseline: 28,
      fieldCapacity: 37,
      stressThreshold: 19,
      drainageRate: 1.08,
      seed: 19,
    },
    'lpg-singkong-2': {
      baseline: 24,
      fieldCapacity: 33,
      stressThreshold: 15,
      drainageRate: 1.18,
      seed: 31,
    },
    'lpg-jagung-3': {
      baseline: 29,
      fieldCapacity: 38,
      stressThreshold: 20,
      drainageRate: 1.05,
      seed: 43,
    },
    'lpg-kedelai-4': {
      baseline: 30,
      fieldCapacity: 39,
      stressThreshold: 21,
      drainageRate: 0.96,
      seed: 59,
    },
    'mrk-padi-1': {
      baseline: 61,
      fieldCapacity: 70,
      stressThreshold: 46,
      drainageRate: 0.68,
      seed: 13,
    },
    'mrk-padi-2': {
      baseline: 63,
      fieldCapacity: 72,
      stressThreshold: 47,
      drainageRate: 0.65,
      seed: 29,
    },
    'mrk-jagung-3': {
      baseline: 35,
      fieldCapacity: 44,
      stressThreshold: 23,
      drainageRate: 0.88,
      seed: 41,
    },
    'mrk-sorgum-4': {
      baseline: 27,
      fieldCapacity: 36,
      stressThreshold: 17,
      drainageRate: 1.15,
      seed: 67,
    },
  };

  const profile = profileByField[field.id] ?? {
    baseline: 32,
    fieldCapacity: 40,
    stressThreshold: 20,
    drainageRate: 1.0,
    seed: 17,
  };

  // Seasonal moisture curve adjustment: harvest maturity dries down; mid-season flowering peaks
  const isPaddyField =
    field.id === 'blok-utara-a' || field.id === 'mrk-padi-1' || field.id === 'mrk-padi-2';
  const isPaddyDryDown = isPaddyField && snapshotIndex >= 4;
  const isCaneRipening =
    (field.id === 'blok-selatan-d' || field.id === 'lpg-tebu-1') && snapshotIndex >= 4;
  const seasonalShift = isPaddyDryDown
    ? -11
    : isCaneRipening
    ? -6
    : activeSnap.meanNdvi > 0.7
    ? 3
    : -2;

  const endDateObj = new Date(`${activeSnap.date}T12:00:00Z`);

  const days: SoilMoisturePoint[] = [];
  let surface = Math.max(
    profile.stressThreshold - 2,
    Math.min(profile.fieldCapacity + 4, profile.baseline + seasonalShift)
  );
  let rootZone = surface + 2.4;

  for (let i = 0; i < 30; i++) {
    const dayOffset = i - 29;
    const d = new Date(endDateObj.getTime());
    d.setUTCDate(d.getUTCDate() + dayOffset);

    const dateIso = d.toISOString().slice(0, 10);
    const dateLabel = `${MONTH_ABBR[d.getUTCMonth()]} ${String(d.getUTCDate()).padStart(2, '0')}`;

    const wave = Math.sin((i + profile.seed + snapshotIndex * 3) * 0.65);
    const spikeSeed = (i * 7 + profile.seed + snapshotIndex * 5) % 11;
    let rainMm = 0;
    if (i === 29) {
      rainMm = activeSnap.rainMm;
    } else if (i === 5) {
      rainMm = prevSnap.rainMm > 0 ? prevSnap.rainMm : 2.2;
    } else if (spikeSeed === 0 || (wave > 0.78 && spikeSeed < 5)) {
      rainMm = Number((3.4 + ((i + profile.seed) % 6) * 1.4).toFixed(1));
    } else if (spikeSeed === 3 && wave > 0.2) {
      rainMm = Number((0.8 + ((i + snapshotIndex) % 3) * 0.6).toFixed(1));
    }

    const etLoss =
      (0.85 + (activeSnap.tempC - 28) * 0.14 + activeSnap.meanNdvi * 0.45) *
      profile.drainageRate;
    const rainRecharge = rainMm * (isPaddyField ? 1.55 : 1.35);

    const paddyIrrigation =
      isPaddyField && !isPaddyDryDown && surface < profile.stressThreshold + 5
        ? 5.5
        : 0;

    surface = Math.max(
      profile.stressThreshold - 5,
      Math.min(profile.fieldCapacity + 8, surface - etLoss + rainRecharge + paddyIrrigation)
    );
    rootZone = Math.max(
      profile.stressThreshold - 3,
      Math.min(profile.fieldCapacity + 5, rootZone * 0.84 + surface * 0.16 + 0.35)
    );

    days.push({
      dayOffset,
      dateIso,
      dateLabel,
      surfaceMoisturePct: Number(surface.toFixed(1)),
      rootZoneMoisturePct: Number(rootZone.toFixed(1)),
      rainfallMm: rainMm,
    });
  }

  const surfaceVals = days.map((d) => d.surfaceMoisturePct);
  const current = days[days.length - 1];
  const first = days[0];

  const avg30dSurfacePct = Number(
    (surfaceVals.reduce((acc, v) => acc + v, 0) / surfaceVals.length).toFixed(1)
  );
  const min30dSurfacePct = Number(Math.min(...surfaceVals).toFixed(1));
  const max30dSurfacePct = Number(Math.max(...surfaceVals).toFixed(1));
  const delta30dPct = Number((current.surfaceMoisturePct - first.surfaceMoisturePct).toFixed(1));

  const status: SoilMoistureSeries['status'] =
    current.surfaceMoisturePct > profile.fieldCapacity
      ? 'Saturated'
      : current.surfaceMoisturePct < profile.stressThreshold
      ? 'Low Moisture'
      : 'Optimal';

  return {
    fieldCapacityPct: profile.fieldCapacity,
    stressThresholdPct: profile.stressThreshold,
    currentSurfacePct: current.surfaceMoisturePct,
    currentRootZonePct: current.rootZoneMoisturePct,
    avg30dSurfacePct,
    min30dSurfacePct,
    max30dSurfacePct,
    delta30dPct,
    status,
    days,
  };
}

export interface EstateMap {
  id: EstateMapId;
  shortName: Record<Lang, string>;
  regionLabel: Record<Lang, string>;
  coordinatesLabel: string;
  basemapSrc: string;
  basemapAlt: string;
  parcels: FieldParcel[];
  initialScoutingNotes: ScoutingNote[];
}

const LAMPUNG_PARCELS: FieldParcel[] = [
  {
    id: 'lpg-tebu-1',
    name: { en: 'Terbanggi Sugarcane A', id: 'Blok Tebu Terbanggi A' },
    crop: { en: 'Estate Sugarcane', id: 'Tebu Perkebunan' },
    variety: 'PS 864',
    areaHa: 184.5,
    sowingDate: 'Nov 12',
    soilType: { en: 'Red-Yellow Podsolic', id: 'Podsolik Merah Kuning' },
    uniformRateKgHa: 210,
    fertilizerProduct: { en: 'ZA & Phonska Plus', id: 'ZA & Phonska Plus' },
    polygonPath: 'M 145 24 L 492 24 L 492 268 L 128 268 Z',
    labelPos: { x: 312, y: 146 },
    centerGeo: [105.2148, -4.8214],
    ndviGradientStops: [
      { offset: '0%', color: '#059669' },
      { offset: '55%', color: '#22C55E' },
      { offset: '100%', color: '#84CC16' },
    ],
    zoneSubPolygons: {
      high: 'M 150 28 L 385 28 L 375 262 L 134 262 Z',
      low: 'M 382 28 L 488 28 L 488 264 L 380 264 Z',
    },
    zones: [
      {
        id: 'high',
        label: { en: 'Zone A · High Potential', id: 'Zona A · Potensi Tinggi' },
        sharePct: 50,
        areaHa: 92.3,
        defaultRateKgHa: 230,
        yieldPotentialTHa: 102.0,
      },
      {
        id: 'medium',
        label: { en: 'Zone B · Target Mean', id: 'Zona B · Target Sedang' },
        sharePct: 33,
        areaHa: 60.9,
        defaultRateKgHa: 185,
        yieldPotentialTHa: 86.5,
      },
      {
        id: 'low',
        label: { en: 'Zone C · Laterite Ridge', id: 'Zona C · Pematang Laterit' },
        sharePct: 17,
        areaHa: 31.3,
        defaultRateKgHa: 140,
        yieldPotentialTHa: 68.0,
      },
    ],
    snapshots: [
      {
        date: '2026-01-15',
        shortDate: 'Jan 15',
        cloudCover: 5,
        meanNdvi: 0.58,
        minNdvi: 0.41,
        maxNdvi: 0.69,
        growthStage: { en: 'Early Tillering Ratoon', id: 'Anakan Awal Keprasan' },
        biomassIndex: 3.6,
        sprayWindow: 'Optimal',
        windKmh: 8,
        tempC: 30,
        rainMm: 0.4,
        nitrogenKgHa: 174,
        phosphorusKgHa: 64,
        potassiumKgHa: 182,
      },
      {
        date: '2026-02-08',
        shortDate: 'Feb 08',
        cloudCover: 7,
        meanNdvi: 0.71,
        minNdvi: 0.54,
        maxNdvi: 0.81,
        growthStage: { en: 'Rapid Stalk Elongation', id: 'Pemanjangan Batang Cepat' },
        biomassIndex: 5.1,
        sprayWindow: 'Optimal',
        windKmh: 9,
        tempC: 31,
        rainMm: 0,
        nitrogenKgHa: 154,
        phosphorusKgHa: 57,
        potassiumKgHa: 169,
      },
      {
        date: '2026-03-02',
        shortDate: 'Mar 02',
        cloudCover: 8,
        meanNdvi: 0.82,
        minNdvi: 0.66,
        maxNdvi: 0.9,
        growthStage: { en: 'Canopy Closure Peak', id: 'Penutupan Tajuk Penuh' },
        biomassIndex: 6.2,
        sprayWindow: 'Marginal',
        windKmh: 15,
        tempC: 31,
        rainMm: 1.2,
        nitrogenKgHa: 131,
        phosphorusKgHa: 50,
        potassiumKgHa: 152,
      },
      {
        date: '2026-03-26',
        shortDate: 'Mar 26',
        cloudCover: 3,
        meanNdvi: 0.79,
        minNdvi: 0.61,
        maxNdvi: 0.87,
        growthStage: { en: 'Brix Sugar Build-up', id: 'Akumulasi Gula Brix' },
        biomassIndex: 5.8,
        sprayWindow: 'Optimal',
        windKmh: 7,
        tempC: 32,
        rainMm: 0,
        nitrogenKgHa: 112,
        phosphorusKgHa: 45,
        potassiumKgHa: 138,
      },
      {
        date: '2026-04-18',
        shortDate: 'Apr 18',
        cloudCover: 6,
        meanNdvi: 0.65,
        minNdvi: 0.49,
        maxNdvi: 0.75,
        growthStage: { en: 'Pre-Harvest Ripening', id: 'Pemasakan Pra-Tebang' },
        biomassIndex: 4.4,
        sprayWindow: 'Hold',
        windKmh: 19,
        tempC: 32,
        rainMm: 5.6,
        nitrogenKgHa: 92,
        phosphorusKgHa: 41,
        potassiumKgHa: 125,
      },
      {
        date: '2026-05-10',
        shortDate: 'May 10',
        cloudCover: 1,
        meanNdvi: 0.46,
        minNdvi: 0.31,
        maxNdvi: 0.56,
        growthStage: { en: 'Crushing Mill Harvest', id: 'Panen Giling Pabrik' },
        biomassIndex: 2.7,
        sprayWindow: 'Optimal',
        windKmh: 6,
        tempC: 31,
        rainMm: 0,
        nitrogenKgHa: 80,
        phosphorusKgHa: 37,
        potassiumKgHa: 116,
      },
    ],
  },
  {
    id: 'lpg-singkong-2',
    name: { en: 'Seputih Cassava B', id: 'Blok Singkong Seputih B' },
    crop: { en: 'Industrial Cassava', id: 'Singkong Industri' },
    variety: 'UJ-5 Kasesart',
    areaHa: 148.0,
    sowingDate: 'Dec 18',
    soilType: { en: 'Brown Latosol', id: 'Latosol Cokelat' },
    uniformRateKgHa: 165,
    fertilizerProduct: { en: 'Urea & KCl Blend', id: 'Campuran Urea & KCl' },
    polygonPath: 'M 508 24 L 866 24 L 876 268 L 508 268 Z',
    labelPos: { x: 692, y: 146 },
    centerGeo: [105.2264, -4.8219],
    ndviGradientStops: [
      { offset: '0%', color: '#16A34A' },
      { offset: '55%', color: '#84CC16' },
      { offset: '100%', color: '#EAB308' },
    ],
    zoneSubPolygons: {
      high: 'M 635 28 L 862 28 L 870 264 L 635 264 Z',
      low: 'M 512 28 L 632 28 L 632 264 L 512 264 Z',
    },
    zones: [
      {
        id: 'high',
        label: { en: 'Zone A · Deep Tuber Loam', id: 'Zona A · Umbi Optimal' },
        sharePct: 45,
        areaHa: 66.6,
        defaultRateKgHa: 180,
        yieldPotentialTHa: 38.5,
      },
      {
        id: 'medium',
        label: { en: 'Zone B · Target Mean', id: 'Zona B · Target Sedang' },
        sharePct: 37,
        areaHa: 54.8,
        defaultRateKgHa: 150,
        yieldPotentialTHa: 31.2,
      },
      {
        id: 'low',
        label: { en: 'Zone C · Dry Gravel Slope', id: 'Zona C · Lereng Kering' },
        sharePct: 18,
        areaHa: 26.6,
        defaultRateKgHa: 115,
        yieldPotentialTHa: 23.4,
      },
    ],
    snapshots: [
      {
        date: '2026-01-15',
        shortDate: 'Jan 15',
        cloudCover: 5,
        meanNdvi: 0.34,
        minNdvi: 0.22,
        maxNdvi: 0.44,
        growthStage: { en: '30 DAP · Stem Sprouting', id: '30 HST · Pertumbuhan Tunas' },
        biomassIndex: 1.5,
        sprayWindow: 'Optimal',
        windKmh: 8,
        tempC: 30,
        rainMm: 0.4,
        nitrogenKgHa: 132,
        phosphorusKgHa: 48,
        potassiumKgHa: 194,
      },
      {
        date: '2026-02-08',
        shortDate: 'Feb 08',
        cloudCover: 7,
        meanNdvi: 0.56,
        minNdvi: 0.41,
        maxNdvi: 0.67,
        growthStage: { en: '54 DAP · Canopy Expansion', id: '54 HST · Pelebaran Tajuk' },
        biomassIndex: 3.3,
        sprayWindow: 'Optimal',
        windKmh: 9,
        tempC: 31,
        rainMm: 0,
        nitrogenKgHa: 148,
        phosphorusKgHa: 44,
        potassiumKgHa: 181,
      },
      {
        date: '2026-03-02',
        shortDate: 'Mar 02',
        cloudCover: 8,
        meanNdvi: 0.72,
        minNdvi: 0.56,
        maxNdvi: 0.82,
        growthStage: { en: '76 DAP · Root Bulking Start', id: '76 HST · Pembesaran Umbi Awal' },
        biomassIndex: 4.9,
        sprayWindow: 'Marginal',
        windKmh: 15,
        tempC: 31,
        rainMm: 1.2,
        nitrogenKgHa: 121,
        phosphorusKgHa: 39,
        potassiumKgHa: 162,
      },
      {
        date: '2026-03-26',
        shortDate: 'Mar 26',
        cloudCover: 3,
        meanNdvi: 0.79,
        minNdvi: 0.63,
        maxNdvi: 0.88,
        growthStage: { en: '100 DAP · Peak Starch Fill', id: '100 HST · Pengisian Pati Maksimal' },
        biomassIndex: 5.7,
        sprayWindow: 'Optimal',
        windKmh: 7,
        tempC: 32,
        rainMm: 0,
        nitrogenKgHa: 98,
        phosphorusKgHa: 35,
        potassiumKgHa: 141,
      },
      {
        date: '2026-04-18',
        shortDate: 'Apr 18',
        cloudCover: 6,
        meanNdvi: 0.69,
        minNdvi: 0.52,
        maxNdvi: 0.79,
        growthStage: { en: '123 DAP · Tuber Maturation', id: '123 HST · Pematangan Umbi' },
        biomassIndex: 4.8,
        sprayWindow: 'Hold',
        windKmh: 19,
        tempC: 32,
        rainMm: 5.6,
        nitrogenKgHa: 82,
        phosphorusKgHa: 31,
        potassiumKgHa: 126,
      },
      {
        date: '2026-05-10',
        shortDate: 'May 10',
        cloudCover: 1,
        meanNdvi: 0.51,
        minNdvi: 0.36,
        maxNdvi: 0.61,
        growthStage: { en: '145 DAP · High-Starch Window', id: '145 HST · Siap Panen Tapioka' },
        biomassIndex: 3.1,
        sprayWindow: 'Optimal',
        windKmh: 6,
        tempC: 31,
        rainMm: 0,
        nitrogenKgHa: 71,
        phosphorusKgHa: 28,
        potassiumKgHa: 114,
      },
    ],
  },
  {
    id: 'lpg-jagung-3',
    name: { en: 'Central Corn Block C', id: 'Blok Jagung Tengah C' },
    crop: { en: 'Hybrid Corn', id: 'Jagung Hibrida' },
    variety: 'NK 212',
    areaHa: 162.4,
    sowingDate: 'Jan 08',
    soilType: { en: 'Clay Loam', id: 'Lempung Berliat' },
    uniformRateKgHa: 190,
    fertilizerProduct: { en: 'NPK Phonska & Urea', id: 'NPK Phonska & Urea' },
    polygonPath: 'M 128 286 L 492 286 L 492 496 L 128 496 Z',
    labelPos: { x: 310, y: 392 },
    centerGeo: [105.2152, -4.8286],
    ndviGradientStops: [
      { offset: '0%', color: '#059669' },
      { offset: '55%', color: '#22C55E' },
      { offset: '100%', color: '#F59E0B' },
    ],
    zoneSubPolygons: {
      high: 'M 134 290 L 486 290 L 486 410 L 134 410 Z',
      low: 'M 134 415 L 486 415 L 486 492 L 134 492 Z',
    },
    zones: [
      {
        id: 'high',
        label: { en: 'Zone A · High Potential', id: 'Zona A · Potensi Tinggi' },
        sharePct: 47,
        areaHa: 76.3,
        defaultRateKgHa: 215,
        yieldPotentialTHa: 10.1,
      },
      {
        id: 'medium',
        label: { en: 'Zone B · Target Mean', id: 'Zona B · Target Sedang' },
        sharePct: 36,
        areaHa: 58.5,
        defaultRateKgHa: 170,
        yieldPotentialTHa: 8.3,
      },
      {
        id: 'low',
        label: { en: 'Zone C · Compaction Margin', id: 'Zona C · Tepi Pemadatan' },
        sharePct: 17,
        areaHa: 27.6,
        defaultRateKgHa: 125,
        yieldPotentialTHa: 6.1,
      },
    ],
    snapshots: [
      {
        date: '2026-01-15',
        shortDate: 'Jan 15',
        cloudCover: 5,
        meanNdvi: 0.25,
        minNdvi: 0.18,
        maxNdvi: 0.32,
        growthStage: { en: 'V2 · Early Emergence', id: 'Fase V2 · Tumbuh Awal' },
        biomassIndex: 0.9,
        sprayWindow: 'Optimal',
        windKmh: 8,
        tempC: 30,
        rainMm: 0.4,
        nitrogenKgHa: 162,
        phosphorusKgHa: 60,
        potassiumKgHa: 170,
      },
      {
        date: '2026-02-08',
        shortDate: 'Feb 08',
        cloudCover: 7,
        meanNdvi: 0.49,
        minNdvi: 0.36,
        maxNdvi: 0.6,
        growthStage: { en: 'V7 · Stem Elongation', id: 'Fase V7 · Vegetatif Cepat' },
        biomassIndex: 2.9,
        sprayWindow: 'Optimal',
        windKmh: 9,
        tempC: 31,
        rainMm: 0,
        nitrogenKgHa: 179,
        phosphorusKgHa: 55,
        potassiumKgHa: 161,
      },
      {
        date: '2026-03-02',
        shortDate: 'Mar 02',
        cloudCover: 8,
        meanNdvi: 0.74,
        minNdvi: 0.58,
        maxNdvi: 0.84,
        growthStage: { en: 'VT · Tasseling & Silking', id: 'Fase VT · Keluar Malai' },
        biomassIndex: 5.2,
        sprayWindow: 'Marginal',
        windKmh: 15,
        tempC: 31,
        rainMm: 1.2,
        nitrogenKgHa: 141,
        phosphorusKgHa: 49,
        potassiumKgHa: 145,
      },
      {
        date: '2026-03-26',
        shortDate: 'Mar 26',
        cloudCover: 3,
        meanNdvi: 0.83,
        minNdvi: 0.67,
        maxNdvi: 0.91,
        growthStage: { en: 'R3 · Kernel Milk Stage', id: 'Fase R3 · Pengisian Biji' },
        biomassIndex: 6.1,
        sprayWindow: 'Optimal',
        windKmh: 7,
        tempC: 32,
        rainMm: 0,
        nitrogenKgHa: 109,
        phosphorusKgHa: 42,
        potassiumKgHa: 129,
      },
      {
        date: '2026-04-18',
        shortDate: 'Apr 18',
        cloudCover: 6,
        meanNdvi: 0.68,
        minNdvi: 0.51,
        maxNdvi: 0.78,
        growthStage: { en: 'R5 · Dent Maturation', id: 'Fase R5 · Pengerasan Tongkol' },
        biomassIndex: 4.7,
        sprayWindow: 'Hold',
        windKmh: 19,
        tempC: 32,
        rainMm: 5.6,
        nitrogenKgHa: 88,
        phosphorusKgHa: 37,
        potassiumKgHa: 117,
      },
      {
        date: '2026-05-10',
        shortDate: 'May 10',
        cloudCover: 1,
        meanNdvi: 0.39,
        minNdvi: 0.27,
        maxNdvi: 0.49,
        growthStage: { en: 'R6 · Dry Grain Harvest', id: 'Fase R6 · Panen Pipilan' },
        biomassIndex: 2.3,
        sprayWindow: 'Optimal',
        windKmh: 6,
        tempC: 31,
        rainMm: 0,
        nitrogenKgHa: 75,
        phosphorusKgHa: 34,
        potassiumKgHa: 108,
      },
    ],
  },
  {
    id: 'lpg-kedelai-4',
    name: { en: 'Upland Soybean D', id: 'Blok Kedelai Kering D' },
    crop: { en: 'Upland Soybeans', id: 'Kedelai Lahan Kering' },
    variety: 'Grobogan',
    areaHa: 126.6,
    sowingDate: 'Jan 19',
    soilType: { en: 'Latosol Loam', id: 'Latosol Lempung' },
    uniformRateKgHa: 95,
    fertilizerProduct: { en: 'SP-36 & Rhizobium', id: 'SP-36 & Inokulan Rhizobium' },
    polygonPath: 'M 508 286 L 876 286 L 870 496 L 508 496 Z',
    labelPos: { x: 692, y: 392 },
    centerGeo: [105.2269, -4.8289],
    ndviGradientStops: [
      { offset: '0%', color: '#65A30D' },
      { offset: '55%', color: '#EAB308' },
      { offset: '100%', color: '#DC2626' },
    ],
    zoneSubPolygons: {
      high: 'M 512 290 L 635 290 L 635 492 L 512 492 Z',
      low: 'M 755 290 L 872 290 L 866 492 L 755 492 Z',
    },
    zones: [
      {
        id: 'high',
        label: { en: 'Zone A · Optimal Moisture', id: 'Zona A · Kelembapan Optimal' },
        sharePct: 43,
        areaHa: 54.4,
        defaultRateKgHa: 80,
        yieldPotentialTHa: 3.1,
      },
      {
        id: 'medium',
        label: { en: 'Zone B · Target Mean', id: 'Zona B · Target Sedang' },
        sharePct: 38,
        areaHa: 48.1,
        defaultRateKgHa: 95,
        yieldPotentialTHa: 2.5,
      },
      {
        id: 'low',
        label: { en: 'Zone C · Dry Perimeter', id: 'Zona C · Tepi Kering' },
        sharePct: 19,
        areaHa: 24.1,
        defaultRateKgHa: 110,
        yieldPotentialTHa: 1.8,
      },
    ],
    snapshots: [
      {
        date: '2026-01-15',
        shortDate: 'Jan 15',
        cloudCover: 5,
        meanNdvi: 0.21,
        minNdvi: 0.15,
        maxNdvi: 0.27,
        growthStage: { en: 'Seedbed Preparation', id: 'Olah Tanah Siap Tanam' },
        biomassIndex: 0.5,
        sprayWindow: 'Optimal',
        windKmh: 8,
        tempC: 30,
        rainMm: 0.4,
        nitrogenKgHa: 98,
        phosphorusKgHa: 61,
        potassiumKgHa: 148,
      },
      {
        date: '2026-02-08',
        shortDate: 'Feb 08',
        cloudCover: 7,
        meanNdvi: 0.36,
        minNdvi: 0.25,
        maxNdvi: 0.45,
        growthStage: { en: 'V3 · Trifoliate Leaf', id: 'Fase V3 · Daun Majemuk' },
        biomassIndex: 1.6,
        sprayWindow: 'Optimal',
        windKmh: 9,
        tempC: 31,
        rainMm: 0,
        nitrogenKgHa: 109,
        phosphorusKgHa: 55,
        potassiumKgHa: 140,
      },
      {
        date: '2026-03-02',
        shortDate: 'Mar 02',
        cloudCover: 8,
        meanNdvi: 0.61,
        minNdvi: 0.44,
        maxNdvi: 0.72,
        growthStage: { en: 'R2 · Full Flowering', id: 'Fase R2 · Berbunga Penuh' },
        biomassIndex: 3.7,
        sprayWindow: 'Marginal',
        windKmh: 15,
        tempC: 31,
        rainMm: 1.2,
        nitrogenKgHa: 118,
        phosphorusKgHa: 48,
        potassiumKgHa: 129,
      },
      {
        date: '2026-03-26',
        shortDate: 'Mar 26',
        cloudCover: 3,
        meanNdvi: 0.76,
        minNdvi: 0.59,
        maxNdvi: 0.85,
        growthStage: { en: 'R5 · Pod & Seed Fill', id: 'Fase R5 · Pengisian Polong' },
        biomassIndex: 5.1,
        sprayWindow: 'Optimal',
        windKmh: 7,
        tempC: 32,
        rainMm: 0,
        nitrogenKgHa: 101,
        phosphorusKgHa: 41,
        potassiumKgHa: 116,
      },
      {
        date: '2026-04-18',
        shortDate: 'Apr 18',
        cloudCover: 6,
        meanNdvi: 0.62,
        minNdvi: 0.46,
        maxNdvi: 0.72,
        growthStage: { en: 'R7 · Pod Senescence', id: 'Fase R7 · Polong Menua' },
        biomassIndex: 3.8,
        sprayWindow: 'Hold',
        windKmh: 19,
        tempC: 32,
        rainMm: 5.6,
        nitrogenKgHa: 88,
        phosphorusKgHa: 36,
        potassiumKgHa: 105,
      },
      {
        date: '2026-05-10',
        shortDate: 'May 10',
        cloudCover: 1,
        meanNdvi: 0.27,
        minNdvi: 0.18,
        maxNdvi: 0.35,
        growthStage: { en: 'R8 · Combine Harvest', id: 'Fase R8 · Panen Serempak' },
        biomassIndex: 1.1,
        sprayWindow: 'Optimal',
        windKmh: 6,
        tempC: 31,
        rainMm: 0,
        nitrogenKgHa: 84,
        phosphorusKgHa: 34,
        potassiumKgHa: 99,
      },
    ],
  },
];

const MERAUKE_PARCELS: FieldParcel[] = [
  {
    id: 'mrk-padi-1',
    name: { en: 'Kurik North Paddy A', id: 'Blok Padi Kurik Utara A' },
    crop: { en: 'Mechanized Paddy', id: 'Padi Mekanisasi' },
    variety: 'Mekongga',
    areaHa: 245.0,
    sowingDate: 'Jan 06',
    soilType: { en: 'Swamp Alluvial', id: 'Aluvial Rawa' },
    uniformRateKgHa: 180,
    fertilizerProduct: { en: 'Urea & NPK Granule', id: 'Urea & NPK Granul' },
    polygonPath: 'M 255 170 L 538 170 L 552 332 L 195 332 Z',
    labelPos: { x: 378, y: 252 },
    centerGeo: [140.4126, -8.2845],
    ndviGradientStops: [
      { offset: '0%', color: '#059669' },
      { offset: '55%', color: '#22C55E' },
      { offset: '100%', color: '#84CC16' },
    ],
    zoneSubPolygons: {
      high: 'M 258 174 L 445 174 L 452 328 L 200 328 Z',
      low: 'M 448 174 L 534 174 L 548 328 L 456 328 Z',
    },
    zones: [
      {
        id: 'high',
        label: { en: 'Zone A · High Potential', id: 'Zona A · Potensi Tinggi' },
        sharePct: 52,
        areaHa: 127.4,
        defaultRateKgHa: 195,
        yieldPotentialTHa: 7.2,
      },
      {
        id: 'medium',
        label: { en: 'Zone B · Target Mean', id: 'Zona B · Target Sedang' },
        sharePct: 33,
        areaHa: 80.9,
        defaultRateKgHa: 160,
        yieldPotentialTHa: 6.0,
      },
      {
        id: 'low',
        label: { en: 'Zone C · Canal Acid Pocket', id: 'Zona C · Kantong Masam Kanal' },
        sharePct: 15,
        areaHa: 36.7,
        defaultRateKgHa: 120,
        yieldPotentialTHa: 4.5,
      },
    ],
    snapshots: [
      {
        date: '2026-01-15',
        shortDate: 'Jan 15',
        cloudCover: 9,
        meanNdvi: 0.33,
        minNdvi: 0.22,
        maxNdvi: 0.43,
        growthStage: { en: '10 DAS · Direct Seeded', id: '10 HST · Tabela Mekanis' },
        biomassIndex: 1.6,
        sprayWindow: 'Optimal',
        windKmh: 9,
        tempC: 29,
        rainMm: 0.3,
        nitrogenKgHa: 148,
        phosphorusKgHa: 52,
        potassiumKgHa: 162,
      },
      {
        date: '2026-02-08',
        shortDate: 'Feb 08',
        cloudCover: 6,
        meanNdvi: 0.59,
        minNdvi: 0.44,
        maxNdvi: 0.71,
        growthStage: { en: '34 DAS · Active Tillering', id: '34 HST · Anakan Aktif' },
        biomassIndex: 3.8,
        sprayWindow: 'Optimal',
        windKmh: 10,
        tempC: 30,
        rainMm: 0,
        nitrogenKgHa: 168,
        phosphorusKgHa: 47,
        potassiumKgHa: 152,
      },
      {
        date: '2026-03-02',
        shortDate: 'Mar 02',
        cloudCover: 7,
        meanNdvi: 0.76,
        minNdvi: 0.61,
        maxNdvi: 0.85,
        growthStage: { en: '56 DAS · Panicle Initiation', id: '56 HST · Fase Primordia' },
        biomassIndex: 5.4,
        sprayWindow: 'Marginal',
        windKmh: 17,
        tempC: 30,
        rainMm: 2.1,
        nitrogenKgHa: 132,
        phosphorusKgHa: 42,
        potassiumKgHa: 138,
      },
      {
        date: '2026-03-26',
        shortDate: 'Mar 26',
        cloudCover: 3,
        meanNdvi: 0.84,
        minNdvi: 0.68,
        maxNdvi: 0.91,
        growthStage: { en: '80 DAS · Full Heading', id: '80 HST · Pembungaan Malai' },
        biomassIndex: 6.2,
        sprayWindow: 'Optimal',
        windKmh: 8,
        tempC: 31,
        rainMm: 0,
        nitrogenKgHa: 106,
        phosphorusKgHa: 37,
        potassiumKgHa: 124,
      },
      {
        date: '2026-04-18',
        shortDate: 'Apr 18',
        cloudCover: 10,
        meanNdvi: 0.63,
        minNdvi: 0.47,
        maxNdvi: 0.74,
        growthStage: { en: '103 DAS · Grain Filling', id: '103 HST · Pengisian Gabah' },
        biomassIndex: 4.5,
        sprayWindow: 'Hold',
        windKmh: 22,
        tempC: 31,
        rainMm: 6.8,
        nitrogenKgHa: 86,
        phosphorusKgHa: 33,
        potassiumKgHa: 111,
      },
      {
        date: '2026-05-10',
        shortDate: 'May 10',
        cloudCover: 2,
        meanNdvi: 0.35,
        minNdvi: 0.23,
        maxNdvi: 0.45,
        growthStage: { en: '125 DAS · Combine Harvest', id: '125 HST · Panen Combine' },
        biomassIndex: 2.1,
        sprayWindow: 'Optimal',
        windKmh: 9,
        tempC: 29,
        rainMm: 0,
        nitrogenKgHa: 74,
        phosphorusKgHa: 30,
        potassiumKgHa: 102,
      },
    ],
  },
  {
    id: 'mrk-padi-2',
    name: { en: 'Salor East Tidal Rice B', id: 'Blok Padi Salor Timur B' },
    crop: { en: 'Tidal Rice', id: 'Padi Rawa Pasang Surut' },
    variety: 'Inpara 8',
    areaHa: 210.5,
    sowingDate: 'Jan 12',
    soilType: { en: 'Humic Gleysol', id: 'Gleisol Humik' },
    uniformRateKgHa: 165,
    fertilizerProduct: { en: 'NPK Phonska & Dolomite', id: 'NPK Phonska & Dolomit' },
    polygonPath: 'M 632 170 L 892 170 L 948 332 L 652 332 Z',
    labelPos: { x: 778, y: 252 },
    centerGeo: [140.4254, -8.2851],
    ndviGradientStops: [
      { offset: '0%', color: '#16A34A' },
      { offset: '55%', color: '#84CC16' },
      { offset: '100%', color: '#EAB308' },
    ],
    zoneSubPolygons: {
      high: 'M 638 174 L 775 174 L 795 328 L 656 328 Z',
      low: 'M 780 174 L 888 174 L 942 328 L 800 328 Z',
    },
    zones: [
      {
        id: 'high',
        label: { en: 'Zone A · Fertile Basin', id: 'Zona A · Cekungan Subur' },
        sharePct: 44,
        areaHa: 92.6,
        defaultRateKgHa: 175,
        yieldPotentialTHa: 6.6,
      },
      {
        id: 'medium',
        label: { en: 'Zone B · Target Mean', id: 'Zona B · Target Sedang' },
        sharePct: 38,
        areaHa: 80.0,
        defaultRateKgHa: 150,
        yieldPotentialTHa: 5.5,
      },
      {
        id: 'low',
        label: { en: 'Zone C · Sulfidic Levee', id: 'Zona C · Pematang Sulfat' },
        sharePct: 18,
        areaHa: 37.9,
        defaultRateKgHa: 120,
        yieldPotentialTHa: 4.1,
      },
    ],
    snapshots: [
      {
        date: '2026-01-15',
        shortDate: 'Jan 15',
        cloudCover: 9,
        meanNdvi: 0.29,
        minNdvi: 0.19,
        maxNdvi: 0.38,
        growthStage: { en: 'Early Stand Establishment', id: 'Fase Pertumbuhan Awal' },
        biomassIndex: 1.3,
        sprayWindow: 'Optimal',
        windKmh: 9,
        tempC: 29,
        rainMm: 0.3,
        nitrogenKgHa: 136,
        phosphorusKgHa: 49,
        potassiumKgHa: 155,
      },
      {
        date: '2026-02-08',
        shortDate: 'Feb 08',
        cloudCover: 6,
        meanNdvi: 0.52,
        minNdvi: 0.38,
        maxNdvi: 0.64,
        growthStage: { en: 'Vegetative Tillering', id: 'Anakan Vegetatif' },
        biomassIndex: 3.1,
        sprayWindow: 'Optimal',
        windKmh: 10,
        tempC: 30,
        rainMm: 0,
        nitrogenKgHa: 152,
        phosphorusKgHa: 45,
        potassiumKgHa: 146,
      },
      {
        date: '2026-03-02',
        shortDate: 'Mar 02',
        cloudCover: 7,
        meanNdvi: 0.69,
        minNdvi: 0.53,
        maxNdvi: 0.79,
        growthStage: { en: 'Booting Stage', id: 'Fase Bunting' },
        biomassIndex: 4.8,
        sprayWindow: 'Marginal',
        windKmh: 17,
        tempC: 30,
        rainMm: 2.1,
        nitrogenKgHa: 124,
        phosphorusKgHa: 40,
        potassiumKgHa: 133,
      },
      {
        date: '2026-03-26',
        shortDate: 'Mar 26',
        cloudCover: 3,
        meanNdvi: 0.77,
        minNdvi: 0.6,
        maxNdvi: 0.86,
        growthStage: { en: 'Anthesis & Grain Set', id: 'Fase Pembungaan' },
        biomassIndex: 5.5,
        sprayWindow: 'Optimal',
        windKmh: 8,
        tempC: 31,
        rainMm: 0,
        nitrogenKgHa: 99,
        phosphorusKgHa: 35,
        potassiumKgHa: 119,
      },
      {
        date: '2026-04-18',
        shortDate: 'Apr 18',
        cloudCover: 10,
        meanNdvi: 0.58,
        minNdvi: 0.43,
        maxNdvi: 0.69,
        growthStage: { en: 'Yellow Ripening', id: 'Pematangan Kuning' },
        biomassIndex: 4.0,
        sprayWindow: 'Hold',
        windKmh: 22,
        tempC: 31,
        rainMm: 6.8,
        nitrogenKgHa: 82,
        phosphorusKgHa: 31,
        potassiumKgHa: 108,
      },
      {
        date: '2026-05-10',
        shortDate: 'May 10',
        cloudCover: 2,
        meanNdvi: 0.31,
        minNdvi: 0.21,
        maxNdvi: 0.4,
        growthStage: { en: 'Harvest & Stubble Mulch', id: 'Panen & Pengolahan Jerami' },
        biomassIndex: 1.8,
        sprayWindow: 'Optimal',
        windKmh: 9,
        tempC: 29,
        rainMm: 0,
        nitrogenKgHa: 71,
        phosphorusKgHa: 29,
        potassiumKgHa: 99,
      },
    ],
  },
  {
    id: 'mrk-jagung-3',
    name: { en: 'Tanah Miring Corn C', id: 'Blok Jagung Tanah Miring C' },
    crop: { en: 'Feed Corn', id: 'Jagung Pakan' },
    variety: 'P32 Singa',
    areaHa: 178.0,
    sowingDate: 'Jan 14',
    soilType: { en: 'Alluvial Clay', id: 'Aluvial Liat' },
    uniformRateKgHa: 195,
    fertilizerProduct: { en: 'Urea & Phonska', id: 'Urea & Phonska' },
    polygonPath: 'M 178 352 L 555 352 L 575 538 L 98 538 Z',
    labelPos: { x: 356, y: 446 },
    centerGeo: [140.4118, -8.2912],
    ndviGradientStops: [
      { offset: '0%', color: '#059669' },
      { offset: '55%', color: '#84CC16' },
      { offset: '100%', color: '#F59E0B' },
    ],
    zoneSubPolygons: {
      high: 'M 182 356 L 448 356 L 460 534 L 106 534 Z',
      low: 'M 454 356 L 551 356 L 570 534 L 465 534 Z',
    },
    zones: [
      {
        id: 'high',
        label: { en: 'Zone A · High Potential', id: 'Zona A · Potensi Tinggi' },
        sharePct: 48,
        areaHa: 85.4,
        defaultRateKgHa: 215,
        yieldPotentialTHa: 9.8,
      },
      {
        id: 'medium',
        label: { en: 'Zone B · Target Mean', id: 'Zona B · Target Sedang' },
        sharePct: 35,
        areaHa: 62.3,
        defaultRateKgHa: 175,
        yieldPotentialTHa: 8.1,
      },
      {
        id: 'low',
        label: { en: 'Zone C · Drainage Edge', id: 'Zona C · Tepi Drainase' },
        sharePct: 17,
        areaHa: 30.3,
        defaultRateKgHa: 130,
        yieldPotentialTHa: 5.9,
      },
    ],
    snapshots: [
      {
        date: '2026-01-15',
        shortDate: 'Jan 15',
        cloudCover: 9,
        meanNdvi: 0.24,
        minNdvi: 0.17,
        maxNdvi: 0.31,
        growthStage: { en: 'VE · Planter Seeding', id: 'Fase VE · Tanam Mekanis' },
        biomassIndex: 0.8,
        sprayWindow: 'Optimal',
        windKmh: 9,
        tempC: 29,
        rainMm: 0.3,
        nitrogenKgHa: 164,
        phosphorusKgHa: 59,
        potassiumKgHa: 172,
      },
      {
        date: '2026-02-08',
        shortDate: 'Feb 08',
        cloudCover: 6,
        meanNdvi: 0.46,
        minNdvi: 0.33,
        maxNdvi: 0.57,
        growthStage: { en: 'V6 · Rapid Leaf Growth', id: 'Fase V6 · Pertumbuhan Daun' },
        biomassIndex: 2.6,
        sprayWindow: 'Optimal',
        windKmh: 10,
        tempC: 30,
        rainMm: 0,
        nitrogenKgHa: 181,
        phosphorusKgHa: 54,
        potassiumKgHa: 163,
      },
      {
        date: '2026-03-02',
        shortDate: 'Mar 02',
        cloudCover: 7,
        meanNdvi: 0.71,
        minNdvi: 0.54,
        maxNdvi: 0.81,
        growthStage: { en: 'VT · Tasseling', id: 'Fase VT · Pembungaan Jantan' },
        biomassIndex: 4.9,
        sprayWindow: 'Marginal',
        windKmh: 17,
        tempC: 30,
        rainMm: 2.1,
        nitrogenKgHa: 143,
        phosphorusKgHa: 48,
        potassiumKgHa: 146,
      },
      {
        date: '2026-03-26',
        shortDate: 'Mar 26',
        cloudCover: 3,
        meanNdvi: 0.82,
        minNdvi: 0.66,
        maxNdvi: 0.9,
        growthStage: { en: 'R3 · Cob Milk Fill', id: 'Fase R3 · Pengisian Tongkol' },
        biomassIndex: 5.9,
        sprayWindow: 'Optimal',
        windKmh: 8,
        tempC: 31,
        rainMm: 0,
        nitrogenKgHa: 112,
        phosphorusKgHa: 41,
        potassiumKgHa: 130,
      },
      {
        date: '2026-04-18',
        shortDate: 'Apr 18',
        cloudCover: 10,
        meanNdvi: 0.67,
        minNdvi: 0.5,
        maxNdvi: 0.77,
        growthStage: { en: 'R5 · Kernel Dent', id: 'Fase R5 · Pengerasan Biji' },
        biomassIndex: 4.5,
        sprayWindow: 'Hold',
        windKmh: 22,
        tempC: 31,
        rainMm: 6.8,
        nitrogenKgHa: 90,
        phosphorusKgHa: 36,
        potassiumKgHa: 118,
      },
      {
        date: '2026-05-10',
        shortDate: 'May 10',
        cloudCover: 2,
        meanNdvi: 0.37,
        minNdvi: 0.25,
        maxNdvi: 0.47,
        growthStage: { en: 'R6 · Mechanical Harvest', id: 'Fase R6 · Panen Mekanisasi' },
        biomassIndex: 2.1,
        sprayWindow: 'Optimal',
        windKmh: 9,
        tempC: 29,
        rainMm: 0,
        nitrogenKgHa: 77,
        phosphorusKgHa: 33,
        potassiumKgHa: 109,
      },
    ],
  },
  {
    id: 'mrk-sorgum-4',
    name: { en: 'Malind Sorghum D', id: 'Blok Sorgum Malind D' },
    crop: { en: 'Tropical Sorghum', id: 'Sorgum Tropis' },
    variety: 'Bioguma 1',
    areaHa: 152.5,
    sowingDate: 'Jan 20',
    soilType: { en: 'Sandy Loam', id: 'Lempung Berpasir' },
    uniformRateKgHa: 145,
    fertilizerProduct: { en: 'NPK & Urea Top-Dress', id: 'NPK & Susulan Urea' },
    polygonPath: 'M 656 352 L 954 352 L 982 538 L 692 538 Z',
    labelPos: { x: 820, y: 446 },
    centerGeo: [140.4262, -8.2918],
    ndviGradientStops: [
      { offset: '0%', color: '#65A30D' },
      { offset: '55%', color: '#EAB308' },
      { offset: '100%', color: '#DC2626' },
    ],
    zoneSubPolygons: {
      high: 'M 662 356 L 818 356 L 835 534 L 696 534 Z',
      low: 'M 824 356 L 950 356 L 976 534 L 840 534 Z',
    },
    zones: [
      {
        id: 'high',
        label: { en: 'Zone A · High Biomass', id: 'Zona A · Biomassa Tinggi' },
        sharePct: 45,
        areaHa: 68.6,
        defaultRateKgHa: 165,
        yieldPotentialTHa: 6.4,
      },
      {
        id: 'medium',
        label: { en: 'Zone B · Target Mean', id: 'Zona B · Target Sedang' },
        sharePct: 37,
        areaHa: 56.4,
        defaultRateKgHa: 140,
        yieldPotentialTHa: 5.2,
      },
      {
        id: 'low',
        label: { en: 'Zone C · Sandy Ridge', id: 'Zona C · Pematang Berpasir' },
        sharePct: 18,
        areaHa: 27.5,
        defaultRateKgHa: 110,
        yieldPotentialTHa: 3.9,
      },
    ],
    snapshots: [
      {
        date: '2026-01-15',
        shortDate: 'Jan 15',
        cloudCover: 9,
        meanNdvi: 0.22,
        minNdvi: 0.16,
        maxNdvi: 0.28,
        growthStage: { en: 'Emergence & Root Set', id: 'Perkecambahan Awal' },
        biomassIndex: 0.7,
        sprayWindow: 'Optimal',
        windKmh: 9,
        tempC: 29,
        rainMm: 0.3,
        nitrogenKgHa: 128,
        phosphorusKgHa: 51,
        potassiumKgHa: 144,
      },
      {
        date: '2026-02-08',
        shortDate: 'Feb 08',
        cloudCover: 6,
        meanNdvi: 0.43,
        minNdvi: 0.31,
        maxNdvi: 0.54,
        growthStage: { en: '5-Leaf Vegetative', id: 'Fase Vegetatif 5 Daun' },
        biomassIndex: 2.3,
        sprayWindow: 'Optimal',
        windKmh: 10,
        tempC: 30,
        rainMm: 0,
        nitrogenKgHa: 139,
        phosphorusKgHa: 47,
        potassiumKgHa: 136,
      },
      {
        date: '2026-03-02',
        shortDate: 'Mar 02',
        cloudCover: 7,
        meanNdvi: 0.64,
        minNdvi: 0.48,
        maxNdvi: 0.75,
        growthStage: { en: 'Boot & Panicle Push', id: 'Fase Bunting Malai' },
        biomassIndex: 4.3,
        sprayWindow: 'Marginal',
        windKmh: 17,
        tempC: 30,
        rainMm: 2.1,
        nitrogenKgHa: 114,
        phosphorusKgHa: 41,
        potassiumKgHa: 123,
      },
      {
        date: '2026-03-26',
        shortDate: 'Mar 26',
        cloudCover: 3,
        meanNdvi: 0.74,
        minNdvi: 0.57,
        maxNdvi: 0.84,
        growthStage: { en: 'Soft Dough Stage', id: 'Fase Pengisian Biji' },
        biomassIndex: 5.1,
        sprayWindow: 'Optimal',
        windKmh: 8,
        tempC: 31,
        rainMm: 0,
        nitrogenKgHa: 92,
        phosphorusKgHa: 36,
        potassiumKgHa: 112,
      },
      {
        date: '2026-04-18',
        shortDate: 'Apr 18',
        cloudCover: 10,
        meanNdvi: 0.59,
        minNdvi: 0.44,
        maxNdvi: 0.69,
        growthStage: { en: 'Hard Dough Drying', id: 'Pematangan Biji Kering' },
        biomassIndex: 3.9,
        sprayWindow: 'Hold',
        windKmh: 22,
        tempC: 31,
        rainMm: 6.8,
        nitrogenKgHa: 79,
        phosphorusKgHa: 32,
        potassiumKgHa: 103,
      },
      {
        date: '2026-05-10',
        shortDate: 'May 10',
        cloudCover: 2,
        meanNdvi: 0.33,
        minNdvi: 0.22,
        maxNdvi: 0.42,
        growthStage: { en: 'Grain & Biomass Harvest', id: 'Panen Biji & Biomassa' },
        biomassIndex: 1.9,
        sprayWindow: 'Optimal',
        windKmh: 9,
        tempC: 29,
        rainMm: 0,
        nitrogenKgHa: 69,
        phosphorusKgHa: 29,
        potassiumKgHa: 95,
      },
    ],
  },
];

const LAMPUNG_NOTES: ScoutingNote[] = [
  {
    id: 'lpg-scout-1',
    fieldId: 'lpg-tebu-1',
    x: 428,
    y: 132,
    category: 'Nitrogen Deficiency',
    severity: 'Moderate',
    author: 'Dedi Kurniawan, Agronomis Sumatra',
    date: 'Mar 18',
    note: {
      en: 'Slightly pale cane leaves on eastern laterite strip. Recommended +25 kg/ha ZA spot top-dress.',
      id: 'Daun tebu agak pucat di jalur laterit timur. Disarankan pemupukan susulan ZA +25 kg/ha.',
    },
  },
  {
    id: 'lpg-scout-2',
    fieldId: 'lpg-singkong-2',
    x: 572,
    y: 184,
    category: 'Weed Pressure',
    severity: 'High',
    author: 'Rina Marlina, Pengendali OPT',
    date: 'Mar 10',
    note: {
      en: 'Broadleaf weed encroachment along red access road boundary. Scheduled mechanical inter-row weeding.',
      id: 'Pertumbuhan gulma berdaun lebar di sepanjang batas jalan kebun. Dijadwalkan penyiangan mekanis antar baris.',
    },
  },
  {
    id: 'lpg-scout-3',
    fieldId: 'lpg-jagung-3',
    x: 280,
    y: 448,
    category: 'Emergence Check',
    severity: 'Low',
    author: 'Dedi Kurniawan, Agronomis Sumatra',
    date: 'Feb 12',
    note: {
      en: 'Uniform hybrid stand at 7.8 plants/m2; cob initiation progressing smoothly across Zone A.',
      id: 'Pertumbuhan jagung merata 7,8 tanaman/m2; pembentukan tongkol berjalan baik di Zona A.',
    },
  },
];

const MERAUKE_NOTES: ScoutingNote[] = [
  {
    id: 'mrk-scout-1',
    fieldId: 'mrk-padi-1',
    x: 490,
    y: 235,
    category: 'Nitrogen Deficiency',
    severity: 'Moderate',
    author: 'Yohanes Kaize, Mandor Estate',
    date: 'Mar 22',
    note: {
      en: 'Slightly lower chlorophyll along east drainage canal; scheduled drone Urea spreader pass in Zone C.',
      id: 'Klorofil agak rendah di tepi kanal timur; dijadwalkan penebaran Urea via drone pada Zona C.',
    },
  },
  {
    id: 'mrk-scout-2',
    fieldId: 'mrk-padi-2',
    x: 842,
    y: 268,
    category: 'Pest / Disease',
    severity: 'High',
    author: 'Maria Gebze, Pengamat OPT',
    date: 'Mar 14',
    note: {
      en: 'Localized rice bug activity near eastern tidal bund. Spot drone spray queued once wind < 12 km/h.',
      id: 'Teramati koloni walang sangit di pematang pasang surut timur. Semprot drone dijadwalkan saat angin < 12 km/jam.',
    },
  },
  {
    id: 'mrk-scout-3',
    fieldId: 'mrk-jagung-3',
    x: 345,
    y: 430,
    category: 'Emergence Check',
    severity: 'Low',
    author: 'Yohanes Kaize, Mandor Estate',
    date: 'Feb 16',
    note: {
      en: 'Precision planter row spacing verified across 178 ha mechanized block with zero drainage ponding.',
      id: 'Kerapatan tanam mesin planter terverifikasi merata di 178 ha tanpa genangan berlebih.',
    },
  },
];

export const ESTATE_MAPS: EstateMap[] = [
  {
    id: 'subang-jabar',
    shortName: { en: 'Subang · West Java', id: 'Subang · Jawa Barat' },
    regionLabel: {
      en: 'Subang & Indramayu Estate · West Java',
      id: 'Kawasan Subang & Indramayu · Jawa Barat',
    },
    coordinatesLabel: '6.4182° S, 107.7614° E',
    basemapSrc: '/src/assets/images/aerial_field_basemap_1795541556790.jpg',
    basemapAlt: 'Top-down satellite orthophoto of Subang and Indramayu irrigated farmland in West Java',
    parcels: FIELD_PARCELS,
    initialScoutingNotes: INITIAL_SCOUTING_NOTES,
  },
  {
    id: 'lampung-tengah',
    shortName: { en: 'Central Lampung', id: 'Lampung Tengah' },
    regionLabel: {
      en: 'Terbanggi & Seputih Plantation · Central Lampung',
      id: 'Perkebunan Terbanggi & Seputih · Lampung Tengah',
    },
    coordinatesLabel: '4.8214° S, 105.2148° E',
    basemapSrc: '/src/assets/images/aerial_lampung_estate_1795543361722.jpg',
    basemapAlt: 'Top-down satellite orthophoto of sugarcane, cassava, and corn plantation blocks in Central Lampung',
    parcels: LAMPUNG_PARCELS,
    initialScoutingNotes: LAMPUNG_NOTES,
  },
  {
    id: 'merauke-papua',
    shortName: { en: 'Merauke · South Papua', id: 'Merauke · Papua Selatan' },
    regionLabel: {
      en: 'Kurik & Salor Food Estate · South Papua',
      id: 'Food Estate Kurik & Salor · Merauke, Papua Selatan',
    },
    coordinatesLabel: '8.2845° S, 140.4126° E',
    basemapSrc: '/src/assets/images/aerial_merauke_estate_1795543362017.jpg',
    basemapAlt: 'Top-down satellite orthophoto of mechanized rice and sorghum plots in Merauke South Papua',
    parcels: MERAUKE_PARCELS,
    initialScoutingNotes: MERAUKE_NOTES,
  },
];

export interface XaiFeatureContribution {
  id: string;
  label: Record<Lang, string>;
  observedValue: string;
  impactPct: number; // positive or negative percentage points around baseline 62
  rationale: Record<Lang, string>;
}

export interface XaiDecisionRule {
  id: string;
  condition: string;
  outcome: Record<Lang, string>;
  triggered: 'positive' | 'caution' | 'action';
}

export interface XaiBreakdown {
  baselineScore: number;
  decisionScore: number;
  confidencePct: number;
  recommendedAction: Record<Lang, string>;
  contributions: XaiFeatureContribution[];
  rules: XaiDecisionRule[];
}

export function computeExplainableAiBreakdown(
  field: FieldParcel,
  snapshotIndex: number,
  vraSavingsPct: number
): XaiBreakdown {
  const snap = field.snapshots[snapshotIndex] ?? field.snapshots[0];
  const moisture = getFieldSoilMoisture30Days(field, snapshotIndex);

  const baselineScore = 62;

  // 1. Canopy NDVI / Chlorophyll contribution (-16 to +20)
  const ndviDelta = Math.round((snap.meanNdvi - 0.52) * 44);
  const ndviImpact = Math.max(-16, Math.min(20, ndviDelta));

  // 2. 30-day Soil Moisture Balance (-14 to +12)
  let moistureImpact = 10;
  if (moisture.status === 'Low Moisture') {
    moistureImpact = -13;
  } else if (moisture.status === 'Saturated') {
    moistureImpact = -7;
  } else {
    const midOptimal = (moisture.fieldCapacityPct + moisture.stressThresholdPct) / 2;
    const dist = Math.abs(moisture.currentSurfacePct - midOptimal);
    moistureImpact = Math.max(4, Math.round(12 - dist * 0.4));
  }

  // 3. Available Soil Nitrogen (-11 to +11)
  const nitrogenImpact =
    snap.nitrogenKgHa >= 130
      ? 10
      : snap.nitrogenKgHa >= 100
      ? 5
      : snap.nitrogenKgHa >= 85
      ? -3
      : -9;

  // 4. P & K Reserve Balance (-5 to +7)
  const pkScore = snap.phosphorusKgHa * 1.4 + snap.potassiumKgHa * 0.45;
  const pkImpact = pkScore >= 135 ? 6 : pkScore >= 105 ? 2 : -4;

  // 5. Microclimate & Spray Safety (-14 to +8)
  const weatherImpact =
    snap.windKmh > 18 || snap.rainMm > 3
      ? -13
      : snap.windKmh > 12 || snap.rainMm > 0.5
      ? -6
      : 7;

  // 6. VRA Zone Allocation Efficiency (-4 to +7)
  const vraImpact =
    vraSavingsPct >= 8
      ? 6
      : vraSavingsPct >= 2
      ? 3
      : vraSavingsPct >= 0
      ? 1
      : -3;

  const rawScore =
    baselineScore +
    ndviImpact +
    moistureImpact +
    nitrogenImpact +
    pkImpact +
    weatherImpact +
    vraImpact;
  const decisionScore = Math.max(18, Math.min(98, rawScore));

  // Model confidence penalized gently by satellite cloud cover
  const confidencePct = Math.max(76, Math.min(97, Math.round(96 - snap.cloudCover * 1.1)));

  const contributions: XaiFeatureContribution[] = [
    {
      id: 'ndvi',
      label: { en: 'Canopy NDVI', id: 'Indeks Tajuk NDVI' },
      observedValue: `${snap.meanNdvi.toFixed(2)}`,
      impactPct: ndviImpact,
      rationale:
        ndviImpact >= 0
          ? {
              en: `Strong chlorophyll reflectance (${snap.meanNdvi.toFixed(2)}) supports high Zone A yield target.`,
              id: `Reflektansi klorofil kuat (${snap.meanNdvi.toFixed(2)}) mendukung target hasil Zona A.`,
            }
          : {
              en: `Lower NDVI (${snap.meanNdvi.toFixed(2)}) reflects early emergence or maturation senescence.`,
              id: `NDVI rendah (${snap.meanNdvi.toFixed(2)}) mencerminkan fase awal tanam atau pematangan.`,
            },
    },
    {
      id: 'moisture',
      label: { en: 'Soil Moisture (30d)', id: 'Kelembapan Tanah' },
      observedValue: `${moisture.currentSurfacePct}%`,
      impactPct: moistureImpact,
      rationale:
        moisture.status === 'Optimal'
          ? {
              en: `Within [${moisture.stressThresholdPct}%–${moisture.fieldCapacityPct}%] optimal band for nutrient uptake.`,
              id: `Berada di rentang ideal [${moisture.stressThresholdPct}%–${moisture.fieldCapacityPct}%] untuk serapan hara.`,
            }
          : moisture.status === 'Low Moisture'
          ? {
              en: `Below ${moisture.stressThresholdPct}% stress floor; dry soil limits Urea hydrolysis.`,
              id: `Di bawah ambang ${moisture.stressThresholdPct}%; tanah kering menghambat penyerapan Urea.`,
            }
          : {
              en: `Exceeds ${moisture.fieldCapacityPct}% capacity; hold top-dress to prevent leaching.`,
              id: `Melebihi kapasitas ${moisture.fieldCapacityPct}%; tunda pemupukan agar pupuk tidak tercuci.`,
            },
    },
    {
      id: 'nitrogen',
      label: { en: 'Soil Nitrogen (N)', id: 'Nitrogen Tanah (N)' },
      observedValue: `${snap.nitrogenKgHa} kg/ha`,
      impactPct: nitrogenImpact,
      rationale:
        nitrogenImpact >= 0
          ? {
              en: `Available N (${snap.nitrogenKgHa} kg/ha) satisfies vegetative demand without blanket dosing.`,
              id: `Ketersediaan N (${snap.nitrogenKgHa} kg/ha) mencukupi kebutuhan tanpa tebar merata berlebih.`,
            }
          : {
              en: `Depleted N reserve (${snap.nitrogenKgHa} kg/ha) triggers targeted Zone B/C supplementation.`,
              id: `Cadangan N menurun (${snap.nitrogenKgHa} kg/ha) memicu rekomendasi susulan terarah Zona B/C.`,
            },
    },
    {
      id: 'weather',
      label: { en: 'Spray Microclimate', id: 'Iklim Mikro Semprot' },
      observedValue: `${snap.windKmh} km/h · ${snap.rainMm} mm`,
      impactPct: weatherImpact,
      rationale:
        weatherImpact >= 0
          ? {
              en: `Calm wind (${snap.windKmh} km/h) and dry canopy permit precise drone/boom pass.`,
              id: `Angin tenang (${snap.windKmh} km/jam) dan tajuk kering aman untuk aplikasi drone/sprayer.`,
            }
          : {
              en: `Wind (${snap.windKmh} km/h) or rain (${snap.rainMm} mm) raises drift & wash-off risk.`,
              id: `Angin (${snap.windKmh} km/jam) atau hujan (${snap.rainMm} mm) meningkatkan risiko drift & pencucian.`,
            },
    },
    {
      id: 'pk',
      label: { en: 'P & K Reserve', id: 'Cadangan Hara P & K' },
      observedValue: `${snap.phosphorusKgHa}/${snap.potassiumKgHa} kg/ha`,
      impactPct: pkImpact,
      rationale: {
        en: `Root energy (P=${snap.phosphorusKgHa}) & stalk strength (K=${snap.potassiumKgHa}) baseline.`,
        id: `Basis kekuatan akar (P=${snap.phosphorusKgHa}) & ketahanan batang (K=${snap.potassiumKgHa}).`,
      },
    },
    {
      id: 'vra',
      label: { en: 'VRA Zoning Fit', id: 'Efisiensi Zona VRA' },
      observedValue: `${vraSavingsPct >= 0 ? `-${vraSavingsPct.toFixed(1)}` : `+${Math.abs(vraSavingsPct).toFixed(1)}`}%`,
      impactPct: vraImpact,
      rationale: {
        en: `Zone rate tuning aligns input spend with ${field.zones[0].sharePct}% high-yield zone.`,
        id: `Penyesuaian dosis selaras dengan ${field.zones[0].sharePct}% luas zona potensi tinggi.`,
      },
    },
  ].sort((a, b) => Math.abs(b.impactPct) - Math.abs(a.impactPct));

  const recommendedAction: Record<Lang, string> =
    weatherImpact < -8
      ? {
          en: `Delay spraying & fertilization until wind ≤ 12 km/h; inspect ${field.name.en} drainage channels.`,
          id: `Tunda penyemprotan & pemupukan hingga angin ≤ 12 km/jam; cek saluran drainase ${field.name.id}.`,
        }
      : moisture.status === 'Low Moisture'
      ? {
          en: `Prioritize supplemental irrigation before applying ${field.fertilizerProduct.en} VRA prescription.`,
          id: `Prioritaskan pengairan tambahan sebelum mengaplikasikan resep VRA ${field.fertilizerProduct.id}.`,
        }
      : {
          en: `Execute Zone-weighted ${field.fertilizerProduct.en} VRA plan (${vraSavingsPct >= 0 ? `${vraSavingsPct.toFixed(1)}% input savings` : 'targeted boost'}).`,
          id: `Jalankan resep VRA ${field.fertilizerProduct.id} berbasis zona (${vraSavingsPct >= 0 ? `hemat ${vraSavingsPct.toFixed(1)}% pupuk` : 'peningkatan dosis terarah'}).`,
        };

  const rules: XaiDecisionRule[] = [
    {
      id: 'rule-ndvi',
      condition: `NDVI=${snap.meanNdvi.toFixed(2)} · N=${snap.nitrogenKgHa} kg/ha`,
      outcome:
        snap.meanNdvi >= 0.65
          ? {
              en: 'Canopy vigorous -> Shift N allocation toward high-potential Zone A maintenance.',
              id: 'Tajuk sehat -> Alokasikan pemeliharaan hara pada Zona A berpotensi tinggi.',
            }
          : {
              en: 'Moderate/Low NDVI -> Prioritize Zone B/C inspection before heavy Urea boost.',
              id: 'NDVI sedang/rendah -> Verifikasi lapangan Zona B/C sebelum dosis Urea penuh.',
            },
      triggered: snap.meanNdvi >= 0.65 ? 'positive' : 'caution',
    },
    {
      id: 'rule-moisture',
      condition: `Moisture=${moisture.currentSurfacePct}% (Target ${moisture.stressThresholdPct}–${moisture.fieldCapacityPct}%)`,
      outcome:
        moisture.status === 'Optimal'
          ? {
              en: 'Optimal root moisture -> Fertilizer dissolution efficiency > 85%.',
              id: 'Kelembapan akar ideal -> Efisiensi pelarutan pupuk diprediksi > 85%.',
            }
          : {
              en: 'Moisture outside optimal band -> Synchronize irrigation/drainage prior to spreading.',
              id: 'Kelembapan di luar rentang ideal -> Atur irigasi/drainase sebelum penebaran.',
            },
      triggered: moisture.status === 'Optimal' ? 'positive' : 'action',
    },
    {
      id: 'rule-weather',
      condition: `Wind=${snap.windKmh} km/h · Rain=${snap.rainMm} mm`,
      outcome:
        weatherImpact >= 0
          ? {
              en: 'Within safety limits (≤12 km/h, ≤0.5 mm) -> Green-light field application.',
              id: 'Memenuhi batas aman (≤12 km/jam, ≤0,5 mm) -> Operasi lapangan diizinkan.',
            }
          : {
              en: 'Threshold exceeded -> Drift/runoff lock activated to protect ROI.',
              id: 'Melewati ambang aman -> Pengunci risiko drift/aliran aktif menjaga efisiensi biaya.',
            },
      triggered: weatherImpact >= 0 ? 'positive' : 'action',
    },
  ];

  return {
    baselineScore,
    decisionScore,
    confidencePct,
    recommendedAction,
    contributions,
    rules,
  };
}

export type SoilTypeKey =
  | 'alluvial'
  | 'latosol'
  | 'regosol'
  | 'andosol'
  | 'podsolik'
  | 'gambut';

export type IrrigationTypeKey =
  | 'irrigated'
  | 'rainfed'
  | 'well_drained'
  | 'tidal_swamp';

export interface ManualFieldInput {
  fieldName: string;
  areaHa: number;
  soilType: SoilTypeKey;
  ph: number;
  moisturePct: number;
  elevationM: number;
  rainfallMmMonth: number;
  tempC: number;
  irrigation: IrrigationTypeKey;
  nitrogenKgHa: number;
  phosphorusKgHa: number;
  potassiumKgHa: number;
}

export interface CropSuitabilityResult {
  cropId: string;
  cropName: Record<Lang, string>;
  varietyHint: string;
  scorePct: number;
  suitabilityClass: 'S1' | 'S2' | 'S3'; // S1 Highly Suitable, S2 Moderately Suitable, S3 Marginal
  estimatedYieldTHa: string;
  limitingFactor: Record<Lang, string>;
  fertilizerFocus: Record<Lang, string>;
}

export interface LandSuitabilityReport {
  rankedCrops: CropSuitabilityResult[];
  soilAmendments: Array<Record<Lang, string>>;
  overallSoilHealth: 'Optimal' | 'Needs Conditioning' | 'Acidity / Drainage Alert';
}

export interface ManualPreset {
  id: string;
  label: Record<Lang, string>;
  data: ManualFieldInput;
}

export const MANUAL_INPUT_PRESETS: ManualPreset[] = [
  {
    id: 'lowland-paddy',
    label: { en: 'Irrigated Lowland Paddy', id: 'Sawah Irigasi Dataran Rendah' },
    data: {
      fieldName: 'Petak Sawah Pak Slamet',
      areaHa: 4.5,
      soilType: 'alluvial',
      ph: 6.1,
      moisturePct: 64,
      elevationM: 45,
      rainfallMmMonth: 240,
      tempC: 29,
      irrigation: 'irrigated',
      nitrogenKgHa: 118,
      phosphorusKgHa: 42,
      potassiumKgHa: 135,
    },
  },
  {
    id: 'upland-dry',
    label: { en: 'Upland Rainfed / Tegalan', id: 'Lahan Kering / Tadah Hujan' },
    data: {
      fieldName: 'Kebun Tegal Bu Siti',
      areaHa: 3.2,
      soilType: 'latosol',
      ph: 5.7,
      moisturePct: 33,
      elevationM: 220,
      rainfallMmMonth: 155,
      tempC: 28,
      irrigation: 'rainfed',
      nitrogenKgHa: 88,
      phosphorusKgHa: 36,
      potassiumKgHa: 112,
    },
  },
  {
    id: 'highland-volcanic',
    label: { en: 'Volcanic Highland Slope', id: 'Dataran Tinggi Vulkanik' },
    data: {
      fieldName: 'Lereng Kebun Wonosobo',
      areaHa: 2.0,
      soilType: 'andosol',
      ph: 5.9,
      moisturePct: 48,
      elevationM: 1250,
      rainfallMmMonth: 230,
      tempC: 19,
      irrigation: 'well_drained',
      nitrogenKgHa: 130,
      phosphorusKgHa: 48,
      potassiumKgHa: 145,
    },
  },
  {
    id: 'acid-peat-palm',
    label: { en: 'Acid Peat / Mineral Ultisol', id: 'Gambut Masam / Podsolik' },
    data: {
      fieldName: 'Blok Kebun Riau Selatan',
      areaHa: 12.0,
      soilType: 'gambut',
      ph: 4.5,
      moisturePct: 58,
      elevationM: 25,
      rainfallMmMonth: 270,
      tempC: 30,
      irrigation: 'tidal_swamp',
      nitrogenKgHa: 78,
      phosphorusKgHa: 24,
      potassiumKgHa: 92,
    },
  },
];

function rangeFitPenalty(val: number, optMin: number, optMax: number, weight: number): number {
  if (val >= optMin && val <= optMax) return 0;
  const dist = val < optMin ? optMin - val : val - optMax;
  const span = Math.max(1, optMax - optMin);
  return Math.min(weight, Math.round((dist / span) * weight));
}

export function evaluateCropSuitability(input: ManualFieldInput): LandSuitabilityReport {
  interface CropProfile {
    cropId: string;
    cropName: Record<Lang, string>;
    varietyHint: string;
    estimatedYieldTHa: string;
    phRange: [number, number];
    moistureRange: [number, number];
    elevRange: [number, number];
    rainRange: [number, number];
    tempRange: [number, number];
    preferredSoils: SoilTypeKey[];
    preferredIrrigation: IrrigationTypeKey[];
    fertilizerFocus: Record<Lang, string>;
  }

  const profiles: CropProfile[] = [
    {
      cropId: 'paddy',
      cropName: { en: 'Irrigated Paddy Rice', id: 'Padi Sawah' },
      varietyHint: 'Inpari 32 HDB / Ciherang',
      estimatedYieldTHa: '6.4 – 7.8 t/ha GKP',
      phRange: [5.2, 7.0],
      moistureRange: [50, 82],
      elevRange: [0, 700],
      rainRange: [150, 380],
      tempRange: [24, 33],
      preferredSoils: ['alluvial', 'latosol', 'regosol'],
      preferredIrrigation: ['irrigated', 'tidal_swamp'],
      fertilizerFocus: {
        en: 'Basal NPK Phonska + Split Urea (14 & 35 DAT)',
        id: 'NPK Phonska dasar + Urea susulan (14 & 35 HST)',
      },
    },
    {
      cropId: 'corn',
      cropName: { en: 'Hybrid Corn', id: 'Jagung Hibrida' },
      varietyHint: 'BISI 18 / NK212 / Pioneer P32',
      estimatedYieldTHa: '8.0 – 10.5 t/ha',
      phRange: [5.5, 7.2],
      moistureRange: [24, 48],
      elevRange: [0, 1200],
      rainRange: [100, 260],
      tempRange: [22, 32],
      preferredSoils: ['regosol', 'alluvial', 'latosol', 'andosol'],
      preferredIrrigation: ['well_drained', 'rainfed', 'irrigated'],
      fertilizerFocus: {
        en: 'High N & K top-dress at V6 vegetative stage',
        id: 'Fokus N & K tinggi pada fase V6 (25–30 HST)',
      },
    },
    {
      cropId: 'soybean',
      cropName: { en: 'Soybean', id: 'Kedelai' },
      varietyHint: 'Anjasmoro / Grobogan',
      estimatedYieldTHa: '2.1 – 2.9 t/ha',
      phRange: [5.6, 7.0],
      moistureRange: [25, 45],
      elevRange: [0, 750],
      rainRange: [90, 220],
      tempRange: [23, 31],
      preferredSoils: ['alluvial', 'regosol', 'latosol'],
      preferredIrrigation: ['well_drained', 'rainfed'],
      fertilizerFocus: {
        en: 'Rhizobium seed inoculant + Phosphorus & K boost',
        id: 'Inokulan Rhizobium + penguatan Fosfor & Kalium',
      },
    },
    {
      cropId: 'sugarcane',
      cropName: { en: 'Sugarcane', id: 'Tebu' },
      varietyHint: 'PS 881 / Kidang Kencana',
      estimatedYieldTHa: '82 – 105 t/ha',
      phRange: [5.3, 7.4],
      moistureRange: [28, 52],
      elevRange: [0, 650],
      rainRange: [120, 280],
      tempRange: [24, 34],
      preferredSoils: ['regosol', 'alluvial', 'latosol', 'podsolik'],
      preferredIrrigation: ['well_drained', 'rainfed', 'irrigated'],
      fertilizerFocus: {
        en: 'ZA (Ammonium Sulfate) + KCl for Brix sugar accumulation',
        id: 'Pupuk ZA + KCl untuk memacu rendemen gula',
      },
    },
    {
      cropId: 'cassava',
      cropName: { en: 'Cassava', id: 'Singkong / Ubi Kayu' },
      varietyHint: 'UJ-5 / Malang-4',
      estimatedYieldTHa: '28 – 38 t/ha',
      phRange: [4.8, 7.0],
      moistureRange: [18, 44],
      elevRange: [0, 900],
      rainRange: [80, 260],
      tempRange: [22, 33],
      preferredSoils: ['podsolik', 'latosol', 'regosol'],
      preferredIrrigation: ['well_drained', 'rainfed'],
      fertilizerFocus: {
        en: 'Potassium (KCl) & organic compost for tuber bulking',
        id: 'Kalium (KCl) & kompos untuk pembesaran umbi',
      },
    },
    {
      cropId: 'oil_palm',
      cropName: { en: 'Oil Palm', id: 'Kelapa Sawit' },
      varietyHint: 'Tenera DxP Marihat / Sriwijaya',
      estimatedYieldTHa: '20 – 26 t/ha TBS',
      phRange: [4.3, 6.2],
      moistureRange: [40, 72],
      elevRange: [0, 400],
      rainRange: [180, 420],
      tempRange: [25, 33],
      preferredSoils: ['podsolik', 'gambut', 'latosol', 'alluvial'],
      preferredIrrigation: ['rainfed', 'tidal_swamp', 'well_drained'],
      fertilizerFocus: {
        en: 'Dolomite + MOP (KCl) + Borate & Rock Phosphate',
        id: 'Dolomit + MOP (KCl) + Borat & Fosfat Alam',
      },
    },
    {
      cropId: 'chili',
      cropName: { en: 'Red Chili & Shallots', id: 'Cabai Merah & Bawang Merah' },
      varietyHint: 'Lado F1 / Bima Brebes',
      estimatedYieldTHa: '12 – 18 t/ha',
      phRange: [5.8, 7.0],
      moistureRange: [30, 52],
      elevRange: [50, 1400],
      rainRange: [90, 220],
      tempRange: [19, 30],
      preferredSoils: ['andosol', 'regosol', 'alluvial'],
      preferredIrrigation: ['well_drained', 'irrigated'],
      fertilizerFocus: {
        en: 'Mulch beds + Balanced NPK + Calcium Nitrate',
        id: 'Bedengan mulsa + NPK seimbang + Kalsium Nitrat',
      },
    },
    {
      cropId: 'arabica',
      cropName: { en: 'Arabica Coffee & Highland Veg', id: 'Kopi Arabika & Sayuran Dataran Tinggi' },
      varietyHint: 'Sigarar Utang / S795',
      estimatedYieldTHa: '1.6 – 2.4 t/ha Green Bean',
      phRange: [5.0, 6.4],
      moistureRange: [34, 58],
      elevRange: [850, 2200],
      rainRange: [130, 300],
      tempRange: [14, 23],
      preferredSoils: ['andosol', 'latosol', 'regosol'],
      preferredIrrigation: ['well_drained', 'rainfed'],
      fertilizerFocus: {
        en: 'Shade-tree mulch + Organic manure + K-rich topdress',
        id: 'Naungan lamtoro + pupuk kandang + susulan tinggi K',
      },
    },
  ];

  const rankedCrops: CropSuitabilityResult[] = profiles
    .map((p) => {
      const phPenalty = rangeFitPenalty(input.ph, p.phRange[0], p.phRange[1], 24);
      const moisturePenalty = rangeFitPenalty(
        input.moisturePct,
        p.moistureRange[0],
        p.moistureRange[1],
        24
      );
      const elevPenalty = rangeFitPenalty(
        input.elevationM,
        p.elevRange[0],
        p.elevRange[1],
        26
      );
      const rainPenalty = rangeFitPenalty(
        input.rainfallMmMonth,
        p.rainRange[0],
        p.rainRange[1],
        12
      );
      const tempPenalty = rangeFitPenalty(
        input.tempC,
        p.tempRange[0],
        p.tempRange[1],
        14
      );
      const soilPenalty = p.preferredSoils.includes(input.soilType) ? 0 : 9;
      const irrigPenalty = p.preferredIrrigation.includes(input.irrigation) ? 0 : 10;

      const totalPenalty =
        phPenalty +
        moisturePenalty +
        elevPenalty +
        rainPenalty +
        tempPenalty +
        soilPenalty +
        irrigPenalty;

      const scorePct = Math.max(18, Math.min(97, 98 - totalPenalty));
      const suitabilityClass: 'S1' | 'S2' | 'S3' =
        scorePct >= 78 ? 'S1' : scorePct >= 56 ? 'S2' : 'S3';

      // Identify dominant limiting factor cleanly
      const penalties = [
        { key: 'elev', val: elevPenalty },
        { key: 'moisture', val: moisturePenalty },
        { key: 'ph', val: phPenalty },
        { key: 'temp', val: tempPenalty },
        { key: 'irrig', val: irrigPenalty },
        { key: 'rain', val: rainPenalty },
        { key: 'soil', val: soilPenalty },
      ].sort((a, b) => b.val - a.val);

      const topIssue = penalties[0];
      let limitingFactor: Record<Lang, string> = {
        en: 'All key soil, elevation, and moisture metrics within target range.',
        id: 'Seluruh parameter tanah, elevasi, dan kelembapan berada di zona ideal.',
      };

      if (topIssue.val >= 5) {
        if (topIssue.key === 'ph') {
          limitingFactor =
            input.ph < p.phRange[0]
              ? {
                  en: `Acidic soil (pH ${input.ph.toFixed(1)} < ${p.phRange[0]}) limits nutrient availability; apply Dolomite.`,
                  id: `Tanah masam (pH ${input.ph.toFixed(1)} < ${p.phRange[0]}) menghambat serapan hara; butuh Dolomit.`,
                }
              : {
                  en: `High pH (${input.ph.toFixed(1)} > ${p.phRange[1]}) reduces micronutrient uptake.`,
                  id: `pH tinggi (${input.ph.toFixed(1)} > ${p.phRange[1]}) menurunkan ketersediaan hara mikro.`,
                };
        } else if (topIssue.key === 'moisture') {
          limitingFactor =
            input.moisturePct < p.moistureRange[0]
              ? {
                  en: `Low soil moisture (${input.moisturePct}% < ${p.moistureRange[0]}%) requires supplemental irrigation.`,
                  id: `Kelembapan rendah (${input.moisturePct}% < ${p.moistureRange[0]}%) memerlukan irigasi tambahan.`,
                }
              : {
                  en: `Excess wetness (${input.moisturePct}% > ${p.moistureRange[1]}%) raises root-rot risk without raised beds.`,
                  id: `Terlalu basah (${input.moisturePct}% > ${p.moistureRange[1]}%) berisiko busuk akar tanpa bedengan drainase.`,
                };
        } else if (topIssue.key === 'elev') {
          limitingFactor = {
            en: `Elevation (${input.elevationM} m) lies outside optimal ${p.elevRange[0]}–${p.elevRange[1]} m band.`,
            id: `Elevasi (${input.elevationM} mdpl) di luar rentang ideal ${p.elevRange[0]}–${p.elevRange[1]} mdpl.`,
          };
        } else if (topIssue.key === 'temp') {
          limitingFactor = {
            en: `Ambient temp (${input.tempC}°C) differs from optimal ${p.tempRange[0]}–${p.tempRange[1]}°C zone.`,
            id: `Suhu rata-rata (${input.tempC}°C) di luar zona ideal ${p.tempRange[0]}–${p.tempRange[1]}°C.`,
          };
        } else if (topIssue.key === 'irrig') {
          limitingFactor = {
            en: 'Water management regime needs drainage or supplemental irrigation tuning.',
            id: 'Tata air lahan memerlukan penyesuaian drainase atau irigasi suplementer.',
          };
        } else if (topIssue.key === 'rain') {
          limitingFactor = {
            en: `Monthly rain (${input.rainfallMmMonth} mm) deviates from crop water requirement.`,
            id: `Curah hujan (${input.rainfallMmMonth} mm/bln) kurang selaras dengan kebutuhan air tanaman.`,
          };
        } else {
          limitingFactor = {
            en: 'Soil texture requires organic matter conditioning before planting.',
            id: 'Tekstur tanah memerlukan pembenah bahan organik sebelum olah tanam.',
          };
        }
      }

      return {
        cropId: p.cropId,
        cropName: p.cropName,
        varietyHint: p.varietyHint,
        scorePct,
        suitabilityClass,
        estimatedYieldTHa: p.estimatedYieldTHa,
        limitingFactor,
        fertilizerFocus: p.fertilizerFocus,
      };
    })
    .sort((a, b) => b.scorePct - a.scorePct);

  const soilAmendments: Array<Record<Lang, string>> = [];
  if (input.ph < 5.4) {
    const dolomiteTon = Number(((5.8 - input.ph) * 1.4).toFixed(1));
    soilAmendments.push({
      en: `Neutralize soil acidity (pH ${input.ph.toFixed(1)}) with ${dolomiteTon} t/ha agricultural Dolomite 14 days pre-planting.`,
      id: `Naikkan pH masam (${input.ph.toFixed(1)}) dengan ${dolomiteTon} t/ha kapur Dolomit 14 hari sebelum tanam.`,
    });
  } else if (input.ph > 7.4) {
    soilAmendments.push({
      en: `Alkaline soil (pH ${input.ph.toFixed(1)}): incorporate elemental sulfur or compost to improve Phosphorus availability.`,
      id: `Tanah basa (pH ${input.ph.toFixed(1)}): tambahkan belerang pertanian atau kompos matang agar Fosfor mudah terserap.`,
    });
  } else {
    soilAmendments.push({
      en: `Soil pH (${input.ph.toFixed(1)}) is within healthy tropical agronomic range (5.5–7.2); standard organic matter maintenance suffices.`,
      id: `pH tanah (${input.ph.toFixed(1)}) berada di rentang agronomi sehat (5,5–7,2); cukup pertahankan kompos organik rutin.`,
    });
  }

  if (input.nitrogenKgHa < 95 || input.phosphorusKgHa < 32 || input.potassiumKgHa < 110) {
    soilAmendments.push({
      en: `NPK reserve alert (N=${input.nitrogenKgHa}, P=${input.phosphorusKgHa}, K=${input.potassiumKgHa} kg/ha): prioritize basal compound NPK + compost.`,
      id: `Cadangan hara perlu ditingkatkan (N=${input.nitrogenKgHa}, P=${input.phosphorusKgHa}, K=${input.potassiumKgHa} kg/ha): prioritaskan pupuk NPK majemuk dasar.`,
    });
  } else {
    soilAmendments.push({
      en: `Macro-nutrient baseline balanced (N=${input.nitrogenKgHa}, P=${input.phosphorusKgHa}, K=${input.potassiumKgHa} kg/ha): apply split side-dressing to avoid leaching.`,
      id: `Cadangan hara makro memadai (N=${input.nitrogenKgHa}, P=${input.phosphorusKgHa}, K=${input.potassiumKgHa} kg/ha): berikan pupuk susulan bertahap.`,
    });
  }

  if (input.moisturePct > 68 && input.irrigation !== 'irrigated') {
    soilAmendments.push({
      en: `High water saturation (${input.moisturePct}%): build 30 cm perimeter drainage trenches (parit cacing) before non-paddy crops.`,
      id: `Kelembapan sangat tinggi (${input.moisturePct}%): buat parit drainase sedalam 30 cm sebelum tanam palawija/hortikultura.`,
    });
  } else if (input.moisturePct < 28) {
    soilAmendments.push({
      en: `Dry topsoil (${input.moisturePct}%): apply straw mulch and schedule drip/sprinkler wetting prior to germination.`,
      id: `Tanah permukaan kering (${input.moisturePct}%): gunakan mulsa jerami dan jadwalkan pengairan sebelum fase kecambah.`,
    });
  }

  const overallSoilHealth: LandSuitabilityReport['overallSoilHealth'] =
    input.ph < 5.0 || input.moisturePct > 74 || input.moisturePct < 22
      ? 'Acidity / Drainage Alert'
      : input.ph < 5.5 || input.nitrogenKgHa < 90
      ? 'Needs Conditioning'
      : 'Optimal';

  return {
    rankedCrops,
    soilAmendments,
    overallSoilHealth,
  };
}

export type ActivityType = 'planting' | 'irrigation' | 'fertilization' | 'pesticide';

export interface FieldActivityEntry {
  id: string;
  fieldId: string;
  date: string; // YYYY-MM-DD
  type: ActivityType;
  materialOrMethod: string;
  quantityLabel: string;
  costPerHaIdr: number;
  operator: string;
  vigorImpactPct: number;
  note: string;
  isUserEntry?: boolean;
}

export const INITIAL_FIELD_ACTIVITIES: FieldActivityEntry[] = [
  {
    id: 'act-utara-1',
    fieldId: 'blok-utara-a',
    date: '2026-01-04',
    type: 'planting',
    materialOrMethod: 'Inpari 32 HDB · Jajar Legowo 2:1',
    quantityLabel: '25 kg/ha',
    costPerHaIdr: 1450000,
    operator: 'Poktan Tani Makmur',
    vigorImpactPct: 4.5,
    note: 'Transplanting 18-day seedlings across full 118.4 ha block.',
  },
  {
    id: 'act-utara-2',
    fieldId: 'blok-utara-a',
    date: '2026-01-22',
    type: 'fertilization',
    materialOrMethod: 'Urea Prill (46% N) + NPK Phonska',
    quantityLabel: '165 kg/ha',
    costPerHaIdr: 890000,
    operator: 'Hendra Wijaya',
    vigorImpactPct: 9.2,
    note: 'First vegetative top-dress targeted on Zone A & B tillers.',
  },
  {
    id: 'act-utara-3',
    fieldId: 'blok-utara-a',
    date: '2026-02-14',
    type: 'irrigation',
    materialOrMethod: 'Irigasi Teknis AWD · Pintu Air Utara',
    quantityLabel: '420 m³/ha',
    costPerHaIdr: 210000,
    operator: 'Petugas P3A Subang',
    vigorImpactPct: 5.8,
    note: 'Controlled flooding to 4 cm standing water depth.',
  },
  {
    id: 'act-utara-4',
    fieldId: 'blok-utara-a',
    date: '2026-03-04',
    type: 'pesticide',
    materialOrMethod: 'Buprofezin + Azoxistrobin Drone Spray',
    quantityLabel: '0.85 L/ha',
    costPerHaIdr: 520000,
    operator: 'Tim Drone Agrispray',
    vigorImpactPct: 6.4,
    note: 'Preventive brown planthopper & blast spray under calm 6 km/h wind.',
  },
  {
    id: 'act-timur-1',
    fieldId: 'blok-timur-b',
    date: '2026-01-12',
    type: 'planting',
    materialOrMethod: 'Jagung Hibrida BISI 18 · Planter 70×20 cm',
    quantityLabel: '18 kg/ha',
    costPerHaIdr: 1750000,
    operator: 'Rahmat Hidayat',
    vigorImpactPct: 4.0,
    note: 'Seed treatment with Metalaxyl prior to mechanized sowing.',
  },
  {
    id: 'act-timur-2',
    fieldId: 'blok-timur-b',
    date: '2026-02-05',
    type: 'irrigation',
    materialOrMethod: 'Pompa Alur / Furrow Irrigation',
    quantityLabel: '310 m³/ha',
    costPerHaIdr: 340000,
    operator: 'Rahmat Hidayat',
    vigorImpactPct: 7.1,
    note: 'Relieved early vegetative moisture dip along sandy ridge.',
  },
  {
    id: 'act-timur-3',
    fieldId: 'blok-timur-b',
    date: '2026-02-26',
    type: 'pesticide',
    materialOrMethod: 'Emamektin Benzoat (FAW Control)',
    quantityLabel: '0.5 L/ha',
    costPerHaIdr: 460000,
    operator: 'Surya Pratama',
    vigorImpactPct: 5.3,
    note: 'Targeted whorl spray checked Spodoptera frugiperda larvae.',
  },
  {
    id: 'act-barat-1',
    fieldId: 'blok-barat-c',
    date: '2026-01-14',
    type: 'planting',
    materialOrMethod: 'Kedelai Anjasmoro + Rhizobium Inoculant',
    quantityLabel: '45 kg/ha',
    costPerHaIdr: 1280000,
    operator: 'Koperasi Tani Jaya',
    vigorImpactPct: 3.8,
    note: 'Zero-tillage relay planting after residual paddy moisture.',
  },
  {
    id: 'act-barat-2',
    fieldId: 'blok-barat-c',
    date: '2026-02-18',
    type: 'irrigation',
    materialOrMethod: 'Sprinkler Tambahan Fase R1',
    quantityLabel: '260 m³/ha',
    costPerHaIdr: 290000,
    operator: 'Koperasi Tani Jaya',
    vigorImpactPct: 6.2,
    note: 'Protected early bloom flower retention during dry spell.',
  },
  {
    id: 'act-selatan-1',
    fieldId: 'blok-selatan-d',
    date: '2026-01-18',
    type: 'fertilization',
    materialOrMethod: 'Campuran ZA + KCl Ratoon Boost',
    quantityLabel: '190 kg/ha',
    costPerHaIdr: 1120000,
    operator: 'Tim Kebun PG Subang',
    vigorImpactPct: 8.4,
    note: 'Side-dressed along cane furrows before canopy closure.',
  },
  {
    id: 'act-lpg-1',
    fieldId: 'lpg-tebu-1',
    date: '2026-01-08',
    type: 'planting',
    materialOrMethod: 'Tebu PS 881 · Bibit Bagal 2 Mata',
    quantityLabel: '6.5 t/ha',
    costPerHaIdr: 2900000,
    operator: 'Divisi Kebun Terbanggi',
    vigorImpactPct: 5.1,
    note: 'Deep furrow planting with Dolomite lime amendment.',
  },
  {
    id: 'act-lpg-2',
    fieldId: 'lpg-tebu-1',
    date: '2026-02-20',
    type: 'pesticide',
    materialOrMethod: 'Ametryn Pre-Emergence Herbicide',
    quantityLabel: '2.0 L/ha',
    costPerHaIdr: 410000,
    operator: 'Andi Saputra',
    vigorImpactPct: 4.7,
    note: 'Broadleaf weed suppression along inter-row drainage.',
  },
  {
    id: 'act-mrk-1',
    fieldId: 'mrk-padi-1',
    date: '2026-01-05',
    type: 'planting',
    materialOrMethod: 'Padi Inpara 3 · Direct Seeded (Tabela)',
    quantityLabel: '35 kg/ha',
    costPerHaIdr: 1320000,
    operator: 'Brigade Alsintan Kurik',
    vigorImpactPct: 4.9,
    note: 'Mechanized drum seeder across 245 ha food estate block.',
  },
  {
    id: 'act-mrk-2',
    fieldId: 'mrk-padi-1',
    date: '2026-02-11',
    type: 'irrigation',
    materialOrMethod: 'Pompa Pintu Pasang Surut Sektor 1',
    quantityLabel: '480 m³/ha',
    costPerHaIdr: 260000,
    operator: 'Yohanes Kaize',
    vigorImpactPct: 6.9,
    note: 'Flushed iron toxicity buildup during active tillering.',
  },
];

export interface CropVarietyProfile {
  varietyId: string;
  varietyLabel: string;
  cropGroup: Record<Lang, string>;
  defaultTargetYieldTHa: number;
  minYieldTHa: number;
  maxYieldTHa: number;
  // Total elemental nutrient requirement (kg/ha) per ton of target yield
  nPerTon: number;
  pPerTon: number;
  kPerTon: number;
  splitTiming: Array<{
    stage: Record<Lang, string>;
    window: Record<Lang, string>;
    nSharePct: number;
    pSharePct: number;
    kSharePct: number;
  }>;
}

export const CROP_VARIETY_PROFILES: CropVarietyProfile[] = [
  {
    varietyId: 'Inpari 32 HDB',
    varietyLabel: 'Inpari 32 HDB',
    cropGroup: { en: 'Irrigated Rice', id: 'Padi Sawah' },
    defaultTargetYieldTHa: 7.2,
    minYieldTHa: 4.5,
    maxYieldTHa: 9.5,
    nPerTon: 23.5,
    pPerTon: 7.2,
    kPerTon: 22.0,
    splitTiming: [
      {
        stage: { en: 'Basal Dressing', id: 'Pupuk Dasar' },
        window: { en: '0–7 DAT', id: '0–7 HST' },
        nSharePct: 30,
        pSharePct: 100,
        kSharePct: 50,
      },
      {
        stage: { en: 'Top-Dress I (Tillering)', id: 'Susulan I (Anakan Aktif)' },
        window: { en: '21–25 DAT', id: '21–25 HST' },
        nSharePct: 40,
        pSharePct: 0,
        kSharePct: 0,
      },
      {
        stage: { en: 'Top-Dress II (Panicle)', id: 'Susulan II (Primordia)' },
        window: { en: '38–42 DAT', id: '38–42 HST' },
        nSharePct: 30,
        pSharePct: 0,
        kSharePct: 50,
      },
    ],
  },
  {
    varietyId: 'Inpara 3 Swampland',
    varietyLabel: 'Inpara 3 Swampland',
    cropGroup: { en: 'Tidal / Swampland Rice', id: 'Padi Pasang Surut' },
    defaultTargetYieldTHa: 6.4,
    minYieldTHa: 4.0,
    maxYieldTHa: 8.5,
    nPerTon: 22.0,
    pPerTon: 7.8,
    kPerTon: 23.0,
    splitTiming: [
      {
        stage: { en: 'Basal Dressing', id: 'Pupuk Dasar' },
        window: { en: '0–7 DAS', id: '0–7 HST' },
        nSharePct: 30,
        pSharePct: 100,
        kSharePct: 50,
      },
      {
        stage: { en: 'Top-Dress I (Tillering)', id: 'Susulan I (Anakan Aktif)' },
        window: { en: '20–24 DAS', id: '20–24 HST' },
        nSharePct: 40,
        pSharePct: 0,
        kSharePct: 0,
      },
      {
        stage: { en: 'Top-Dress II (Panicle)', id: 'Susulan II (Bunting)' },
        window: { en: '36–40 DAS', id: '36–40 HST' },
        nSharePct: 30,
        pSharePct: 0,
        kSharePct: 50,
      },
    ],
  },
  {
    varietyId: 'BISI 18',
    varietyLabel: 'BISI 18 / Pioneer P32',
    cropGroup: { en: 'Hybrid Corn', id: 'Jagung Hibrida' },
    defaultTargetYieldTHa: 9.2,
    minYieldTHa: 5.5,
    maxYieldTHa: 12.5,
    nPerTon: 21.0,
    pPerTon: 6.4,
    kPerTon: 18.5,
    splitTiming: [
      {
        stage: { en: 'Starter / Basal', id: 'Pupuk Dasar' },
        window: { en: '7–10 DAS', id: '7–10 HST' },
        nSharePct: 30,
        pSharePct: 100,
        kSharePct: 50,
      },
      {
        stage: { en: 'Side-Dress I (V6)', id: 'Susulan I (Fase V6)' },
        window: { en: '25–30 DAS', id: '25–30 HST' },
        nSharePct: 45,
        pSharePct: 0,
        kSharePct: 0,
      },
      {
        stage: { en: 'Side-Dress II (Pre-Tassel)', id: 'Susulan II (Pra-Malai)' },
        window: { en: '42–45 DAS', id: '42–45 HST' },
        nSharePct: 25,
        pSharePct: 0,
        kSharePct: 50,
      },
    ],
  },
  {
    varietyId: 'Anjasmoro',
    varietyLabel: 'Anjasmoro / Grobogan',
    cropGroup: { en: 'Soybean', id: 'Kedelai' },
    defaultTargetYieldTHa: 2.6,
    minYieldTHa: 1.5,
    maxYieldTHa: 3.6,
    nPerTon: 42.0,
    pPerTon: 14.5,
    kPerTon: 48.0,
    splitTiming: [
      {
        stage: { en: 'Basal + Rhizobium', id: 'Pupuk Dasar + Rhizobium' },
        window: { en: '0–7 DAS', id: '0–7 HST' },
        nSharePct: 60,
        pSharePct: 100,
        kSharePct: 60,
      },
      {
        stage: { en: 'Pre-Bloom Boost', id: 'Susulan Awal Berbunga' },
        window: { en: '22–28 DAS', id: '22–28 HST' },
        nSharePct: 40,
        pSharePct: 0,
        kSharePct: 40,
      },
      {
        stage: { en: 'Pod-Fill Check (Foliar)', id: 'Kontrol Pengisian Polong' },
        window: { en: '45 DAS', id: '45 HST' },
        nSharePct: 0,
        pSharePct: 0,
        kSharePct: 0,
      },
    ],
  },
  {
    varietyId: 'PS 881',
    varietyLabel: 'PS 881 / Kidang Kencana',
    cropGroup: { en: 'Sugarcane', id: 'Tebu' },
    defaultTargetYieldTHa: 95,
    minYieldTHa: 60,
    maxYieldTHa: 130,
    nPerTon: 2.0,
    pPerTon: 0.65,
    kPerTon: 2.1,
    splitTiming: [
      {
        stage: { en: 'Furrow Basal', id: 'Pupuk Dasar Alur' },
        window: { en: '0–14 DAP', id: '0–14 HST' },
        nSharePct: 35,
        pSharePct: 100,
        kSharePct: 40,
      },
      {
        stage: { en: 'Tillering Top-Dress', id: 'Susulan I (Tunas)' },
        window: { en: '45–60 DAP', id: '45–60 HST' },
        nSharePct: 45,
        pSharePct: 0,
        kSharePct: 30,
      },
      {
        stage: { en: 'Grand Growth K Boost', id: 'Susulan II (Batang & Brix)' },
        window: { en: '90–105 DAP', id: '90–105 HST' },
        nSharePct: 20,
        pSharePct: 0,
        kSharePct: 30,
      },
    ],
  },
  {
    varietyId: 'UJ-5 / Kasetsart',
    varietyLabel: 'UJ-5 / Malang-4',
    cropGroup: { en: 'Cassava', id: 'Singkong / Ubi Kayu' },
    defaultTargetYieldTHa: 36,
    minYieldTHa: 20,
    maxYieldTHa: 50,
    nPerTon: 4.5,
    pPerTon: 1.5,
    kPerTon: 5.4,
    splitTiming: [
      {
        stage: { en: 'Early Root Establish', id: 'Pupuk Awal Akar' },
        window: { en: '15–21 DAP', id: '15–21 HST' },
        nSharePct: 50,
        pSharePct: 100,
        kSharePct: 40,
      },
      {
        stage: { en: 'Tuber Initiation', id: 'Susulan Pembesaran Umbi' },
        window: { en: '60–75 DAP', id: '60–75 HST' },
        nSharePct: 50,
        pSharePct: 0,
        kSharePct: 60,
      },
      {
        stage: { en: 'Starch Bulking Check', id: 'Pemantauan Pati' },
        window: { en: '150 DAP', id: '150 HST' },
        nSharePct: 0,
        pSharePct: 0,
        kSharePct: 0,
      },
    ],
  },
];

export interface FertilizerCalcInput {
  varietyId: string;
  areaHa: number;
  targetYieldTHa: number;
  currentNKgHa: number;
  currentPKgHa: number;
  currentKKgHa: number;
}

export interface FertilizerProductRecommendation {
  id: 'phonska' | 'urea' | 'sp36' | 'kcl';
  name: Record<Lang, string>;
  analysisLabel: string;
  rateKgHa: number;
  totalKg: number;
  sacks50Kg: number;
  estimatedCostIdr: number;
}

export interface FertilizerCalcResult {
  profile: CropVarietyProfile;
  nutrients: Array<{
    key: 'N' | 'P' | 'K';
    label: Record<Lang, string>;
    soilAvailableKgHa: number;
    cropDemandKgHa: number;
    recommendedAddKgHa: number;
  }>;
  products: FertilizerProductRecommendation[];
  totalRateKgHa: number;
  totalSacks: number;
  totalCostIdr: number;
  costPerHaIdr: number;
  splits: Array<{
    stage: Record<Lang, string>;
    window: Record<Lang, string>;
    phonskaKgHa: number;
    ureaKgHa: number;
    sp36KgHa: number;
    kclKgHa: number;
  }>;
}

export function matchVarietyProfileId(field: FieldParcel): string {
  const v = field.variety.toLowerCase();
  if (v.includes('inpara')) return 'Inpara 3 Swampland';
  if (v.includes('bisi') || v.includes('pioneer')) return 'BISI 18';
  if (v.includes('anjasmoro') || v.includes('grobogan')) return 'Anjasmoro';
  if (v.includes('ps 881')) return 'PS 881';
  if (v.includes('uj-5') || v.includes('kasetsart')) return 'UJ-5 / Kasetsart';
  return 'Inpari 32 HDB';
}

export function calculateFertilizerPrescription(
  input: FertilizerCalcInput
): FertilizerCalcResult {
  const profile =
    CROP_VARIETY_PROFILES.find((p) => p.varietyId === input.varietyId) ??
    CROP_VARIETY_PROFILES[0];

  const demandN = Math.round(profile.nPerTon * input.targetYieldTHa);
  const demandP = Math.round(profile.pPerTon * input.targetYieldTHa);
  const demandK = Math.round(profile.kPerTon * input.targetYieldTHa);

  // Soil credit efficiency factor (~0.62 available in season, adjusted so realistic deficits appear)
  const creditN = Math.round(input.currentNKgHa * 0.65);
  const creditP = Math.round(input.currentPKgHa * 0.58);
  const creditK = Math.round(input.currentKKgHa * 0.62);

  // Deficit in elemental nutrient (kg/ha), with maintenance minimum when high yield targeted
  const addN = Math.max(15, demandN - creditN);
  const addP = Math.max(8, demandP - creditP);
  const addK = Math.max(12, demandK - creditK);

  // Convert elemental P -> P2O5 (*2.29) and elemental K -> K2O (*1.20)
  const reqN = addN;
  const reqP2O5 = addP * 2.29;
  const reqK2O = addK * 1.2;

  // Allocate compound NPK Phonska (15-15-15) up to the limiting base requirement (capped reasonably at 300 kg/ha)
  const phonskaByP = (reqP2O5 / 0.15) * 0.72;
  const phonskaByN = (reqN / 0.15) * 0.35;
  const phonskaRate = Math.min(300, Math.max(50, Math.round(Math.min(phonskaByP, phonskaByN) / 5) * 5));

  const nFromPhonska = phonskaRate * 0.15;
  const p2o5FromPhonska = phonskaRate * 0.15;
  const k2oFromPhonska = phonskaRate * 0.15;

  const remN = Math.max(0, reqN - nFromPhonska);
  const remP2O5 = Math.max(0, reqP2O5 - p2o5FromPhonska);
  const remK2O = Math.max(0, reqK2O - k2oFromPhonska);

  const ureaRate = Math.max(0, Math.round(remN / 0.46 / 5) * 5);
  const sp36Rate = Math.max(0, Math.round(remP2O5 / 0.36 / 5) * 5);
  const kclRate = Math.max(0, Math.round(remK2O / 0.60 / 5) * 5);

  // Indonesian benchmark retail / non-subsidized blend prices (IDR per kg)
  const priceMap = {
    phonska: 4200,
    urea: 3800,
    sp36: 4600,
    kcl: 5800,
  };

  const buildProduct = (
    id: 'phonska' | 'urea' | 'sp36' | 'kcl',
    name: Record<Lang, string>,
    analysisLabel: string,
    rateKgHa: number
  ): FertilizerProductRecommendation => {
    const totalKg = Math.round(rateKgHa * input.areaHa);
    const sacks50Kg = Math.ceil(totalKg / 50);
    const estimatedCostIdr = Math.round(totalKg * priceMap[id]);
    return {
      id,
      name,
      analysisLabel,
      rateKgHa,
      totalKg,
      sacks50Kg,
      estimatedCostIdr,
    };
  };

  const products: FertilizerProductRecommendation[] = [
    buildProduct(
      'phonska',
      { en: 'NPK Phonska Compound', id: 'NPK Phonska Majemuk' },
      '15-15-15',
      phonskaRate
    ),
    buildProduct('urea', { en: 'Urea Prill / Granular', id: 'Urea Prill / Granul' }, '46% N', ureaRate),
    buildProduct('sp36', { en: 'SP-36 Phosphate', id: 'SP-36 Fosfat' }, '36% P₂O₅', sp36Rate),
    buildProduct('kcl', { en: 'KCl / Muriate of Potash', id: 'KCl / MOP Kalium' }, '60% K₂O', kclRate),
  ];

  const totalRateKgHa = products.reduce((s, p) => s + p.rateKgHa, 0);
  const totalSacks = products.reduce((s, p) => s + p.sacks50Kg, 0);
  const totalCostIdr = products.reduce((s, p) => s + p.estimatedCostIdr, 0);
  const costPerHaIdr = input.areaHa > 0 ? Math.round(totalCostIdr / input.areaHa) : 0;

  const splits = profile.splitTiming.map((st, idx) => ({
    stage: st.stage,
    window: st.window,
    phonskaKgHa: idx === 0 ? phonskaRate : 0,
    ureaKgHa: Math.round((ureaRate * st.nSharePct) / 100),
    sp36KgHa: Math.round((sp36Rate * st.pSharePct) / 100),
    kclKgHa: Math.round((kclRate * st.kSharePct) / 100),
  }));

  return {
    profile,
    nutrients: [
      {
        key: 'N',
        label: { en: 'Nitrogen (N)', id: 'Nitrogen (N)' },
        soilAvailableKgHa: input.currentNKgHa,
        cropDemandKgHa: demandN,
        recommendedAddKgHa: addN,
      },
      {
        key: 'P',
        label: { en: 'Phosphorus (P)', id: 'Fosfor (P)' },
        soilAvailableKgHa: input.currentPKgHa,
        cropDemandKgHa: demandP,
        recommendedAddKgHa: addP,
      },
      {
        key: 'K',
        label: { en: 'Potassium (K)', id: 'Kalium (K)' },
        soilAvailableKgHa: input.currentKKgHa,
        cropDemandKgHa: demandK,
        recommendedAddKgHa: addK,
      },
    ],
    products,
    totalRateKgHa,
    totalSacks,
    totalCostIdr,
    costPerHaIdr,
    splits,
  };
}

export interface YieldYearPoint {
  year: string;
  yieldTHa: number;
  totalTons: number;
  meanPeakNdvi: number;
  isForecast: boolean;
}

export interface ZoneYieldProjection {
  zoneId: 'high' | 'medium' | 'low';
  label: Record<Lang, string>;
  areaHa: number;
  sharePct: number;
  projectedTHa: number;
  projectedTons: number;
}

export interface YieldForecastReport {
  forecastYieldTHa: number;
  forecastTotalTons: number;
  forecastLowTons: number;
  forecastHighTons: number;
  histAvgTHa: number;
  deltaVsHistoryPct: number;
  ndviMultiplier: number;
  moistureFactor: number;
  confidencePct: number;
  daysToHarvest: number;
  estimatedGrossIdr: number;
  pricePerKgIdr: number;
  yearlySeries: YieldYearPoint[];
  zoneBreakdown: ZoneYieldProjection[];
}

export function computeYieldForecast(
  field: FieldParcel,
  snapshotIndex: number
): YieldForecastReport {
  const snap = field.snapshots[snapshotIndex] ?? field.snapshots[0];
  const moisture = getFieldSoilMoisture30Days(field, snapshotIndex);

  // Baseline zone-weighted potential yield (t/ha)
  const baselineTons = field.zones.reduce(
    (sum, z) => sum + z.areaHa * z.yieldPotentialTHa,
    0
  );
  const baselineTHa = baselineTons / field.areaHa;

  // Expected NDVI curve across the 6 season passes (early -> mid -> peak -> senescence)
  const expectedPassNdvi = [0.28, 0.48, 0.72, 0.80, 0.68, 0.42][snapshotIndex] ?? 0.65;
  const ndviRatio = snap.meanNdvi / Math.max(0.18, expectedPassNdvi);
  // Bounded vegetation multiplier derived from NDVI + biomass performance
  const ndviMultiplier = Math.max(
    0.86,
    Math.min(1.13, Number((0.92 + (ndviRatio - 0.88) * 0.42).toFixed(3)))
  );

  const moistureFactor =
    moisture.status === 'Optimal'
      ? 1.03
      : moisture.status === 'Low Moisture'
      ? 0.93
      : 0.96;

  const forecastYieldTHa = Number((baselineTHa * ndviMultiplier * moistureFactor).toFixed(2));
  const forecastTotalTons = Number((forecastYieldTHa * field.areaHa).toFixed(1));

  // Confidence tightens as season approaches peak/maturity passes and lowers with cloud cover
  const passConfidence = [74, 79, 85, 91, 93, 96][snapshotIndex] ?? 86;
  const confidencePct = Math.max(
    68,
    Math.min(97, Math.round(passConfidence - snap.cloudCover * 0.75))
  );

  const bandSpreadPct = Math.max(0.04, (100 - confidencePct) / 220);
  const forecastLowTons = Number((forecastTotalTons * (1 - bandSpreadPct)).toFixed(1));
  const forecastHighTons = Number((forecastTotalTons * (1 + bandSpreadPct)).toFixed(1));

  // Deterministic 4-year historical yield series (2022–2025) grounded in parcel baseline
  const seedHash = field.id
    .split('')
    .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const yearOffsets = [-0.07, 0.03, -0.02, 0.04]; // e.g., El Nino dip vs favorable season
  const years = ['2022', '2023', '2024', '2025'];

  const historicalPoints: YieldYearPoint[] = years.map((yr, idx) => {
    const jitter = (((seedHash + idx * 17) % 7) - 3) * 0.012;
    const factor = 1 + yearOffsets[idx] + jitter;
    const yTHa = Number((baselineTHa * factor).toFixed(2));
    return {
      year: yr,
      yieldTHa: yTHa,
      totalTons: Number((yTHa * field.areaHa).toFixed(1)),
      meanPeakNdvi: Number(Math.min(0.91, Math.max(0.56, 0.78 * factor)).toFixed(2)),
      isForecast: false,
    };
  });

  const histAvgTHa = Number(
    (
      historicalPoints.reduce((s, p) => s + p.yieldTHa, 0) /
      historicalPoints.length
    ).toFixed(2)
  );
  const deltaVsHistoryPct = Number(
    (((forecastYieldTHa - histAvgTHa) / histAvgTHa) * 100).toFixed(1)
  );

  const peakNdviSoFar = Math.max(
    ...field.snapshots.slice(0, snapshotIndex + 1).map((s) => s.meanNdvi)
  );

  const yearlySeries: YieldYearPoint[] = [
    ...historicalPoints,
    {
      year: '2026*',
      yieldTHa: forecastYieldTHa,
      totalTons: forecastTotalTons,
      meanPeakNdvi: Number(peakNdviSoFar.toFixed(2)),
      isForecast: true,
    },
  ];

  const zoneBreakdown: ZoneYieldProjection[] = field.zones.map((z) => {
    const projectedTHa = Number(
      (z.yieldPotentialTHa * ndviMultiplier * moistureFactor).toFixed(2)
    );
    return {
      zoneId: z.id,
      label: z.label,
      areaHa: z.areaHa,
      sharePct: z.sharePct,
      projectedTHa,
      projectedTons: Number((projectedTHa * z.areaHa).toFixed(1)),
    };
  });

  const daysToHarvest = [115, 91, 69, 45, 22, 0][snapshotIndex] ?? 30;

  // Farmgate Indonesian commodity price benchmarks (IDR/kg)
  const cropEn = field.crop.en.toLowerCase();
  const pricePerKgIdr = cropEn.includes('rice') || cropEn.includes('paddy')
    ? 6000
    : cropEn.includes('corn')
    ? 5200
    : cropEn.includes('soybean')
    ? 10500
    : cropEn.includes('sugarcane')
    ? 750
    : cropEn.includes('cassava')
    ? 1450
    : 4800; // Sorghum / other grain

  const estimatedGrossIdr = Math.round(forecastTotalTons * 1000 * pricePerKgIdr);

  return {
    forecastYieldTHa,
    forecastTotalTons,
    forecastLowTons,
    forecastHighTons,
    histAvgTHa,
    deltaVsHistoryPct,
    ndviMultiplier,
    moistureFactor,
    confidencePct,
    daysToHarvest,
    estimatedGrossIdr,
    pricePerKgIdr,
    yearlySeries,
    zoneBreakdown,
  };
}

