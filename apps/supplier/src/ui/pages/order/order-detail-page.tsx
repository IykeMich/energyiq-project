import { useMemo, useState } from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { ConfirmDialog, LoadingOverlay, toast } from '@energyiq/ui';
import { getOrderDetail, getOrderStage } from './mocks';
import { OrderInfoCard } from '@/ui/components/order/order-info-card';
import { OrderDistributorCard } from '@/ui/components/order/order-distributor-card';
import { RejectOrderModal } from '@/ui/components/order/reject-order-modal';
import { ModifyOrderModal } from '@/ui/components/order/modify-order-modal';

type OpenModal = null | 'reject' | 'modify' | 'confirmApprove' | 'confirmReject' | 'confirmModify';

export function OrderDetailPage() {
  const navigate = useNavigate();
  const { slug = '', id = '' } = useParams<{ slug: string; id: string }>();
  const [modal, setModal] = useState<OpenModal>(null);
  const [pendingReject, setPendingReject] = useState<{ reason: string; note: string } | null>(null);
  const [stage, setStage] = useState(() => getOrderStage(id));
  const [isProcessing, setIsProcessing] = useState(false);

  const detail = useMemo(() => getOrderDetail(id), [id]);
  const actionsDisabled = stage === 'rejected';

  if (!detail) {
    return (
      <section className="flex flex-col gap-3">
        <h1 className="text-2xl font-semibold text-foreground">Order not found</h1>
        <p className="text-sm text-muted-foreground">
          We couldn’t find an order with ID <strong>{id}</strong>.
        </p>
        <button
          type="button"
          onClick={() => navigate(`/${slug}/orders`)}
          className="self-start mt-2 h-10 px-5 rounded-full bg-brand text-brand-foreground font-semibold text-sm"
        >
          Back to Orders
        </button>
      </section>
    );
  }

  const handleModifyConfirmed = () => {
    setModal(null);
    setIsProcessing(true);
    // TODO(orval): replace the timer with the modify mutation's pending/settled state.
    setTimeout(() => {
      setIsProcessing(false);
      toast.success('Success', {
        description: `'${detail.summary.id}' has been modified. ${detail.distributor.name} will receive a notification soon.`,
      });
    }, 1200);
  };

  const handleApproveConfirmed = () => {
    setModal(null);
    // Approving an order continues into the dispatch wizard.
    navigate(`/${slug}/orders/${detail.summary.id}/dispatch`);
  };

  const handleRejectConfirmed = () => {
    if (!pendingReject) return;
    setModal(null);
    // Rejecting transitions the page itself: red "Order Rejected" pill + disabled actions.
    setStage('rejected');
    setPendingReject(null);
  };

  const handleRejectClick = () => {
    // A dispatched order can no longer be rejected — surface a toast instead of the modal.
    if (stage === 'awaiting_delivery') {
      toast.error('This order cannot be rejected at its current stage');
      return;
    }
    setModal('reject');
  };

  return (
    <section className="flex flex-col gap-6">
      <header className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3.5">
          <button
            type="button"
            onClick={() => navigate(`/${slug}/orders`)}
            aria-label="Back to orders"
            className="w-7.75 h-7.75 rounded-full bg-brand text-brand-foreground flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="text-2xl font-semibold text-foreground">Order Details</h1>
        </div>
        {stage === 'rejected' ? (
          <span className="inline-flex items-center gap-2 rounded-full bg-danger/20 text-danger px-4 py-2 text-sm font-semibold">
            <Send className="w-4 h-4" />
            Order Rejected
          </span>
        ) : (
          <span className="inline-flex items-center gap-2 rounded-full bg-success/20 text-success px-4 py-2 text-sm font-semibold">
            <Send className="w-4 h-4" />
            {stage === 'awaiting_delivery' ? 'Awaiting Delivery' : 'Awaiting Approval'}
          </span>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6 items-start">
        <OrderInfoCard
          orderId={detail.summary.id}
          purchaseDate={`${detail.summary.date} | 09:45`}
          amountNGN={detail.summary.amountNGN}
          payment={{ method: detail.payment.method, status: detail.summary.payment }}
          delivery={detail.delivery}
          lineItems={detail.lineItems}
          timeline={detail.timeline}
        />

        <OrderDistributorCard
          distributor={detail.distributor}
          shipping={detail.shipping}
          payment={detail.payment}
          actions={
            <>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setModal('modify')}
                  disabled={actionsDisabled}
                  className={
                    actionsDisabled
                      ? 'h-13.25 rounded-[28px] border border-border-strong text-muted-foreground font-semibold cursor-not-allowed'
                      : 'h-13.25 rounded-[28px] border border-brand text-brand font-semibold'
                  }
                >
                  Modify Order
                </button>
                <button
                  type="button"
                  onClick={handleRejectClick}
                  disabled={actionsDisabled}
                  className={
                    actionsDisabled
                      ? 'h-13.25 rounded-[28px] border border-border-strong text-muted-foreground font-semibold cursor-not-allowed'
                      : 'h-13.25 rounded-[28px] border border-danger text-danger font-semibold'
                  }
                >
                  Reject Order
                </button>
              </div>
              <button
                type="button"
                onClick={() => setModal('confirmApprove')}
                disabled={actionsDisabled}
                className={
                  actionsDisabled
                    ? 'h-13.25 rounded-[28px] bg-foreground/10 text-muted-foreground font-semibold cursor-not-allowed'
                    : 'h-13.25 rounded-[28px] bg-brand text-brand-foreground font-semibold'
                }
              >
                Approve Order
              </button>
            </>
          }
        />
      </div>

      <RejectOrderModal
        open={modal === 'reject'}
        onOpenChange={(o) => !o && setModal(null)}
        detail={detail}
        onReject={(d) => {
          setPendingReject(d);
          setModal('confirmReject');
        }}
      />

      <ModifyOrderModal
        open={modal === 'modify'}
        onOpenChange={(o) => !o && setModal(null)}
        detail={detail}
        // TODO(orval): persist the edited line items via the modify mutation.
        onSave={() => setModal('confirmModify')}
      />

      <ConfirmDialog
        open={modal === 'confirmApprove'}
        onOpenChange={(o) => !o && setModal(null)}
        title={`Confirm Approval- ${detail.summary.id}`}
        message="Are you sure you want to approve this order? The distributor will be notified immediately."
        confirmLabel="Approve"
        intent="primary"
        onConfirm={handleApproveConfirmed}
      />

      <ConfirmDialog
        open={modal === 'confirmReject'}
        onOpenChange={(o) => !o && setModal(null)}
        title="Reject Confirmation"
        message="Are you sure you want to reject this order? The distributor will be notified immediately."
        confirmLabel="Confirm Rejection"
        intent="danger"
        onConfirm={handleRejectConfirmed}
      />

      <ConfirmDialog
        open={modal === 'confirmModify'}
        onOpenChange={(o) => !o && setModal(null)}
        title="Confirm Order Modification"
        message={`You are modifying Order ${detail.summary.id}. The distributor will be notified of these changes.`}
        confirmLabel="Confirm Changes"
        intent="primary"
        onConfirm={handleModifyConfirmed}
      />

      {isProcessing && <LoadingOverlay message="Saving changes..." />}
    </section>
  );
}
