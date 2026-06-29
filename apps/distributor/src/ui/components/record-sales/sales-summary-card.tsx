import type { RecordSaleForm } from './types';

interface Props {
  formData: RecordSaleForm;
}

export function SalesSummaryCard({
  formData,
}: Props) {
  const hasRequiredData =
    Boolean(formData.product) &&
    formData.quantity > 0 &&
    formData.unitPrice > 0;

  const total =
    formData.quantity *
    formData.unitPrice;

  if (!hasRequiredData) {
    return (
     <div className="flex h-130 w-full items-center justify-center rounded-[24px] border border-[#3A3A3A] bg-[#1B1B1B]">
        <p className="max-w-70 text-center text-xs italic text-[#7D7D7D]">
          The sales summary will appear when the required details
          has been entered.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[24px] border border-[#3A3A3A] bg-[#1B1B1B] p-4">
      <h2 className="mb-4 text-xs font-medium text-[#FBC02D]">
        Sales Summary
      </h2>

      <div className="mb-5 border-b border-[#2E2E2E]" />

      <div className="space-y-5 text-sm">
        <Row
          label="Product:"
          value={formData.product}
        />

        <Row
          label="Quantity:"
          value={formData.quantity.toLocaleString()}
        />

        <Row
          label="Unit Price:"
          value={`₦${formData.unitPrice.toLocaleString()}`}
        />

        <Row
          label="Payment Method:"
          value={
            formData.paymentMethod || '-'
          }
        />

        <Row
          label="Date / Time:"
          value={formData.date || '-'}
        />

        <Row
          label="Customer Name:"
          value={
            formData.customerName || '-'
          }
        />

        <div className="pt-5" />

        <Row
          label="Total Amount:"
          value={`₦${total.toLocaleString()}`}
          bold
        />
      </div>

      <div className="mt-8 border-t border-[#2E2E2E] pt-5">
        <div className="flex gap-3">
          <button
            type="button"
            className="flex-1 rounded-full bg-[#4A4A4A] py-3 text-sm text-white transition hover:bg-[#5A5A5A]"
          >
            Back
          </button>

          <button
            type="button"
            className="flex-1 rounded-full bg-[#FBC02D] py-3 text-sm font-medium text-black transition hover:opacity-90"
          >
            Submit Sales
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  bold = false,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-[#E5E5E5]">
        {label}
      </span>

      <span
        className={`text-right ${
          bold
            ? 'font-medium text-white'
            : 'text-white'
        }`}
      >
        {value || '-'}
      </span>
    </div>
  );
}