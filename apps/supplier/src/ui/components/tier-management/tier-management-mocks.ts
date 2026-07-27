export interface TierThreshold {
  minMonths: number;
  paymentDiscipline: number;
  minVolume: number;
}

export interface TierConfig {
  id: string;
  name: string;
  activeCount: number;
  color: string;
  borderColor: string;
  thresholds: TierThreshold;
  benefits: string;
}

export const TIER_MANAGEMENT_MOCK: TierConfig[] = [
  {
    id: 'bronze',
    name: 'Bronze Tier',
    activeCount: 2,
    color: '#FB8C1C',
    borderColor: '#FB8C1C',
    thresholds: {
      minMonths: 0,
      paymentDiscipline: 0,
      minVolume: 0,
    },
    benefits: 'Standard Pricing',
  },
  {
    id: 'silver',
    name: 'Silver Tier',
    activeCount: 2,
    color: '#C0C0C0',
    borderColor: '#A1A1AA',
    thresholds: {
      minMonths: 6,
      paymentDiscipline: 95,
      minVolume: 15000000,
    },
    benefits: '5% Discount, Priority Support',
  },
  {
    id: 'gold',
    name: 'Gold Tier',
    activeCount: 2,
    color: '#FBC02D',
    borderColor: '#FBC02D',
    thresholds: {
      minMonths: 12,
      paymentDiscipline: 95,
      minVolume: 15000000,
    },
    benefits: '10% Discount, Credit Terms, Priority Support, Dedicated manager.',
  },
];
