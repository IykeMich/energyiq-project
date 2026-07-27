import { useMemo, useState } from 'react';
import { ArrowLeft, CheckCircle2, X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { LoadingOverlay, SuccessModal, type SuccessModalDetail } from '@energyiq/ui';
import { getComplaintDetail, REJECTION_AUDIT, type ComplaintDetail } from './mocks';
import { ComplaintThreadPanel } from '@/ui/components/complaint/complaint-thread-panel';
import { ComplaintDetailSidebar } from '@/ui/components/complaint/complaint-detail-sidebar';
import { ResolveComplaintModal } from '@/ui/components/complaint/resolve-complaint-modal';
import { RejectComplaintModal } from '@/ui/components/complaint/reject-complaint-modal';
import {
  useResolveComplaintMutation,
  useReviewComplaintMutation,
} from '@/hooks/use-complaints';

type OpenModal = null | 'resolve' | 'reject';

/** Simulates the in-flight mutation so the loading overlay is visible. TODO(orval): real call. */
function settleAfterDelay(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 1600));
}

/** Formats a Naira amount with the "#" prefix used across the complaint screens. */
function formatNaira(amount: string): string {
  const numeric = Number(amount);
  return Number.isFinite(numeric) && numeric > 0 ? `#${numeric.toLocaleString('en-NG')}` : '#0';
}

/** Builds the Audit Summary rows shown on the Resolution Confirmed modal. */
function buildAuditSummary(
  detail: ComplaintDetail,
  data: { amount: string },
): SuccessModalDetail[] {
  return [
    { label: 'Distributor:', value: detail.distributor.name },
    { label: 'Credit Issued:', value: formatNaira(data.amount) },
    { label: 'Replacement:', value: `${detail.order.shortfall} - Mar 21 2026` },
  ];
}

