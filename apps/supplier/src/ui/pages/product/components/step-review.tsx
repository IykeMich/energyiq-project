import { CheckCircle2 } from 'lucide-react';
import { cn } from '@energyiq/shared';
import type { AutomationOption, NewProductDraft } from '../mocks';

interface StepReviewProps {
  draft: NewProductDraft;
  onChange: (patch: Partial<NewProductDraft>) => void;
}

interface AutomationDef {
  value: AutomationOption;
  title: string;
  description: string;
}

const AUTOMATION_OPTIONS: AutomationDef[] = [
  {
    value: 'publish-now',
    title: 'Publish Immediately',
    description: 'Distributors gain immediate access. No manual review required.',
  },
  {
    value: 'schedule',
    title: 'Schedule Activation',
    description: 'Product becomes available to distributors on a specific future date.',
  },
  {
    value: 'save-draft',
    title: 'Save as Draft',
    description: 'Keep this product hidden from distributors while you finish editing.',
  },
  {
    value: 'submit-review',
    title: 'Submit for Review',
    description: 'Send the product to a teammate for approval before publishing.',
  },
];

export function StepReview({ draft, onChange }: StepReviewProps) {
  const productChecks = [
    { label: 'All mandatory fields completed', ok: !!(draft.name && draft.category && draft.measuringUnit) },
    { label: 'Pricing validated against market rates', ok: !!draft.sellingPrice },
    { label: 'Inventory levels sufficient for SLAs', ok: draft.warehouseAllocations.some((w) => !!w.allocatedQuantity) },
    { label: 'Distributor access configured', ok: !!draft.visibility },
    { label: 'Quality specifications defined', ok: true },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="border border-border-subtle rounded-[28px] p-7 flex flex-col gap-5">
        <div>
          <h2 className="text-base font-semibold text-foreground">Review and Activation</h2>
          <p className="text-sm text-foreground/70 mt-1">
            Confirm the details below before publishing. You can still go back to edit.
          </p>
        </div>

        <div className="bg-brand text-brand-foreground rounded-[20px] p-5 flex flex-col gap-1">
          <p className="text-sm font-semibold">Product Snapshot</p>
          <p className="text-base font-bold">{draft.name || 'Untitled product'}</p>
          <p className="text-xs">
            {(draft.category || '—')} · {(draft.measuringUnit || '—')} ·{' '}
            {(draft.packagingType || '—')}
          </p>
        </div>

        <SummarySection title="Review Checklist">
          <ul className="flex flex-col gap-2.5">
            {productChecks.map((c) => (
              <li key={c.label} className="flex items-center gap-3 text-sm">
                <CheckCircle2
                  className={cn('w-4 h-4', c.ok ? 'text-success' : 'text-muted-foreground')}
                />
                <span className={cn(c.ok ? 'text-foreground' : 'text-muted-foreground')}>
                  {c.label}
                </span>
              </li>
            ))}
          </ul>
        </SummarySection>

        <SummarySection title="Product Summary">
          <SummaryRow label="Product Name" value={draft.name || '—'} />
          <SummaryRow label="Category" value={draft.category || '—'} />
          <SummaryRow label="Measurement Unit" value={draft.measuringUnit || '—'} />
          <SummaryRow label="Packaging Type" value={draft.packagingType || '—'} />
        </SummarySection>

        <SummarySection title="Pricing Summary">
          <SummaryRow label="Price Type" value={draft.priceType || '—'} />
          <SummaryRow label="Selling Price" value={draft.sellingPrice ? `${draft.currency} ${Number(draft.sellingPrice).toLocaleString()}` : '—'} />
          <SummaryRow label="Pricing Tier" value={draft.pricingTier || '—'} />
          <SummaryRow label="Tax Configuration" value={draft.taxConfiguration || '—'} />
        </SummarySection>

        <SummarySection title="Warehouse Summary">
          {draft.warehouseAllocations
            .filter((a) => a.warehouseLocation)
            .map((a) => (
              <SummaryRow
                key={a.id}
                label={a.warehouseLocation}
                value={`${a.allocatedQuantity || '—'} · ${a.storageLocation || '—'}`}
              />
            ))}
          {!draft.warehouseAllocations.some((a) => a.warehouseLocation) && (
            <p className="text-sm text-muted-foreground">No warehouses assigned yet.</p>
          )}
        </SummarySection>

        <SummarySection title="Distribution Summary">
          <SummaryRow
            label="Visibility"
            value={
              draft.visibility === 'all'
                ? 'All Distributors'
                : draft.visibility === 'tier'
                ? 'Tier-Based Access'
                : 'Selected Distributors'
            }
          />
          <SummaryRow
            label="Approval Workflow"
            value={
              draft.approvalWorkflow === 'auto'
                ? 'Auto-Approve'
                : draft.approvalWorkflow === 'manual'
                ? 'Manual Approval'
                : 'Scheduled Activation'
            }
          />
        </SummarySection>
      </div>

      <div className="border border-border-subtle rounded-[28px] p-7 flex flex-col gap-4">
        <h2 className="text-base font-semibold text-foreground">Automation Options</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {AUTOMATION_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange({ automationOption: opt.value })}
              className={cn(
                'text-left rounded-[16px] border p-4 flex flex-col gap-1.5 transition-colors',
                draft.automationOption === opt.value
                  ? 'border-brand bg-brand/5'
                  : 'border-border-subtle bg-surface-card hover:bg-foreground/5',
              )}
            >
              <p className="text-sm font-semibold text-foreground">{opt.title}</p>
              <p className="text-xs text-foreground/80">{opt.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function SummarySection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm text-foreground">
      <span>{label}</span>
      <span className="font-semibold text-right">{value}</span>
    </div>
  );
}
