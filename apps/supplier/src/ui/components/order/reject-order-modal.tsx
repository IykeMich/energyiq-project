import { useEffect, useState } from 'react';
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';
import { X } from 'lucide-react';
import { Modal } from '@energyiq/ui';
import {  type OrderDetail } from './order-detail-mapper';
import { TextField } from '../product/wizard-fields';

const NGN = new Intl.NumberFormat('en-NG');

interface RejectOrderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  detail: OrderDetail;
  onReject: (data: { reason: string; note: string }) => void;
}

export function RejectOrderModal({ open, onOpenChange, detail, onReject }: RejectOrderModalProps) {
  const [reason, setReason] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (open) {
      setReason('');
      setNote('');
    }
  }, [open]);

  const canReject = reason.trim().length > 0;
  const productSummary = detail.lineItems
    .map((li) => `${li.name.split(' (')[0]} (${li.quantityLabel})`)
    .join(' ; ');

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      showClose={false}
      className="bg-[#121212] rounded-[36px] max-w-226 border-0"
    >
      <div className="px-16 pt-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2.5">
            <span className="h-8.75 w-1.25 rounded-xs bg-brand" />
            <h2 className="text-[22px] font-semibold text-[#FAFAFA] m-0">
              {`Reject Order- ${detail.summary.id}`}
            </h2>
          </div>
          <DialogPrimitive.Close
            aria-label="Close"
            className="tap-effect flex h-8 w-8 items-center justify-center rounded-full bg-brand text-brand-foreground hover:bg-brand/90"
          >
            <X className="h-4 w-4" />
          </DialogPrimitive.Close>
        </div>
      </div>

      <div className="px-16 pb-10 flex flex-col gap-6">
        <dl className="flex flex-col gap-3 text-lg font-medium text-[#FAFAFA]">
          <Row label="Order ID:" value={detail.summary.id} />
          <Row label="Distributor:" value={detail.distributor.name} />
          <Row label="Product:" value={productSummary} />
          <Row label="Total:" value={`₦${NGN.format(detail.payment.total)}`} />
        </dl>

        <div className="flex flex-col gap-2">
                  <TextField
                    label="Reject Reason:"
                    value={reason}
                    onChange={(v) => setReason(v)}
                    placeholder="e.g. Fuel"
                  />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-lg font-medium text-[#FAFAFA]">Note to Distributor:</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={5}
            placeholder="Optional context for the distributor"
            className="bg-[#6161611A] rounded-[33px] p-5 text-base text-[#FAFAFA] placeholder:text-muted-foreground outline-none focus:outline focus:outline-brand resize-none"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => canReject && onReject({ reason, note })}
            disabled={!canReject}
            className="tap-effect w-39.5 h-13.25 rounded-[34px] bg-brand text-brand-foreground font-semibold hover:bg-brand/90 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-brand"
          >
            Reject
          </button>
        </div>
      </div>
    </Modal>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex">
      <dt className="font-medium mr-2">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
