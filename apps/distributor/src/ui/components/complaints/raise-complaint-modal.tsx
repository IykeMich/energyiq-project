import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Modal, SuccessModal, WizardStepPills, toast } from '@energyiq/ui';
import {
  usePostV1DistributorComplaintCreate,
  getGetV1DistributorComplaintOverviewQueryKey,
} from '@energyiq/api/generated/distributor-complaints/distributor-complaints';
import { RaiseComplaintHeader } from './raise-complaint-header';
import { RaiseComplaintIssueTypeStep } from './raise-complaint-issue-type-step';
import { RaiseComplaintDetailsStep } from './raise-complaint-details-step';
import { RaiseComplaintEvidenceStep } from './raise-complaint-evidence-step';
import { RaiseComplaintReviewStep } from './raise-complaint-review-step';
import { EMPTY_RAISE_COMPLAINT_DRAFT, type RaiseComplaintDraft } from './complaints-mocks';

interface RaiseComplaintModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const STEP_LABELS = ['Issue Type', 'Details', 'Evidence Upload', 'Review and Submit'];
const LAST_STEP = STEP_LABELS.length;

/** Parses a free-text amount field (e.g. "₦84,000") down to a plain number for the API. */
function parseEstimatedAmount(value: string): number {
  const numeric = Number(value.replace(/[^0-9.]/g, ''));
  return Number.isFinite(numeric) ? numeric : 0;
}

/** Four-step "Raise a Complaint" wizard, submitting to the create-complaint endpoint. */
export function RaiseComplaintModal({ open, onOpenChange }: RaiseComplaintModalProps) {
  const queryClient = useQueryClient();
  const createComplaint = usePostV1DistributorComplaintCreate();

  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<RaiseComplaintDraft>(EMPTY_RAISE_COMPLAINT_DRAFT);
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setStep(1);
      setDraft(EMPTY_RAISE_COMPLAINT_DRAFT);
      setSubmittedCode(null);
    }
  }, [open]);

  const updateDraft = (patch: Partial<RaiseComplaintDraft>) =>
    setDraft((previous) => ({ ...previous, ...patch }));

  const handleBack = () => {
    if (step === 1) {
      onOpenChange(false);
      return;
    }
    setStep((current) => current - 1);
  };

  const handleContinue = async () => {
    if (step !== LAST_STEP) {
      setStep((current) => current + 1);
      return;
    }

    try {
      const response = await createComplaint.mutateAsync({
        data: {
          complaint_category: draft.issueType,
          complaint_title: draft.complaintTitle,
          description: draft.description,
          estimated_amount: parseEstimatedAmount(draft.estimate),
          order_id: draft.relatedOrder,
          quantity_affected: draft.quantityAffected,
          // Evidence stays presentational: no presign/upload endpoint exists yet
          // for complaint evidence, so files picked in step 3 aren't submitted.
        },
      });
      await queryClient.invalidateQueries({ queryKey: getGetV1DistributorComplaintOverviewQueryKey() });
      // fetcher() throws on non-success responseCode, so a resolved mutateAsync
      // is always the 201 variant at runtime; narrow the discriminated union to match.
      if (response.status !== 201) throw new Error('Unexpected complaint create response');
      setSubmittedCode(response.data.data?.distributor_complaint_code ?? null);
    } catch {
      toast.error('Failed to submit complaint', { description: 'Please try again.' });
    }
  };

  return (
    <>
    <Modal open={open && !submittedCode} onOpenChange={onOpenChange} showClose={false} size="lg">
      {/* Capped column: fixed header + stepper, a scrolling step region whose
          content cuts behind solid top/bottom bands, then a fixed footer. */}
      <div className="flex max-h-[80vh] flex-col">
        <div className="flex shrink-0 flex-col gap-7">
          <RaiseComplaintHeader onClose={() => onOpenChange(false)} />
          <WizardStepPills steps={STEP_LABELS} current={step - 1} />
        </div>

        <div className="relative mt-6 flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto py-5 pr-1">
            {step === 1 && <RaiseComplaintIssueTypeStep draft={draft} onChange={updateDraft} />}
            {step === 2 && <RaiseComplaintDetailsStep draft={draft} onChange={updateDraft} />}
            {step === 3 && <RaiseComplaintEvidenceStep draft={draft} onChange={updateDraft} />}
            {step === 4 && <RaiseComplaintReviewStep draft={draft} />}
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-5 bg-surface-modal"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-5 bg-surface-modal"
          />
        </div>

        <div className="flex shrink-0 items-center gap-4 pt-6">
          <button
            type="button"
            onClick={handleBack}
            className="tap-effect rounded-full bg-[#3A3A3A] px-10 py-3.5 text-sm font-semibold text-[#FAFAFA]"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleContinue}
            disabled={createComplaint.isPending}
            className="tap-effect flex-1 rounded-full bg-[#FBC02D] px-6 py-3.5 text-sm font-semibold text-[#121212] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {step === LAST_STEP ? (createComplaint.isPending ? 'Submitting…' : 'Submit Complaint') : 'Continue'}
          </button>
        </div>
      </div>
    </Modal>

    <SuccessModal
      open={open && submittedCode !== null}
      onOpenChange={() => onOpenChange(false)}
      tone="brand"
      title="Complaint Submitted Successfully!"
      subtitle="Your complaint has been submitted to the supplier. You will be notified as it progresses through reviews."
      highlight={{ label: 'Complaint Reference:', value: submittedCode ?? '' }}
      footerNote="Expected resolution within 72 hours. Check status in Complaint tab."
    />
    </>
  );
}
