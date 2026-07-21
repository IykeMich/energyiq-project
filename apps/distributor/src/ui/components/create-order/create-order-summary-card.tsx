import { OrderDetailRow } from '../order-detail/order-detail-row';
import { CreateOrderBindingNotice } from './create-order-binding-notice';
import { formatNaira } from './create-order-mocks';
import { useCreateOrderMutation } from '@/hooks/use-orders';
// import type { CreateOrderLineItem } from './create-order-products-card';

export interface CreateOrderSummaryLine {
  label: string;
  amount: number;
}

export interface CreateOrderSummaryData {
  /** Per-fuel breakdown shown at the top (PMS, AGO). */
  lineItems: CreateOrderSummaryLine[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  balance: number;
}

interface CreateOrderSummaryCardProps {
    summary: CreateOrderSummaryData;

  // lineItems: CreateOrderLineItem[];
  // distributorId: string;
  notes?: string;
  shippingAddress?: Record<string, unknown>;

  isEmpty: boolean;
  onSaveDraft: () => void;

  submitLabel?: string;
  bindingNoticeInline?: boolean;
  onSubmit: () => void;
  // isSubmitting: boolean;
}

/** Right column: live order totals, primary actions, and trading balance. */
export function CreateOrderSummaryCard({
  summary,
  // lineItems,
  // distributorId,
  // notes,
  // shippingAddress,
  isEmpty,
  onSaveDraft,
  // onSubmit,
  // isSubmitting,
  submitLabel = 'Create New Order',
  bindingNoticeInline = true,
}: CreateOrderSummaryCardProps) {

const createOrder = useCreateOrderMutation();

const handleSubmit = async () => {
  try {
    // await createOrder.mutateAsync({
    //   distributor_id: distributorId,

    //   items: lineItems.map(item => ({
    //     product_id: item.productId,
    //     quantity: item.quantity,
    //   })),

    //   notes,

    //   shipping_address: shippingAddress,
    // });

    console.log('Order created successfully');
  } catch (error) {
    console.error('Create order failed', error);
  }
};


  return (
    <div className="flex flex-col gap-6 rounded-[18px] bg-[#6161611A] p-8 lg:sticky lg:top-6">
      <h2 className="text-lg font-semibold text-foreground">Order Summary</h2>

      <div className="flex flex-col gap-3">
        {summary.lineItems.map((line) => (
          <OrderDetailRow key={line.label} label={line.label} value={formatNaira(line.amount)} />
        ))}
      </div>

      <div className="h-px w-full bg-[#FFFFFF1A]" />

      <div className="flex flex-col gap-3">
        <OrderDetailRow label="Subtotal:" value={formatNaira(summary.subtotal)} />
        <OrderDetailRow
          label="Gold Tier Discount (10%):"
          value={`−${formatNaira(summary.discount)}`}
        />
        <OrderDetailRow
          label="Delivery Fee:"
          value={summary.deliveryFee === 0 ? 'Free' : formatNaira(summary.deliveryFee)}
        />
      </div>

      {/* Total Amount — solid gold bar; Balance Amount — muted dark bar. */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between gap-4 rounded-2xl bg-[#FBC02D] px-5 py-4">
          <span className="text-base font-semibold text-[#121212]">Total Amount:</span>
          <span className="text-base font-bold text-[#121212]">{formatNaira(summary.total)}</span>
        </div>
        <div className="flex items-center justify-between gap-4 rounded-2xl bg-[#FBC02D14] px-5 py-4">
          <span className="text-base font-medium text-foreground">Balance Amount:</span>
          <span className="text-base font-semibold text-foreground">
            {formatNaira(summary.balance)}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
       <button
  type="button"
  onClick={handleSubmit}
  disabled={isEmpty || createOrder.isPending}
  className="tap-effect h-[52px] rounded-full bg-[#FBC02D] text-base font-semibold text-[#121212] disabled:opacity-50"
>
  {createOrder.isPending ? 'Submitting…' : submitLabel}
</button>
        <button
          type="button"
          onClick={onSaveDraft}
          className="tap-effect h-[52px] rounded-full border border-[#FBC02D] text-base font-semibold text-[#FBC02D]"
        >
          Save as Draft
        </button>
      </div>

      {bindingNoticeInline && <CreateOrderBindingNotice variant="inline" />}
    </div>
  );
}
