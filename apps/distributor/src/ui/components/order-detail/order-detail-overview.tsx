import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ConfirmDialog, SuccessModal, toast } from '@energyiq/ui';
import { PageHeaderContent } from '@/ui/layouts/page-header';
import { useCancelOrderMutation, useDeliverOrderMutation } from '@/hooks/use-orders';
import { OrdersSearchBar } from '../orders/orders-search-bar';
import { OrderDetailHeader } from './order-detail-header';
import { OrderDetailInfoCard } from './order-detail-info-card';
import { OrderDetailSummaryCard } from './order-detail-summary-card';
import { OrderDetailActions } from './order-detail-actions';
import { OrderDetailHelpCard } from './order-detail-help-card';
import { getAvailableActions } from './order-detail-mapper';
import type { OrderDetailData } from './order-detail-mocks';

type OpenModal = null | 'cancel' | 'receive';

interface OrderDetailOverviewProps {
  data: OrderDetailData;
  orderId: string;
}

/**
 * Distributor Order Details page. Wires the order action buttons to the real
 * distributor order API endpoints (cancel, receive/deliver, modify — a
 * distributor never approves/rejects/dispatches its own purchase order).
 */
export function OrderDetailOverview({ data, orderId }: OrderDetailOverviewProps) {
  const navigate = useNavigate();
  const { slug = '' } = useParams<{ slug: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  const [modal, setModal] = useState<OpenModal>(null);
  const [success, setSuccess] = useState({ open: false, title: '', subtitle: '' });

  const cancelMutation = useCancelOrderMutation();
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
                  onCancel={() => setModal('cancel')}
                  onReceive={() => setModal('receive')}
                />
              }
            />
            <OrderDetailHelpCard help={data.help} />
          </div>
        </div>
      </section>

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
