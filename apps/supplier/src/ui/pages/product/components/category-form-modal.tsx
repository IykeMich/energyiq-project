import { useEffect, useState } from 'react';
import { Modal } from '@energyiq/ui';
import { emptyCategory, type ProductCategoryRow } from '../mocks';
import { Field, SelectField, TextField } from './wizard-fields';

interface CategoryFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: ProductCategoryRow | null;
  onSave: (data: Omit<ProductCategoryRow, 'id'>) => void;
}

export function CategoryFormModal({ open, onOpenChange, initial, onSave }: CategoryFormModalProps) {
  const [form, setForm] = useState<Omit<ProductCategoryRow, 'id'>>(emptyCategory());

  useEffect(() => {
    if (open) {
      const { name = '', description = '', numberOfProducts = 0, status = 'active' } = initial ?? {};
      setForm({ name, description, numberOfProducts, status });
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
        <Field label="Category" required>
          <TextField
            value={form.name}
            onChange={(v) => setForm((p) => ({ ...p, name: v }))}
            placeholder="e.g. Fuel"
          />
        </Field>
        <Field label="No of Products:">
          <TextField
            type="number"
            value={String(form.numberOfProducts)}
            onChange={(v) => setForm((p) => ({ ...p, numberOfProducts: Number(v) || 0 }))}
            placeholder="0"
          />
        </Field>
        <Field label="Description:">
          <TextField
            value={form.description}
            onChange={(v) => setForm((p) => ({ ...p, description: v }))}
            placeholder="Short summary"
          />
        </Field>
        <Field label="Status:">
          <SelectField
            value={form.status}
            onChange={(v) => setForm((p) => ({ ...p, status: (v as ProductCategoryRow['status']) || 'active' }))}
            options={[
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
            ]}
          />
        </Field>

        <div className="flex justify-end mt-2">
          <button
            type="button"
            disabled={!canSave}
            onClick={() => onSave(form)}
            className="h-[53px] rounded-[28px] bg-brand text-brand-foreground font-semibold px-10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
}
