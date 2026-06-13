import { Truck } from 'lucide-react';
import type { OrderDispatchAssignment } from '@/ui/pages/order/mocks';

export interface DispatchAssignmentValues extends OrderDispatchAssignment {
  dispatchNote: string;
}

interface DispatchAssignmentFormProps {
  values: DispatchAssignmentValues;
  onChange: (next: DispatchAssignmentValues) => void;
  onSaveDraft: () => void;
  onConfirm: () => void;
}

/** Dispatch Assignment stage: capture driver/vehicle/tracking/ETA + note, then confirm. */
export function DispatchAssignmentForm({
  values,
  onChange,
  onSaveDraft,
  onConfirm,
}: DispatchAssignmentFormProps) {
  const setField = (field: keyof DispatchAssignmentValues, value: string) =>
    onChange({ ...values, [field]: value });

  return (
    <section className="rounded-[28px] border border-dashed border-border-strong p-7 flex flex-col gap-6">
      <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
        <Truck className="h-5 w-5 text-brand" aria-hidden="true" />
        Dispatch Assignment
      </h2>

      <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
        <Field
          label="Driver's Name:"
          value={values.driverName}
          onChange={(value) => setField('driverName', value)}
        />
        <Field
          label="Vehicle plate number :"
          value={values.vehiclePlate}
          onChange={(value) => setField('vehiclePlate', value)}
        />
        <Field
          label="Tracking / waybill number:"
          value={values.trackingNumber}
          onChange={(value) => setField('trackingNumber', value)}
        />
        <Field
          label="Estimated Delivery:"
          value={values.estimatedDelivery}
          onChange={(value) => setField('estimatedDelivery', value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm text-foreground">Dispatch Note:</label>
        <textarea
          value={values.dispatchNote}
          onChange={(event) => setField('dispatchNote', event.target.value)}
          rows={3}
          placeholder="e.g. Fragile items, Refrigeration needed.."
          className="resize-none rounded-[16px] border border-border-strong bg-surface-card p-4 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-brand"
        />
      </div>

      <p className="text-xs text-warning">
        The distributor will be notified by SMS and email when this order is marked as dispatched.
      </p>

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
          Confirm Dispatch
        </button>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-foreground">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 rounded-[16px] border border-border-strong bg-surface-card px-4 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-brand"
      />
    </div>
  );
}
