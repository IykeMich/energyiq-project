import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { SuccessModal } from '@energyiq/ui';
import { emptyDraft, type NewProductDraft } from './mocks';
import { StepProductDetails } from './components/step-product-details';
import { StepDistributorAccess } from './components/step-distributor-access';
import { StepReview } from './components/step-review';
import { ScheduleActivationModal } from './components/schedule-activation-modal';
import { ComplianceOfficerModal } from './components/compliance-officer-modal';

const TOTAL_STEPS = 3;

const STEP_LABELS: Record<number, string> = {
  1: 'Product Details',
  2: 'Distributor Access',
  3: 'Review',
};

export function AddProductPage() {
  const navigate = useNavigate();
  const { slug = '' } = useParams<{ slug: string }>();
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<NewProductDraft>(emptyDraft());
  const [successOpen, setSuccessOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [officerOpen, setOfficerOpen] = useState(false);

  const patch = (next: Partial<NewProductDraft>) => setDraft((prev) => ({ ...prev, ...next }));

  const handleNext = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  const handlePrev = () => setStep((s) => Math.max(s - 1, 1));
  const handlePublish = () => {
    if (draft.automationOption === 'schedule') {
      setScheduleOpen(true);
    } else if (draft.automationOption === 'submit-review') {
      setOfficerOpen(true);
    } else {
      setSuccessOpen(true);
    }
  };
  const handleSaveDraft = () => setSuccessOpen(true);

  return (
    <section className="flex flex-col gap-6">
      <header className="flex items-center gap-3.5">
        <button
          type="button"
          onClick={() => navigate(`/${slug}/products`)}
          aria-label="Back to products"
          className="w-[31px] h-[31px] rounded-full bg-brand text-brand-foreground flex items-center justify-center"
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
          className="h-[53px] rounded-[28px] border border-border-strong text-foreground font-semibold px-8"
        >
          {step === 1 ? 'Cancel' : 'Previous'}
        </button>

        <div className="flex items-center gap-3">
          {step === TOTAL_STEPS ? (
            <>
              <button
                type="button"
                onClick={handleSaveDraft}
                className="h-[53px] rounded-[28px] bg-brand/20 text-brand font-semibold px-8"
              >
                Save as Draft
              </button>
              <button
                type="button"
                onClick={handlePublish}
                className="h-[53px] rounded-[28px] bg-brand text-brand-foreground font-semibold px-10"
              >
                Publish Product
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="h-[53px] rounded-[28px] bg-brand text-brand-foreground font-semibold px-12"
            >
              Next
            </button>
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
        onSchedule={() => {
          setScheduleOpen(false);
          setSuccessOpen(true);
        }}
      />

      <ComplianceOfficerModal
        open={officerOpen}
        onOpenChange={setOfficerOpen}
        onAssign={() => {
          setOfficerOpen(false);
          setSuccessOpen(true);
        }}
      />

      <SuccessModal
        open={successOpen}
        onOpenChange={setSuccessOpen}
        title={draft.automationOption === 'save-draft' ? 'Draft Saved' : 'Product Published'}
        subtitle={
          draft.automationOption === 'save-draft' ? (
            <>
              <span className="text-brand font-semibold">{draft.name || 'Untitled product'}</span>{' '}
              has been saved as a draft. You can keep editing whenever you’re ready.
            </>
          ) : (
            <>
              <span className="text-brand font-semibold">{draft.name || 'Untitled product'}</span>{' '}
              is now visible to your distributor network.
            </>
          )
        }
        primaryAction={{
          label: 'Go to Products',
          onClick: () => {
            setSuccessOpen(false);
            navigate(`/${slug}/products`);
          },
        }}
        secondaryAction={{
          label: 'Add Another Product',
          onClick: () => {
            setSuccessOpen(false);
            setDraft(emptyDraft());
            setStep(1);
          },
        }}
        buttonLayout="stack"
      />
    </section>
  );
}
