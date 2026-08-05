import {
  PACKAGING_OPTIONS,
  TYPE_OPTIONS,
  type NewProductDraft,
  type ProductDraftErrors,
  type ProductVariantDraft,
} from '@/ui/pages/product/mocks';
import { useProductCategoriesQuery } from '@/hooks/use-product-categories';
import { useProductUnitsQuery } from '@/hooks/use-product-units';
import { SelectField, TextAreaField, TextField } from './wizard-fields';
import { ProductVariantEditor } from './product-variant-editor';

interface ProductBasicInfoTabProps {
  draft: NewProductDraft;
  onChange: (patch: Partial<NewProductDraft>) => void;
  errors?: ProductDraftErrors;
}

export function ProductBasicInfoTab({ draft, onChange, errors }: ProductBasicInfoTabProps) {
  const showVariants = draft.type === 'Product with Variant';

  const categoriesQuery = useProductCategoriesQuery({ status: 'active' });
  const unitsQuery = useProductUnitsQuery({ status: 'active' });

  const categoryOptions = (categoriesQuery.data ?? [])
    .filter((category) => category.id && category.name)
    .map((category) => ({ value: category.id as string, label: category.name as string }));

  const unitOptions = (unitsQuery.data ?? [])
    .filter((unit) => unit.short_code && unit.unit_name)
    .map((unit) => ({ value: unit.short_code as string, label: `${unit.unit_name} (${unit.short_code})` }));

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
      <TextField
        label="Product Name:"
        value={draft.name}
        onChange={(value) => onChange({ name: value })}
        placeholder="e.g. Diesel"
        error={errors?.name}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectField
          label="Product Category:"
          value={draft.category}
          onChange={(value) => onChange({ category: value })}
          placeholder="Select category"
          options={categoryOptions}
          error={errors?.category}
        />
        <SelectField
          label="Product Type:"
          value={draft.type}
          onChange={(value) => onChange({ type: value })}
          placeholder="Select type"
          options={TYPE_OPTIONS}
        />
        <SelectField
          label="Measuring Unit:"
          value={draft.measuringUnit}
          onChange={(value) => onChange({ measuringUnit: value })}
          placeholder="Select unit"
          options={unitOptions}
          error={errors?.measuringUnit}
        />
        <SelectField
          label="Packaging Type:"
          value={draft.packagingType}
          onChange={(value) => onChange({ packagingType: value })}
          placeholder="Select packaging"
          options={PACKAGING_OPTIONS}
        />
      </div>

      {showVariants && (
        <ProductVariantEditor
          variants={draft.variants}
          onAdd={addVariant}
          onRemove={removeVariant}
          onChange={updateVariant}
        />
      )}

      <div className="border-t border-dashed border-border-subtle pt-5">
        <TextAreaField
          label="Product Description:"
          value={draft.description}
          onChange={(value) => onChange({ description: value })}
          placeholder="Add Description...."
        />
      </div>
    </div>
  );
}
