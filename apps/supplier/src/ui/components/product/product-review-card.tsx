import { useState } from 'react';
import { AlertCircle, Pencil, X } from 'lucide-react';
import { cn } from '@energyiq/shared';
import { SuccessModal } from '@energyiq/ui';
import type { ProductBasicInfoDraft } from './product-basic-info-card';
import type { ProductPricingDraft } from './product-pricing-card';
import type { ProductInventoryDraft } from './product-inventory-card';
import type { ProductComplianceDraft } from './product-compliance-card';
import type { ProductTradingRulesDraft } from './product-trading-rules-card';
import type { ProductAccessControlDraft } from './product-access-control-card';
import { FormActionButton } from './wizard-fields';

// The app sidebar reserves real horizontal space (`--sidebar-width: 16rem`), so a modal
// centered on the raw viewport reads as shifted left of the actual content area. Nudge
// right by half that width on desktop, where the sidebar is actually visible/reserved.
const MODAL_CENTERING_CLASSNAME = 'md:left-[calc(50%+8rem)]';

interface ProductReviewCardProps {
  basicInfo: ProductBasicInfoDraft;
  pricing: ProductPricingDraft;
  inventory: ProductInventoryDraft;
  compliance: ProductComplianceDraft;
  tradingRules: ProductTradingRulesDraft;
  accessControl: ProductAccessControlDraft;
  onEditStep: (step: number) => void;
  onCancel: () => void;
  /** Called once the user dismisses the (simulated) success modal, to leave the wizard. */
  onSubmitted: () => void;
}

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

function ReviewField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-brand" />
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <p className="text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}

function ReviewSection({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#6161611A] border border-[#616161B2] rounded-[7px] overflow-hidden">
      <div className="flex items-center justify-between bg-[#6161611A] border-b border-[#616161B2] px-4 py-3">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <button
          type="button"
          onClick={onEdit}
          className="tap-effect flex items-center gap-1 text-sm font-medium text-brand hover:opacity-80"
        >
          Edit
          <Pencil className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-4 p-4">{children}</div>
    </div>
  );
}

