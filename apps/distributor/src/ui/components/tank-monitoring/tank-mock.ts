
export interface TankRow {
  id: string;
  name: string;
  product: string;
  capacity: number;
  current: number;
  daysLeft: number;
  status: string;
}

export const TANKS_MOCK: TankRow[] = [

  

  {
    id: '1',
    name: 'Main Depot A',
    product: 'Premium Motor Spirit (PMS)',
    capacity: 50000,
    current: 40000,
    daysLeft: 8,
    status: 'Healthy',
  },
  {
    id: '2',
    name: 'Main Depot',
    product: 'Automotive Gas Oil (AGO)',
    capacity: 30000,
    current: 24420,
    daysLeft: 8,
    status: 'Healthy',
  },
  {
    id: '3',
    name: 'Nsukka Station',
    product: 'AGO',
    capacity: 20000,
    current: 10250,
    daysLeft: 4,
    status: 'Low Stock',
  },
  {
    id: '4',
    name: 'New Haven',
    product: 'DPK',
    capacity: 10000,
    current: 2400,
    daysLeft: 1,
    status: 'Critical',
  },
];