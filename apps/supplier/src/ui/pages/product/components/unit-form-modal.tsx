import { useEffect, useState } from 'react';
import { Modal } from '@energyiq/ui';
import { emptyUnit, UNIT_TYPE_OPTIONS, type ProductUnitRow } from '../mocks';
import { Field, SelectField, TextField } from './wizard-fields';

interface UnitFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: ProductUnitRow | null;
  onSave: (data: Omit<ProductUnitRow, 'id'>) => void;
}

export function UnitFormModal({ open, onOpenChange, initial, onSave }: UnitFormModalProps) {
  const [form, setForm] = useState<Omit<ProductUnitRow, 'id'>>(emptyUnit());

  useEffect(() => {
    if (open) {
      const { name = '', description = '', type = 'Volume', shortCode = '' } = initial ?? {};
      setForm({ name, description, type, shortCode });
    }
  }, [open, initial]);

  const canSave = form.name.trim().length > 0 && form.shortCode.trim().length > 0;

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={initial ? `Edit ${initial.name}` : 'Add Unit'}
      size="md"
    >
      <div className="flex flex-col gap-5">
        <Field label="Unit Name:" required>
          <TextField
            value={form.name}
            onChange={(v) => setForm((p) => ({ ...p, name: v }))}
            placeholder="e.g. Litre"
          />
        </Field>
        <Field label="Short Code:" required>
          <TextField
            value={form.shortCode}
            onChange={(v) => setForm((p) => ({ ...p, shortCode: v }))}
            placeholder="e.g. L"
          />
        </Field>
        <Field label="Type:">
          <SelectField
            value={form.type}
            onChange={(v) => setForm((p) => ({ ...p, type: (v as ProductUnitRow['type']) || 'Volume' }))}
            options={UNIT_TYPE_OPTIONS}
          />
        </Field>
        <Field label="Description:">
          <TextField
            value={form.description}
            onChange={(v) => setForm((p) => ({ ...p, description: v }))}
            placeholder="Short summary"
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
