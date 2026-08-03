import type { ReactNode } from 'react';
import { cn } from '@energyiq/shared';
import {
  type NewProductDraft,
  type ProductDraftErrors,
  type WarehouseAllocationDraft,
} from '@/ui/pages/product/mocks';
import { ProductBasicInfoTab } from './product-basic-info-tab';
import { ProductPricingTab } from './product-pricing-tab';
import { ProductWarehouseTab } from './product-warehouse-tab';

export type ProductDetailsTab = 'basic' | 'pricing' | 'warehouse';

interface StepProductDetailsProps {
  draft: NewProductDraft;
  onChange: (patch: Partial<NewProductDraft>) => void;
  errors?: ProductDraftErrors;
  tab: ProductDetailsTab;
  onTabChange: (tab: ProductDetailsTab) => void;
  /** Nav buttons (Cancel/Next etc.) rendered inside this card, below the tab content. */
  footer?: ReactNode;
}

export function StepProductDetails({ draft, onChange, errors, tab, onTabChange, footer }: StepProductDetailsProps) {
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
          warehouseId: '',
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
    <div className="bg-[#6161611A] border border-[#616161B2] rounded-[28px] p-7 flex flex-col gap-6">
      <h2 className="text-base font-semibold text-foreground">Product Details</h2>

      <div className="flex items-center gap-2 flex-wrap">
        <TabButton active={tab === 'basic'} onClick={() => onTabChange('basic')}>
          Basic Information
        </TabButton>
        <TabButton active={tab === 'pricing'} onClick={() => onTabChange('pricing')}>
          Pricing
        </TabButton>
        <TabButton active={tab === 'warehouse'} onClick={() => onTabChange('warehouse')}>
          Inventory/Trading
        </TabButton>
      </div>

      <div className="border-t border-border-subtle pt-6">
        {tab === 'basic' && <ProductBasicInfoTab draft={draft} onChange={onChange} errors={errors} />}
        {tab === 'pricing' && <ProductPricingTab draft={draft} onChange={onChange} errors={errors} />}
        {tab === 'warehouse' && (
          <ProductWarehouseTab
            draft={draft}
            onChange={updateAllocation}
            onAdd={addAllocation}
            onRemove={removeAllocation}
            errors={errors}
          />
        )}
      </div>

      {footer}
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
        'tap-effect h-10 px-5 rounded-[14px] text-sm font-semibold transition-colors',
        active
          ? 'bg-[#FBC02D33] text-[#FBC02D] hover:opacity-90'
          : 'bg-transparent text-foreground hover:bg-foreground/5',
      )}
    >
      {children}
    </button>
  );
}
