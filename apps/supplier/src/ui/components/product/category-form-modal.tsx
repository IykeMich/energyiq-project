import { useEffect, useState } from 'react';
import { Modal } from '@energyiq/ui';
import type { product } from '@energyiq/domain';
import { FormActionButton, TextField, ToggleSwitch } from './wizard-fields';

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
      className="bg-[#121212]"
    >
      <div className="flex flex-col gap-5">
        <TextField
          label="Category:"
          value={form.name}
          onChange={(v) => setForm((p) => ({ ...p, name: v }))}
          placeholder="e.g. Fuel"
          className="w-full"
        />
        <TextField
          label="No of Products"
          value={''}
          onChange={(v) => setForm((p) => ({ ...p, noOfProducts: v }))}
          placeholder="e.g. 10"
          disabled
          className="w-full"
        />
        <TextField
          label="Description:"
          value={form.description ?? ''}
          onChange={(v) => setForm((p) => ({ ...p, description: v }))}
          placeholder="Short summary"
          className="w-full"
        />
        <ToggleSwitch
          label="Status:"
          checked={form.status === 'active'}
          onChange={(next) => setForm((p) => ({ ...p, status: next ? 'active' : 'inactive' }))}
          className="border-0! outline-0! ring-0! focus:ring-0! focus:outline-0!"
        />

        <div className="flex justify-end gap-3 mt-2">
          <FormActionButton variant="cancel" onClick={() => onOpenChange(false)}>
            Cancel
          </FormActionButton>
          <FormActionButton variant="forward" disabled={!canSave || saving} onClick={() => onSave(form)}>
            {saving ? 'Saving...' : initial ? 'Save Changes' : 'Add Category'}
          </FormActionButton>
        </div>
      </div>
    </Modal>
  );
}
