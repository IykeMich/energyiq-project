import type { StockSegment } from '@/ui/pages/inventory/mocks';
import { WarehouseSegmentedBar } from './warehouse-segmented-bar';

interface WarehouseInventorySummaryProps {
  totalWarehouses: number;
  composition: StockSegment[];
}

/** Top summary panel: Total Warehouses count + Total Stock composition bar. */
export function WarehouseInventorySummary({ totalWarehouses, composition }: WarehouseInventorySummaryProps) {
  return (
    <div className="flex w-full gap-4 bg-[#6161611A] p-6 rounded-[18px]">
    {/* <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 bg-[#6161611A] p-6 rounded-[18px]"> */}
      <div className="bg-[#FFFFFF1A] rounded-[14px] px-6 py-5 flex flex-col gap-3 lg:min-w-75">
        <p className="text-sm text-[#FFFFFF]">Total Warehouses</p>
        <p className="text-3xl font-bold text-foreground">{totalWarehouses}</p>
      </div>
      <div className="bg-[#FFFFFF1A] rounded-[14px] px-6 py-5 flex flex-col gap-4 lg:min-w-150 lg:max-w-100">
        <p className="text-sm text-[#FFFFFF]">Total Stock</p>
        <WarehouseSegmentedBar segments={composition} />
      </div>
    </div>
  );
}
