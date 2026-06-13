import { cn } from '@energyiq/shared';
import type {
  ApprovalWorkflowOption,
  NewProductDraft,
  VisibilityOption,
} from '@/ui/pages/product/mocks';

interface StepDistributorAccessProps {
  draft: NewProductDraft;
  onChange: (patch: Partial<NewProductDraft>) => void;
}

interface OptionDef<T extends string> {
  value: T;
  title: string;
  description: string;
  /** Gold count pill (e.g. "128 Distributors") shown on the All Distributors card. */
  countPill?: string;
  /** Outlined action button (e.g. "Select Tier") shown on the tier/selected cards. */
  actionLabel?: string;
}

const VISIBILITY_OPTIONS: OptionDef<VisibilityOption>[] = [
  {
    value: 'all',
    title: 'All Distributors',
    description:
      'Make this product visible to your entire distributor network. All current and future distributors will be able to see and order this product.',
    countPill: '128 Distributors',
  },
  {
    value: 'tier',
    title: 'Tier-Based Access',
    description:
      'Limit visibility to distributors based on their tier level (Bronze, Silver, Gold). Useful for exclusive products or tiered pricing strategies.',
    actionLabel: 'Select Tier',
  },
  {
    value: 'selected',
    title: 'Selected Distributors',
    description:
      'Hand-pick the exact distributors who can see and order this product. Best for pilots, regional exclusives, or strategic accounts.',
    actionLabel: 'Manual Selection',
  },
];

const WORKFLOW_OPTIONS: OptionDef<ApprovalWorkflowOption>[] = [
  {
    value: 'auto',
    title: 'Auto-Approve',
    description: 'Distributors gain immediate access to the product. No manual review required.',
  },
  {
    value: 'manual',
    title: 'Manual Approval',
    description: 'Each distributor request must be reviewed and approved by your team.',
  },
  {
    value: 'scheduled',
    title: 'Scheduled Activation',
    description: 'Product becomes available to distributors on a specific future date.',
  },
];

export function StepDistributorAccess({ draft, onChange }: StepDistributorAccessProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="border border-border-subtle rounded-[28px] p-7 flex flex-col gap-5">
        <h2 className="text-base font-semibold text-foreground">Distributor Access &amp; Visibility</h2>
        <div className="flex flex-col gap-3">
          {VISIBILITY_OPTIONS.map((opt) => (
            <RadioCard
              key={opt.value}
              option={opt}
              selected={draft.visibility === opt.value}
              onSelect={() => onChange({ visibility: opt.value })}
            />
          ))}
        </div>
      </div>

      <div className="border border-border-subtle rounded-[28px] p-7 flex flex-col gap-5">
        <h2 className="text-base font-semibold text-foreground">Approval Workflow</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {WORKFLOW_OPTIONS.map((opt) => (
            <RadioCard
              key={opt.value}
              option={opt}
              selected={draft.approvalWorkflow === opt.value}
              onSelect={() => onChange({ approvalWorkflow: opt.value })}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface RadioCardProps<T extends string> {
  option: OptionDef<T>;
  selected: boolean;
  onSelect: () => void;
}

function RadioCard<T extends string>({ option, selected, onSelect }: RadioCardProps<T>) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        'text-left rounded-[20px] p-5 border transition-colors flex flex-col gap-2',
        selected ? 'border-brand bg-brand/5' : 'border-border-subtle bg-surface-card hover:bg-foreground/5',
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            'mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0',
            selected ? 'border-brand' : 'border-muted-foreground',
          )}
        >
          {selected && <span className="w-2.5 h-2.5 rounded-full bg-brand" />}
        </span>
        <div className="flex flex-col gap-2 flex-1">
          <p className="text-sm font-semibold text-foreground">{option.title}</p>
          <p className="text-xs text-foreground/80">{option.description}</p>
          {option.countPill && (
            <span className="self-start rounded-full px-3 py-1 text-xs font-semibold bg-brand text-brand-foreground">
              {option.countPill}
            </span>
          )}
          {option.actionLabel && (
            <span
              className={cn(
                'self-start rounded-full border px-4 py-1.5 text-xs font-semibold',
                selected ? 'border-brand text-brand' : 'border-border-strong text-foreground',
              )}
            >
              {option.actionLabel}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
