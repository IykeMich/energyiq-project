import {
  CATEGORY_OPTIONS,
  PACKAGING_OPTIONS,
  TYPE_OPTIONS,
  UNIT_OPTIONS,
  type NewProductDraft,
  type ProductVariantDraft,
} from '@/ui/pages/product/mocks';
import { Field, SelectField, TextAreaField, TextField } from './wizard-fields';
import { ProductVariantEditor } from './product-variant-editor';

interface ProductBasicInfoTabProps {
  draft: NewProductDraft;
  onChange: (patch: Partial<NewProductDraft>) => void;
}

export function ProductBasicInfoTab({ draft, onChange }: ProductBasicInfoTabProps) {
  const showVariants = draft.type === 'Product with Variant';

  const addVariant = () =>
    onChange({
      variants: [
        ...draft.variants,
        {
          id: `var-${draft.variants.length + 1}-${Math.random().toString(36).slice(2, 6)}`,
          name: '',
          displayName: '',
          costPrice: '',
          sellingPrice: '',
        },
      ],
    });

  const removeVariant = (id: string) =>
    onChange({ variants: draft.variants.filter((variant) => variant.id !== id) });

  const updateVariant = (id: string, patch: Partial<ProductVariantDraft>) =>
    onChange({
      variants: draft.variants.map((variant) =>
        variant.id === id ? { ...variant, ...patch } : variant,
      ),
    });

  return (
    <div className="flex flex-col gap-5">
      <Field label="Product Name:" required>
        <TextField value={draft.name} onChange={(value) => onChange({ name: value })} placeholder="e.g. Diesel" />
      </Field>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Product Category:" required>
          <SelectField
            value={draft.category}
            onChange={(value) => onChange({ category: value })}
            placeholder="Select category"
            options={CATEGORY_OPTIONS}
          />
        </Field>
        <Field label="Product Type:">
          <SelectField
            value={draft.type}
            onChange={(value) => onChange({ type: value })}
            placeholder="Select type"
            options={TYPE_OPTIONS}
          />
        </Field>
        <Field label="Measuring Unit:" required>
          <SelectField
            value={draft.measuringUnit}
            onChange={(value) => onChange({ measuringUnit: value })}
            placeholder="Select unit"
            options={UNIT_OPTIONS}
          />
        </Field>
        <Field label="Packaging Type:">
          <SelectField
            value={draft.packagingType}
            onChange={(value) => onChange({ packagingType: value })}
            placeholder="Select packaging"
            options={PACKAGING_OPTIONS}
          />
        </Field>
      </div>

      {showVariants && (
        <ProductVariantEditor
          variants={draft.variants}
          onAdd={addVariant}
          onRemove={removeVariant}
          onChange={updateVariant}
        />
      )}

      <div className="border-t border-border-subtle pt-5">
        <Field label="Product Description:">
          <TextAreaField
            value={draft.description}
            onChange={(value) => onChange({ description: value })}
            placeholder="Add Description...."
          />
        </Field>
      </div>
    </div>
  );
}
