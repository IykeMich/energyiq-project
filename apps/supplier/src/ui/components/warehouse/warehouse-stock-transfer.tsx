import { useMemo, useState } from 'react';
import { TRANSFER_PRODUCT_OPTIONS, WAREHOUSES_MOCK } from '@/ui/pages/inventory/mocks';
import { Field, SelectField, TextAreaField, TextField } from '@/ui/components/product/wizard-fields';
import { WarehouseTransferCard } from './warehouse-transfer-card';

export interface StockTransferPayload {
  product: string;
  fromName: string;
  fromLocation: string;
  toName: string;
  toLocation: string;
  quantity: string;
  notes: string;
}

interface WarehouseStockTransferProps {
  onCancel: () => void;
  onReview: (payload: StockTransferPayload) => void;
}

export function WarehouseStockTransfer({ onCancel, onReview }: WarehouseStockTransferProps) {
  const [product, setProduct] = useState('');
  const [fromId, setFromId] = useState('');
  const [toId, setToId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [notes, setNotes] = useState('');

  const warehouseOptions = useMemo(
    () =>
      WAREHOUSES_MOCK.map((warehouse) => ({
        value: warehouse.id,
        label: `${warehouse.name} (${warehouse.stockLevelPercent}%)`,
      })),
    [],
  );

  const fromWarehouse = WAREHOUSES_MOCK.find((warehouse) => warehouse.id === fromId);
  const toWarehouse = WAREHOUSES_MOCK.find((warehouse) => warehouse.id === toId);
  const available = fromWarehouse?.usedL ?? 0;

  const canReview = Boolean(product && fromId && toId && quantity.trim());

  return (
    <div className="border border-border-subtle rounded-[28px] p-7 flex flex-col gap-6">
      <h2 className="text-base font-semibold text-foreground">Transfer Details</h2>

      <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
        {WAREHOUSES_MOCK.map((warehouse) => (
          <WarehouseTransferCard key={warehouse.id} warehouse={warehouse} />
        ))}
      </div>

      <div className="bg-surface-card rounded-[24px] p-6 flex flex-col gap-5">
        <Field label="Product:">
          <SelectField value={product} onChange={setProduct} options={TRANSFER_PRODUCT_OPTIONS} placeholder="Select...." />
        </Field>
        <Field label="From Warehouse:">
          <SelectField value={fromId} onChange={setFromId} options={warehouseOptions} placeholder="Select..." />
        </Field>
        <Field label="To Warehouse:">
          <SelectField value={toId} onChange={setToId} options={warehouseOptions} placeholder="Select..." />
        </Field>
        {fromWarehouse && (
          <p className="-mt-3 text-xs text-brand">{available.toLocaleString()}L available</p>
        )}
        <Field label={fromWarehouse ? `Quantity (max ${available.toLocaleString()}L available)` : 'Quantity (L):'}>
          <TextField type="number" value={quantity} onChange={setQuantity} placeholder="Enter quantity..." />
        </Field>
        <Field label="Notes (Optional):">
          <TextAreaField value={notes} onChange={setNotes} placeholder="Reason for transfer" />
        </Field>
      </div>

      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="h-[53px] rounded-[28px] bg-foreground/10 text-foreground font-semibold px-8"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={!canReview}
          onClick={() =>
            onReview({
              product,
              fromName: fromWarehouse?.name ?? '',
              fromLocation: fromWarehouse?.fullLocation ?? '',
              toName: toWarehouse?.name ?? '',
              toLocation: toWarehouse?.fullLocation ?? '',
              quantity,
              notes,
            })
          }
          className="h-[53px] rounded-[28px] bg-brand text-brand-foreground font-semibold px-10 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Review Transfer
        </button>
      </div>
    </div>
  );
}
