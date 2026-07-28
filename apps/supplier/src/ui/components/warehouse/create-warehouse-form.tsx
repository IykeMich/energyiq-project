import { useMemo, useState } from 'react';
import type { warehouse } from '@energyiq/domain';
import { Field, FormActionButton, SelectField, TextField, ToggleSwitch } from '@/ui/components/product/wizard-fields';
import { useEmployeesQuery } from '@/hooks/use-employees';

interface CreateWarehouseFormProps {
  onCancel: () => void;
  onSave: (req: warehouse.WarehouseCreateRequest) => void;
}

export function CreateWarehouseForm({ onCancel, onSave }: CreateWarehouseFormProps) {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState('');
  const [managerId, setManagerId] = useState('');
  const [active, setActive] = useState(false);

  const { data: managers } = useEmployeesQuery({ role: 'manager' });
  const managerOptions = useMemo(
    () =>
      (managers?.items ?? []).map((manager) => ({
        value: manager.id ?? '',
        label: manager.name ?? manager.email ?? 'Unnamed',
      })),
    [managers],
  );

  const canSave = Boolean(name && location && capacity);

  const handleSave = () => {
    onSave({
      name,
      location,
      capacity: Number.parseFloat(capacity) || 0,
      manager_id: managerId || undefined,
      status: active ? 'active' : 'inactive',
    });
  };

  return (
    <div className="border border-border-subtle rounded-[28px] p-7 flex flex-col gap-6">
      <h2 className="text-base font-semibold text-foreground">Warehouse Details</h2>

      <Field label="Warehouse Name:">
        <TextField value={name} onChange={setName} placeholder="Enter warehouse name" />
      </Field>

      <Field label="Location:">
        <TextField value={location} onChange={setLocation} placeholder="Enter warehouse location" />
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Field label="Capacity (L):">
          <TextField type="number" value={capacity} onChange={setCapacity} placeholder="e.g. 60000" />
        </Field>
        <Field label="Select Manager:">
          <SelectField
            value={managerId}
            onChange={setManagerId}
            options={managerOptions}
            placeholder="Select manager"
          />
        </Field>
        <Field label="Status:">
          <ToggleSwitch checked={active} onChange={setActive} />
        </Field>
      </div>

      <div className="flex items-center justify-end gap-3">
        <FormActionButton variant="cancel" onClick={onCancel}>
          Cancel
        </FormActionButton>
        <FormActionButton variant="forward" disabled={!canSave} onClick={handleSave}>
          Save
        </FormActionButton>
      </div>
    </div>
  );
}
