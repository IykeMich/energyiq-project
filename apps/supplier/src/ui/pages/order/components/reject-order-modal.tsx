import { useEffect, useState } from 'react';
import { Modal, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@energyiq/ui';
import { REJECT_REASONS, type OrderDetail } from '../mocks';

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
      title={`Reject Order- ${detail.summary.id}`}
      size="lg"
    >
      <div className="flex flex-col gap-6">
        <dl className="flex flex-col gap-3 text-sm text-foreground">
          <Row label="Order ID:" value={detail.summary.id} />
          <Row label="Distributor:" value={detail.distributor.name} />
          <Row label="Product:" value={productSummary} />
          <Row label="Total:" value={`₦${NGN.format(detail.payment.total)}`} />
        </dl>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-foreground">Reject Reason:</label>
          <Select value={reason} onValueChange={(v) => setReason(v ?? '')}>
            <SelectTrigger className="bg-surface-card border-border-strong h-[52px] rounded-[28px] text-foreground px-5">
              <SelectValue placeholder="Select a reason" />
            </SelectTrigger>
            <SelectContent>
              {REJECT_REASONS.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-foreground">Note to Distributor:</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={5}
            placeholder="Optional context for the distributor"
            className="bg-surface-card border border-border-strong rounded-[28px] p-5 text-foreground placeholder:text-muted-foreground outline-none focus:border-brand resize-none"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => canReject && onReject({ reason, note })}
            disabled={!canReject}
            className="h-[53px] rounded-[28px] bg-brand text-brand-foreground font-semibold px-12 disabled:opacity-50 disabled:cursor-not-allowed"
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
