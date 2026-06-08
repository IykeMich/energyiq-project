import { useMemo, useState } from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { ConfirmDialog, SuccessModal } from '@energyiq/ui';
import { getOrderDetail, type OrderLineItem } from './mocks';
import { OrderInfoCard } from './components/order-info-card';
import { OrderDistributorCard } from './components/order-distributor-card';
import { RejectOrderModal } from './components/reject-order-modal';
import { ModifyOrderModal } from './components/modify-order-modal';
import { AddProductModal } from './components/add-product-modal';

type OpenModal = null | 'reject' | 'modify' | 'addProduct' | 'confirmApprove' | 'confirmReject';

interface SuccessState {
  open: boolean;
  title: string;
  subtitle: string;
  reference?: string;
}

export function OrderDetailPage() {
  const navigate = useNavigate();
  const { slug = '', id = '' } = useParams<{ slug: string; id: string }>();
  const [modal, setModal] = useState<OpenModal>(null);
  const [success, setSuccess] = useState<SuccessState>({ open: false, title: '', subtitle: '' });
  const [pendingReject, setPendingReject] = useState<{ reason: string; note: string } | null>(null);
  const [extraLineItems, setExtraLineItems] = useState<OrderLineItem[]>([]);

  const detail = useMemo(() => getOrderDetail(id), [id]);

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

  const fullDetail = {
    ...detail,
    lineItems: [...detail.lineItems, ...extraLineItems],
  };

  const closeSuccess = () => setSuccess((s) => ({ ...s, open: false }));

  const handleApproveConfirmed = () => {
    setModal(null);
    setSuccess({
      open: true,
      title: 'Order Approved',
      subtitle: `Order ${detail.summary.id} has been approved. The distributor has been notified.`,
      reference: detail.summary.id,
    });
  };

  const handleRejectConfirmed = () => {
    if (!pendingReject) return;
    setModal(null);
    setSuccess({
      open: true,
      title: 'Order Rejected',
      subtitle: `Order ${detail.summary.id} has been rejected. The distributor has been notified.`,
      reference: detail.summary.id,
    });
    setPendingReject(null);
  };

  return (
    <section className="flex flex-col gap-6">
      <header className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3.5">
          <button
            type="button"
            onClick={() => navigate(`/${slug}/orders`)}
            aria-label="Back to orders"
            className="w-[31px] h-[31px] rounded-full bg-brand text-brand-foreground flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="text-2xl font-semibold text-foreground">Order Details</h1>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-success/20 text-success px-4 py-2 text-sm font-semibold">
          <Send className="w-4 h-4" />
          Awaiting Approval
        </span>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6 items-start">
        <OrderInfoCard
          orderId={detail.summary.id}
          purchaseDate={`${detail.summary.date} | 09:45`}
          amountNGN={detail.summary.amountNGN}
          payment={{ method: detail.payment.method, status: detail.summary.payment }}
          delivery={detail.delivery}
          lineItems={fullDetail.lineItems}
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
                  className="h-[53px] rounded-[28px] border border-brand text-brand font-semibold"
                >
                  Modify Order
                </button>
                <button
                  type="button"
                  onClick={() => setModal('reject')}
                  className="h-[53px] rounded-[28px] border border-danger text-danger font-semibold"
                >
                  Reject Order
                </button>
              </div>
              <button
                type="button"
                onClick={() => setModal('confirmApprove')}
                className="h-[53px] rounded-[28px] bg-brand text-brand-foreground font-semibold"
              >
                Approve Order
              </button>
              <button
                type="button"
                onClick={() => setModal('addProduct')}
                className="h-[53px] rounded-[28px] bg-foreground/10 text-foreground font-semibold"
              >
                Add Product
              </button>
            </>
          }
        />
      </div>

      <RejectOrderModal
        open={modal === 'reject'}
        onOpenChange={(o) => !o && setModal(null)}
        detail={fullDetail}
        onReject={(d) => {
          setPendingReject(d);
          setModal('confirmReject');
        }}
      />

      <ModifyOrderModal
        open={modal === 'modify'}
        onOpenChange={(o) => !o && setModal(null)}
        detail={fullDetail}
        onSave={() => {
          setModal(null);
          setSuccess({
            open: true,
            title: 'Order Modified',
            subtitle: `Order ${detail.summary.id} has been updated. The distributor will receive the revised quote.`,
            reference: detail.summary.id,
          });
        }}
      />

      <AddProductModal
        open={modal === 'addProduct'}
        onOpenChange={(o) => !o && setModal(null)}
        orderId={detail.summary.id}
        onAdd={(item) => {
          setExtraLineItems((prev) => [...prev, item]);
          setModal(null);
        }}
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

      <SuccessModal
        open={success.open}
        onOpenChange={(o) => !o && closeSuccess()}
        title={success.title}
        subtitle={
          <>
            {success.subtitle.split(detail.summary.id).map((part, i, arr) => (
              <span key={i}>
                {part}
                {i < arr.length - 1 && (
                  <span className="text-brand font-semibold">{detail.summary.id}</span>
                )}
              </span>
            ))}
          </>
        }
        highlight={success.reference ? { label: 'Order Reference:', value: success.reference } : undefined}
        primaryAction={{ label: 'Track Order', onClick: closeSuccess }}
        secondaryAction={{
          label: 'Go to Home',
          onClick: () => {
            closeSuccess();
            navigate(`/${slug}/dashboard`);
          },
        }}
        buttonLayout="stack"
      />
    </section>
  );
}
