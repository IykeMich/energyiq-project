import { useState } from 'react';
import { Boxes, Plus } from 'lucide-react';
import { CreateOrderCard } from './create-order-card';
import { CreateOrderProductRow } from './create-order-product-row';
import { CreateOrderAddProductModal } from './create-order-add-product-modal';
import {
  type CreateOrderProductOption,
  type CreateOrderLineItem,
} from './create-order-mocks';

export type { CreateOrderLineItem };

interface CreateOrderProductsCardProps {
  supplierId: string;
  onSupplierChange: (supplierId: string) => void;
  products: CreateOrderProductOption[];
  lineItems: CreateOrderLineItem[];
  onQuantityChange: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
  onAddProducts: (items: CreateOrderLineItem[]) => void;
}

const COLUMN_LABELS = ['Product', 'Unit Price', 'Quantity', 'Sub-Total'];

/** "Products" section: column headers, the added line items, and the Add Product flow. */
export function CreateOrderProductsCard({
  supplierId,
  onSupplierChange,
  products,
  lineItems,
  onQuantityChange,
  onRemove,
  onAddProducts,
}: CreateOrderProductsCardProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);

  return (
    <CreateOrderCard
      title="Products"
      subtitle="Add products to your order (MOQ applies)"
      icon={Boxes}
    >
      {lineItems.length > 0 ? (
        <div className="flex flex-col gap-3">
          {/* Column headers — hidden on small screens where rows stack. */}
          <div className="hidden grid-cols-[2fr_1fr_auto_1fr] gap-4 px-4 lg:grid">
            {COLUMN_LABELS.map((label) => (
              <span key={label} className="text-xs font-medium uppercase tracking-wide text-[#FFFFFFCC]">
                {label}
              </span>
            ))}
          </div>

          {lineItems.map((item) => (
            <CreateOrderProductRow
              key={item.productId}
              item={item}
              onQuantityChange={(quantity) => onQuantityChange(item.productId, quantity)}
              onRemove={() => onRemove(item.productId)}
            />
          ))}
        </div>
      ) : (
        <p className="rounded-[14px] bg-[#FFFFFF0D] p-6 text-center text-sm text-[#FFFFFFCC]">
          No products added yet. Use “Add Product” to start building your order.
        </p>
      )}

      <button
        type="button"
        onClick={() => setIsAddOpen(true)}
        className="tap-effect inline-flex w-fit items-center gap-1.5 rounded-full border border-[#FBC02D] px-5 py-2.5 text-sm font-semibold text-[#FBC02D]"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        Add Product
      </button>

      <CreateOrderAddProductModal
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        supplierId={supplierId}
        onSupplierChange={onSupplierChange}
        products={products}
        lineItems={lineItems}
        onConfirm={onAddProducts}
      />
    </CreateOrderCard>
  );
}
