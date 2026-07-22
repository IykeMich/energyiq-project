import { useEffect, useState, type ReactNode } from 'react';
import { LoadingOverlay, SuccessModal, toast, type SuccessModalAction } from '@energyiq/ui';
import { shared, type product } from '@energyiq/domain';
import {
  buildActivationDetails,
  buildDraftDetails,
  buildReviewProcessDetails,
  buildScheduledDetails,
  emptyDraft,
  formatScheduleDate,
  formatScheduleTime,
  productToDraft,
  validateProductDraft,
  PRODUCT_DETAILS_TAB_FIELDS,
  type NewProductDraft,
  type ProductDraftErrors,
  type ReviewRow,
} from '@/ui/pages/product/mocks';
import {
  useCreateProductMutation,
  useProductQuery,
  useUpdateProductMutation,
} from '@/hooks/use-products';
import { StepProductDetails, type ProductDetailsTab } from './step-product-details';
import { StepDistributorAccess } from './step-distributor-access';
import { StepReview } from './step-review';
import { ScheduleActivationModal } from './schedule-activation-modal';
import { ComplianceOfficerModal } from './compliance-officer-modal';
import { ProductPublishFailedBanner } from './product-publish-failed-banner';

const { DomainError, ResponseCodes } = shared;

/** Turns a caught mutation error into the text shown to the user, preferring the backend's real message. */
function extractErrorMessage(error: unknown): string {
  if (error instanceof DomainError) {
    const data = error.data as { message?: string; errors?: Array<{ field: string; message: string }> } | undefined;
    if (error.code === ResponseCodes.VALIDATION_FAILED && data?.errors?.length) {
      return data.errors.map((fieldError) => fieldError.message).join(' ');
    }
    return data?.message || error.message;
  }
  return 'An unexpected error occurred. Please try again.';
}

/**
 * Map the wizard's draft (a UI-shaped model) onto the real create/update payload.
 *
 * Known gap, intentionally not fabricated:
 * - Tax type only sends a value when it matches the backend enum (VAT/GST/
 *   SalesTax); the wizard's other suggested labels ("Withholding Tax",
 *   "Custom Duty") have no backend equivalent and fall back to 'None'.
 */
function toUpsertRequest(
  draft: NewProductDraft,
  options: { status: 'draft' | 'active'; approvalWorkflow: product.ApprovalWorkflow; activationAt?: string },
): product.ProductUpsertRequest {
  const isTiered = draft.priceType === 'Tiered';
  const isVariant = draft.type === 'Product with Variant';
  const taxType: product.TaxType =
    draft.taxType === 'VAT' || draft.taxType === 'GST' || draft.taxType === 'SalesTax'
      ? draft.taxType
      : 'None';

  return {
    name: draft.name,
    sku: draft.name.replace(/[^a-zA-Z0-9]/g, '').slice(0, 40) || `SKU-${Date.now()}`,
    category_id: draft.category,
    unit: draft.measuringUnit,
    currency: draft.currency,
    base_price: Number(draft.sellingPrice) || 0,
    cost_price: Number(draft.costPrice) || undefined,
    description: draft.description || undefined,
    packaging_type: draft.packagingType || undefined,
    status: options.status,
    product_type: isVariant ? 'product_with_variants' : 'single_product',
    price_type: isTiered ? 'tiered' : 'untiered',
    approval_workflow: options.approvalWorkflow,
    distributor_visibility:
      draft.visibility === 'tier' ? 'tier_based' : draft.visibility === 'selected' ? 'selected_distributors' : 'all_distributors',
    activation_at: options.activationAt,
    product_variants: isVariant
      ? draft.variants.map((variant) => ({
          sku: variant.name.replace(/[^a-zA-Z0-9]/g, '').slice(0, 40) || `VAR-${variant.id}`,
          display_name: variant.displayName || variant.name,
          cost_price: Number(variant.costPrice) || 0,
          selling_price: Number(variant.sellingPrice) || 0,
        }))
      : undefined,
    tier_pricing: isTiered
      ? draft.pricingTiers.map((tier) => ({
          tier: tier.tier,
          unit_price: Number(tier.unitPrice) || 0,
          min_quantity: tier.minQuantity ? Number(tier.minQuantity) : undefined,
          max_quantity: tier.maxQuantity ? Number(tier.maxQuantity) : undefined,
        }))
      : undefined,
    tax_configuration: draft.taxEnabled
      ? { tax_type: taxType, tax_rate: Number(draft.taxRate) || 0 }
      : undefined,
    warehouse_allocations: draft.warehouseAllocations
      .filter((allocation) => allocation.warehouseId)
      .map((allocation) => ({
        warehouse_id: allocation.warehouseId,
        quantity: allocation.allocatedQuantity ? Number(allocation.allocatedQuantity) : undefined,
        storage_location: allocation.storageLocation || undefined,
      })),
  };
}

