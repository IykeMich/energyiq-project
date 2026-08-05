import { useMemo, useState } from 'react';
import type { Product } from '@energyiq/domain/product';

import type { Warehouse } from '@/ui/pages/inventory/mocks';
import {
  SelectField,
  TextAreaField,
  TextField,
} from '@/ui/components/product/wizard-fields';
import { WarehouseTransferCard } from './warehouse-transfer-card';
import { useProductsQuery } from '@/hooks/use-products';

export interface StockTransferPayload {
  product: string;
  productId: string;
  fromId: string;
  fromName: string;
  fromLocation: string;
  toId: string;
  toName: string;
  toLocation: string;
  quantity: string;
  notes: string;
}

interface WarehouseStockTransferProps {
  warehouses: Warehouse[];
  onCancel: () => void;
  onReview: (payload: StockTransferPayload) => void;
}

export function WarehouseStockTransfer({
  warehouses,
  onCancel,
  onReview,
}: WarehouseStockTransferProps) {
  const [product, setProduct] = useState('');
  const [fromId, setFromId] = useState('');
  const [toId, setToId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [notes, setNotes] = useState('');

  const productsQuery = useProductsQuery();

  const products = productsQuery.data?.items ?? [];

  const productOptions = useMemo(
    () =>
      products
        .filter(
          (product): product is Product & { id: string; name: string } =>
            !!product.id && !!product.name,
        )
        .map((product) => ({
          value: product.id,
          label: product.name,
        })),
    [products],
  );

  const selectedProduct = useMemo(
    () => products.find((p) => p.id === product),
    [products, product],
  );

  const warehouseOptions = useMemo(
    () =>
      warehouses.map((warehouse) => ({
        value: warehouse.id,
        label: `${warehouse.name} (${warehouse.stockLevelPercent}%)`,
      })),
    [warehouses],
  );

  const fromWarehouse = warehouses.find((w) => w.id === fromId);
  const toWarehouse = warehouses.find((w) => w.id === toId);

  const available = fromWarehouse?.usedL ?? 0;

  const canReview = Boolean(
    selectedProduct &&
      fromId &&
      toId &&
      quantity.trim() &&
      fromId !== toId,
  );

  return (
    <div className="border border-border-subtle rounded-[28px] p-7 flex flex-col gap-6">
      <h2 className="text-base font-semibold text-foreground">
        Transfer Details
      </h2>

      <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
        {warehouses.map((warehouse) => (
          <WarehouseTransferCard
            key={warehouse.id}
            warehouse={warehouse}
          />
        ))}
      </div>

      <div className="bg-surface-card rounded-[24px] p-6 flex flex-col gap-5">
        <SelectField
          label="Product:"
          value={product}
          onChange={setProduct}
          options={productOptions}
          placeholder="Select..."
        />

        <SelectField
          label="From Warehouse:"
          value={fromId}
          onChange={setFromId}
          options={warehouseOptions}
          placeholder="Select..."
        />

        <SelectField
          label="To Warehouse:"
          value={toId}
          onChange={setToId}
          options={warehouseOptions}
          placeholder="Select..."
        />

        {fromWarehouse && (
          <p className="-mt-3 text-xs text-brand">
            {available.toLocaleString()}L available
          </p>
        )}

        <TextField
          label={
            fromWarehouse
              ? `Quantity (max ${available.toLocaleString()}L available)`
              : 'Quantity (L):'
          }
          type="number"
          value={quantity}
          onChange={setQuantity}
          placeholder="Enter quantity..."
        />

        <TextAreaField
          label="Notes (Optional):"
          value={notes}
          onChange={setNotes}
          placeholder="Reason for transfer"
        />
      </div>

      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="h-13.25 rounded-[28px] bg-foreground/10 text-foreground font-semibold px-8"
        >
          Cancel
        </button>

        <button
          type="button"
          disabled={!canReview}
          onClick={() =>
            onReview({
              product: selectedProduct?.name ?? '',
              productId: selectedProduct?.id ?? '',
              fromId,
              fromName: fromWarehouse?.name ?? '',
              fromLocation: fromWarehouse?.fullLocation ?? '',
              toId,
              toName: toWarehouse?.name ?? '',
              toLocation: toWarehouse?.fullLocation ?? '',
              quantity,
              notes,
            })
          }
          className="h-13.25 rounded-[28px] bg-brand text-brand-foreground font-semibold px-10 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Review Transfer
        </button>
      </div>
    </div>
  );
}