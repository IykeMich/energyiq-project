import { useEffect, useState } from 'react';
import { Modal } from '@energyiq/ui';
import type { product } from '@energyiq/domain';
import { UNIT_TYPE_OPTIONS } from '@/ui/pages/product/mocks';
import { FormActionButton, SelectField, TextField } from './wizard-fields';

interface UnitFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: product.ProductUnit | null;
  onSave: (data: product.ProductUnitUpsertRequest) => void;
  saving?: boolean;
}

function emptyForm(): product.ProductUnitUpsertRequest {
  return { unit_name: '', short_code: '', type: 'Volume', description: '', status: 'active' };
}

export function UnitFormModal({ open, onOpenChange, initial, onSave, saving }: UnitFormModalProps) {
  const [form, setForm] = useState<product.ProductUnitUpsertRequest>(emptyForm());

  useEffect(() => {
    if (open) {
      const {
        unit_name = '',
        short_code = '',
        type = 'Volume',
        description = '',
        status = 'active',
      } = initial ?? {};
      setForm({ unit_name, short_code, type, description, status: status as product.UnitStatus });
    }
  }, [open, initial]);

  const canSave = form.unit_name.trim().length > 0 && form.short_code.trim().length > 0;

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={initial ? `Edit ${initial.unit_name}` : 'Add Unit'}
      size="md"
      className="bg-[#121212]"
    >
      <div className="flex flex-col gap-5">
        <TextField
          label="Unit Name:"
          required
          value={form.unit_name}
          onChange={(v) => setForm((p) => ({ ...p, unit_name: v }))}
          placeholder="e.g. Litre"
        />
        <TextField
          label="Short Code:"
          required
          value={form.short_code}
          onChange={(v) => setForm((p) => ({ ...p, short_code: v }))}
          placeholder="e.g. L"
        />
        <SelectField
          label="Type:"
          value={form.type}
          onChange={(v) => setForm((p) => ({ ...p, type: v || 'Volume' }))}
          options={UNIT_TYPE_OPTIONS}
        />
        <TextField
          label="Description:"
          value={form.description ?? ''}
          onChange={(v) => setForm((p) => ({ ...p, description: v }))}
          placeholder="Short summary"
        />

        <div className="flex justify-end gap-3 mt-2">
          <FormActionButton variant="cancel" onClick={() => onOpenChange(false)}>
            Cancel
          </FormActionButton>
          <FormActionButton variant="forward" disabled={!canSave || saving} onClick={() => onSave(form)}>
            {saving ? 'Saving...' : initial ? 'Save Changes' : 'Add Unit'}
          </FormActionButton>
        </div>
      </div>
    </Modal>
  );
}
