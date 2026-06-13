import type { Warehouse } from '@/ui/pages/inventory/mocks';
import { WarehouseStockLevelCell } from './warehouse-stock-level-cell';

interface WarehouseTransferCardProps {
  warehouse: Warehouse;
}

/** Compact warehouse card shown in the Stock Transfer "Transfer Details" scroller. */
export function WarehouseTransferCard({ warehouse }: WarehouseTransferCardProps) {
  return (
    <div className="shrink-0 w-[230px] bg-surface-card border border-border-subtle rounded-[18px] p-4 flex flex-col gap-3">
      <div>
        <p className="text-sm font-semibold text-foreground">{warehouse.name}</p>
        <p className="text-xs text-muted-foreground mt-1">{warehouse.fullLocation}</p>
      </div>
      <WarehouseStockLevelCell percent={warehouse.stockLevelPercent} />
      <span className="self-start rounded-full border border-brand/40 px-3 py-1 text-xs font-semibold text-brand">
        {warehouse.usedL.toLocaleString()}L/{warehouse.capacityL.toLocaleString()}L
      </span>
    </div>
  );
}
