import { AlertCircle } from 'lucide-react';
import { cn } from '@energyiq/shared';
import { STORAGE_LOCATION_OPTIONS } from '@/ui/pages/product/mocks';
import { useWarehousesQuery } from '@/hooks/use-warehouses';
import { FormActionButton, SelectField, TextField } from './wizard-fields';
import { ProductWarehouseAllocationRow, type WarehouseAllocation } from './product-warehouse-allocation-row';

export interface ProductInventoryDraft {
  allocations: WarehouseAllocation[];
  pendingWarehouseId: string;
  pendingQuantity: string;
  pendingStorageLocation: string;
}

interface ProductInventoryCardProps {
  draft: ProductInventoryDraft;
  onChange: (patch: Partial<ProductInventoryDraft>) => void;
  onCancel: () => void;
  onNext: () => void;
}

const FIELD_CLASSNAME = 'h-[47px] rounded-[33px]';

/** Right-panel "Inventory" card for step 3 of the "Add New Product" wizard. */
export function ProductInventoryCard({ draft, onChange, onCancel, onNext }: ProductInventoryCardProps) {
  const warehousesQuery = useWarehousesQuery({ status: 'active' });
  const warehouses = warehousesQuery.data?.items ?? [];

  const warehouseOptions = warehouses
    .filter((warehouse) => warehouse.warehouse_id && warehouse.warehouse_name)
    .map((warehouse) => ({ value: warehouse.warehouse_id as string, label: warehouse.warehouse_name as string }));

  const pendingWarehouse = warehouses.find((warehouse) => warehouse.warehouse_id === draft.pendingWarehouseId);
  const availableStock =
    pendingWarehouse?.capacity !== undefined && pendingWarehouse?.stock_level_percentage !== undefined
      ? Math.round(pendingWarehouse.capacity * (1 - pendingWarehouse.stock_level_percentage / 100))
      : undefined;

  const canAddWarehouse = Boolean(draft.pendingWarehouseId && draft.pendingQuantity && draft.pendingStorageLocation);

  const addAllocation = () => {
    if (!canAddWarehouse) return;
    onChange({
      allocations: [
        ...draft.allocations,
        {
          id: `wh-${draft.allocations.length + 1}-${Math.random().toString(36).slice(2, 6)}`,
          warehouseId: draft.pendingWarehouseId,
          warehouseLabel: pendingWarehouse?.warehouse_name ?? draft.pendingWarehouseId,
          quantity: draft.pendingQuantity,
          storageLocation: draft.pendingStorageLocation,
        },
      ],
      pendingWarehouseId: '',
      pendingQuantity: '',
      pendingStorageLocation: '',
    });
  };

  const removeAllocation = (id: string) =>
    onChange({ allocations: draft.allocations.filter((allocation) => allocation.id !== id) });

  // Pulls the row's values back into the form above and drops the row — re-submitting via
  // "+ Add Warehouse" commits the edit.
  const editAllocation = (id: string) => {
    const allocation = draft.allocations.find((entry) => entry.id === id);
    if (!allocation) return;
    onChange({
      pendingWarehouseId: allocation.warehouseId,
      pendingQuantity: allocation.quantity,
      pendingStorageLocation: allocation.storageLocation,
      allocations: draft.allocations.filter((entry) => entry.id !== id),
    });
  };

  const isStepValid = draft.allocations.length > 0;

  return (
    <div className="bg-[#6161611A] border border-[#616161B2] rounded-[48px] p-7 flex flex-1 min-w-0 flex-col gap-7">
      <div className="flex flex-col gap-2.5">
        <h2 className="text-lg font-medium text-foreground">Inventory</h2>
        <p className="text-base text-foreground/80">Add stock for this product at one or more warehouse locations.</p>
      </div>

      <div className="flex flex-col gap-4 border-t border-[#616161B2] pt-7">
        <p className="text-base font-semibold text-muted-foreground">Warehouse Allocation</p>

        <div className="border border-[#616161B2] rounded-[18px] p-4 flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto] gap-4 md:items-end">
            <SelectField
              label="Warehouse Location:"
              value={draft.pendingWarehouseId}
              onChange={(value) => onChange({ pendingWarehouseId: value })}
              placeholder={warehousesQuery.isLoading ? 'Loading warehouses...' : 'Select Warehouse'}
              options={warehouseOptions}
              className={FIELD_CLASSNAME}
            />
            <TextField
              label="Quantity (L):"
              type="number"
              value={draft.pendingQuantity}
              onChange={(value) => onChange({ pendingQuantity: value })}
              placeholder="0"
              className={FIELD_CLASSNAME}
            />
            <SelectField
              label="Storage Location:"
              value={draft.pendingStorageLocation}
              onChange={(value) => onChange({ pendingStorageLocation: value })}
              placeholder="Select Storage"
              options={STORAGE_LOCATION_OPTIONS}
              className={FIELD_CLASSNAME}
            />
            <button
              type="button"
              onClick={addAllocation}
              disabled={!canAddWarehouse}
              className={cn(
                'tap-effect h-[47px] shrink-0 rounded-[20px] px-5 text-xs font-medium text-[#121212] hover:opacity-90 disabled:hover:opacity-100 disabled:cursor-not-allowed',
                canAddWarehouse ? 'bg-brand' : 'bg-[#FBC02D33]',
              )}
            >
              + Add Warehouse
            </button>
          </div>

          {availableStock !== undefined && (
            <span className="self-start rounded-[14px] bg-[#FBC02D33] px-4 py-2 text-sm font-semibold text-foreground">
              Available Stock: {availableStock.toLocaleString()}L
            </span>
          )}
        </div>

        <div className="flex flex-col">
          <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 px-3 pb-3 border-b border-[#616161B2] text-sm text-foreground">
            <span>Warehouse</span>
            <span className="text-center">Quantity</span>
            <span className="text-center">Storage location</span>
            <span className="text-center">Actions</span>
          </div>
          {draft.allocations.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">No warehouse entries yet. Add one above.</p>
          ) : (
            draft.allocations.map((allocation) => (
              <ProductWarehouseAllocationRow
                key={allocation.id}
                allocation={allocation}
                onEdit={editAllocation}
                onRemove={removeAllocation}
              />
            ))
          )}
        </div>
      </div>

      <div className="rounded-[8px] bg-[#FB8C1C33] px-4 py-2.5 flex items-center gap-3">
        <AlertCircle className="h-5 w-5 shrink-0 text-[#FB8C1C]" />
        <p className="text-xs font-semibold text-[#FB8C1C]">
          This inventory won't be available to distributors until the product is approved.
        </p>
      </div>

      <div className="flex justify-end gap-4 border-t border-[#616161B2] pt-7">
        <FormActionButton variant="cancel" onClick={onCancel}>
          Cancel
        </FormActionButton>
        <button
          type="button"
          onClick={onNext}
          disabled={!isStepValid}
          className={cn(
            'tap-effect h-10.5 rounded-[28px] px-12 font-semibold text-[#121212] hover:opacity-90 disabled:hover:opacity-100 disabled:cursor-not-allowed',
            isStepValid ? 'bg-brand' : 'bg-[#FBC02D33]',
          )}
        >
          Next
        </button>
      </div>
    </div>
  );
}
