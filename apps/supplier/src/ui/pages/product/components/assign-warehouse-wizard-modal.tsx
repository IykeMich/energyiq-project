import { useEffect, useMemo, useState } from 'react';
import { Search, CheckCircle2 } from 'lucide-react';
import { Modal, WizardStepPills } from '@energyiq/ui';
import { cn } from '@energyiq/shared';
import {
  PRODUCTS_MOCK,
  WAREHOUSES_FOR_ASSIGN,
  type Product,
  type WarehouseAssignTarget,
} from '../mocks';

type Step = 1 | 2 | 3 | 'success';

interface Allocation {
  warehouseId: string;
  quantity: string;
}

interface AssignWarehouseWizardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const STEP_LABELS = ['Select Product', 'Assign to Warehouses', 'Review and Submit'];

export function AssignWarehouseWizardModal({ open, onOpenChange }: AssignWarehouseWizardModalProps) {
  const [step, setStep] = useState<Step>(1);
  const [search, setSearch] = useState('');
  const [productId, setProductId] = useState<string>('');
  const [allocations, setAllocations] = useState<Allocation[]>([]);

  useEffect(() => {
    if (open) {
      setStep(1);
      setSearch('');
      setProductId('');
      setAllocations([]);
    }
  }, [open]);

  const selectedProduct = useMemo<Product | undefined>(
    () => PRODUCTS_MOCK.find((p) => p.id === productId),
    [productId],
  );

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return PRODUCTS_MOCK.slice(0, 10);
    return PRODUCTS_MOCK.filter(
      (p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q),
    ).slice(0, 10);
  }, [search]);

  const selectedWarehouses = useMemo(
    () => allocations.filter((a) => Number(a.quantity) > 0),
    [allocations],
  );

  const totalAllocationL = useMemo(
    () => selectedWarehouses.reduce((sum, a) => sum + Number(a.quantity || 0), 0),
    [selectedWarehouses],
  );

  const toggleWarehouse = (id: string) => {
    setAllocations((prev) => {
      const idx = prev.findIndex((a) => a.warehouseId === id);
      if (idx === -1) return [...prev, { warehouseId: id, quantity: '' }];
      return prev.filter((a) => a.warehouseId !== id);
    });
  };

  const setQuantity = (id: string, quantity: string) =>
    setAllocations((prev) =>
      prev.map((a) => (a.warehouseId === id ? { ...a, quantity } : a)),
    );

  const isSelected = (id: string) => allocations.some((a) => a.warehouseId === id);

  const canContinueFromStep1 = !!productId;
  const canContinueFromStep2 = totalAllocationL > 0;

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={step === 'success' ? undefined : 'Warehouse Assignment'}
      onBack={step === 'success' ? undefined : () => onOpenChange(false)}
      size="lg"
    >
      {step !== 'success' && (
        <WizardStepPills
          steps={STEP_LABELS}
          current={typeof step === 'number' ? step - 1 : 2}
          className="mb-6"
        />
      )}

      {step === 1 && (
        <>
          <h3 className="text-lg font-semibold text-foreground">Select Product</h3>
          <p className="text-sm text-foreground/80 mb-4">
            Choose the product you want to assign to one or more warehouses
          </p>

          <div className="bg-surface-card border border-border-strong rounded-full px-5 h-[52px] flex items-center gap-3 mb-4">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              className="bg-transparent flex-1 outline-none text-foreground placeholder:text-muted-foreground text-sm"
            />
          </div>

          <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-1">
            {filteredProducts.map((p) => {
              const active = productId === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setProductId(p.id)}
                  className={cn(
                    'flex items-center justify-between rounded-[20px] border px-5 py-4 text-left transition-colors',
                    active
                      ? 'border-brand bg-brand/5'
                      : 'border-border-strong bg-surface-card hover:bg-foreground/5',
                  )}
                >
                  <div>
                    <p className="text-sm font-semibold text-foreground">{p.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {p.sku} · ₦{p.defaultPriceNGN.toLocaleString()} per {p.unit}
                    </p>
                  </div>
                  {active && (
                    <span className="w-6 h-6 rounded-md bg-brand text-brand-foreground flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <Footer
            onBack={() => onOpenChange(false)}
            backLabel="Cancel"
            onPrimary={() => canContinueFromStep1 && setStep(2)}
            primaryDisabled={!canContinueFromStep1}
            primaryLabel="Continue"
          />
        </>
      )}

      {step === 2 && (
        <>
          {selectedProduct && (
            <p className="text-xs font-semibold text-success bg-success/15 self-start rounded-full px-4 py-1.5 mb-4 inline-block">
              {selectedProduct.sku} · {selectedProduct.name}
            </p>
          )}
          <h3 className="text-lg font-semibold text-foreground">Assign Warehouses</h3>
          <p className="text-sm text-foreground/80 mb-4">
            Select one or more warehouses and set the stock quantity for each.
          </p>

          <div className="flex flex-col gap-3 max-h-[440px] overflow-y-auto pr-1">
            {WAREHOUSES_FOR_ASSIGN.map((w) => (
              <WarehouseCard
                key={w.id}
                warehouse={w}
                selected={isSelected(w.id)}
                quantity={allocations.find((a) => a.warehouseId === w.id)?.quantity ?? ''}
                onToggle={() => toggleWarehouse(w.id)}
                onQuantityChange={(q) => setQuantity(w.id, q)}
              />
            ))}
          </div>

          {selectedWarehouses.length > 0 && (
            <div className="mt-4 bg-brand/10 border border-brand rounded-[16px] px-5 py-3 text-center text-sm font-semibold text-brand">
              {selectedWarehouses.length} warehouse{selectedWarehouses.length === 1 ? '' : 's'} selected · Total
              allocation: {totalAllocationL.toLocaleString()} Litres
            </div>
          )}

          <Footer
            onBack={() => setStep(1)}
            onPrimary={() => canContinueFromStep2 && setStep(3)}
            primaryDisabled={!canContinueFromStep2}
            primaryLabel="Continue"
          />
        </>
      )}

      {step === 3 && (
        <>
          <h3 className="text-lg font-semibold text-foreground">Review &amp; Confirm</h3>
          <p className="text-sm text-foreground/80 mb-5">
            Confirm the warehouse assignments before saving.
          </p>

          <div className="bg-surface-card border border-border-subtle rounded-[20px] p-5 mb-4">
            <p className="text-xs text-muted-foreground">Product:</p>
            <p className="text-base font-semibold text-foreground mt-1">{selectedProduct?.name}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {selectedProduct?.sku} · {selectedProduct?.unit}
            </p>
          </div>

          <div className="bg-surface-card border border-border-subtle rounded-[20px] p-5">
            <p className="text-xs text-muted-foreground mb-4">
              Warehouse Assignments ({selectedWarehouses.length})
            </p>
            <div className="flex flex-col gap-4">
              {selectedWarehouses.map((a) => {
                const w = WAREHOUSES_FOR_ASSIGN.find((x) => x.id === a.warehouseId);
                return (
                  <div key={a.warehouseId} className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{w?.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{w?.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-brand">
                        {Number(a.quantity).toLocaleString()}L
                      </p>
                      <p className="text-xs text-brand">Litres</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Footer
            onBack={() => setStep(2)}
            onPrimary={() => setStep('success')}
            primaryLabel="Submit"
            primaryClassName="flex-1"
          />
        </>
      )}

      {step === 'success' && (
        <div className="flex flex-col items-center -mt-4 gap-3">
          <div className="w-[68px] h-[68px] rounded-full bg-brand/20 flex items-center justify-center">
            <div className="w-[52px] h-[52px] rounded-full bg-brand flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-brand-foreground" />
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-foreground mt-2">Assignment Saved!</h2>
          <p className="text-sm text-foreground text-center max-w-[440px]">
            {selectedProduct?.name} has been successfully assigned to {selectedWarehouses.length}{' '}
            warehouse{selectedWarehouses.length === 1 ? '' : 's'}.
          </p>

          <div className="bg-surface-card border border-border-subtle rounded-[16px] py-5 px-6 mt-4 self-stretch flex flex-col items-center gap-1">
            {selectedWarehouses.map((a) => {
              const w = WAREHOUSES_FOR_ASSIGN.find((x) => x.id === a.warehouseId);
              return (
                <div key={a.warehouseId} className="flex flex-col items-center">
                  <p className="text-sm text-foreground">{w?.name}</p>
                  <p className="text-xl font-bold text-brand">{Number(a.quantity).toLocaleString()} Litres</p>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col gap-3 mt-5 w-full">
            <button
              type="button"
              onClick={() => {
                setStep(1);
                setSearch('');
                setProductId('');
                setAllocations([]);
              }}
              className="h-[53px] rounded-[28px] bg-brand text-brand-foreground font-semibold"
            >
              Assign another Product
            </button>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="h-[53px] rounded-[28px] bg-foreground/10 text-foreground font-semibold"
            >
              Go to Home
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}

interface WarehouseCardProps {
  warehouse: WarehouseAssignTarget;
  selected: boolean;
  quantity: string;
  onToggle: () => void;
  onQuantityChange: (next: string) => void;
}

function WarehouseCard({
  warehouse,
  selected,
  quantity,
  onToggle,
  onQuantityChange,
}: WarehouseCardProps) {
  const pct = Math.round((warehouse.usedL / warehouse.capacityL) * 100);
  const barColor = pct >= 80 ? 'bg-warning' : 'bg-success';

  return (
    <div
      className={cn(
        'rounded-[20px] border p-5 transition-colors',
        selected ? 'border-brand bg-brand/5' : 'border-border-strong bg-surface-card',
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-start justify-between text-left"
      >
        <div>
          <p className="text-sm font-semibold text-foreground">{warehouse.name}</p>
          <p className="text-xs text-muted-foreground mt-1">{warehouse.location}</p>
        </div>
        <div
          className={cn(
            'w-5 h-5 rounded-md flex items-center justify-center shrink-0',
            selected ? 'bg-brand text-brand-foreground' : 'border-2 border-muted-foreground',
          )}
        >
          {selected && <CheckCircle2 className="w-3.5 h-3.5" />}
        </div>
      </button>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-foreground mb-1.5">
          <span>{warehouse.usedL.toLocaleString()} L used</span>
          <span>{warehouse.capacityL.toLocaleString()} L total</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-foreground/10">
          <div className={cn('h-full rounded-full', barColor)} style={{ width: `${pct}%` }} />
        </div>
        <p className={cn('text-xs mt-2', pct >= 80 ? 'text-warning' : 'text-success')}>
          {pct}% capacity used
        </p>
      </div>

      {selected && (
        <div className="mt-4 border-t border-border-subtle pt-4">
          <label className="text-xs text-foreground">Stock Quantity to Assign (L):</label>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            value={quantity}
            onChange={(e) => onQuantityChange(e.target.value)}
            placeholder="0"
            className="mt-2 w-full bg-surface-card border border-border-strong h-[44px] rounded-full px-5 text-foreground placeholder:text-muted-foreground outline-none focus:border-brand"
          />
          <p className="text-xs text-muted-foreground mt-1.5">
            Available space: {(warehouse.capacityL - warehouse.usedL).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}

interface FooterProps {
  onBack: () => void;
  backLabel?: string;
  onPrimary: () => void;
  primaryLabel: string;
  primaryDisabled?: boolean;
  primaryClassName?: string;
}

function Footer({
  onBack,
  backLabel = 'Back',
  onPrimary,
  primaryLabel,
  primaryDisabled,
  primaryClassName,
}: FooterProps) {
  return (
    <div className="flex items-center gap-3 mt-6">
      <button
        type="button"
        onClick={onBack}
        className="h-[46px] rounded-full bg-foreground/10 text-foreground font-semibold px-8"
      >
        {backLabel}
      </button>
      <button
        type="button"
        onClick={onPrimary}
        disabled={primaryDisabled}
        className={cn(
          'h-[46px] rounded-full bg-brand text-brand-foreground font-semibold px-10 disabled:opacity-50 disabled:cursor-not-allowed',
          primaryClassName ?? 'flex-1',
        )}
      >
        {primaryLabel}
      </button>
    </div>
  );
}
