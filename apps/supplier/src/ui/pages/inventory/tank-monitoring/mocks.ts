export type TankStatus = 'adequate' | 'warning' | 'critical';

export interface Tank {
  id: string;
  name: string;
  location: string;
  product: string;
  capacityL: number;
  stockL: number;
  coverageDays: number;
  reorderDays: number;
  status: TankStatus;
}

export interface TankSummary {
  totalTanks: number;
  totalProducts: number;
  alerts: number;
  lastDip: string;
  lastDipTime: string;
  avgDaysLeft: number;
}

export interface VarianceAlert {
  tankName: string;
  expectedL: number;
  actualL: number;
}

export const TANKS_MOCK: Tank[] = [
  {
    id: 'tank-main-a',
    name: 'Main Depot (Tank A)',
    location: 'Lagos Island',
    product: 'Premium Motor Spirit (PMS)',
    capacityL: 33_000,
    stockL: 24_420,
    coverageDays: 8.2,
    reorderDays: 6,
    status: 'adequate',
  },
  {
    id: 'tank-main-b',
    name: 'Main Depot (Tank B)',
    location: 'Lagos Island',
    product: 'Premium Motor Spirit (PMS)',
    capacityL: 33_000,
    stockL: 24_420,
    coverageDays: 8.2,
    reorderDays: 6,
    status: 'adequate',
  },
  {
    id: 'tank-ikeja-b',
    name: 'Ikeja Station (Tank B)',
    location: 'Ikeja',
    product: 'Automotive Gas Oil',
    capacityL: 20_000,
    stockL: 10_230,
    coverageDays: 4.8,
    reorderDays: 6,
    status: 'critical',
  },
  {
    id: 'tank-vi-c',
    name: 'Victoria Island (Tank C)',
    location: 'VI',
    product: 'Dual Purpose Kerosene',
    capacityL: 10_000,
    stockL: 2_400,
    coverageDays: 1.2,
    reorderDays: 5,
    status: 'critical',
  },
];

export const TANK_SUMMARY_MOCK: TankSummary = {
  totalTanks: 4,
  totalProducts: 3,
  alerts: 2,
  lastDip: 'Today',
  lastDipTime: '11:42am',
  avgDaysLeft: 13,
};

export const VARIANCE_ALERT_MOCK: VarianceAlert = {
  tankName: 'Main Depot (Tank A)',
  expectedL: 25_100,
  actualL: 24_420,
};
