import { Check } from 'lucide-react';
import { cn } from '@energyiq/shared';
import {
  buildReviewSummary,
  type AutomationOption,
  type NewProductDraft,
  type ReviewChecklistItem,
  type ReviewRow,
} from '@/ui/pages/product/mocks';

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
    description: 'Make the product live to distributors right away. They can start placing orders immediately.',
  },
  {
    value: 'schedule',
    title: 'Schedule Activation',
    description: 'Set a future date and time when the product becomes available to distributors.',
  },
  {
    value: 'save-draft',
    title: 'Save as Draft',
    description: 'Save the product configuration without publishing. You can activate it later.',
  },
  {
    value: 'submit-review',
    title: 'Submit for Review',
    description: 'Send the product to your compliance team for final approval before activation.',
  },
];

export function StepReview({ draft, onChange }: StepReviewProps) {
  const summary = buildReviewSummary(draft);

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-base font-semibold text-foreground">Review and Activation</h2>

      {/* Product snapshot */}
      <div className="bg-brand text-brand-foreground rounded-[20px] p-6 flex flex-col gap-1.5">
        <p className="text-lg font-bold">{summary.snapshot.name}</p>
        <p className="text-sm">Product Code: {summary.snapshot.productCode}</p>
        <p className="text-sm">Category: {summary.snapshot.category}</p>
        <p className="text-sm">Unit: {summary.snapshot.unit}</p>
        <p className="text-sm">Currently Creating: {summary.snapshot.creating}.</p>
      </div>

      {/* Review checklist */}
      <div className="border border-border-subtle rounded-[28px] p-7 flex flex-col gap-5">
        <h3 className="text-base font-semibold text-foreground">Review Checklist</h3>
        <ul className="flex flex-col gap-4">
          {summary.checklist.map((item) => (
            <ChecklistRow key={item.label} item={item} />
          ))}
        </ul>
      </div>

      {/* Summary sections */}
      <div className="border border-border-subtle rounded-[28px] p-7 flex flex-col">
        <SummarySection title="Product Summary" rows={summary.product} />
        <Divider />
        <SummarySection title="Pricing Summary" rows={summary.pricing} />
        <Divider />
        <SummarySection title="Warehouse Summary" rows={summary.warehouse} />
        <Divider />
        <SummarySection title="Distribution Summary" rows={summary.distribution} />
      </div>

      {/* Activation options */}
      <div className="border border-border-subtle rounded-[28px] p-7 flex flex-col gap-4">
        <h3 className="text-base font-semibold text-foreground">Activation Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {AUTOMATION_OPTIONS.map((option) => (
            <ActivationCard
              key={option.value}
              option={option}
              selected={draft.automationOption === option.value}
              onSelect={() => onChange({ automationOption: option.value })}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ChecklistRow({ item }: { item: ReviewChecklistItem }) {
  return (
    <li className="flex items-start justify-between gap-3">
      <div className="flex items-start gap-2">
        <Asterisk />
        <div className="flex flex-col gap-0.5">
          <span className="text-sm text-foreground">{item.label}</span>
          {item.description && (
            <span className="text-xs text-muted-foreground">{item.description}</span>
          )}
        </div>
      </div>
      <span
        className={cn(
          'w-[22px] h-[22px] rounded-md flex items-center justify-center shrink-0',
          item.ok ? 'bg-success text-success-foreground' : 'bg-foreground/10 text-muted-foreground',
        )}
      >
        <Check className="w-3.5 h-3.5" strokeWidth={3} />
      </span>
    </li>
  );
}

function SummarySection({ title, rows }: { title: string; rows: ReviewRow[] }) {
  return (
    <div className="flex flex-col gap-3 py-5 first:pt-0 last:pb-0">
      <h4 className="text-base font-semibold text-foreground">{title}</h4>
      <div className="flex flex-col gap-3">
        {rows.map((row) => (
          <div key={row.label} className="flex items-start justify-between gap-4 text-sm">
            <span className="flex items-start gap-2 text-foreground">
              <Asterisk />
              {row.label}:
            </span>
            <span className="font-semibold text-foreground text-right">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActivationCard({
  option,
  selected,
  onSelect,
}: {
  option: AutomationDef;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        'tap-effect text-left rounded-[16px] border p-4 flex items-start gap-3 transition-colors',
        selected ? 'border-brand bg-brand/5' : 'border-border-subtle bg-surface-card hover:bg-foreground/5',
      )}
    >
      <span
        className={cn(
          'mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0',
          selected ? 'border-brand' : 'border-muted-foreground',
        )}
      >
        {selected && <span className="w-2.5 h-2.5 rounded-full bg-brand" />}
      </span>
      <div className="flex flex-col gap-1.5">
        <p className="text-sm font-semibold text-foreground">{option.title}</p>
        <p className="text-xs text-foreground/80">{option.description}</p>
      </div>
    </button>
  );
}

/** Small gold required-style marker shown before checklist and summary labels. */
function Asterisk() {
  return <span className="text-brand text-xs leading-none mt-0.5 shrink-0">✱</span>;
}

function Divider() {
  return <div className="border-t border-dashed border-border-subtle" />;
}
