import { useEffect, useMemo, useState } from 'react';
import { Modal, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@energyiq/ui';
import { ADDABLE_PRODUCTS, type OrderLineItem } from '../mocks';

const NGN = new Intl.NumberFormat('en-NG');

interface AddProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  onAdd: (lineItem: OrderLineItem) => void;
}

export function AddProductModal({ open, onOpenChange, orderId, onAdd }: AddProductModalProps) {
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [priceOverride, setPriceOverride] = useState('');

  useEffect(() => {
    if (open) {
      setProductId('');
      setQuantity('');
      setPriceOverride('');
    }
  }, [open]);

  const product = useMemo(
    () => ADDABLE_PRODUCTS.find((p) => p.id === productId),
    [productId],
  );

  const effectivePrice = priceOverride.trim().length > 0 ? Number(priceOverride) : product?.unitPriceNGN ?? 0;
  const qtyNumber = Number(quantity) || 0;
  const total = Math.round(qtyNumber * effectivePrice);
  const canAdd = !!product && qtyNumber > 0 && effectivePrice > 0;

  const handleAdd = () => {
    if (!canAdd || !product) return;
    onAdd({
      id: `${product.id}-${Date.now()}`,
      name: product.name,
      quantityLabel: `${qtyNumber.toLocaleString()} ${product.unit}`,
      quantity: qtyNumber,
      unit: product.unit,
      unitPriceNGN: effectivePrice,
      totalNGN: total,
    });
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange} title={`Add Product- ${orderId}`} size="lg">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-sm text-foreground">Product:</label>
          <Select value={productId} onValueChange={(v) => setProductId(v ?? '')}>
            <SelectTrigger className="bg-surface-card border-border-strong h-[52px] rounded-[28px] text-foreground px-5">
              <SelectValue placeholder="Select a product" />
            </SelectTrigger>
            <SelectContent>
              {ADDABLE_PRODUCTS.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-foreground">
              Quantity{product ? ` (${product.unit})` : ''}:
            </label>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="0"
              className="bg-surface-card border border-border-strong h-[44px] rounded-[28px] px-5 text-foreground placeholder:text-muted-foreground outline-none focus:border-brand"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-foreground">Price Per Unit (₦):</label>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              value={priceOverride}
              onChange={(e) => setPriceOverride(e.target.value)}
              placeholder={product ? String(product.unitPriceNGN) : '0'}
              className="bg-surface-card border border-border-strong h-[44px] rounded-[28px] px-5 text-foreground placeholder:text-muted-foreground outline-none focus:border-brand"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border-subtle">
          <p className="text-sm text-foreground">Line total:</p>
          <p className="text-base font-semibold text-brand">₦{NGN.format(total)}</p>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleAdd}
            disabled={!canAdd}
            className="h-[53px] rounded-[28px] bg-brand text-brand-foreground font-semibold px-12 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Product
          </button>
        </div>
      </div>
    </Modal>
  );
}
