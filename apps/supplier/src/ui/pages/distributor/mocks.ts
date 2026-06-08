export type DistributorTier = 'Bronze' | 'Silver' | 'Gold';
export type DistributorStatus = 'active' | 'pending' | 'cold' | 'inactive';

export interface Distributor {
  id: string;
  name: string;
  tier: DistributorTier;
  totalOrders: number;
  totalValueNGN: number;
  lastOrder: string;
  location: string;
  status: DistributorStatus;
}

export interface DistributorSummary {
  total: number;
  activeThisMonth: number;
  coldTier: number;
  pendingApproval: number;
}

const sampleNames = [
  'Stardvile Oil',
  'PrimeFuel Distributors',
  'Apex Energy Ltd',
  'Bluewave Trading',
  'NorthStar Petroleum',
  'Zenith Logistics',
  'GreenLine Distribution',
];

const sampleLocations = [
  'Port Harcourt, Rivers',
  'Ibadan, Oyo',
  'Lagos Island, Lagos',
  'Wuse, Abuja',
  'Awka, Anambra',
  'Kano, Kano',
  'Lekki, Lagos',
];

const sampleDates = [
  '2 days ago',
  '12 Mar 2026',
  '28 Feb 2026',
  '04 Mar 2026',
  '17 Feb 2026',
  '21 Mar 2026',
  '08 Feb 2026',
];

const tierByIndex: DistributorTier[] = ['Gold', 'Silver', 'Gold', 'Bronze', 'Silver', 'Gold', 'Bronze'];
const statusByIndex: DistributorStatus[] = ['active', 'pending', 'active', 'cold', 'active', 'pending', 'inactive'];

export const DISTRIBUTORS_MOCK: Distributor[] = Array.from({ length: 10 }, (_, i) => ({
  id: `dist-${String(i + 1).padStart(3, '0')}`,
  name: sampleNames[i % sampleNames.length],
  tier: tierByIndex[i % tierByIndex.length],
  totalOrders: 12 + (i % 6) * 3,
  totalValueNGN: 14_500_000 + (i % 4) * 1_750_000,
  lastOrder: sampleDates[i % sampleDates.length],
  location: sampleLocations[i % sampleLocations.length],
  status: statusByIndex[i % statusByIndex.length],
}));

export function buildDistributorSummary(rows: Distributor[]): DistributorSummary {
  return {
    total: rows.length,
    activeThisMonth: rows.filter((r) => r.status === 'active').length,
    coldTier: rows.filter((r) => r.status === 'cold').length,
    pendingApproval: rows.filter((r) => r.status === 'pending').length,
  };
}
