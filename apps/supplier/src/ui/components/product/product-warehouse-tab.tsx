import { Trash2 } from 'lucide-react';
import {
  STORAGE_LOCATION_OPTIONS,
  WAREHOUSE_OPTIONS,
  type NewProductDraft,
  type WarehouseAllocationDraft,
} from '@/ui/pages/product/mocks';
import { Field, SelectField, TextField } from './wizard-fields';

interface ProductWarehouseTabProps {
  draft: NewProductDraft;
  onChange: (id: string, patch: Partial<WarehouseAllocationDraft>) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
}

export function ProductWarehouseTab({ draft, onChange, onAdd, onRemove }: ProductWarehouseTabProps) {
  const warehouseOptions = WAREHOUSE_OPTIONS.map((warehouse) => warehouse.name);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-foreground">Configure initial stock quantities for each warehouse.</p>
        <button
          type="button"
          onClick={onAdd}
          className="tap-effect text-sm font-semibold text-brand transition-opacity hover:opacity-80"
        >
          + Add Warehouse
        </button>
      </div>

      {draft.warehouseAllocations.map((allocation, index) => {
        const warehouse = WAREHOUSE_OPTIONS.find((option) => option.name === allocation.warehouseLocation);
        const canRemove = draft.warehouseAllocations.length > 1;
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
            <Field label="Warehouse Location:" required>
              <SelectField
                value={allocation.warehouseLocation}
                onChange={(value) => onChange(allocation.id, { warehouseLocation: value })}
                placeholder="Select warehouse"
                options={warehouseOptions}
              />
            </Field>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Allocated Quantity:">
                <TextField
                  value={allocation.allocatedQuantity}
                  onChange={(value) => onChange(allocation.id, { allocatedQuantity: value })}
                  placeholder="e.g. 30,000L"
                />
              </Field>
              <Field label="Storage Location:">
                <SelectField
                  value={allocation.storageLocation}
                  onChange={(value) => onChange(allocation.id, { storageLocation: value })}
                  placeholder="Select storage"
                  options={STORAGE_LOCATION_OPTIONS}
                />
              </Field>
            </div>
            {warehouse && (
              <p className="text-xs text-foreground text-right">
                Available Stock:{' '}
                <span className="text-brand font-semibold">{warehouse.availableStockL.toLocaleString()}L</span>
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
