import { useEffect, useMemo, useState } from 'react';
import { Building2, Check, Package, Search } from 'lucide-react';
import { Modal } from '@energyiq/ui';

import {
  formatNaira,
  SUPPLIER_OPTIONS,
  type CreateOrderLineItem,
  type CreateOrderProductOption,
} from './create-order-mocks';
import { CreateOrderQuantityStepper } from './create-order-quantity-stepper';

interface CreateOrderAddProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  supplierId: string;
  onSupplierChange: (supplierId: string) => void;
  products: CreateOrderProductOption[];
  lineItems: CreateOrderLineItem[];
  onConfirm: (items: CreateOrderLineItem[]) => void;
}

/**
 * Lets the distributor choose an active supplier, browse that supplier's catalog,
 * select one or more products, set quantities, and add them to the order in one go.
 */
export function CreateOrderAddProductModal({
  open,
  onOpenChange,
  supplierId,
  onSupplierChange,
  products,
  lineItems,
  onConfirm,
}: CreateOrderAddProductModalProps) {
  const [selectedSupplierId, setSelectedSupplierId] = useState(supplierId);
  const [supplierSearch, setSupplierSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [selections, setSelections] = useState<Record<string, number>>({});

  // Reset local state whenever the modal opens, seeding it with the current order lines.
  useEffect(() => {
    if (!open) return;

    setSelectedSupplierId(supplierId);
    setSupplierSearch('');
    setProductSearch('');
    setSelections(
      Object.fromEntries(lineItems.map((item) => [item.productId, item.quantity])),
    );
  }, [open, supplierId, lineItems]);

  const filteredSuppliers = useMemo(
    () =>
      SUPPLIER_OPTIONS.filter((supplier) =>
        supplier.name.toLowerCase().includes(supplierSearch.trim().toLowerCase()),
      ),
    [supplierSearch],
  );

  const selectedSupplierName = useMemo(
    () => SUPPLIER_OPTIONS.find((supplier) => supplier.id === selectedSupplierId)?.name ?? '',
    [selectedSupplierId],
  );

  const supplierProductIds = useMemo(() => {
    const ids = new Set(
      products
        .filter((product) => product.supplier_id === selectedSupplierId)
        .map((product) => product.id),
    );
    return ids;
  }, [products, selectedSupplierId]);

  const filteredProducts = useMemo(() => {
    const term = productSearch.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSupplier =
        !product.supplier_id ||
        product.supplier_id === selectedSupplierId ||
        supplierProductIds.size === 0;

      if (!matchesSupplier) return false;
      if (!term) return true;

      return (
        product.name.toLowerCase().includes(term) ||
        product.code.toLowerCase().includes(term)
      );
    });
  }, [products, selectedSupplierId, supplierProductIds, productSearch]);

  const selectedCount = Object.keys(selections).length;

  const selectedTotal = useMemo(
    () =>
      Object.entries(selections).reduce((sum, [productId, quantity]) => {
        const product = products.find((p) => p.id === productId);
        return sum + (product ? product.unitPrice * quantity : 0);
      }, 0),
    [selections, products],
  );

  const toggleProduct = (product: CreateOrderProductOption) => {
    setSelections((current) => {
      const next = { ...current };
      if (next[product.id] !== undefined) {
        delete next[product.id];
      } else {
        next[product.id] = product.moq;
      }
      return next;
    });
  };

  const changeQuantity = (product: CreateOrderProductOption, quantity: number) => {
    setSelections((current) => ({
      ...current,
      [product.id]: quantity,
    }));
  };

  const handleConfirm = () => {
    const items: CreateOrderLineItem[] = Object.entries(selections).map(([productId, quantity]) => {
      const product = products.find((p) => p.id === productId);
      if (!product) {
        const existing = lineItems.find((item) => item.productId === productId);
        return existing ?? ({} as CreateOrderLineItem);
      }

      return {
        productId: product.id,
        name: product.name,
        shortLabel: product.shortLabel,
        code: product.code,
        unit: product.unit,
        unitAbbrev: product.unitAbbrev,
        unitPrice: product.unitPrice,
        moq: product.moq,
        goldDiscount: product.goldDiscount,
        available: product.available,
        quantity,
      };
    });

    onSupplierChange(selectedSupplierId);
    onConfirm(items.filter((item): item is CreateOrderLineItem => Boolean(item.productId)));
    onOpenChange(false);
  };

  const selectedProductCountLabel = `${selectedCount} product${selectedCount === 1 ? '' : 's'} selected`;

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Add Product"
      size="xl"
      className="max-h-[85vh] overflow-y-auto"
    >
      <div className="flex flex-col gap-6">
        <div className="space-y-1">
          <p className="text-sm text-[#FFFFFFCC]">Choose the active supplier.</p>
        </div>

        {/* Supplier search */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#FFFFFF99]" />
          <input
            type="text"
            value={supplierSearch}
            onChange={(event) => setSupplierSearch(event.target.value)}
            placeholder="Search Suppliers"
            className="h-12 w-full rounded-full border border-[#FFFFFF33] bg-transparent pl-12 pr-5 text-sm text-foreground placeholder:text-[#FFFFFF66]"
          />
        </div>

        {/* Active suppliers */}
        <div className="space-y-3">
          <span className="text-xs font-medium uppercase tracking-wide text-[#FFFFFFCC]">
            Active Suppliers
          </span>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {filteredSuppliers.map((supplier) => {
              const isSelected = supplier.id === selectedSupplierId;

              return (
                <button
                  key={supplier.id}
                  type="button"
                  onClick={() => setSelectedSupplierId(supplier.id)}
                  className={`flex items-center justify-between gap-3 rounded-2xl border p-4 text-left transition-colors ${
                    isSelected
                      ? 'border-[#FBC02D] bg-[#FBC02D14]'
                      : 'border-[#FFFFFF33] bg-transparent hover:bg-[#FFFFFF0D]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                        isSelected ? 'bg-[#FBC02D] text-[#121212]' : 'bg-[#FFFFFF1A] text-[#FFFFFFCC]'
                      }`}
                    >
                      <Building2 className="h-4 w-4" />
                    </span>
                    <span className="text-sm font-medium text-foreground">{supplier.name}</span>
                  </div>

                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                      isSelected
                        ? 'border-[#FBC02D] bg-[#FBC02D] text-[#121212]'
                        : 'border-[#FFFFFF33] bg-transparent'
                    }`}
                  >
                    {isSelected && <Check className="h-3.5 w-3.5" />}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Catalog notice */}
        <p className="rounded-2xl border border-[#FBC02D33] bg-[#FBC02D14] p-4 text-xs leading-relaxed text-[#FBC02DCC]">
          Distributors select from a supplier&apos;s catalog — you can&apos;t create or edit a
          supplier&apos;s products directly.
        </p>

        {/* Product selection */}
        <div className="space-y-4">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-foreground">
              Product Selection — {selectedSupplierName || 'Supplier'}
            </h3>
            <p className="text-xs text-[#FFFFFF99]">Products, orders and pricing filtered to this supplier.</p>
          </div>

          <div className="relative">
            <Search className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#FFFFFF99]" />
            <input
              type="text"
              value={productSearch}
              onChange={(event) => setProductSearch(event.target.value)}
              placeholder="Search Products"
              className="h-12 w-full rounded-full border border-[#FFFFFF33] bg-transparent pl-12 pr-5 text-sm text-foreground placeholder:text-[#FFFFFF66]"
            />
          </div>

          <div className="flex flex-col gap-3">
            {filteredProducts.map((product) => {
              const isSelected = selections[product.id] !== undefined;
              const quantity = selections[product.id] ?? product.moq;
              const subtotal = product.unitPrice * quantity;

              return (
                <div
                  key={product.id}
                  className={`grid grid-cols-1 items-start gap-4 rounded-[14px] p-4 lg:grid-cols-[auto_2fr_1fr_1fr] ${
                    isSelected ? 'bg-[#FBC02D14]' : 'bg-[#FFFFFF0D]'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleProduct(product)}
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
                      isSelected
                        ? 'border-[#FBC02D] bg-[#FBC02D] text-[#121212]'
                        : 'border-[#FFFFFF33] bg-transparent'
                    }`}
                    aria-label={isSelected ? `Deselect ${product.name}` : `Select ${product.name}`}
                  >
                    {isSelected && <Check className="h-3.5 w-3.5" />}
                  </button>

                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-[#FFFFFF99]" />
                      <span className="text-sm font-semibold text-foreground">{product.name}</span>
                    </div>
                    <span className="text-xs text-[#FFFFFFCC]">
                      {product.code} · {formatNaira(product.unitPrice)} per {product.unit}
                    </span>
                    {product.available && (
                      <span className="mt-1 w-fit rounded-2xl bg-[#388E3C26] px-3 py-0.5 text-[10px] text-[#388E3C]">
                        In Stock
                      </span>
                    )}
                  </div>

                  <div className="flex items-center">
                    {isSelected ? (
                      <CreateOrderQuantityStepper
                        value={quantity}
                        unitAbbrev={product.unitAbbrev}
                        step={product.moq}
                        onChange={(value) => changeQuantity(product, value)}
                      />
                    ) : (
                      <span className="text-sm text-[#FFFFFF66]">—</span>
                    )}
                  </div>

                  <div className="flex items-center justify-end">
                    <span className="text-sm font-semibold text-foreground">
                      {isSelected ? formatNaira(subtotal) : '—'}
                    </span>
                  </div>
                </div>
              );
            })}

            {filteredProducts.length === 0 && (
              <p className="rounded-[14px] bg-[#FFFFFF0D] p-6 text-center text-sm text-[#FFFFFFCC]">
                No products found for this supplier.
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-4 border-t border-[#FFFFFF1A] pt-6">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-[#FFFFFFCC]">{selectedProductCountLabel}</span>
            <span className="text-base font-bold text-foreground">{formatNaira(selectedTotal)}</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="tap-effect h-11 rounded-full border border-[#FFFFFF33] text-sm font-semibold text-foreground transition-colors hover:bg-[#FFFFFF0D]"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={selectedCount === 0}
              className="tap-effect h-11 rounded-full bg-[#FBC02D] text-sm font-semibold text-[#121212] disabled:opacity-50"
            >
              Confirm and Create Order
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
