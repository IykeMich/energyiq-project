export interface SaleRow {
  id: string;
  customer: string;
  product: string;
  qty: number;
  unitPrice: number;
  total: number;
  date: string;
  method: string;
  status: 'Recorded' | 'Voided';
}

export const SALES_MOCK: SaleRow[] = [
  {
    id: 'SL-001',
    customer: 'Adebayo Musa',
    product: 'AGO (Diesel)',
    qty: 500,
    unitPrice: 1200,
    total: 600000,
    date: 'Apr 30 08:00',
    method: 'Bank Transfer',
    status: 'Recorded',
  },
  {
    id: 'SL-002',
    customer: 'Emeka Nwafor',
    product: 'PMS (Petrol)',
    qty: 300,
    unitPrice: 1000,
    total: 300000,
    date: 'Apr 30 09:30',
    method: 'POS',
    status: 'Recorded',
  },
  {
    id: 'SL-003',
    customer: 'Apex Oil & Gas',
    product: 'PMS (Petrol)',
    qty: 1000,
    unitPrice: 1100,
    total: 1100000,
    date: 'Apr 30 10:00',
    method: 'Credit',
    status: 'Recorded',
  },
  {
    id: 'SL-004',
    customer: 'Prosperity Eng.',
    product: 'DPK (Kerosene)',
    qty: 150,
    unitPrice: 950,
    total: 142500,
    date: 'May 02 09:20',
    method: 'Bank Transfer',
    status: 'Recorded',
  },
  {
    id: 'SL-005',
    customer: 'Johnson Ltd.',
    product: 'DPK (Kerosene)',
    qty: 80,
    unitPrice: 950,
    total: 76000,
    date: 'May 03 10:45',
    method: 'POS',
    status: 'Recorded',
  },
  {
    id: 'SL-006',
    customer: 'Elite Petroleum',
    product: 'AGO (Diesel)',
    qty: 700,
    unitPrice: 1200,
    total: 840000,
    date: 'May 04 11:20',
    method: 'Bank Transfer',
    status: 'Recorded',
  },
  {
    id: 'SL-007',
    customer: 'Nnamdi Depot',
    product: 'AGO (Diesel)',
    qty: 300,
    unitPrice: 1200,
    total: 360000,
    date: 'May 04 15:40',
    method: 'Bank Transfer',
    status: 'Recorded',
  },
  {
    id: 'SL-008',
    customer: 'Balogun Filling',
    product: 'PMS (Petrol)',
    qty: 500,
    unitPrice: 1000,
    total: 500000,
    date: 'May 05 09:15',
    method: 'POS',
    status: 'Recorded',
  },
  {
    id: 'SL-009',
    customer: 'Prime Energy',
    product: 'AGO (Diesel)',
    qty: 200,
    unitPrice: 1200,
    total: 240000,
    date: 'May 05 12:30',
    method: 'Credit',
    status: 'Voided',
  },
];

export interface SaleRow {
  id: string;
  customer: string;
  product: string;
  qty: number;
  unitPrice: number;
  total: number;
  date: string;
  method: string;
  status: 'Recorded' | 'Voided';
}



export interface SalesFilter {
  id: string;
  label: string;
  options: string[];
}

export const SALES_FILTERS: SalesFilter[] = [
  {
    id: 'filter',
    label: 'Filter',
    options: ['All', 'Recorded', 'Voided'],
  },
  {
    id: 'products',
    label: 'Products',
    options: ['AGO (Diesel)', 'PMS (Petrol)', 'DPK (Kerosene)'],
  },
  {
    id: 'payment',
    label: 'Payment Method',
    options: ['Bank Transfer', 'POS', 'Credit'],
  },
  {
    id: 'date',
    label: 'Date',
    options: ['Today', 'This Week', 'This Month'],
  },
];