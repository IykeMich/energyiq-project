import {
  Dialog,
  DialogContent,
} from '@energyiq/ui';

import type { SaleRow } from './sales-mocks';

interface Props {
  open: boolean;
  onOpenChange: (
    open: boolean,
  ) => void;
  sale: SaleRow | null;
}

export function SaleDetailsModal({
  open,
  onOpenChange,
  sale,
}: Props) {
  if (!sale) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent
        className="
          max-w-120
          border-none
          bg-[#121212]
          text-white
        "
      >
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold">
              {sale.id}
            </h2>

            <p className="text-sm text-[#A3A3A3]">
              Sales Details
            </p>
          </div>

          <div className="space-y-4">
            <Row
              label="Product"
              value={sale.product}
            />

            <Row
              label="Quantity"
              value={`${sale.qty} L`}
            />

            <Row
              label="Unit Price"
              value={`₦${sale.unitPrice.toLocaleString()}`}
            />

            <Row
              label="Total Amount"
              value={`₦${sale.total.toLocaleString()}`}
            />

            <Row
              label="Customer"
              value={sale.customer}
            />

            <Row
              label="Method"
              value={sale.method}
            />

            <Row
              label="Date"
              value={sale.date}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Row({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex justify-between">
      <span className="text-[#A3A3A3]">
        {label}
      </span>

      <span>{value}</span>
    </div>
  );
}