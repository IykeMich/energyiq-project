import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { ConfirmDialog, LoadingOverlay, Textarea, toast } from '@energyiq/ui';
import { useApprovalDetailQuery, useApproveRequestMutation, useRejectRequestMutation } from '@/hooks/use-approval';
import { ProductAuthorizationStatusBadge } from './product-authorization-status-badge';
import { ProductAuthorizationDiffTable } from './product-authorization-diff-table';

interface SummaryTileProps {
  label: string;
  children: React.ReactNode;
}

function SummaryTile({ label, children }: SummaryTileProps) {
  return (
    <div className="flex flex-1 min-w-[220px] flex-col justify-center gap-1.5 rounded-[14px] bg-[#FFFFFF1A] p-5">
      <span className="text-base text-white">{label}</span>
      <span className="text-lg font-medium text-white">{children}</span>
    </div>
  );
}

export function ProductAuthorizationReviewOverview() {
  const navigate = useNavigate();
  const { slug = 'demo', id = '' } = useParams<{ slug: string; id: string }>();
  const [comment, setComment] = useState('');
  const [pendingAction, setPendingAction] = useState<null | 'approve' | 'reject'>(null);

  const detailQuery = useApprovalDetailQuery(id);
  const approveRequest = useApproveRequestMutation();
  const rejectRequest = useRejectRequestMutation();

  const detail = detailQuery.data;

  const goBack = () => navigate(`/${slug}/products/authorization`);

  // A reject comment is captured for the reviewer's own record, but
  // POST /v1/approval/reject/{id} takes no request body today — there is
  // nowhere on the backend to send it yet, so it stays UI-only.
  const requireComment = detail?.require_reject_comment ?? true;
  const canReject = !requireComment || comment.trim().length > 0;

  const handleConfirm = async () => {
    if (!pendingAction || !detail?.id) return;
    const approved = pendingAction === 'approve';
    setPendingAction(null);
    try {
      if (approved) {
        await approveRequest.mutateAsync(detail.id);
        toast.success(`${detail.reference ?? detail.id} approved.`, {
          description: 'Proposed changes have been applied.',
        });
      } else {
        await rejectRequest.mutateAsync(detail.id);
        toast.error(`${detail.reference ?? detail.id} rejected.`, { description: 'Original data is still unchanged.' });
      }
      goBack();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.');
    }
  };

  if (detailQuery.isLoading || !detail) {
    return <LoadingOverlay message="Loading request..." />;
  }

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-[10px]">
        <div className="flex items-center gap-[7px]">
          <button
            type="button"
            onClick={goBack}
            aria-label="Back to authorization queue"
            className="tap-effect flex h-7 w-7 items-center justify-center rounded-full bg-brand/70"
          >
            <ArrowLeft className="h-4 w-4 text-[#121212]" />
          </button>
          <h1 className="text-lg font-semibold text-[#FAFAFA]">Review request</h1>
        </div>
        <p className="text-base text-[#FAFAFACC]">{detail.title}</p>
      </header>

      <div className="flex flex-wrap gap-4 rounded-[18px] bg-[#6161611A] p-6">
        <SummaryTile label="Organization:">{detail.organization}</SummaryTile>
        <SummaryTile label="Requested by:">{detail.requested_by}</SummaryTile>
        <SummaryTile label="Approval Level:">{detail.approval_level}</SummaryTile>
        <SummaryTile label="Status:">
          <ProductAuthorizationStatusBadge status={detail.status} label={detail.status_label} />
        </SummaryTile>
      </div>

      <h2 className="text-lg font-semibold text-[#FAFAFA]">Current data vs. proposed changes</h2>

      <ProductAuthorizationDiffTable changes={detail.current_vs_proposed ?? []} />

      <div className="flex flex-col gap-3 rounded-[33px] bg-[#6161611A] px-6 py-5">
        <label htmlFor="authorization-comment" className="text-base text-[#FAFAFA]">
          Approval comment {requireComment ? '(required to reject)*' : '(optional)'}:
        </label>
        <Textarea
          id="authorization-comment"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          placeholder="Add context for the requester"
          className="min-h-[20px] resize-none border-none bg-transparent p-0 text-sm font-medium placeholder:text-[#9E9E9E] focus-visible:ring-0"
        />
      </div>

      <div className="flex items-center justify-end gap-4">
        <button
          type="button"
          disabled={!canReject}
          onClick={() => setPendingAction('reject')}
          className="tap-effect h-[52px] rounded-full border border-danger px-12 text-base font-semibold text-danger hover:bg-danger/10 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Reject
        </button>
        <button
          type="button"
          onClick={() => setPendingAction('approve')}
          className="tap-effect h-[52px] rounded-full bg-brand px-12 text-base font-semibold text-[#121212] hover:opacity-90"
        >
          Approve Request
        </button>
      </div>

      <ConfirmDialog
        open={pendingAction === 'approve'}
        onOpenChange={(open) => !open && setPendingAction(null)}
        title={`Approve ${detail.reference ?? detail.id}`}
        message="Are you sure you want to approve this request? The requester will be notified immediately."
        confirmLabel="Approve"
        intent="primary"
        onConfirm={handleConfirm}
      />

      <ConfirmDialog
        open={pendingAction === 'reject'}
        onOpenChange={(open) => !open && setPendingAction(null)}
        title={`Reject ${detail.reference ?? detail.id}`}
        message="Are you sure you want to reject this request? The requester will be notified immediately."
        confirmLabel="Confirm Rejection"
        intent="danger"
        onConfirm={handleConfirm}
      />
    </section>
  );
}
