import { useEffect, useState } from 'react';
import { Modal } from '@energyiq/ui';
import type { product } from '@energyiq/domain';
import { UNIT_TYPE_OPTIONS } from '@/ui/pages/product/mocks';
import { Field, SelectField, TextField, ToggleSwitch } from './wizard-fields';

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
    >
      <div className="flex flex-col gap-5">
        <Field label="Unit Name:" required>
          <TextField
            value={form.unit_name}
            onChange={(v) => setForm((p) => ({ ...p, unit_name: v }))}
            placeholder="e.g. Litre"
          />
        </Field>
        <Field label="Short Code:" required>
          <TextField
            value={form.short_code}
            onChange={(v) => setForm((p) => ({ ...p, short_code: v }))}
            placeholder="e.g. L"
          />
        </Field>
        <Field label="Type:">
          <SelectField
            value={form.type}
            onChange={(v) => setForm((p) => ({ ...p, type: v || 'Volume' }))}
            options={UNIT_TYPE_OPTIONS}
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
