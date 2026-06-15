import { cn } from '@energyiq/shared';
import type { RecordSaleForm } from './types';

const METHODS = [
  'Cash',
  'Bank Transfer',
  'POS',
  'Credit',
];

interface Props {
  formData: RecordSaleForm;
  setFormData: React.Dispatch<
    React.SetStateAction<RecordSaleForm>
  >;
}

export function PaymentMethodSelector({
  formData,
  setFormData,
}: Props) {
  return (
    <>
      <p className="mb-3 text-xs text-[#FFFFFF80]">
        Payment Method
      </p>

      <div className="flex flex-wrap gap-2">
        {METHODS.map((method) => (
          <button
            key={method}
            onClick={() =>
              setFormData((prev) => ({
                ...prev,
                paymentMethod:
                  method,
              }))
            }
            className={cn(
              'rounded-full border px-4 py-2 text-xs',
              formData.paymentMethod ===
                method
                ? 'border-[#FBC02D] bg-[#FBC02D] text-black'
                : 'border-[#262626] text-white',
            )}
          >
            {method}
          </button>
        ))}
      </div>
    </>
  );
}