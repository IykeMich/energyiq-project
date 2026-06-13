import { useState } from 'react';
import { ConfirmDialog, SuccessModal } from '@energyiq/ui';
import type { DistributorApplication } from '@/ui/pages/distributor/mocks';
import { DistributorApplicationCard } from './distributor-application-card';
import { DistributorApplicationDetail } from './distributor-application-detail';

interface DistributorApprovalReviewProps {
  applications: DistributorApplication[];
  isEmpty?: boolean;
}

type PendingAction = null | 'approve' | 'reject';

interface SuccessState {
  open: boolean;
  title: string;
  subtitle: string;
}

export function DistributorApprovalReview({
  applications,
  isEmpty = applications.length === 0,
}: DistributorApprovalReviewProps) {
  const [selectedId, setSelectedId] = useState(applications[0]?.id ?? '');
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [success, setSuccess] = useState<SuccessState>({ open: false, title: '', subtitle: '' });

  const selected = applications.find((application) => application.id === selectedId) ?? applications[0];

  if (isEmpty || !selected) {
    return (
      <div className="flex min-h-[320px] items-center justify-center rounded-[24px] border border-border-subtle p-6">
        <p className="text-sm text-muted-foreground">No pending applications awaiting review.</p>
      </div>
    );
  }

  const closeSuccess = () => setSuccess((state) => ({ ...state, open: false }));

  const handleConfirm = () => {
    if (!pendingAction) return;
    const approved = pendingAction === 'approve';
    setPendingAction(null);
    setSuccess({
      open: true,
      title: approved ? 'Distributor Approved' : 'Application Rejected',
      subtitle: approved
        ? `${selected.businessName} has been approved and notified.`
        : `${selected.businessName}'s application has been rejected and notified.`,
    });
  };

  return (
    <>
      <div className="rounded-[24px] border border-border-subtle p-6">
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_1.3fr]">
          <div className="flex flex-col gap-4">
            {applications.map((application) => (
              <DistributorApplicationCard
                key={application.id}
                application={application}
                selected={application.id === selected.id}
                onSelect={() => setSelectedId(application.id)}
              />
            ))}
          </div>

          <DistributorApplicationDetail
            application={selected}
            onApprove={() => setPendingAction('approve')}
            onReject={() => setPendingAction('reject')}
          />
        </div>
      </div>

      <ConfirmDialog
        open={pendingAction === 'approve'}
        onOpenChange={(open) => !open && setPendingAction(null)}
        title={`Confirm Approval — ${selected.businessName}`}
        message="Are you sure you want to approve this distributor? They will be notified immediately."
        confirmLabel="Approve"
        intent="primary"
        onConfirm={handleConfirm}
      />

      <ConfirmDialog
        open={pendingAction === 'reject'}
        onOpenChange={(open) => !open && setPendingAction(null)}
        title={`Reject Application — ${selected.businessName}`}
        message="Are you sure you want to reject this application? The distributor will be notified immediately."
        confirmLabel="Confirm Rejection"
        intent="danger"
        onConfirm={handleConfirm}
      />

      <SuccessModal
        open={success.open}
        onOpenChange={(open) => !open && closeSuccess()}
        title={success.title}
        subtitle={success.subtitle}
        primaryAction={{ label: 'Done', onClick: closeSuccess }}
        buttonLayout="stack"
      />
    </>
  );
}
