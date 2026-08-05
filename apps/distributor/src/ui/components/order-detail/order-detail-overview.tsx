import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ConfirmDialog, SuccessModal, toast } from '@energyiq/ui';
import { PageHeaderContent } from '@/ui/layouts/page-header';
import {
  useApproveOrderMutation,
  useRejectOrderMutation,
  useCancelOrderMutation,
  useDispatchOrderMutation,
  useDeliverOrderMutation,
} from '@/hooks/use-orders';
import { OrdersSearchBar } from '../orders/orders-search-bar';
import { OrderDetailHeader } from './order-detail-header';
import { OrderDetailInfoCard } from './order-detail-info-card';
import { OrderDetailSummaryCard } from './order-detail-summary-card';
import { OrderDetailActions } from './order-detail-actions';
import { OrderDetailHelpCard } from './order-detail-help-card';
import { getAvailableActions } from './order-detail-mapper';
import type { OrderDetailData } from './order-detail-mocks';

type OpenModal = null | 'approve' | 'reject' | 'cancel' | 'dispatch' | 'receive';

interface OrderDetailOverviewProps {
  data: OrderDetailData;
  orderId: string;
}

/**
 * Distributor Order Details page. Wires the order action buttons to the real
 * order API endpoints.
 */
export function OrderDetailOverview({ data, orderId }: OrderDetailOverviewProps) {
  const navigate = useNavigate();
  const { slug = '' } = useParams<{ slug: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  const [modal, setModal] = useState<OpenModal>(null);
  const [success, setSuccess] = useState({ open: false, title: '', subtitle: '' });

  const approveMutation = useApproveOrderMutation();
  const rejectMutation = useRejectOrderMutation();
  const cancelMutation = useCancelOrderMutation();
  const dispatchMutation = useDispatchOrderMutation();
  const deliverMutation = useDeliverOrderMutation();

  const goToOrders = () => navigate(`/${slug}/orders`);
  const closeModal = () => setModal(null);

  const backendStatus = data.status.label.toLowerCase();
  const actions = getAvailableActions(backendStatus);

  const runMutation = (
    mutate: () => void,
    successTitle: string,
    successSubtitle: string,
  ) => {
    mutate();
    setModal(null);
    setSuccess({ open: true, title: successTitle, subtitle: successSubtitle });
  };

  const handleApprove = () => {
    approveMutation.mutate(orderId, {
      onSuccess: () =>
        runMutation(
          () => {},
          'Order Approved',
          `Order ${data.orderId} has been approved. The supplier has been notified.`,
        ),
      onError: (error) => {
        closeModal();
        toast.error('Approval failed', { description: (error as Error).message });
      },
    });
  };

  const handleReject = () => {
    rejectMutation.mutate(
      { id: orderId, req: { reason: 'Rejected by distributor' } },
      {
        onSuccess: () =>
          runMutation(
            () => {},
            'Order Rejected',
            `Order ${data.orderId} has been rejected. The supplier has been notified.`,
          ),
        onError: (error) => {
          closeModal();
          toast.error('Rejection failed', { description: (error as Error).message });
        },
      },
    );
  };

  const handleCancel = () => {
    cancelMutation.mutate(orderId, {
      onSuccess: () =>
        runMutation(
          () => {},
          'Order Cancelled',
          `Order ${data.orderId} has been cancelled.`,
        ),
      onError: (error) => {
        closeModal();
        toast.error('Cancellation failed', { description: (error as Error).message });
      },
    });
  };

  const handleDispatch = () => {
    dispatchMutation.mutate(
      {
        id: orderId,
        req: {
          driver_name: 'Driver',
          estimated_delivery: new Date().toISOString(),
          tracking_number: 'TRACK-001',
          vehicle_plate: 'ABC-123',
        },
      },
      {
        onSuccess: () =>
          runMutation(
            () => {},
            'Order Dispatched',
            `Order ${data.orderId} has been dispatched.`,
          ),
        onError: (error) => {
          closeModal();
          toast.error('Dispatch failed', { description: (error as Error).message });
        },
      },
    );
  };

  const handleReceive = () => {
    deliverMutation.mutate(orderId, {
      onSuccess: () =>
        runMutation(
          () => {},
          'Order Received',
          `Order ${data.orderId} has been marked as received.`,
        ),
      onError: (error) => {
        closeModal();
        toast.error('Receive failed', { description: (error as Error).message });
      },
    });
  };

  return (
    <>
      <PageHeaderContent>
        <OrdersSearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      </PageHeaderContent>

      <section className="flex flex-col gap-6">
        <OrderDetailHeader status={data.status} onBack={goToOrders} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.65fr_1fr]">
          <OrderDetailInfoCard data={data} />

          <div className="flex flex-col gap-6">
            <OrderDetailSummaryCard
              data={data}
              actions={
                <OrderDetailActions
                  {...actions}
                  onModify={() => navigate(`/${slug}/orders/${orderId}/edit`)}
                  onReject={() => setModal('reject')}
                  onApprove={() => setModal('approve')}
                  onCancel={() => setModal('cancel')}
                  onDispatch={() => setModal('dispatch')}
                  onReceive={() => setModal('receive')}
                />
              }
            />
            <OrderDetailHelpCard help={data.help} />
          </div>
        </div>
      </section>

      <ConfirmDialog
        open={modal === 'approve'}
        onOpenChange={(open) => !open && closeModal()}
        title={`Confirm Approval - ${data.orderId}`}
        message="Are you sure you want to approve this order? The supplier will be notified immediately."
        confirmLabel="Approve"
        intent="primary"
        onConfirm={handleApprove}
      />

      <ConfirmDialog
        open={modal === 'reject'}
        onOpenChange={(open) => !open && closeModal()}
        title="Reject Confirmation"
        message="Are you sure you want to reject this order? The supplier will be notified immediately."
        confirmLabel="Confirm Rejection"
        intent="danger"
        onConfirm={handleReject}
      />

      <ConfirmDialog
        open={modal === 'cancel'}
        onOpenChange={(open) => !open && closeModal()}
        title="Cancel Confirmation"
        message="Are you sure you want to cancel this order? This action cannot be undone."
        confirmLabel="Cancel Order"
        intent="danger"
        onConfirm={handleCancel}
      />

      <ConfirmDialog
        open={modal === 'dispatch'}
        onOpenChange={(open) => !open && closeModal()}
        title="Dispatch Confirmation"
        message="Are you sure you want to dispatch this order?"
        confirmLabel="Dispatch"
        intent="primary"
        onConfirm={handleDispatch}
      />

      <ConfirmDialog
        open={modal === 'receive'}
        onOpenChange={(open) => !open && closeModal()}
        title="Receive Confirmation"
        message="Confirm that you have received this order."
        confirmLabel="Mark Received"
        intent="primary"
        onConfirm={handleReceive}
      />

      <SuccessModal
        open={success.open}
        onOpenChange={(open) => !open && setSuccess((state) => ({ ...state, open: false }))}
        title={success.title}
        subtitle={success.subtitle}
        primaryAction={{ label: 'Back to Orders', onClick: goToOrders }}
      />
    </>
  );
}
