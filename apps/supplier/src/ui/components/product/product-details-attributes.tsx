import { ProductDetailsEditHeading } from './product-details-edit-heading';

interface ProductAttribute {
  label: string;
  value: string;
}

interface ProductDetailsAttributesProps {
  attributes: ProductAttribute[];
  onEdit?: () => void;
}

/** "Attributes" section: heading with edit pencil over a wrapped row of label/value pill chips. */
export function ProductDetailsAttributes({ attributes, onEdit }: ProductDetailsAttributesProps) {
  if (attributes.length === 0) return null;

  return (
    <section className="flex flex-col gap-3">
      <ProductDetailsEditHeading title="Attributes:" onEdit={onEdit} />
      <div className="flex flex-wrap gap-2">
        {attributes.map((attribute) => (
          <span
            key={attribute.label}
            className="inline-flex items-center rounded-[8px] bg-foreground/10 px-3 py-1.5 text-xs font-medium text-[#FAFAFA]"
          >
            {attribute.label}: {attribute.value}
          </span>
        ))}
      </div>
    </section>
  );
}
