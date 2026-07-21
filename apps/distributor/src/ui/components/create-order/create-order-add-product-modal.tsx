import { useMemo, useState } from 'react';
import {
  Button,
  Modal,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@energyiq/ui';

import { formatNaira, type CreateOrderProductOption } from './create-order-mocks';
import { useProductsQuery } from '@/hooks/use-products';

interface CreateOrderAddProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (product: CreateOrderProductOption) => void;
}

/** Picks a product from the catalog and adds it to the order. */
export function CreateOrderAddProductModal({
  open,
  onOpenChange,
  onAdd,
}: CreateOrderAddProductModalProps) {
  const [selectedId, setSelectedId] = useState('');

  const { data, isLoading } = useProductsQuery();
  console.log('Products Response:', data);



const options = useMemo<CreateOrderProductOption[]>(
  () =>
    (data?.items ?? []).map((product) => ({
      id: product.id ?? '',
      name: product.name ?? '',
      shortLabel: product.name ?? '',
      code: product.sku ?? '',
      unit: product.unit ?? '',
      unitAbbrev: product.unit ?? '',
      unitPrice: Number(product.base_price ?? 0),
      moq: Number(product.moq ?? 1),
      available: true,
      goldDiscount: Boolean(product.gold_discount),
    })),
  [data],
);

const selectedProduct = options.find(
  (product) => product.id === selectedId,
);
  const handleAdd = () => {
  if (!selectedProduct) return;

  onAdd(selectedProduct);

  setSelectedId('');
  onOpenChange(false);
};

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Add Product"
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Products
          </label>

          <Select
            value={selectedId}
            onValueChange={(value) => setSelectedId(value ?? '')}
          >
            <SelectTrigger className="w-full">
  {selectedProduct ? (
    <span>
      {selectedProduct.name} — {formatNaira(selectedProduct.unitPrice)} / {selectedProduct.unit}
    </span>
  ) : (
    <SelectValue
      placeholder={
        isLoading ? 'Loading products...' : 'Select a product'
      }
    />
  )}
</SelectTrigger>

            <SelectContent>
              {options.map((product) => (
                <SelectItem
                  key={product.id}
                  value={product.id}
                >
                  {product.name} — {formatNaira(product.unitPrice)}/{product.unit}
                </SelectItem>
              ))}

              {!isLoading && options.length === 0 && (
                <div className="px-3 py-2 text-sm text-gray-500">
                  No products available.
                </div>
              )}
            </SelectContent>
          </Select>
        </div>

        <Button
          type="button"
          onClick={handleAdd}
          disabled={!selectedId || isLoading}
          className="h-11 w-full rounded-full bg-[#FBC02D] text-base font-semibold text-[#121212]"
        >
          Add to Order
        </Button>
      </div>
    </Modal>
  );
}