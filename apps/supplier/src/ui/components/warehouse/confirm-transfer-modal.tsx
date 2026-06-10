import { ArrowRight } from 'lucide-react';
import { Modal } from '@energyiq/ui';
import type { StockTransferPayload } from './warehouse-stock-transfer';

interface ConfirmTransferModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payload: StockTransferPayload | null;
  onBack: () => void;
  onConfirm: () => void;
}

export function ConfirmTransferModal({
  open,
  onOpenChange,
  payload,
  onBack,
  onConfirm,
}: ConfirmTransferModalProps) {
  return (
    <Modal open={open} onOpenChange={onOpenChange} title="Confirm Transfer" size="md">
      {payload && (
        <div className="bg-surface-card border border-border-subtle rounded-[20px] p-5 flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <Endpoint label="From:" name={payload.fromName} location={payload.fromLocation} />
            <span className="w-8 h-8 rounded-full bg-brand text-brand-foreground flex items-center justify-center shrink-0">
              <ArrowRight className="w-4 h-4" />
            </span>
            <Endpoint label="To:" name={payload.toName} location={payload.toLocation} />
          </div>

          <div className="border-t border-border-subtle pt-4 flex flex-col gap-3">
            <Row label="Product:" value={payload.product} />
            <Row label="Quantity:" value={`${payload.quantity}L`} />
            <Row label="Notes:" value={payload.notes || '–'} />
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 mt-6">
        <button
          type="button"
          onClick={onBack}
          className="h-[53px] rounded-[28px] bg-foreground/10 text-foreground font-semibold px-8"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="flex-1 h-[53px] rounded-[28px] bg-brand text-brand-foreground font-semibold"
        >
          Confirm Transfer
        </button>
      </div>
    </Modal>
  );
}

function Endpoint({ label, name, location }: { label: string; name: string; location: string }) {
  return (
    <div className="flex-1 bg-surface-modal border border-border-subtle rounded-[16px] p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold text-foreground mt-1">{name}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{location}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold text-foreground text-right">{value}</span>
    </div>
  );
}
