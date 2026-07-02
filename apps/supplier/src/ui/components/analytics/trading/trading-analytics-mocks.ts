// TODO(orval): replace with useGetTradingAnalyticsKpisQuery once the endpoint lands.
export const TRADING_ANALYTICS_KPIS_MOCK = [
  { label: 'Total Trades', value: '1,348', trend: { value: '+10% vs last month', direction: 'up' as const } },
  { label: 'Trading Volume', value: '₦420M', trend: { value: '+12% vs last month', direction: 'up' as const } },
  { label: 'Internal Trades', value: '1,103', trend: { value: '+8% vs last month', direction: 'up' as const } },
  { label: 'Avg Settlement Time', value: '6.2 Hrs', trend: { value: '-15% vs last month', direction: 'down' as const } },
];

// TODO(orval): replace with useGetTradeOverTimeQuery once the endpoint lands.
export interface TradeOverTimePoint {
  day: string;
  trades: number;
}

export const TRADE_OVER_TIME_MOCK: TradeOverTimePoint[] = [
  { day: 'Mon', trades: 25 },
  { day: 'Tue', trades: 40 },
  { day: 'Wed', trades: 35 },
  { day: 'Thu', trades: 55 },
  { day: 'Fri', trades: 45 },
  { day: 'Sat', trades: 30 },
  { day: 'Sun', trades: 20 },
];

// TODO(orval): replace with useGetTopTradingDistributorsQuery once the endpoint lands.
export interface TopTradingDistributorItem {
  name: string;
  value: number;
}

export const TOP_TRADING_DISTRIBUTORS_MOCK: TopTradingDistributorItem[] = [
  { name: 'PetroMax', value: 5000000 },
  { name: 'Island Oil Ltd', value: 4700000 },
  { name: 'ABC Fuels', value: 3200000 },
  { name: 'Micity', value: 1800000 },
];

// TODO(orval): replace with useGetTradeSettlementStatusQuery once the endpoint lands.
export interface TradeSettlementStatusItem {
  name: string;
  value: number;
  color: string;
}

export const TRADE_SETTLEMENT_STATUS_MOCK: TradeSettlementStatusItem[] = [
  { name: 'Settled Trades', value: 80, color: '#FBC02D' },
  { name: 'Pending Trades', value: 15, color: '#1E88E5' },
  { name: 'Failed/Reversed', value: 5, color: '#D30A0A' },
];

// TODO(orval): replace with useGetSettlementLineDistributionQuery once the endpoint lands.
export interface SettlementLineDistributionItem {
  range: string;
  count: number;
}

export const SETTLEMENT_LINE_DISTRIBUTION_MOCK: SettlementLineDistributionItem[] = [
  { range: '< 1 Hrs', count: 12 },
  { range: '1-4 Hrs', count: 25 },
  { range: '4-12 Hrs', count: 35 },
  { range: '> 24 Hrs', count: 18 },
];

// TODO(orval): replace with useGetPaymentDelayTimeQuery once the endpoint lands.
export interface PaymentDelayItem {
  bucket: string;
  percentage: number;
  color: string;
}

export const PAYMENT_DELAY_TIME_MOCK: PaymentDelayItem[] = [
  { bucket: 'On-time', percentage: 35, color: '#2E7D32' },
  { bucket: '1-6 Hrs late', percentage: 40, color: '#FBC02D' },
  { bucket: '6-12 Hrs late', percentage: 15, color: '#FB8C1C' },
  { bucket: 'Over 12 Hrs', percentage: 10, color: '#D30A0A' },
];

// TODO(orval): replace with useGetPaymentSuccessBreakdownQuery once the endpoint lands.
export interface PaymentSuccessItem {
  method: string;
  success_rate: string;
  usage: string;
}

export const PAYMENT_SUCCESS_BREAKDOWN_MOCK: PaymentSuccessItem[] = [
  { method: 'Bank Transfer', success_rate: '96.5%', usage: '35%' },
  { method: 'Card Payments', success_rate: '93.2%', usage: '25%' },
];
