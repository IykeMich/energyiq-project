import { useEffect, useState } from 'react';
import { Modal } from '@energyiq/ui';
import { cn } from '@energyiq/shared';
import {
  WAREHOUSES_MOCK,
  WAREHOUSE_LOCATION_OPTIONS,
  WAREHOUSE_MANAGER_OPTIONS,
  WAREHOUSE_STATUS_OPTIONS,
  defaultWarehouseProducts,
  type EditWarehouseProduct,
  type Warehouse,
} from '@/ui/pages/inventory/mocks';
import { Field, SelectField, TextField } from '@/ui/components/product/wizard-fields';

type Tab = 'basic' | 'product';

interface EditWarehouseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  warehouse: Warehouse | null;
  onSave: () => void;
}

const WAREHOUSE_NAME_OPTIONS = WAREHOUSES_MOCK.map((warehouse) => warehouse.name);

export function EditWarehouseModal({ open, onOpenChange, warehouse, onSave }: EditWarehouseModalProps) {
  const [tab, setTab] = useState<Tab>('basic');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [manager, setManager] = useState('');
  const [status, setStatus] = useState('active');
  const [products, setProducts] = useState<EditWarehouseProduct[]>([]);

  useEffect(() => {
    if (open) {
      setTab('basic');
      setName(warehouse?.name ?? '');
      setLocation(warehouse?.fullLocation ?? '');
      setManager(WAREHOUSE_MANAGER_OPTIONS[0]);
      setStatus(warehouse?.status ?? 'active');
      setProducts(defaultWarehouseProducts());
    }
  }, [open, warehouse]);

  const updateProduct = (id: string, patch: Partial<EditWarehouseProduct>) =>
    setProducts((prev) => prev.map((product) => (product.id === id ? { ...product, ...patch } : product)));

  const removeProduct = (id: string) =>
    setProducts((prev) => prev.filter((product) => product.id !== id));

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
            <SelectField value={name} onChange={setName} options={WAREHOUSE_NAME_OPTIONS} placeholder="Select warehouse" />
          </Field>
          <Field label="Location:">
            <SelectField value={location} onChange={setLocation} options={WAREHOUSE_LOCATION_OPTIONS} placeholder="Select location" />
          </Field>
          <Field label="Warehouse Manager:">
            <SelectField value={manager} onChange={setManager} options={WAREHOUSE_MANAGER_OPTIONS} placeholder="Select manager" />
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
          onClick={onSave}
          className="h-[53px] rounded-[28px] bg-brand text-brand-foreground font-semibold px-12"
        >
          Save
        </button>
      </div>
    </Modal>
  );
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