export function ComplaintDetailPage() {
  const navigate = useNavigate();
  const { slug = '', id = '' } = useParams<{ slug: string; id: string }>();
  const [modal, setModal] = useState<OpenModal>(null);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
  const [resolveAudit, setResolveAudit] = useState<SuccessModalDetail[] | null>(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);

  const detail = useMemo(() => getComplaintDetail(id), [id]);
  const resolveMutation = useResolveComplaintMutation();
  const reviewMutation = useReviewComplaintMutation();

  if (!detail) {
    return (
      <section className="flex flex-col gap-3">
        <h1 className="text-2xl font-semibold text-foreground">Complaint not found</h1>
        <p className="text-sm text-muted-foreground">
          We couldn’t find a complaint with ID <strong>{id}</strong>.
        </p>
        <button
          type="button"
          onClick={() => navigate(`/${slug}/complaints`)}
          className="mt-2 h-10 self-start rounded-full bg-brand px-5 text-sm font-semibold text-brand-foreground"
        >
          Back to Complaints
        </button>
      </section>
    );
  }

  const goToComplaints = () => navigate(`/${slug}/complaints`);
  const goToDashboard = () => navigate(`/${slug}/dashboard`);

  const handleResolveSubmitted = async (data: {
    resolutionType: string;
    amount: string;
    message: string;
  }) => {
    setModal(null);
    setLoadingMessage('Resolving Complaint....');
    try {
      await resolveMutation.mutateAsync({
        id: detail.complaintId,
        req: {
          resolution_type: data.resolutionType,
          resolution_notes: `${data.message}${data.amount ? ` (Amount: #${Number(data.amount).toLocaleString('en-NG')})` : ''}`,
          resolution_amount: data.amount ? Number(data.amount) : undefined,
        },
      });
      setResolveAudit(buildAuditSummary(detail, { amount: data.amount }));
    } finally {
      setLoadingMessage(null);
    }
  };

  const handleReviewStarted = async () => {
    setLoadingMessage('Starting Review....');
    try {
      await reviewMutation.mutateAsync({ id: detail.complaintId });
      setReviewOpen(true);
    } finally {
      setLoadingMessage(null);
    }
  };

  const handleRejectConfirmed = async () => {
    setModal(null);
    setLoadingMessage('Rejecting Complaint....');
    await settleAfterDelay();
    setLoadingMessage(null);
    setRejectOpen(true);
  };

  const rejectSummary: SuccessModalDetail[] = [
    { label: 'Rejected by:', value: REJECTION_AUDIT.rejectedBy },
    { label: 'Date:', value: REJECTION_AUDIT.date },
  ];

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-3">
        <div className="flex items-center gap-3.5">
          <button
            type="button"
            onClick={() => navigate(`/${slug}/complaints`)}
            aria-label="Back to complaints"
            className="flex h-7.75 w-7.75 items-center justify-center rounded-full bg-brand text-brand-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="text-2xl font-semibold text-foreground">Complaint Details</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3 pl-11">
          <p className="text-sm text-[#FAFAFA]">
            {detail.id}- {detail.title}
          </p>
          <span className="rounded-full bg-[#FBC02D]/20 px-3 py-1 text-xs font-medium text-[#FBC02D]">
            {detail.statusLabel}
          </span>
        </div>
      </header>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1.4fr_1fr]">
        <ComplaintThreadPanel
          slaBanner={detail.slaBanner}
          thread={detail.thread}
          timeline={detail.timeline}
          documents={detail.documents}
          onSendResponse={() => {
            // TODO(orval): post the quick response to the complaint thread endpoint.
          }}
        />

        <ComplaintDetailSidebar
          detail={detail}
          onReview={handleReviewStarted}
          onResolve={() => setModal('resolve')}
          onReject={() => setModal('reject')}
        />
      </div>

      <ResolveComplaintModal
        open={modal === 'resolve'}
        onOpenChange={(isOpen) => !isOpen && setModal(null)}
        detail={detail}
        onSubmit={handleResolveSubmitted}
        onSaveDraft={() => {
          // TODO(orval): persist the resolution draft once the endpoint lands.
          setModal(null);
        }}
      />

      <RejectComplaintModal
        open={modal === 'reject'}
        onOpenChange={(isOpen) => !isOpen && setModal(null)}
        onConfirm={handleRejectConfirmed}
      />

      {loadingMessage && <LoadingOverlay message={loadingMessage} />}

      <SuccessModal
        open={resolveAudit !== null}
        onOpenChange={(isOpen) => !isOpen && setResolveAudit(null)}
        tone="brand"
        title="Resolution Confirmed"
        subtitle={
          <>
            <span className="font-semibold text-brand">{detail.id}</span> has been formally
            resolved and formally closed.
          </>
        }
        detailsTitle="Audit Summary"
        details={resolveAudit ?? undefined}
        primaryAction={{
          label: 'Download Report',
          onClick: () => {
            // TODO(orval): download the resolution report once the endpoint lands.
          },
        }}
        secondaryAction={{
          label: 'Back to Complaints',
          onClick: () => {
            setResolveAudit(null);
            goToComplaints();
          },
        }}
        buttonLayout="stack"
      />

      <SuccessModal
        open={reviewOpen}
        onOpenChange={setReviewOpen}
        tone="brand"
        icon={CheckCircle2}
        title="Review Started"
        subtitle={
          <>
            You have started reviewing{' '}
            <span className="font-semibold text-brand">
              {detail.id}- {detail.title}
            </span>
            .
          </>
        }
        primaryAction={{
          label: 'Back to Complaints',
          onClick: () => {
            setReviewOpen(false);
            goToComplaints();
          },
        }}
        secondaryAction={{
          label: 'Go to Home',
          onClick: () => {
            setReviewOpen(false);
            goToDashboard();
          },
        }}
        buttonLayout="stack"
      />

      <SuccessModal
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        tone="danger"
        icon={X}
        title="Complaint Rejected"
        subtitle={
          <>
            <span className="font-semibold text-brand">
              {detail.id}- {detail.title}
            </span>{' '}
            has been rejected.
          </>
        }
        detailsTitle="Summary"
        details={rejectSummary}
        primaryAction={{
          label: 'Back to Complaints',
          onClick: () => {
            setRejectOpen(false);
            goToComplaints();
          },
        }}
        secondaryAction={{
          label: 'Go to Home',
          onClick: () => {
            setRejectOpen(false);
            goToDashboard();
          },
        }}
        buttonLayout="stack"
      />
    </section>
  );
}
