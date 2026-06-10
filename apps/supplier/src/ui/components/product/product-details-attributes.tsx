import type { ProductAttribute } from '@/ui/pages/product/mocks';
import { ProductDetailsEditHeading } from './product-details-edit-heading';

interface ProductDetailsAttributesProps {
  attributes: ProductAttribute[];
  onEdit?: () => void;
}

/** "Attributes" section: heading with edit pencil over a row of attribute pills. */
export function ProductDetailsAttributes({ attributes, onEdit }: ProductDetailsAttributesProps) {
  return (
    <section className="flex flex-col gap-3">
      <ProductDetailsEditHeading title="Attributes:" onEdit={onEdit} />
      <div className="flex flex-wrap gap-2">
        {attributes.map((attribute) => (
          <span
            key={attribute.label}
            className="inline-flex items-center rounded-[14px] bg-[#FFFFFF1A] px-3 py-1.5 text-xs font-medium text-[#FAFAFA]"
          >
            {attribute.label}: {attribute.value}
          </span>
        ))}
      </div>
    </section>
  );
}
