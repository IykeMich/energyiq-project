import type { product as productDomain } from '@energyiq/domain';

const NGN = new Intl.NumberFormat('en-NG');

interface InfoBoxProps {
  label: string;
  value: string;
  className?: string;
}

/** Bordered label-over-value box used in the Product Info grid. */
function InfoBox({ label, value, className }: InfoBoxProps) {
  return (
    <div className={`flex flex-col gap-2 rounded-[14px] border border-[#FFFFFF1A] px-4 py-3 ${className ?? ''}`}>
      <span className="text-xs text-[#FFFFFFCC]">{label}</span>
      <span className="text-sm font-medium text-[#FAFAFA]">{value}</span>
    </div>
  );
}

interface ProductDetailsInfoProps {
  product: productDomain.Product;
}

/** "Product Info" section: default price, unit measured, and warehouses the product is assigned to. */
export function ProductDetailsInfo({ product }: ProductDetailsInfoProps) {
  const warehouseCount = product.warehouse_ids?.length ?? 0;
  const warehouseLabel = `${warehouseCount} Warehouse${warehouseCount === 1 ? '' : 's'}`;
  const price = Number(product.base_price ?? 0);

  return (
    <section className="flex flex-col gap-3">
      <p className="text-sm text-[#FFFFFFCC]">Product Info:</p>
      <div className="grid grid-cols-2 gap-3">
        <InfoBox
          label="Default Price:"
          value={`${product.currency === 'USD' ? '$' : '₦'}${NGN.format(price)}`}
        />
        <InfoBox label="Unit Measured:" value={product.unit ?? '—'} />
      </div>
      <InfoBox label="Assigned To:" value={warehouseLabel} />
    </section>
  );
}
