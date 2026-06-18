export interface Pump {
  id: string;
  name: string;
  product: string;
  nozzleCount: number;
  totalSales: number;
  volumeSold: number;
  status: 'active' | 'inactive' | 'faulty';
  meterReading: number;
}