import { X } from 'lucide-react';
import { Modal, WizardStepPills } from '@energyiq/ui';
import {
  TRANSFER_TIMELINE_STEPS,
  transferTimelineStep,
  type TransferRecord,
} from '@/ui/pages/inventory/mocks';
import { TransferStatusBadge } from './transfer-history-table';

interface TransferDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record: TransferRecord | null;
}

export function TransferDetailModal({ open, onOpenChange, record }: TransferDetailModalProps) {
  return (
    <Modal open={open} onOpenChange={onOpenChange} showClose={false} size="lg">
      {record && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-1 h-5 rounded-full bg-brand" />
              <h2 className="text-xl font-semibold text-foreground">{record.id}</h2>
              <TransferStatusBadge status={record.status} />
            </div>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              aria-label="Close"
              className="w-8 h-8 rounded-full bg-brand text-brand-foreground flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-sm text-foreground">Timeline:</p>
            <div className="bg-surface-card border border-border-subtle rounded-[16px] p-5">
              <WizardStepPills
                steps={[...TRANSFER_TIMELINE_STEPS]}
                current={transferTimelineStep(record.status)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-sm text-foreground">Transfer Details:</p>
            <div className="flex flex-col gap-3">
              <Row label="Product:" value={record.productName} />
              <Row label="Quantity:" value={record.quantity} />
              <Row label="From:" value={record.fromName} />
              <Row label="To:" value={record.toName} />
              <Row label="Initiated by:" value={record.initiatedBy} />
              <Row label="Date:" value={record.date} />
            </div>
          </div>
        </div>
      )}
    </Modal>
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
