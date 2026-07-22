import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { LoadingOverlay, toast } from '@energyiq/ui';
import { useOrderQuery, useDispatchOrderMutation } from '@/hooks/use-orders';
import { toOrderDispatch } from '@/ui/pages/order/mocks';
import { OrderProgressStepper } from './order-progress-stepper';
import { OrderSummaryCard } from './order-summary-card';
import { OrderDeliveryDetailsCard } from './order-delivery-details-card';
import { DispatchAssignmentForm, type DispatchAssignmentValues } from './dispatch-assignment-form';
import { ConfirmDeliveryCard } from './confirm-delivery-card';
import { OrderDispatchedSuccess } from './order-dispatched-success';

type DispatchStage = 'assign' | 'review' | 'success';

// Last-completed stepper index per stage: Order Approved → Preparing Goods → Dispatched.
const STAGE_ACTIVE_INDEX: Record<DispatchStage, number> = {
  assign: 0,
  review: 1,
  success: 3,
};

interface OrderDispatchFlowProps {
  orderId: string;
}

/** Supplier "Approve Order" dispatch wizard: assign → review → dispatched success. */
export function OrderDispatchFlow({ orderId }: OrderDispatchFlowProps) {
  const navigate = useNavigate();
  const { slug = '' } = useParams<{ slug: string }>();
  const { data: order, isLoading, error } = useOrderQuery(orderId);
  const dispatchMutation = useDispatchOrderMutation();

  const dispatch = useMemo(() => (order ? toOrderDispatch(order) : null), [order]);

  const [stage, setStage] = useState<DispatchStage>('assign');
  const [assignment, setAssignment] = useState<DispatchAssignmentValues>({
    driverName: '',
    vehiclePlate: '',
    trackingNumber: '',
    estimatedDelivery: '',
    dispatchNote: '',
  });

  useEffect(() => {
    if (dispatch) {
      setAssignment((prev) => ({
        ...dispatch.assignment,
        dispatchNote: prev.dispatchNote,
      }));
    }
  }, [dispatch]);

  const goToOrders = () => navigate(`/${slug}/orders`);
  const goHome = () => navigate(`/${slug}/dashboard`);

  if (isLoading) {
    return <LoadingOverlay message="Loading dispatch details..." />;
  }

  if (error) {
    return (
      <section className="flex flex-col gap-6">
        <header className="flex items-center gap-3.5">
          <button
            type="button"
            onClick={goToOrders}
            aria-label="Back to orders"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-brand-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="text-2xl font-semibold text-foreground">{orderId}</h1>
        </header>
        <p className="text-sm text-muted-foreground">Unable to load dispatch details. Please try again.</p>
      </section>
    );
  }

  if (!dispatch) {
    return (
      <section className="flex flex-col gap-6">
        <header className="flex items-center gap-3.5">
          <button
            type="button"
            onClick={goToOrders}
            aria-label="Back to orders"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-brand-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="text-2xl font-semibold text-foreground">{orderId}</h1>
        </header>
        <p className="text-sm text-muted-foreground">Order not found.</p>
      </section>
    );
  }

  const handleConfirm = () => {
    dispatchMutation.mutate(
      {
        id: orderId,
        req: {
          driver_name: assignment.driverName,
          vehicle_plate: assignment.vehiclePlate,
          tracking_number: assignment.trackingNumber,
          estimated_delivery: assignment.estimatedDelivery,
          note: assignment.dispatchNote,
        },
      },
      {
        onSuccess: () => setStage('success'),
        onError: (err) => {
          toast.error('Dispatch failed', {
            description: err instanceof Error ? err.message : 'Unable to dispatch order. Please try again.',
          });
        },
      },
    );
  };

  return (
    <section className="flex flex-col gap-6">
      <header className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3.5">
          <button
            type="button"
            onClick={goToOrders}
            aria-label="Back to orders"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-brand-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="text-2xl font-semibold text-foreground">{orderId}</h1>
        </div>
        {stage === 'success' ? (
          <span className="inline-flex items-center gap-2 rounded-full bg-[#1B22AF]/20 px-4 py-2 text-sm font-semibold text-[#6F77FF]">
            <Send className="h-4 w-4" />
            Dispatched
          </span>
        ) : (
          <span className="inline-flex items-center gap-2 rounded-full bg-[#6366F1]/20 px-4 py-2 text-sm font-semibold text-[#8B8FF7]">
            <Send className="h-4 w-4" />
            Awaiting Dispatch
          </span>
        )}
      </header>

      <OrderProgressStepper activeIndex={STAGE_ACTIVE_INDEX[stage]} />

      {stage === 'success' ? (
        <OrderDispatchedSuccess
          success={dispatch.success}
          quantities={dispatch.dispatchedQuantities}
          onGoHome={goHome}
          onBackToOrders={goToOrders}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 items-start">
            <OrderSummaryCard summary={dispatch.summary} />
            <OrderDeliveryDetailsCard delivery={dispatch.delivery} />
          </div>

          {stage === 'assign' ? (
            <DispatchAssignmentForm
              values={assignment}
              onChange={setAssignment}
              onSaveDraft={goToOrders}
              onConfirm={() => setStage('review')}
            />
          ) : (
            <ConfirmDeliveryCard
              assignment={assignment}
              quantities={dispatch.dispatchedQuantities}
              onSaveDraft={goToOrders}
              onConfirm={handleConfirm}
            />
          )}
        </>
      )}

      {dispatchMutation.isPending && <LoadingOverlay message="Dispatching order..." />}
    </section>
  );
}
