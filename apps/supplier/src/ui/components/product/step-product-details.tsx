import { useState } from 'react';
import { cn } from '@energyiq/shared';
import { type NewProductDraft, type WarehouseAllocationDraft } from '@/ui/pages/product/mocks';
import { ProductBasicInfoTab } from './product-basic-info-tab';
import { ProductPricingTab } from './product-pricing-tab';
import { ProductWarehouseTab } from './product-warehouse-tab';

type Tab = 'basic' | 'pricing' | 'warehouse';

interface StepProductDetailsProps {
  draft: NewProductDraft;
  onChange: (patch: Partial<NewProductDraft>) => void;
}

export function StepProductDetails({ draft, onChange }: StepProductDetailsProps) {
  const [tab, setTab] = useState<Tab>('basic');

  const updateAllocation = (id: string, patch: Partial<WarehouseAllocationDraft>) =>
    onChange({
      warehouseAllocations: draft.warehouseAllocations.map((allocation) =>
        allocation.id === id ? { ...allocation, ...patch } : allocation,
      ),
    });

  const addAllocation = () =>
    onChange({
      warehouseAllocations: [
        ...draft.warehouseAllocations,
        {
          id: `wa-${draft.warehouseAllocations.length + 1}-${Math.random().toString(36).slice(2, 6)}`,
          warehouseLocation: '',
          allocatedQuantity: '',
          storageLocation: '',
        },
      ],
    });

  const removeAllocation = (id: string) =>
    onChange({
      warehouseAllocations: draft.warehouseAllocations.filter((allocation) => allocation.id !== id),
    });

  return (
    <div className="border border-border-subtle rounded-[28px] p-7 flex flex-col gap-6">
      <h2 className="text-base font-semibold text-foreground">Product Details</h2>

      <div className="flex items-center gap-2 flex-wrap">
        <TabButton active={tab === 'basic'} onClick={() => setTab('basic')}>
          Basic Information
        </TabButton>
        <TabButton active={tab === 'pricing'} onClick={() => setTab('pricing')}>
          Pricing
        </TabButton>
        <TabButton active={tab === 'warehouse'} onClick={() => setTab('warehouse')}>
          Warehouse Allocation
        </TabButton>
      </div>

      <div className="border-t border-border-subtle pt-6">
        {tab === 'basic' && <ProductBasicInfoTab draft={draft} onChange={onChange} />}
        {tab === 'pricing' && <ProductPricingTab draft={draft} onChange={onChange} />}
        {tab === 'warehouse' && (
          <ProductWarehouseTab
            draft={draft}
            onChange={updateAllocation}
            onAdd={addAllocation}
            onRemove={removeAllocation}
          />
        )}
      </div>
    </div>
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
        'tap-effect h-10 px-5 rounded-full text-sm font-semibold transition-colors',
        active
          ? 'bg-brand text-brand-foreground hover:opacity-90'
          : 'bg-transparent text-foreground hover:bg-foreground/5',
      )}
    >
      {children}
    </button>
  );
}
