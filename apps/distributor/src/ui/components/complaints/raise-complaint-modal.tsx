import { useEffect, useState } from 'react';
import { Modal, SuccessModal, WizardStepPills } from '@energyiq/ui';
import { RaiseComplaintHeader } from './raise-complaint-header';
import { RaiseComplaintIssueTypeStep } from './raise-complaint-issue-type-step';
import { RaiseComplaintDetailsStep } from './raise-complaint-details-step';
import { RaiseComplaintEvidenceStep } from './raise-complaint-evidence-step';
import { RaiseComplaintReviewStep } from './raise-complaint-review-step';
import {
  EMPTY_RAISE_COMPLAINT_DRAFT,
  NEW_COMPLAINT_REFERENCE,
  type RaiseComplaintDraft,
} from './complaints-mocks';

interface RaiseComplaintModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const STEP_LABELS = ['Issue Type', 'Details', 'Evidence Upload', 'Review and Submit'];
const LAST_STEP = STEP_LABELS.length;

/** Four-step "Raise a Complaint" wizard. Mock-driven until the create endpoint lands. */
export function RaiseComplaintModal({ open, onOpenChange }: RaiseComplaintModalProps) {
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<RaiseComplaintDraft>(EMPTY_RAISE_COMPLAINT_DRAFT);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (open) {
      setStep(1);
      setDraft(EMPTY_RAISE_COMPLAINT_DRAFT);
      setSubmitted(false);
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

  const handleContinue = () => {
    if (step === LAST_STEP) {
      // TODO(orval): submit `draft` via the create-complaint mutation, then show confirmation.
      setSubmitted(true);
      return;
    }
    setStep((current) => current + 1);
  };

  return (
    <>
    <Modal open={open && !submitted} onOpenChange={onOpenChange} showClose={false} size="lg">
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
            className="tap-effect flex-1 rounded-full bg-[#FBC02D] px-6 py-3.5 text-sm font-semibold text-[#121212]"
          >
            {step === LAST_STEP ? 'Submit Complaint' : 'Continue'}
          </button>
        </div>
      </div>
    </Modal>

    <SuccessModal
      open={open && submitted}
      onOpenChange={() => onOpenChange(false)}
      tone="brand"
      title="Complaint Submitted Successfully!"
      subtitle="Your complaint has been submitted to Apex Petroleum Ltd. You will be notified as it progresses through reviews."
      highlight={{ label: 'Complaint Reference:', value: NEW_COMPLAINT_REFERENCE }}
      footerNote="Expected resolution within 72 hours. Check status in Complaint tab."
    />
    </>
  );
}
