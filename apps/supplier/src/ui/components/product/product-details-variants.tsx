import type { ProductVariant } from '@/ui/pages/product/mocks';
import { ProductDetailsEditHeading } from './product-details-edit-heading';

const NGN = new Intl.NumberFormat('en-NG');

interface ProductDetailsVariantsProps {
  variants: ProductVariant[];
  onEdit?: () => void;
}

/** "Variants" section: heading with edit pencil over name/price rows in bordered boxes. */
export function ProductDetailsVariants({ variants, onEdit }: ProductDetailsVariantsProps) {
  return (
    <section className="flex flex-col gap-3">
      <ProductDetailsEditHeading title="Variants:" onEdit={onEdit} />
      <div className="flex flex-col gap-2">
        {variants.map((variant) => (
          <div
            key={variant.name}
            className="flex items-center justify-between gap-4 rounded-[14px] border border-[#FFFFFF1A] px-4 py-3"
          >
            <span className="text-sm text-[#FFFFFFCC]">{variant.name}:</span>
            <span className="text-sm font-medium text-[#FAFAFA]">₦{NGN.format(variant.priceNGN)}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