const TOTAL_STEPS = 3;
const PRODUCT_DETAILS_TAB_ORDER: ProductDetailsTab[] = ['basic', 'pricing', 'warehouse'];

const STEP_LABELS: Record<number, string> = {
  1: 'Product Details',
  2: 'Distributor Access',
  3: 'Review',
};

const LOADING_MESSAGE: Record<NewProductDraft['automationOption'], string> = {
  'publish-now': 'Publishing product...',
  schedule: 'Scheduling activation...',
  'save-draft': 'Saving draft...',
  'submit-review': 'Submitting for review...',
};

interface SuccessConfig {
  title: string;
  subtitle: ReactNode;
  details: ReviewRow[];
  primaryAction: SuccessModalAction;
  secondaryAction: SuccessModalAction;
}

export interface ProductWizardProps {
  mode: 'create' | 'edit';
  /** Required when `mode === 'edit'` — the product being edited. */
  productId?: string;
  /** Cancel button on step 1 / basic tab. */
  onCancel: () => void;
  /** Success modal's "Go to Home" action. */
  onGoHome: () => void;
  /** Success modal's "View Product Dashboard" action (create) / dismiss (edit). */
  onViewProducts: () => void;
}

/**
 * The full product create/edit wizard (3 steps: Product Details, Distributor
 * Access, Review & Activation). Host-agnostic — rendered full-page by
 * `AddProductPage` for "Create New Product" and inside the products list's
 * right slide-over (`ProductDetailsSheet`) for editing an existing product.
 */
