import { useMemo, useState } from 'react';
import type { warehouse } from '@energyiq/domain';
import { FormActionButton, SelectField, TextField, ToggleSwitch } from '@/ui/components/product/wizard-fields';
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
      warehouse_name: name,
      location,
      capacity: Number.parseFloat(capacity) || 0,
      manager_id: managerId || undefined,
      status: active ? 'active' : 'inactive',
    });
  };

  return (
    <div className="border border-border-subtle rounded-[28px] p-7 flex flex-col gap-6">
      <h2 className="text-base font-semibold text-foreground">Warehouse Details</h2>

      <TextField label="Warehouse Name:" value={name} onChange={setName} placeholder="Enter warehouse name" />

      <TextField label="Location:" value={location} onChange={setLocation} placeholder="Enter warehouse location" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TextField label="Capacity (L):" type="number" value={capacity} onChange={setCapacity} placeholder="e.g. 60000" />
        <SelectField
          label="Select Manager:"
          value={managerId}
          onChange={setManagerId}
          options={managerOptions}
          placeholder="Select manager"
        />
        <ToggleSwitch label="Status:" checked={active} onChange={setActive} />
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
