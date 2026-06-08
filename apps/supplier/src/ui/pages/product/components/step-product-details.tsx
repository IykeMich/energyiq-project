import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { cn } from '@energyiq/shared';
import {
  CATEGORY_OPTIONS,
  CURRENCY_OPTIONS,
  PACKAGING_OPTIONS,
  PRICE_TYPE_OPTIONS,
  PRICING_TIER_OPTIONS,
  STORAGE_LOCATION_OPTIONS,
  TAX_OPTIONS,
  TYPE_OPTIONS,
  UNIT_OPTIONS,
  WAREHOUSE_OPTIONS,
  type NewProductDraft,
  type WarehouseAllocationDraft,
} from '../mocks';
import { Field, SelectField, TextAreaField, TextField } from './wizard-fields';

type Tab = 'basic' | 'pricing' | 'warehouse';

interface StepProductDetailsProps {
  draft: NewProductDraft;
  onChange: (patch: Partial<NewProductDraft>) => void;
}

export function StepProductDetails({ draft, onChange }: StepProductDetailsProps) {
  const [tab, setTab] = useState<Tab>('basic');

  const updateAllocation = (id: string, patch: Partial<WarehouseAllocationDraft>) =>
    onChange({
      warehouseAllocations: draft.warehouseAllocations.map((a) =>
        a.id === id ? { ...a, ...patch } : a,
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
      warehouseAllocations: draft.warehouseAllocations.filter((a) => a.id !== id),
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
        {tab === 'basic' && <BasicInfoTab draft={draft} onChange={onChange} />}
        {tab === 'pricing' && <PricingTab draft={draft} onChange={onChange} />}
        {tab === 'warehouse' && (
          <WarehouseAllocationTab
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
        'h-10 px-5 rounded-full text-sm font-semibold transition-colors',
        active
          ? 'bg-brand text-brand-foreground'
          : 'bg-transparent text-foreground hover:bg-foreground/5',
      )}
    >
      {children}
    </button>
  );
}

function BasicInfoTab({
  draft,
  onChange,
}: {
  draft: NewProductDraft;
  onChange: (patch: Partial<NewProductDraft>) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <Field label="Product Name:" required>
        <TextField value={draft.name} onChange={(v) => onChange({ name: v })} placeholder="e.g. Diesel" />
      </Field>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Product Category:" required>
          <SelectField
            value={draft.category}
            onChange={(v) => onChange({ category: v })}
            placeholder="Select category"
            options={CATEGORY_OPTIONS}
          />
        </Field>
        <Field label="Product Type:">
          <SelectField
            value={draft.type}
            onChange={(v) => onChange({ type: v })}
            placeholder="Select type"
            options={TYPE_OPTIONS}
          />
        </Field>
        <Field label="Measuring Unit:" required>
          <SelectField
            value={draft.measuringUnit}
            onChange={(v) => onChange({ measuringUnit: v })}
            placeholder="Select unit"
            options={UNIT_OPTIONS}
          />
        </Field>
        <Field label="Packaging Type:">
          <SelectField
            value={draft.packagingType}
            onChange={(v) => onChange({ packagingType: v })}
            placeholder="Select packaging"
            options={PACKAGING_OPTIONS}
          />
        </Field>
      </div>
      <div className="border-t border-border-subtle pt-5">
        <Field label="Product Description:">
          <TextAreaField
            value={draft.description}
            onChange={(v) => onChange({ description: v })}
            placeholder="Add Description...."
          />
        </Field>
      </div>
    </div>
  );
}

function PricingTab({
  draft,
  onChange,
}: {
  draft: NewProductDraft;
  onChange: (patch: Partial<NewProductDraft>) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Field label="Price Type:">
        <SelectField
          value={draft.priceType}
          onChange={(v) => onChange({ priceType: v })}
          placeholder="Select pricing model"
          options={PRICE_TYPE_OPTIONS}
        />
      </Field>
      <Field label="Selling Price:" required>
        <TextField
          type="number"
          value={draft.sellingPrice}
          onChange={(v) => onChange({ sellingPrice: v })}
          placeholder="0.00"
        />
      </Field>
      <Field label="Currency:">
        <SelectField
          value={draft.currency}
          onChange={(v) => onChange({ currency: v })}
          placeholder="Select currency"
          options={CURRENCY_OPTIONS}
        />
      </Field>
      <Field label="Pricing Tier:">
        <SelectField
          value={draft.pricingTier}
          onChange={(v) => onChange({ pricingTier: v })}
          placeholder="Select tier"
          options={PRICING_TIER_OPTIONS}
        />
      </Field>
      <Field label="Tax Configuration:" className="md:col-span-2">
        <SelectField
          value={draft.taxConfiguration}
          onChange={(v) => onChange({ taxConfiguration: v })}
          placeholder="Select tax setting"
          options={TAX_OPTIONS}
        />
      </Field>
    </div>
  );
}

interface WarehouseAllocationTabProps {
  draft: NewProductDraft;
  onChange: (id: string, patch: Partial<WarehouseAllocationDraft>) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
}

function WarehouseAllocationTab({ draft, onChange, onAdd, onRemove }: WarehouseAllocationTabProps) {
  const warehouseOptions = WAREHOUSE_OPTIONS.map((w) => w.name);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-foreground">Configure initial stock quantities for each warehouse.</p>
        <button
          type="button"
          onClick={onAdd}
          className="text-sm font-semibold text-brand"
        >
          + Add Warehouse
        </button>
      </div>

      {draft.warehouseAllocations.map((alloc, idx) => {
        const wh = WAREHOUSE_OPTIONS.find((w) => w.name === alloc.warehouseLocation);
        const canRemove = draft.warehouseAllocations.length > 1;
        return (
          <div key={alloc.id} className="bg-surface-card border border-border-subtle rounded-[24px] p-5 flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <span className="text-xs font-semibold text-brand">{idx + 1}.</span>
              {canRemove && (
                <button
                  type="button"
                  onClick={() => onRemove(alloc.id)}
                  aria-label="Remove warehouse allocation"
                  className="w-7 h-7 rounded-full bg-brand/20 text-brand flex items-center justify-center"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <Field label="Warehouse Location:" required>
              <SelectField
                value={alloc.warehouseLocation}
                onChange={(v) => onChange(alloc.id, { warehouseLocation: v })}
                placeholder="Select warehouse"
                options={warehouseOptions}
              />
            </Field>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Allocated Quantity:">
                <TextField
                  value={alloc.allocatedQuantity}
                  onChange={(v) => onChange(alloc.id, { allocatedQuantity: v })}
                  placeholder="e.g. 30,000L"
                />
              </Field>
              <Field label="Storage Location:">
                <SelectField
                  value={alloc.storageLocation}
                  onChange={(v) => onChange(alloc.id, { storageLocation: v })}
                  placeholder="Select storage"
                  options={STORAGE_LOCATION_OPTIONS}
                />
              </Field>
            </div>
            {wh && (
              <p className="text-xs text-foreground text-right">
                Available Stock: <span className="text-brand font-semibold">{wh.availableStockL.toLocaleString()}L</span>
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