/** Right-panel "Review and Activation" card for step 7 of the "Add New Product" wizard — reads every prior step's draft. */
export function ProductReviewCard({
  basicInfo,
  pricing,
  inventory,
  compliance,
  tradingRules,
  accessControl,
  onEditStep,
  onCancel,
  onSubmitted,
}: ProductReviewCardProps) {
  const [submitState, setSubmitState] = useState<SubmitState>('idle');

  const totalInventoryQuantity = inventory.allocations.reduce((sum, allocation) => sum + (Number(allocation.quantity) || 0), 0);

  // TODO(orval): replace with the real "submit product for authorization" mutation once it exists.
  // Simulated outcome (weighted toward success) so the success/error modal flow can be demoed end-to-end.
  const handleSubmit = () => {
    setSubmitState('submitting');
    setTimeout(() => {
      setSubmitState(Math.random() < 0.85 ? 'success' : 'error');
    }, 900);
  };

  return (
    <div className="bg-[#6161611A] border border-[#616161B2] rounded-[48px] p-7 flex flex-1 min-w-0 flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <h2 className="text-lg font-medium text-foreground">Review and Activation</h2>
        <p className="text-base text-foreground/80">Check everything over, then publish or save this listing as a draft.</p>
      </div>

      <div className="flex flex-col gap-4 border-t border-[#616161B2] pt-5">
        <ReviewSection title="Basic Information" onEdit={() => onEditStep(1)}>
          <ReviewField label="Product Name:" value={basicInfo.name || '—'} />
          <ReviewField label="SKU Code:" value={basicInfo.sku || '—'} />
          <ReviewField label="Category:" value={basicInfo.category || '—'} />
          <ReviewField label="Measurement Unit:" value={basicInfo.measuringUnit || '—'} />
          <ReviewField label="Product Description:" value={basicInfo.description || '—'} />
        </ReviewSection>

        <ReviewSection title="Pricing" onEdit={() => onEditStep(2)}>
          <ReviewField label="Base Price:" value={pricing.basePrice ? `₦${pricing.basePrice}` : '—'} />
          <ReviewField label="Currency:" value={pricing.currency || '—'} />
          <ReviewField label="Pricing Tiers:" value="3 Tiers" />
          <ReviewField label="Promotional Pricing:" value={pricing.promoEnabled ? 'Enabled' : 'Disabled'} />
        </ReviewSection>

        <ReviewSection title="Inventory" onEdit={() => onEditStep(3)}>
          <ReviewField label="Warehouse Location:" value={inventory.allocations[0]?.warehouseLabel || '—'} />
          <ReviewField label="Storage Location:" value={inventory.allocations[0]?.storageLocation || '—'} />
          <ReviewField label="Quantity to add:" value={totalInventoryQuantity > 0 ? `${totalInventoryQuantity.toLocaleString()}L` : '—'} />
        </ReviewSection>

        <ReviewSection title="Compliance" onEdit={() => onEditStep(4)}>
          <ReviewField label="Certifications:" value={compliance.certifications.join(', ') || '—'} />
          <ReviewField label="Expiry Date:" value={compliance.expiryDate || '—'} />
        </ReviewSection>

        <ReviewSection title="Trading Rules" onEdit={() => onEditStep(5)}>
          <ReviewField label="Minimum Order Quantity (MOQ):" value={tradingRules.moq ? `${tradingRules.moq}L` : '—'} />
          <ReviewField label="Maximum Order Quantity:" value={tradingRules.maxOrderQuantity ? `${tradingRules.maxOrderQuantity}L` : '—'} />
          <ReviewField label="Credit Terms:" value={tradingRules.creditTerms || '—'} />
          <ReviewField label="Return Allowed:" value={tradingRules.returnsAllowed ? 'Yes' : 'No'} />
          <ReviewField label="Return Window:" value={tradingRules.returnWindowDays ? `${tradingRules.returnWindowDays} Days` : '—'} />
          <ReviewField label="Restocking Fee:" value={tradingRules.restockingFeePercent ? `${tradingRules.restockingFeePercent}%` : '-'} />
          <ReviewField label="Instructions:" value={tradingRules.returnInstructions || '-'} />
        </ReviewSection>

        <ReviewSection title="Access Rules" onEdit={() => onEditStep(6)}>
          <ReviewField label="Tiers selected:" value={accessControl.visibleTiers.join(', ') || '—'} />
          <ReviewField label="Regions selected:" value={accessControl.geographicAvailability.length > 0 ? `${accessControl.geographicAvailability.length} Regions` : '—'} />
        </ReviewSection>
      </div>

      <div className="rounded-lg bg-[#FB8C1C33] px-4 py-3.5 flex items-center gap-3">
        <AlertCircle className="h-5 w-5 shrink-0 text-[#FB8C1C]" />
        <p className="text-xs font-semibold text-[#FB8C1C]">
          Submitting sends this product to the authorization queue for review — it won't be visible to distributors until
          approved.
        </p>
      </div>

      <div className="flex justify-end gap-4 border-t border-[#616161B2] pt-5">
        <FormActionButton variant="cancel" onClick={onCancel}>
          Cancel
        </FormActionButton>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitState === 'submitting'}
          className={cn(
            'tap-effect h-10.5 rounded-[28px] bg-brand px-8 font-semibold text-[#121212] hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed',
          )}
        >
          {submitState === 'submitting' ? 'Submitting...' : 'Submit for Authorization'}
        </button>
      </div>

      <SuccessModal
        open={submitState === 'success'}
        onOpenChange={(open) => !open && setSubmitState('idle')}
        tone="success"
        title="Product submitted for review"
        subtitle="Your product has been sent to the authorization queue. You'll be notified once it's approved and visible to distributors."
        primaryAction={{ label: 'Back to Products', onClick: onSubmitted }}
        className={MODAL_CENTERING_CLASSNAME}
      />

      <SuccessModal
        open={submitState === 'error'}
        onOpenChange={(open) => !open && setSubmitState('idle')}
        tone="danger"
        icon={X}
        title="Submission failed"
        subtitle="Something went wrong while submitting this product for review. Please try again."
        primaryAction={{ label: 'Try Again', onClick: handleSubmit }}
        secondaryAction={{ label: 'Cancel', onClick: onCancel }}
        className={MODAL_CENTERING_CLASSNAME}
      />
    </div>
  );
}