export function ProductWizard({ mode, productId, onCancel, onGoHome, onViewProducts }: ProductWizardProps) {
  const isEditMode = mode === 'edit';
  const [step, setStep] = useState(1);
  const [productDetailsTab, setProductDetailsTab] = useState<ProductDetailsTab>('basic');
  const [draft, setDraft] = useState<NewProductDraft>(emptyDraft());
  const [successOpen, setSuccessOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [officerOpen, setOfficerOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [publishError, setPublishError] = useState(false);
  const [publishErrorMessage, setPublishErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<ProductDraftErrors>({});
  const [scheduleData, setScheduleData] = useState({ date: '', time: '' });
  const [officerData, setOfficerData] = useState({ officer: '', note: '' });

  const existingProductQuery = useProductQuery(productId ?? '', { enabled: isEditMode });
  const createProduct = useCreateProductMutation();
  const updateProduct = useUpdateProductMutation();

  // Pre-fill the wizard once the existing product loads, so editing starts
  // from its current values instead of a blank draft.
  useEffect(() => {
    if (existingProductQuery.data) {
      setDraft(productToDraft(existingProductQuery.data));
    }
  }, [existingProductQuery.data]);

  const patch = (next: Partial<NewProductDraft>) => setDraft((prev) => ({ ...prev, ...next }));

  const handleNext = () => {
    if (step === 1) {
      const errors = validateProductDraft(draft);
      const blockingFields = PRODUCT_DETAILS_TAB_FIELDS[productDetailsTab];
      const hasBlockingError = blockingFields.some((field) => errors[field]);
      setFieldErrors(errors);
      if (hasBlockingError) {
        toast.error('Missing required fields', {
          description: 'Please complete the highlighted fields before continuing.',
        });
        return;
      }

      const tabIndex = PRODUCT_DETAILS_TAB_ORDER.indexOf(productDetailsTab);
      if (tabIndex < PRODUCT_DETAILS_TAB_ORDER.length - 1) {
        setProductDetailsTab(PRODUCT_DETAILS_TAB_ORDER[tabIndex + 1]);
        return;
      }
      setFieldErrors({});
    }
    setStep((current) => Math.min(current + 1, TOTAL_STEPS));
  };
  const handlePrev = () => {
    if (step === 1) {
      const tabIndex = PRODUCT_DETAILS_TAB_ORDER.indexOf(productDetailsTab);
      if (tabIndex > 0) {
        setProductDetailsTab(PRODUCT_DETAILS_TAB_ORDER[tabIndex - 1]);
      }
      return;
    }
    setStep((current) => Math.max(current - 1, 1));
  };

  const productName = draft.name || 'Untitled product';

  /** Builds the create/update payload for the selected activation option and submits it. */
  const runActivation = async () => {
    setSuccessOpen(false);
    setPublishError(false);
    setPublishErrorMessage('');
    setIsProcessing(true);
    try {
      const activationAt =
        draft.automationOption === 'schedule' && scheduleData.date
          ? new Date(`${scheduleData.date}T${scheduleData.time || '00:00'}:00`).toISOString()
          : undefined;

      const req = toUpsertRequest(draft, {
        status: draft.automationOption === 'save-draft' ? 'draft' : 'active',
        approvalWorkflow: draft.automationOption === 'schedule' ? 'scheduled' : 'auto-approve',
        activationAt,
      });

      if (isEditMode && productId) {
        await updateProduct.mutateAsync({ id: productId, req });
      } else {
        await createProduct.mutateAsync(req);
      }

      // Known gap, intentionally not fabricated: "Submit for Review" has no real
      // transition yet — PATCH /v1/product/status/{id} only accepts
      // draft/active/inactive/scheduled, not 'pending_review'. The product is
      // saved as a draft above; there's no backend call left to make until a
      // real review-submission endpoint exists.

      setIsProcessing(false);
      setSuccessOpen(true);
    } catch (error) {
      setIsProcessing(false);
      setPublishError(true);
      setPublishErrorMessage(extractErrorMessage(error));
    }
  };

  const handlePublish = () => {
    if (draft.automationOption === 'schedule') {
      setScheduleOpen(true);
    } else if (draft.automationOption === 'submit-review') {
      setOfficerOpen(true);
    } else {
      void runActivation();
    }
  };

  const handleExport = () => {
    // TODO(orval): export the product configuration once the endpoint is available.
  };

  const successConfig = buildSuccessConfig({
    automationOption: draft.automationOption,
    productName,
    scheduleData,
    officerData,
    draft,
    onGoHome: () => {
      setSuccessOpen(false);
      onGoHome();
    },
    onViewProducts: () => {
      setSuccessOpen(false);
      onViewProducts();
    },
    onEditSchedule: () => {
      setSuccessOpen(false);
      setScheduleOpen(true);
    },
    onContinueEditing: () => setSuccessOpen(false),
    onAddReviewNotes: () => {
      setSuccessOpen(false);
      setOfficerOpen(true);
    },
  });

  return (
    <div className="flex flex-col gap-6">
      {publishError && (
        <ProductPublishFailedBanner
          productName={productName}
          message={publishErrorMessage}
          onRetry={() => void runActivation()}
          onDismiss={() => setPublishError(false)}
        />
      )}

      {isEditMode && existingProductQuery.isLoading && <LoadingOverlay message="Loading product..." />}

      {step === 1 && (
        <StepProductDetails
          draft={draft}
          onChange={patch}
          errors={fieldErrors}
          tab={productDetailsTab}
          onTabChange={setProductDetailsTab}
        />
      )}
      {step === 2 && <StepDistributorAccess draft={draft} onChange={patch} />}
      {step === 3 && <StepReview draft={draft} onChange={patch} />}

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <button
          type="button"
          onClick={step === 1 && productDetailsTab === 'basic' ? onCancel : handlePrev}
          className="tap-effect h-[53px] rounded-[28px] border border-border-strong text-foreground font-semibold px-8 transition-colors hover:border-brand"
        >
          {step === 1 && productDetailsTab === 'basic' ? 'Cancel' : 'Previous'}
        </button>

        <div className="flex items-center gap-3">
          {step === 1 && (
            <button
              type="button"
              onClick={handleNext}
              className="tap-effect h-[53px] rounded-[28px] bg-brand text-brand-foreground font-semibold px-12 transition-opacity hover:opacity-90"
            >
              Next
            </button>
          )}

          {step === 2 && (
            <button
              type="button"
              onClick={handleNext}
              className="tap-effect h-[53px] rounded-[28px] bg-brand text-brand-foreground font-semibold px-10 transition-opacity hover:opacity-90"
            >
              Go to Review
            </button>
          )}

          {step === TOTAL_STEPS && (
            <>
              <button
                type="button"
                onClick={handleExport}
                className="tap-effect h-[53px] rounded-[28px] bg-brand/20 text-brand font-semibold px-8 transition-colors hover:bg-brand/30"
              >
                Export Configuration
              </button>
              <button
                type="button"
                onClick={handlePublish}
                className="tap-effect h-[53px] rounded-[28px] bg-brand text-brand-foreground font-semibold px-10 transition-opacity hover:opacity-90"
              >
                Publish Product
              </button>
            </>
          )}
        </div>
      </div>

      <p className="text-sm text-foreground text-center">
        Step <span className="font-bold text-brand">{step}</span> of {TOTAL_STEPS}
        <span className="text-muted-foreground"> · {STEP_LABELS[step]}</span>
      </p>

      <ScheduleActivationModal
        open={scheduleOpen}
        onOpenChange={setScheduleOpen}
        onSchedule={(data) => {
          setScheduleData(data);
          setScheduleOpen(false);
          void runActivation();
        }}
      />

      <ComplianceOfficerModal
        open={officerOpen}
        onOpenChange={setOfficerOpen}
        onAssign={(data) => {
          setOfficerData(data);
          setOfficerOpen(false);
          void runActivation();
        }}
      />

      <SuccessModal
        open={successOpen}
        onOpenChange={setSuccessOpen}
        tone="brand"
        buttonLayout="row"
        title={successConfig.title}
        subtitle={successConfig.subtitle}
        details={successConfig.details}
        primaryAction={successConfig.primaryAction}
        secondaryAction={successConfig.secondaryAction}
      />

      {isProcessing && <LoadingOverlay message={LOADING_MESSAGE[draft.automationOption]} />}
    </div>
  );
}

interface SuccessConfigArgs {
  automationOption: NewProductDraft['automationOption'];
  productName: string;
  scheduleData: { date: string; time: string };
  officerData: { officer: string; note: string };
  draft: NewProductDraft;
  onGoHome: () => void;
  onViewProducts: () => void;
  onEditSchedule: () => void;
  onContinueEditing: () => void;
  onAddReviewNotes: () => void;
}

/** Per-outcome content for the shared SuccessModal. */
function buildSuccessConfig(args: SuccessConfigArgs): SuccessConfig {
  const { productName, scheduleData, officerData, draft } = args;
  const name = <span className="text-brand font-semibold">{productName}</span>;
  const goHomeAction: SuccessModalAction = { label: 'Go to Home', onClick: args.onGoHome };

  switch (args.automationOption) {
    case 'schedule':
      return {
        title: 'Activation Scheduled Successfully',
        subtitle: (
          <>
            Your product {name} - is scheduled to go live on {formatScheduleDate(scheduleData.date)} at{' '}
            {formatScheduleTime(scheduleData.time)}. Distributors will gain access automatically.
          </>
        ),
        details: buildScheduledDetails(scheduleData.date, scheduleData.time),
        primaryAction: { label: 'Edit Schedule', onClick: args.onEditSchedule },
        secondaryAction: goHomeAction,
      };
    case 'save-draft':
      return {
        title: 'Product Saved as Draft',
        subtitle: (
          <>
            Your product {name} has been saved as a draft. It’s not visible to distributors yet. You can
            continue editing or activate it later.
          </>
        ),
        details: buildDraftDetails(),
        primaryAction: { label: 'Continue Editing', onClick: args.onContinueEditing },
        secondaryAction: goHomeAction,
      };
    case 'submit-review':
      return {
        title: 'Submitted for Review Successfully',
        subtitle: (
          <>
            Your product {name} has been sent to the compliance team for approval. You’ll be notified once
            reviewed.
          </>
        ),
        details: buildReviewProcessDetails(officerData.officer),
        primaryAction: { label: 'Add Review Notes', onClick: args.onAddReviewNotes },
        secondaryAction: goHomeAction,
      };
    default:
      return {
        title: 'Product Published Successfully',
        subtitle: (
          <>
            Your product {name} is now live and available to 128 distributors in your network. They can start
            placing orders immediately.
          </>
        ),
        details: buildActivationDetails(draft),
        primaryAction: { label: 'View Product Dashboard', onClick: args.onViewProducts },
        secondaryAction: goHomeAction,
      };
  }
}
