import { ClipboardCheck } from 'lucide-react';
import type { DispatchedQuantity } from '@/ui/pages/order/mocks';
import type { DispatchAssignmentValues } from './dispatch-assignment-form';

interface ConfirmDeliveryCardProps {
  assignment: DispatchAssignmentValues;
  quantities: DispatchedQuantity[];
  onSaveDraft: () => void;
  onConfirm: () => void;
}

/** Confirm Delivery stage: review the entered dispatch details + quantities, then confirm. */
export function ConfirmDeliveryCard({
  assignment,
  quantities,
  onSaveDraft,
  onConfirm,
}: ConfirmDeliveryCardProps) {
  return (
    <section className="rounded-[28px] border border-dashed border-success p-7 flex flex-col gap-6">
      <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
        <ClipboardCheck className="h-5 w-5 text-success" aria-hidden="true" />
        Confirm Delivery
      </h2>

      <dl className="flex flex-col gap-4 text-sm text-foreground">
        <Row label="Driver's Name:" value={assignment.driverName} />
        <Row label="Vehicle plate number :" value={assignment.vehiclePlate} />
        <Row label="Tracking / waybill number:" value={assignment.trackingNumber} />
        <div className="flex items-start justify-between gap-4">
          <dt className="text-foreground">Quantity Dispatched:</dt>
          <dd className="flex flex-col items-end gap-1 font-semibold text-right">
            {quantities.map((quantity) => (
              <span key={quantity.id}>{quantity.label}</span>
            ))}
          </dd>
        </div>
      </dl>

      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onSaveDraft}
          className="h-11 rounded-full bg-foreground/10 px-6 text-sm font-semibold text-foreground"
        >
          Save as Draft
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="h-11 rounded-full bg-brand px-6 text-sm font-semibold text-brand-foreground"
        >
          Confirm Delivery
        </button>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-foreground">{label}</dt>
      <dd className="font-semibold text-right">{value}</dd>
    </div>
  );
}
