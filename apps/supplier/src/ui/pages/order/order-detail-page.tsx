import { useMemo, useState } from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { ConfirmDialog, LoadingOverlay, toast } from '@energyiq/ui';
import {
  useOrderQuery,
  useApproveOrderMutation,
  useRejectOrderMutation,
  useCancelOrderMutation,
  useUpdateOrderMutation,
} from '@/hooks/use-orders';
import { toOrderDetail, toOrderDetailStage, type OrderLineItem } from './mocks';
import { OrderInfoCard } from '@/ui/components/order/order-info-card';
import { OrderDistributorCard } from '@/ui/components/order/order-distributor-card';
import { RejectOrderModal } from '@/ui/components/order/reject-order-modal';
import { ModifyOrderModal } from '@/ui/components/order/modify-order-modal';

type OpenModal = null | 'reject' | 'modify' | 'confirmApprove' | 'confirmReject' | 'confirmModify' | 'confirmCancel';

export function OrderDetailPage() {
  const navigate = useNavigate();
  const { slug = '', id = '' } = useParams<{ slug: string; id: string }>();
  const [modal, setModal] = useState<OpenModal>(null);
  const [pendingReject, setPendingReject] = useState<{ reason: string; note: string } | null>(null);
  const [pendingModify, setPendingModify] = useState<OrderLineItem[] | null>(null);

  const { data: order, isLoading, error } = useOrderQuery(id);

  const detail = useMemo(() => (order ? toOrderDetail(order) : null), [order]);
  const stage = useMemo(() => toOrderDetailStage(order?.status), [order?.status]);

  const approveMutation = useApproveOrderMutation();
  const rejectMutation = useRejectOrderMutation();
  const cancelMutation = useCancelOrderMutation();
  const updateMutation = useUpdateOrderMutation();

  const isProcessing =
    approveMutation.isPending ||
    rejectMutation.isPending ||
    cancelMutation.isPending ||
    updateMutation.isPending;

  const actionsDisabled = stage === 'rejected';

  if (isLoading) {
    return <LoadingOverlay message="Loading order details..." />;
  }

  if (error) {
    return (
      <section className="flex flex-col gap-3">
        <h1 className="text-2xl font-semibold text-foreground">Unable to load order</h1>
        <p className="text-sm text-muted-foreground">
          Something went wrong while loading this order. Please try again.
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

  const handleModifySave = (lineItems: OrderLineItem[]) => {
    setPendingModify(lineItems);
    setModal('confirmModify');
  };

  const handleModifyConfirmed = () => {
    if (!detail || !pendingModify) return;
    setModal(null);
    const items = pendingModify.map((item) => ({
      product_id: item.productId,
      quantity: item.quantity,
    }));
    updateMutation.mutate(
      { id, req: { items, reason: 'Order modified by supplier' } },
      {
        onSuccess: () => {
          setPendingModify(null);
          toast.success('Success', {
            description: `'${detail.summary.id}' has been modified. ${detail.distributor.name} will receive a notification soon.`,
          });
        },
      },
    );
  };

  const handleApproveConfirmed = () => {
    setModal(null);
    approveMutation.mutate(id, {
      onSuccess: () => {
        navigate(`/${slug}/orders/${detail.summary.id}/dispatch`);
      },
    });
  };

  const handleRejectConfirmed = () => {
    if (!pendingReject) return;
    setModal(null);
    rejectMutation.mutate(
      { id, req: { reason: pendingReject.reason, note: pendingReject.note } },
      {
        onSuccess: () => {
          setPendingReject(null);
          toast.success('Order rejected', {
            description: `Order '${id}' has been rejected. The distributor will be notified.`,
          });
        },
      },
    );
  };

  const handleCancelConfirmed = () => {
    setModal(null);
    cancelMutation.mutate(id, {
      onSuccess: () => {
        toast.success('Order cancelled', {
          description: `Order '${id}' has been cancelled.`,
        });
      },
    });
  };

  const handleRejectClick = () => {
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
              <button
                type="button"
                onClick={() => setModal('confirmCancel')}
                disabled={actionsDisabled}
                className={
                  actionsDisabled
                    ? 'h-13.25 rounded-[28px] bg-foreground/10 text-muted-foreground font-semibold cursor-not-allowed'
                    : 'h-13.25 rounded-[28px] border border-border-strong text-foreground font-semibold'
                }
              >
                Cancel Order
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
        onSave={handleModifySave}
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

      <ConfirmDialog
        open={modal === 'confirmCancel'}
        onOpenChange={(o) => !o && setModal(null)}
        title="Cancel Confirmation"
        message={`Are you sure you want to cancel Order ${detail.summary.id}? The distributor will be notified immediately.`}
        confirmLabel="Cancel Order"
        intent="danger"
        onConfirm={handleCancelConfirmed}
      />

      {isProcessing && <LoadingOverlay message="Saving changes..." />}
    </section>
  );
}
