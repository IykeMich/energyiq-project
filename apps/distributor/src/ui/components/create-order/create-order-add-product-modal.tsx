import { useState } from 'react';
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

interface CreateOrderAddProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Catalog products not already on the order. */
  options: CreateOrderProductOption[];
  onAdd: (productId: string) => void;
}

/** Picks a product from the remaining catalog and adds it to the order. */
export function CreateOrderAddProductModal({
  open,
  onOpenChange,
  options,
  onAdd,
}: CreateOrderAddProductModalProps) {
  const [selectedId, setSelectedId] = useState('');

  const handleAdd = () => {
    if (!selectedId) return;
    onAdd(selectedId);
    setSelectedId('');
    onOpenChange(false);
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange} title="Add Product" size="sm">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">Product</label>
          <Select value={selectedId} onValueChange={(value) => setSelectedId(value ?? '')}>
            <SelectTrigger className="h-11 w-full rounded-lg">
              <SelectValue placeholder="Select a product" />
            </SelectTrigger>
            <SelectContent>
              {options.map((product) => (
                <SelectItem key={product.id} value={product.id}>
                  {product.name} — {formatNaira(product.unitPrice)}/{product.unit}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {options.length === 0 && (
            <p className="text-xs text-[#FFFFFFCC]">All available products are already on the order.</p>
          )}
        </div>

        <Button
          type="button"
          onClick={handleAdd}
          disabled={!selectedId}
          className="h-11 w-full rounded-full bg-[#FBC02D] text-base font-semibold text-[#121212]"
        >
          Add to Order
        </Button>
      </div>
    </Modal>
  );
}
