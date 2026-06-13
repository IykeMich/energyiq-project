import { useState } from 'react';
import {
  WAREHOUSE_LOCATION_OPTIONS,
  WAREHOUSE_MANAGER_OPTIONS,
  WAREHOUSE_NAME_OPTIONS,
} from '@/ui/pages/inventory/mocks';
import { Field, SelectField, ToggleSwitch } from '@/ui/components/product/wizard-fields';

interface CreateWarehouseFormProps {
  onCancel: () => void;
  onSave: (name: string) => void;
}

export function CreateWarehouseForm({ onCancel, onSave }: CreateWarehouseFormProps) {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [manager, setManager] = useState('');
  const [active, setActive] = useState(false);

  const canSave = Boolean(name && location && manager);

  return (
    <div className="border border-border-subtle rounded-[28px] p-7 flex flex-col gap-6">
      <h2 className="text-base font-semibold text-foreground">Warehouse Details</h2>

      <Field label="Warehouse Name:">
        <SelectField value={name} onChange={setName} options={WAREHOUSE_NAME_OPTIONS} placeholder="Select warehouse name" />
      </Field>

      <Field label="Location:">
        <SelectField value={location} onChange={setLocation} options={WAREHOUSE_LOCATION_OPTIONS} placeholder="Select location" />
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4">
        <Field label="Select Manager:">
          <SelectField value={manager} onChange={setManager} options={WAREHOUSE_MANAGER_OPTIONS} placeholder="Select manager" />
        </Field>
        <Field label="Status:">
          <ToggleSwitch checked={active} onChange={setActive} />
        </Field>
      </div>

      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="h-[53px] rounded-[28px] bg-foreground/10 text-foreground font-semibold px-8"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={!canSave}
          onClick={() => onSave(name)}
          className="h-[53px] rounded-[28px] bg-brand text-brand-foreground font-semibold px-12 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save
        </button>
      </div>
    </div>
  );
}
