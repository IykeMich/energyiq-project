import { AlertTriangle, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@energyiq/ui';
import { useState } from 'react';
import type { SaleRow } from './sales-mocks';

interface VoidSaleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sale: SaleRow | null;
}

interface InfoRowProps {
  label: string;
  value: React.ReactNode;
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-[#FFFFFF99]">
        {label}
      </span>

      <span className="text-sm font-medium text-white">
        {value}
      </span>
    </div>
  );
}

export function VoidSaleModal({
  open,
  onOpenChange,
  sale,
}: VoidSaleModalProps) {
  const [reason, setReason] = useState('');

  if (!sale) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[480px] border-none bg-[#0B0B0B] text-white">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg">
              Void Sale
            </DialogTitle>

            <button
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4 text-[#FFFFFF80]" />
            </button>
          </div>
        </DialogHeader>

        <div className="space-y-5">

          {/* Warning */}
          <div className="rounded-xl bg-[#2B0B0B] p-4">
            <div className="flex gap-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 text-[#EF4444]" />

              <div>
                <p className="text-sm font-medium text-[#EF4444]">
                  This action cannot be undone.
                </p>

                <p className="mt-1 text-xs text-[#FFFFFF80]">
                  This sale will be marked void and removed
                  from reports and daily metrics.
                </p>
              </div>
            </div>
          </div>

          {/* Sale Summary */}
          <div className="rounded-[16px] bg-[#121212] p-4">
            <InfoRow
              label="Sales ID:"
              value={`#${sale.id}`}
            />

            <InfoRow
              label="Product:"
              value={`${sale.product} • ${sale.qty}L`}
            />

            <InfoRow
              label="Total Amount:"
              value={`₦${sale.total.toLocaleString(
                'en-NG',
              )}`}
            />
          </div>

          {/* Reason */}
          <div>
            <label className="mb-2 block text-sm text-[#FFFFFF99]">
              Reason for void
            </label>

            <Select
  value={reason}
  onValueChange={(value) => setReason(value ?? '')}
>
              <SelectTrigger className="border-[#2A2A2A] bg-[#121212]">
                <SelectValue placeholder="Select reason" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="data-entry">
                  Data Entry Error
                </SelectItem>

                <SelectItem value="duplicate">
                  Duplicate Sale
                </SelectItem>

                <SelectItem value="customer">
                  Customer Cancellation
                </SelectItem>

                <SelectItem value="other">
                  Other
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Footer */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() =>
                onOpenChange(false)
              }
            >
              Cancel
            </Button>

            <Button
              className="flex-1 bg-[#EF4444] text-white"
            >
              Void Sale
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}