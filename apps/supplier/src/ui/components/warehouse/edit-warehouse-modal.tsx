import { useEffect, useMemo, useState } from 'react';
import { Modal } from '@energyiq/ui';
import { cn } from '@energyiq/shared';
import type { warehouse } from '@energyiq/domain';
import {
  WAREHOUSE_STATUS_OPTIONS,
  type EditWarehouseProduct,
  type Warehouse,
} from '@/ui/pages/inventory/mocks';
import { Field, SelectField, TextField } from '@/ui/components/product/wizard-fields';
import { useEmployeeQuery, useEmployeesQuery } from '@/hooks/use-employees';

type Tab = 'basic' | 'product';

interface EditWarehouseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  warehouse: Warehouse | null;
  onSave: (req: warehouse.WarehouseUpdateRequest) => void;
}

export function EditWarehouseModal({ open, onOpenChange, warehouse, onSave }: EditWarehouseModalProps) {
  const [tab, setTab] = useState<Tab>('basic');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [manager, setManager] = useState('');
  const [status, setStatus] = useState('active');
  const [products, setProducts] = useState<EditWarehouseProduct[]>([]);

  const { data: managers } = useEmployeesQuery({ role: 'manager' });
  // The warehouse's current manager may fall outside the role/pagination filters above
  // (e.g. their role changed since assignment) — fetch them directly so their name is
  // always resolvable as the field's default value, even if the list above omits them.
  const { data: assignedManager } = useEmployeeQuery(warehouse?.managerId ?? '', {
    enabled: Boolean(warehouse?.managerId),
  });
  const managerOptions = useMemo(() => {
    const options = (managers?.items ?? []).map((employee) => ({
      value: employee.id ?? '',
      label: employee.name ?? employee.email ?? 'Unnamed',
    }));
    if (assignedManager?.id && !options.some((option) => option.value === assignedManager.id)) {
      options.push({
        value: assignedManager.id,
        label: assignedManager.name ?? assignedManager.email ?? 'Unnamed',
      });
    }
    return options;
  }, [managers, assignedManager]);

 useEffect(() => {
  if (open && warehouse) {
    setTab('basic');

    setName(warehouse.name ?? '');

    setLocation(warehouse.fullLocation ?? '');

    setManager(warehouse.managerId ?? '');

    setStatus(warehouse.status ?? 'active');

    setProducts(
      warehouse.productPreview?.map((product) => ({
        id: product.productId,
        name: product.name,
        stockQuantity: `${product.quantity}`,
        pricePerUnit: '',
        maxStock: `${product.maxStock}`,
        reorderPoint: `${product.reorderPoint}`,
        storageLocation: product.storageLocation,
      })) ?? []
    );
  }
}, [open, warehouse]);

  const updateProduct = (id: string, patch: Partial<EditWarehouseProduct>) =>
    setProducts((prev) => prev.map((product) => (product.id === id ? { ...product, ...patch } : product)));

  const removeProduct = (id: string) =>
    setProducts((prev) => prev.filter((product) => product.id !== id));

  const handleSave = () => {
    const productAssignments: warehouse.WarehouseProductAssignment[] = products.map((product) => ({
      product_id: product.id,
      quantity: parseQuantity(product.stockQuantity),
      max_stock: parseQuantity(product.maxStock),
      reorder_point: parseQuantity(product.reorderPoint),
      storage_location: product.storageLocation,
      remove: false,
    }));

    const payload: warehouse.WarehouseUpdateRequest = {
      name,
      location,
      manager_id: manager || undefined,
      status: status as warehouse.WarehouseStatus,
      products: productAssignments,
    };

    onSave(payload);
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Warehouse Information"
      onBack={() => onOpenChange(false)}
      size="lg"
    >
      <div className="flex items-center gap-2 border-b border-border-subtle pb-4 mb-6">
        <TabButton active={tab === 'basic'} onClick={() => setTab('basic')}>
          Basic Information
        </TabButton>
        <TabButton active={tab === 'product'} onClick={() => setTab('product')}>
          Product
        </TabButton>
      </div>

      {tab === 'basic' ? (
        <div className="flex flex-col gap-5">
          <Field label="Warehouse Name:">
              <TextField value={name} onChange={setName} placeholder="Enter warehouse name" />
            </Field>
          <Field label="Location:">
            <TextField value={location} onChange={setLocation} placeholder="Enter location" />
          </Field>
          <Field label="Warehouse Manager:">
            <SelectField value={manager} onChange={setManager} options={managerOptions} placeholder="Select manager" />
          </Field>
          <Field label="Status:">
            <SelectField value={status} onChange={setStatus} options={WAREHOUSE_STATUS_OPTIONS} placeholder="Select status" />
          </Field>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {products.map((product) => (
            <div key={product.id} className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-foreground">{product.name}</p>
                <button
                  type="button"
                  onClick={() => removeProduct(product.id)}
                  className="text-sm font-semibold text-brand"
                >
                  Remove
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Stock Quantity:">
                  <TextField
                    value={product.stockQuantity}
                    onChange={(value) => updateProduct(product.id, { stockQuantity: value })}
                    placeholder="e.g. 3,000L"
                  />
                </Field>
                <Field label="Price Per Unit (#):">
                  <TextField
                    type="number"
                    value={product.pricePerUnit}
                    onChange={(value) => updateProduct(product.id, { pricePerUnit: value })}
                    placeholder="0"
                  />
                </Field>
                <Field label="Max Stock:">
                  <TextField
                    type="number"
                    value={product.maxStock}
                    onChange={(value) => updateProduct(product.id, { maxStock: value })}
                    placeholder="e.g. 5000"
                  />
                </Field>
                <Field label="Reorder Point:">
                  <TextField
                    type="number"
                    value={product.reorderPoint}
                    onChange={(value) => updateProduct(product.id, { reorderPoint: value })}
                    placeholder="e.g. 500"
                  />
                </Field>
                <Field label="Storage Location:">
                  <TextField
                    value={product.storageLocation}
                    onChange={(value) => updateProduct(product.id, { storageLocation: value })}
                    placeholder="e.g. Bay A-3"
                  />
                </Field>
              </div>
            </div>
          ))}
          {products.length === 0 && (
            <p className="text-sm text-muted-foreground">No products assigned to this warehouse.</p>
          )}
        </div>
      )}

      <div className="flex justify-end mt-8">
        <button
          type="button"
          onClick={handleSave}
          className="h-[53px] rounded-[28px] bg-brand text-brand-foreground font-semibold px-12"
        >
          Save
        </button>
      </div>
    </Modal>
  );
}

function parseQuantity(value: string): number {
  const digits = value.replace(/[^0-9.]/g, '');
  const parsed = Number.parseFloat(digits);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'h-10 px-5 rounded-full text-sm font-semibold transition-colors',
        active ? 'bg-brand text-brand-foreground' : 'bg-transparent text-foreground hover:bg-foreground/5',
      )}
    >
      {children}
    </button>
  );
}
