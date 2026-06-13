import type { Product, ProductDetail } from '@/ui/pages/product/mocks';
import { UNIT_LABEL, formatStock } from '@/ui/pages/product/mocks';

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
  product: Product;
  detail: ProductDetail;
}

/** "Product Info" section: default price, unit measured, and total stock across warehouses. */
export function ProductDetailsInfo({ product, detail }: ProductDetailsInfoProps) {
  const warehouseLabel = `${detail.warehouseCount} Warehouse${detail.warehouseCount === 1 ? '' : 's'}`;

  return (
    <section className="flex flex-col gap-3">
      <p className="text-sm text-[#FFFFFFCC]">Product Info:</p>
      <div className="grid grid-cols-2 gap-3">
        <InfoBox label="Default Price:" value={`₦${NGN.format(product.defaultPriceNGN)}`} />
        <InfoBox label="Unit Measured:" value={UNIT_LABEL[product.unit]} />
      </div>
      <InfoBox label="Total Stock:" value={`${formatStock(product)} in ${warehouseLabel}`} />
    </section>
  );
}
