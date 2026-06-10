import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ConfirmDialog, SuccessModal } from '@energyiq/ui';
import { PageHeaderContent } from '@/ui/layouts/page-header';
import { OrdersSearchBar } from '../orders/orders-search-bar';
import { OrderDetailHeader } from './order-detail-header';
import { OrderDetailInfoCard } from './order-detail-info-card';
import { OrderDetailSummaryCard } from './order-detail-summary-card';
import { OrderDetailActions } from './order-detail-actions';
import { OrderDetailHelpCard } from './order-detail-help-card';
import type { OrderDetailData } from './order-detail-mocks';

type OpenModal = null | 'approve' | 'reject';

interface OrderDetailOverviewProps {
  data: OrderDetailData;
}

/**
 * Supplier Order Details page. Search lives in the layout header (matching the
 * design's top row); the order info/items/timeline and supplier/payment summary
 * fill the body. Action flows use the shared confirm + success modals for now.
 */
export function OrderDetailOverview({ data }: OrderDetailOverviewProps) {
  const navigate = useNavigate();
  const { slug = '' } = useParams<{ slug: string }>();
  // TODO(orval): wire this search to the global order search once the API lands.
  const [searchQuery, setSearchQuery] = useState('');
  const [modal, setModal] = useState<OpenModal>(null);
  const [success, setSuccess] = useState({ open: false, title: '', subtitle: '' });

  const goToOrders = () => navigate(`/${slug}/orders`);
  const closeModal = () => setModal(null);

  const handleApprove = () => {
    setModal(null);
    setSuccess({
      open: true,
      title: 'Order Approved',
      subtitle: `Order ${data.orderId} has been approved. The distributor has been notified.`,
    });
  };

  const handleReject = () => {
    setModal(null);
    setSuccess({
      open: true,
      title: 'Order Rejected',
      subtitle: `Order ${data.orderId} has been rejected. The distributor has been notified.`,
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
                  onModify={() => navigate(`/${slug}/orders/${data.orderId}/edit`)}
                  onReject={() => setModal('reject')}
                  onApprove={() => setModal('approve')}
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
        message="Are you sure you want to approve this order? The distributor will be notified immediately."
        confirmLabel="Approve"
        intent="primary"
        onConfirm={handleApprove}
      />

      <ConfirmDialog
        open={modal === 'reject'}
        onOpenChange={(open) => !open && closeModal()}
        title="Reject Confirmation"
        message="Are you sure you want to reject this order? The distributor will be notified immediately."
        confirmLabel="Confirm Rejection"
        intent="danger"
        onConfirm={handleReject}
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
