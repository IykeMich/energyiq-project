import { useEffect, useState } from 'react';
import { Modal } from '@energyiq/ui';
import type { product } from '@energyiq/domain';
import { Field, TextField, ToggleSwitch } from './wizard-fields';

interface CategoryFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: product.ProductCategory | null;
  onSave: (data: product.ProductCategoryUpsertRequest) => void;
  saving?: boolean;
}

function emptyForm(): product.ProductCategoryUpsertRequest {
  return { name: '', description: '', status: 'active' };
}

export function CategoryFormModal({ open, onOpenChange, initial, onSave, saving }: CategoryFormModalProps) {
  const [form, setForm] = useState<product.ProductCategoryUpsertRequest>(emptyForm());

  useEffect(() => {
    if (open) {
      const { name = '', description = '', status = 'active' } = initial ?? {};
      setForm({ name, description, status: status as product.CategoryStatus });
    }
  }, [open, initial]);

  const canSave = form.name.trim().length > 0;

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={initial ? `Edit ${initial.name}` : 'Add Category'}
      size="md"
    >
      <div className="flex flex-col gap-5">
        <Field label="Category">
          <TextField
            value={form.name}
            onChange={(v) => setForm((p) => ({ ...p, name: v }))}
            placeholder="e.g. Fuel"
          />
        </Field>
        <Field label="No of Products">
          <TextField
            value={''}
            onChange={(v) => setForm((p) => ({ ...p, noOfProducts: v }))}
            placeholder="e.g. 10"
          />
        </Field>
        <Field label="Description:">
          <TextField
            value={form.description ?? ''}
            onChange={(v) => setForm((p) => ({ ...p, description: v }))}
            placeholder="Short summary"
          />
        </Field>
        <Field label="Status:">
          <ToggleSwitch
            checked={form.status === 'active'}
            onChange={(next) => setForm((p) => ({ ...p, status: next ? 'active' : 'inactive' }))}
          />
        </Field>

        <div className="flex justify-end mt-2">
          <button
            type="button"
            disabled={!canSave || saving}
            onClick={() => onSave(form)}
            className="h-[53px] rounded-[28px] bg-brand text-brand-foreground font-semibold px-10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : initial ? 'Save Changes' : 'Add'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
