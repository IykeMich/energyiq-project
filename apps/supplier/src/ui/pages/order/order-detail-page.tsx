import { useMemo, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { ConfirmDialog, LoadingOverlay, toast } from '@energyiq/ui';
import { displayTimeOnly } from '@energyiq/shared';
import {
  useOrderQuery,
  useApproveOrderMutation,
  useRejectOrderMutation,
  useCancelOrderMutation,
  useUpdateOrderMutation,
  useDeliverOrderMutation,
} from '@/hooks/use-orders';
import { toOrderDetail, toOrderDetailStage, type OrderLineItem } from '@/ui/components/order/order-detail-mapper';
import { OrderInfoCard } from '@/ui/components/order/order-info-card';
import { OrderDistributorCard } from '@/ui/components/order/order-distributor-card';
import { RejectOrderModal } from '@/ui/components/order/reject-order-modal';
import { ModifyOrderModal } from '@/ui/components/order/modify-order-modal';
import {
  ORDER_STATUS_COLOR,
  ORDER_STATUS_ICON,
  ORDER_STATUS_LABEL,
  toOrderStatus,
} from '@/ui/components/orders/orders-mocks';

type OpenModal =
  | null
  | 'reject'
  | 'modify'
  | 'confirmApprove'
  | 'confirmReject'
  | 'confirmModify'
  | 'confirmCancel'
  | 'confirmDeliver';

export function OrderDetailPage() {
  const navigate = useNavigate();
  const { slug = '', id = '' } = useParams<{ slug: string; id: string }>();
  const [modal, setModal] = useState<OpenModal>(null);
  const [pendingReject, setPendingReject] = useState<{ reason: string; note: string } | null>(null);
  const [pendingModify, setPendingModify] = useState<OrderLineItem[] | null>(null);

  const { data: order, isLoading, error } = useOrderQuery(id);

  const detail = useMemo(() => (order ? toOrderDetail(order) : null), [order]);
  const stage = useMemo(
    () => toOrderDetailStage(order?.supplier_order_status_code),
    [order?.supplier_order_status_code],
  );
  const orderStatus = toOrderStatus(order?.supplier_order_status_code);
  const StatusIcon = ORDER_STATUS_ICON[orderStatus];

  const approveMutation = useApproveOrderMutation();
  const rejectMutation = useRejectOrderMutation();
  const cancelMutation = useCancelOrderMutation();
  const updateMutation = useUpdateOrderMutation();
  const deliverMutation = useDeliverOrderMutation();

  const isProcessing =
    approveMutation.isPending ||
    rejectMutation.isPending ||
    cancelMutation.isPending ||
    updateMutation.isPending ||
    deliverMutation.isPending;

  const canApprove = order?.supplier_can_approve ?? false;
  const canReject = order?.supplier_can_reject ?? false;
  const canCancel = order?.supplier_can_cancel ?? false;
  const canModify = order?.supplier_can_modify ?? false;
  const canDeliver = order?.supplier_can_deliver ?? false;

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
          className="tap-effect self-start mt-2 h-10 px-5 rounded-full bg-brand text-brand-foreground font-semibold text-sm hover:bg-brand/90"
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
          className="tap-effect self-start mt-2 h-10 px-5 rounded-full bg-brand text-brand-foreground font-semibold text-sm hover:bg-brand/90"
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

  const handleDeliverConfirmed = () => {
    setModal(null);
    deliverMutation.mutate(id, {
      onSuccess: () => {
        toast.success('Order marked delivered', {
          description: `Order '${id}' has been marked as delivered.`,
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
            className="tap-effect w-7.75 h-7.75 rounded-full bg-brand text-brand-foreground flex items-center justify-center hover:bg-brand/90"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="text-2xl font-semibold text-foreground">Order Details</h1>
        </div>
        <span
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold"
          style={{
            color: ORDER_STATUS_COLOR[orderStatus],
            backgroundColor: `${ORDER_STATUS_COLOR[orderStatus]}33`,
          }}
        >
          <StatusIcon className="h-4 w-4" aria-hidden="true" />
          {order?.supplier_order_status || ORDER_STATUS_LABEL[orderStatus]}
        </span>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6 items-start">
        <OrderInfoCard
          orderId={detail.summary.id}
          purchaseDate={`${detail.summary.date} | ${displayTimeOnly(order?.supplier_order_placed_at ?? order?.supplier_order_date)}`}
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
                  disabled={!canModify}
                  className={
                    !canModify
                      ? 'h-13.25 rounded-[28px] border border-border-strong text-muted-foreground font-semibold cursor-not-allowed'
                      : 'tap-effect h-13.25 rounded-[28px] border border-brand text-brand font-semibold hover:bg-brand/10'
                  }
                >
                  Modify Order
                </button>
                <button
                  type="button"
                  onClick={handleRejectClick}
                  disabled={!canReject}
                  className={
                    !canReject
                      ? 'h-13.25 rounded-[28px] border border-border-strong text-muted-foreground font-semibold cursor-not-allowed'
                      : 'tap-effect h-13.25 rounded-[28px] border border-danger text-danger font-semibold hover:bg-danger/10'
                  }
                >
                  Reject Order
                </button>
              </div>
              <button
                type="button"
                onClick={() => setModal('confirmApprove')}
                disabled={!canApprove}
                className={
                  !canApprove
                    ? 'h-13.25 rounded-[28px] bg-foreground/10 text-muted-foreground font-semibold cursor-not-allowed'
                    : 'tap-effect h-13.25 rounded-[28px] bg-brand text-brand-foreground font-semibold hover:bg-brand/90'
                }
              >
                Approve Order
              </button>
              {canDeliver && (
                <button
                  type="button"
                  onClick={() => setModal('confirmDeliver')}
                  className="tap-effect h-13.25 rounded-[28px] bg-brand text-brand-foreground font-semibold hover:bg-brand/90"
                >
                  Mark Delivered
                </button>
              )}
              <button
                type="button"
                onClick={() => setModal('confirmCancel')}
                disabled={!canCancel}
                className={
                  !canCancel
                    ? 'h-13.25 rounded-[28px] bg-foreground/10 text-muted-foreground font-semibold cursor-not-allowed'
                    : 'tap-effect h-13.25 rounded-[28px] border border-border-strong text-foreground font-semibold hover:bg-muted'
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

      <ConfirmDialog
        open={modal === 'confirmDeliver'}
        onOpenChange={(o) => !o && setModal(null)}
        title={`Confirm Delivery - ${detail.summary.id}`}
        message="Are you sure you want to mark this order as delivered? The distributor will be notified immediately."
        confirmLabel="Mark Delivered"
        intent="primary"
        onConfirm={handleDeliverConfirmed}
      />

      {isProcessing && <LoadingOverlay message="Saving changes..." />}
    </section>
  );
}
