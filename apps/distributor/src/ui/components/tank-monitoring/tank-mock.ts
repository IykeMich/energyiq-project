export interface TankRow {
  id: string;
  name: string;
  product: string;
  capacity: number;
  current: number;
  daysLeft: number;
  status:
    | 'Healthy'
    | 'Low Stock'
    | 'Critical';
}

export const TANKS_MOCK: TankRow[] = [
  {
    id: '1',
    name: 'Main Depot Tank A',
    product: 'PMS',
    capacity: 50000,
    current: 32000,
    daysLeft: 8,
    status: 'Healthy',
  },
  {
    id: '2',
    name: 'Main Depot Tank B',
    product: 'AGO',
    capacity: 30000,
    current: 5000,
    daysLeft: 2,
    status: 'Low Stock',
  },
  {
    id: '3',
    name: 'Victoria Island Tank C',
    product: 'PMS',
    capacity: 40000,
    current: 1200,
    daysLeft: 1,
    status: 'Critical',
  },
];