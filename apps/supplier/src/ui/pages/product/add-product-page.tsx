import { useState, type ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { LoadingOverlay, SuccessModal, type SuccessModalAction } from '@energyiq/ui';
import {
  buildActivationDetails,
  buildDraftDetails,
  buildReviewProcessDetails,
  buildScheduledDetails,
  emptyDraft,
  formatScheduleDate,
  formatScheduleTime,
  mockProductAction,
  type NewProductDraft,
  type ReviewRow,
} from './mocks';
import { StepProductDetails } from '@/ui/components/product/step-product-details';
import { StepDistributorAccess } from '@/ui/components/product/step-distributor-access';
import { StepReview } from '@/ui/components/product/step-review';
import { ScheduleActivationModal } from '@/ui/components/product/schedule-activation-modal';
import { ComplianceOfficerModal } from '@/ui/components/product/compliance-officer-modal';
import { ProductPublishFailedBanner } from '@/ui/components/product/product-publish-failed-banner';

const TOTAL_STEPS = 3;

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

export function AddProductPage() {
  const navigate = useNavigate();
  const { slug = '' } = useParams<{ slug: string }>();
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<NewProductDraft>(emptyDraft());
  const [successOpen, setSuccessOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [officerOpen, setOfficerOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [publishError, setPublishError] = useState(false);
  const [scheduleData, setScheduleData] = useState({ date: '', time: '' });
  const [officerData, setOfficerData] = useState({ officer: '', note: '' });

  const patch = (next: Partial<NewProductDraft>) => setDraft((prev) => ({ ...prev, ...next }));

  const handleNext = () => setStep((current) => Math.min(current + 1, TOTAL_STEPS));
  const handlePrev = () => setStep((current) => Math.max(current - 1, 1));

  const productName = draft.name || 'Untitled product';

  /** Mocked publish/activation call that drives the loading overlay before the success modal. */
  const runActivation = async () => {
    setSuccessOpen(false);
    setPublishError(false);
    setIsProcessing(true);
    try {
      await mockProductAction();
      setIsProcessing(false);
      setSuccessOpen(true);
    } catch {
      // TODO(orval): the real mutation surfaces failures here.
      setIsProcessing(false);
      setPublishError(true);
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

  const goHome = () => {
    setSuccessOpen(false);
    navigate(`/${slug}/dashboard`);
  };

  const successConfig = buildSuccessConfig({
    automationOption: draft.automationOption,
    productName,
    scheduleData,
    officerData,
    draft,
    goHome,
    onViewDashboard: () => {
      setSuccessOpen(false);
      navigate(`/${slug}/products`);
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
    <section className="flex flex-col gap-6">
      {publishError && (
        <ProductPublishFailedBanner
          productName={productName}
          onRetry={() => void runActivation()}
          onDismiss={() => setPublishError(false)}
        />
      )}

      <header className="flex items-center gap-3.5">
        <button
          type="button"
          onClick={() => navigate(`/${slug}/products`)}
          aria-label="Back to products"
          className="tap-effect w-[31px] h-[31px] rounded-full bg-brand text-brand-foreground flex items-center justify-center transition-opacity hover:opacity-90"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-2xl font-semibold text-foreground">Create New Product</h1>
      </header>

      {step === 1 && <StepProductDetails draft={draft} onChange={patch} />}
      {step === 2 && <StepDistributorAccess draft={draft} onChange={patch} />}
      {step === 3 && <StepReview draft={draft} onChange={patch} />}

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <button
          type="button"
          onClick={step === 1 ? () => navigate(`/${slug}/products`) : handlePrev}
          className="tap-effect h-[53px] rounded-[28px] border border-border-strong text-foreground font-semibold px-8 transition-colors hover:border-brand"
        >
          {step === 1 ? 'Cancel' : 'Previous'}
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
    </section>
  );
}

interface SuccessConfigArgs {
  automationOption: NewProductDraft['automationOption'];
  productName: string;
  scheduleData: { date: string; time: string };
  officerData: { officer: string; note: string };
  draft: NewProductDraft;
  goHome: () => void;
  onViewDashboard: () => void;
  onEditSchedule: () => void;
  onContinueEditing: () => void;
  onAddReviewNotes: () => void;
}

/** Per-outcome content for the shared SuccessModal. */
function buildSuccessConfig(args: SuccessConfigArgs): SuccessConfig {
  const { productName, scheduleData, officerData, draft, goHome } = args;
  const name = <span className="text-brand font-semibold">{productName}</span>;
  const goHomeAction: SuccessModalAction = { label: 'Go to Home', onClick: goHome };

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
        primaryAction: { label: 'View Product Dashboard', onClick: args.onViewDashboard },
        secondaryAction: goHomeAction,
      };
  }
}
