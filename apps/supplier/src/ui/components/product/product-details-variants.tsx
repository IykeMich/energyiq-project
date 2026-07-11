import type { product as productDomain } from '@energyiq/domain';
import { ProductDetailsEditHeading } from './product-details-edit-heading';

const NGN = new Intl.NumberFormat('en-NG');

interface ProductDetailsVariantsProps {
  variants: productDomain.ProductVariant[];
  onEdit?: () => void;
}

/** "Variants" section: heading with edit pencil over name/price rows in bordered boxes. */
export function ProductDetailsVariants({ variants, onEdit }: ProductDetailsVariantsProps) {
  if (variants.length === 0) return null;

  return (
    <section className="flex flex-col gap-3">
      <ProductDetailsEditHeading title="Variants:" onEdit={onEdit} />
      <div className="flex flex-col gap-2">
        {variants.map((variant) => (
          <div
            key={variant.sku}
            className="flex items-center justify-between gap-4 rounded-[14px] border border-[#FFFFFF1A] px-4 py-3"
          >
            <span className="text-sm text-[#FFFFFFCC]">{variant.display_name}:</span>
            <span className="text-sm font-medium text-[#FAFAFA]">₦{NGN.format(variant.selling_price)}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
