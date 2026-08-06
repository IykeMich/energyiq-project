import { cn } from '@energyiq/shared';
import { useProductCategoriesQuery } from '@/hooks/use-product-categories';
import { useProductUnitsQuery } from '@/hooks/use-product-units';
import { TYPE_OPTIONS } from '@/ui/pages/product/mocks';
import { FormActionButton, SelectField, TextAreaField, TextField } from './wizard-fields';

export interface ProductBasicInfoDraft {
  name: string;
  sku: string;
  category: string;
  type: string;
  measuringUnit: string;
  description: string;
}

interface ProductBasicInfoCardProps {
  draft: ProductBasicInfoDraft;
  onChange: (patch: Partial<ProductBasicInfoDraft>) => void;
  onCancel: () => void;
  onNext: () => void;
}

const FIELD_CLASSNAME = 'h-[47px] w-full rounded-[33px]';

/** Right-panel "Product Details" card for step 1 of the "Add New Product" wizard. */
export function ProductBasicInfoCard({ draft, onChange, onCancel, onNext }: ProductBasicInfoCardProps) {
  const categoriesQuery = useProductCategoriesQuery({ status: 'active' });
  const unitsQuery = useProductUnitsQuery({ status: 'active' });

  const categoryOptions = (categoriesQuery.data ?? [])
    .filter((category) => category.id && category.name)
    .map((category) => ({ value: category.id as string, label: category.name as string }));

  const unitOptions = (unitsQuery.data ?? [])
    .filter((unit) => unit.short_code && unit.unit_name)
    .map((unit) => ({ value: unit.short_code as string, label: `${unit.unit_name} (${unit.short_code})` }));

  const isStepValid = Boolean(draft.sku && draft.type && draft.category);

  return (
    <div className="bg-[#6161611A] border border-[#616161B2] rounded-[48px] p-7 flex flex-1 min-w-0 flex-col gap-7">
      <div className="flex flex-col gap-2.5">
        <h2 className="text-lg font-medium text-foreground">Product Details</h2>
        <p className="text-base text-foreground/80">Basic information, SKU, category..</p>
      </div>

      <TextField
        label="Product Name:"
        value={draft.name}
        onChange={(value) => onChange({ name: value })}
        placeholder="e.g Premium Petrol"
        className={FIELD_CLASSNAME}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextField
          label="Product SKU (must be unique):"
          required
          value={draft.sku}
          onChange={(value) => onChange({ sku: value })}
          placeholder="e.g PET-000"
          className={FIELD_CLASSNAME}
        />
        <SelectField
          label="Product Type:"
          required
          value={draft.type}
          onChange={(value) => onChange({ type: value })}
          placeholder="Select Type"
          options={TYPE_OPTIONS}
          className={FIELD_CLASSNAME}
        />
        <SelectField
          label="Product Category:"
          required
          value={draft.category}
          onChange={(value) => onChange({ category: value })}
          placeholder="Select Category"
          options={categoryOptions}
          className={FIELD_CLASSNAME}
        />
        <SelectField
          label="Measuring Unit:"
          value={draft.measuringUnit}
          onChange={(value) => onChange({ measuringUnit: value })}
          placeholder="Select Unit"
          options={unitOptions}
          className={FIELD_CLASSNAME}
        />
      </div>

      <div className="border-t border-[#616161B2] pt-7">
        <TextAreaField
          label="Product Description:"
          value={draft.description}
          onChange={(value) => onChange({ description: value })}
          placeholder="Add Description...."
          rows={3}
          className="rounded-[33px] min-h-[94px]"
        />
      </div>

      <div className="flex justify-end gap-4 border-t border-[#616161B2] pt-7">
        <FormActionButton variant="cancel" onClick={onCancel}>
          Cancel
        </FormActionButton>
        <button
          type="button"
          onClick={onNext}
          disabled={!isStepValid}
          className={cn(
            'tap-effect h-10.5 rounded-[28px] px-12 font-semibold text-[#121212] hover:opacity-90 disabled:hover:opacity-100 disabled:cursor-not-allowed',
            isStepValid ? 'bg-brand' : 'bg-[#FBC02D33]',
          )}
        >
          Next
        </button>
      </div>
    </div>
  );
}
