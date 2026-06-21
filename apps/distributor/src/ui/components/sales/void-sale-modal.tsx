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

export function VoidSaleModal({
  open,
  onOpenChange,
  sale,
}: Props) {
  if (!sale) return null;

  const handleVoid = () => {
    console.log(
      'Voiding sale',
      sale.id,
    );

    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent
        className="
          max-w-[520px]
          border-none
          bg-[#121212]
          text-white
        "
      >
        <div className="space-y-6">
          <h2 className="text-lg font-semibold">
            Void Sale
          </h2>

          <div
            className="
              rounded-xl
              border
              border-[#991B1B]
              bg-[#450A0A]
              p-4
              text-sm
              text-[#FCA5A5]
            "
          >
            This action cannot be
            undone.
          </div>

          <div className="rounded-xl bg-[#1A1A1A] p-4">
            <div className="space-y-3">
              <Row
                label="Sales ID"
                value={sale.id}
              />

              <Row
                label="Product"
                value={sale.product}
              />

              <Row
                label="Total"
                value={`₦${sale.total.toLocaleString()}`}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() =>
                onOpenChange(false)
              }
              className="
                rounded-full
                bg-[#2A2A2A]
                px-6
                py-2
              "
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleVoid}
              className="
                rounded-full
                bg-[#B91C1C]
                px-6
                py-2
                text-white
              "
            >
              Void Sale
            </button>
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