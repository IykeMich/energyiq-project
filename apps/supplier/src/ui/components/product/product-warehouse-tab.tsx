import { Trash2 } from 'lucide-react';
import {
  STORAGE_LOCATION_OPTIONS,
  type NewProductDraft,
  type ProductDraftErrors,
  type WarehouseAllocationDraft,
} from '@/ui/pages/product/mocks';
import { NumericTextField } from '@energyiq/ui';
import { useWarehousesQuery } from '@/hooks/use-warehouses';
import { Field, SelectField } from './wizard-fields';

interface ProductWarehouseTabProps {
  draft: NewProductDraft;
  onChange: (id: string, patch: Partial<WarehouseAllocationDraft>) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
  errors?: ProductDraftErrors;
}

export function ProductWarehouseTab({ draft, onChange, onAdd, onRemove, errors }: ProductWarehouseTabProps) {
  const warehousesQuery = useWarehousesQuery({ status: 'active' });
  const warehouses = warehousesQuery.data?.items ?? [];

  const warehouseOptions = warehouses
    .filter((warehouse) => warehouse.warehouse_id && warehouse.warehouse_name)
    .map((warehouse) => ({ value: warehouse.warehouse_id as string, label: warehouse.warehouse_name as string }));

  const isLoading = warehousesQuery.isLoading;
  const isEmpty = !isLoading && warehouses.length === 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-foreground">Configure initial stock quantities for each warehouse.</p>
        <button
          type="button"
          onClick={onAdd}
          disabled={isEmpty}
          className="tap-effect text-sm font-semibold text-brand transition-opacity hover:opacity-80 disabled:opacity-40 disabled:pointer-events-none"
        >
          + Add Warehouse
        </button>
      </div>

      {isEmpty && (
        <p className="text-sm text-muted-foreground bg-surface-card border border-border-subtle rounded-[24px] p-5">
          No active warehouses found. Add a warehouse first to allocate stock.
        </p>
      )}

      {draft.warehouseAllocations.map((allocation, index) => {
        const warehouse = warehouses.find((option) => option.warehouse_id === allocation.warehouseId);
        const canRemove = draft.warehouseAllocations.length > 1;
        const availableCapacity =
          warehouse?.capacity !== undefined && warehouse?.stock_level_percentage !== undefined
            ? Math.round(warehouse.capacity * (1 - warehouse.stock_level_percentage / 100))
            : undefined;
        return (
          <div
            key={allocation.id}
            className="bg-surface-card border border-border-subtle rounded-[24px] p-5 flex flex-col gap-4"
          >
            <div className="flex items-start justify-between">
              <span className="text-xs font-semibold text-brand">{index + 1}.</span>
              {canRemove && (
                <button
                  type="button"
                  onClick={() => onRemove(allocation.id)}
                  aria-label="Remove warehouse allocation"
                  className="tap-effect w-7 h-7 rounded-full bg-brand/20 text-brand flex items-center justify-center transition-colors hover:bg-brand/30"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <SelectField
              label="Warehouse Location:"
              value={allocation.warehouseId}
              onChange={(value) => onChange(allocation.id, { warehouseId: value })}
              placeholder={isLoading ? 'Loading warehouses...' : 'Select warehouse'}
              options={warehouseOptions}
              error={index === 0 ? errors?.warehouseId : undefined}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Allocated Quantity:">
                <NumericTextField
                  value={allocation.allocatedQuantity}
                  onChange={(value) => onChange(allocation.id, { allocatedQuantity: value })}
                  placeholder="e.g. 30,000"
                  suffix="L"
                />
              </Field>
              <SelectField
                label="Storage Location:"
                value={allocation.storageLocation}
                onChange={(value) => onChange(allocation.id, { storageLocation: value })}
                placeholder="Select storage"
                options={STORAGE_LOCATION_OPTIONS}
              />
            </div>
            {availableCapacity !== undefined && (
              <p className="text-xs text-foreground text-right">
                Available Capacity: <span className="text-brand font-semibold">{availableCapacity.toLocaleString()}</span>
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
