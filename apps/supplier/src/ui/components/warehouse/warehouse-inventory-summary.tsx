import type { StockSegment } from '@/ui/pages/inventory/mocks';
import { WarehouseSegmentedBar } from './warehouse-segmented-bar';

interface WarehouseInventorySummaryProps {
  totalWarehouses: number;
  composition: StockSegment[];
}

/** Top summary panel: Total Warehouses count + Total Stock composition bar. */
export function WarehouseInventorySummary({ totalWarehouses, composition }: WarehouseInventorySummaryProps) {
  return (
    <div className="bg-foreground/5 rounded-[18px] p-4 grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4">
      <div className="bg-foreground/10 rounded-2xl px-6 py-5 flex flex-col gap-3">
        <p className="text-base text-foreground">Total Warehouses</p>
        <p className="text-3xl font-bold text-foreground">{totalWarehouses}</p>
      </div>
      <div className="bg-foreground/10 rounded-2xl px-6 py-5 flex flex-col gap-4">
        <p className="text-base text-foreground">Total Stock</p>
        <WarehouseSegmentedBar segments={composition} />
      </div>
    </div>
  );
}
