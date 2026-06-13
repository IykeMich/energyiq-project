import { CheckCircle2, Clock, Eye, XCircle } from 'lucide-react';
import { cn } from '@energyiq/shared';
import {
  transferStatusTone,
  type TransferRecord,
  type TransferStatus,
} from '@/ui/pages/inventory/mocks';

const GRID = 'grid grid-cols-[0.8fr_0.7fr_1.7fr_0.9fr_1.3fr_1fr_0.6fr] items-center gap-4';

interface TransferHistoryTableProps {
  rows: TransferRecord[];
  onView: (record: TransferRecord) => void;
}

export function TransferHistoryTable({ rows, onView }: TransferHistoryTableProps) {
  return (
    <div className="bg-surface-card rounded-[18px] p-5 flex flex-col gap-5">
      <div className="flex flex-col">
        <div className={`${GRID} rounded-[16px] border border-brand/30 bg-brand/10 px-5 py-4`}>
          {['Transfer ID', 'Product', 'From → To', 'Quantity', 'Date', 'Status', 'Action'].map((heading) => (
            <span key={heading} className="text-sm font-semibold text-foreground">
              {heading}
            </span>
          ))}
        </div>

        {rows.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-12">
            No transfers match your filters.
          </p>
        )}

        {rows.map((record) => (
          <div key={`${record.id}-${record.productCode}-${record.status}-${record.date}`} className={`${GRID} px-5 py-4`}>
            <span className="text-sm text-foreground">{record.id}</span>
            <span className="self-start rounded-full bg-foreground/10 px-3 py-1 text-xs font-semibold text-foreground">
              {record.productCode}
            </span>
            <span className="text-sm text-foreground">
              {record.fromName} → {record.toName}
            </span>
            <span className="text-sm text-foreground">{record.quantity}</span>
            <span className="text-sm text-foreground">{record.date}</span>
            <TransferStatusBadge status={record.status} />
            <button
              type="button"
              onClick={() => onView(record)}
              aria-label={`View ${record.id}`}
              className="text-brand hover:opacity-80"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <p className="text-sm text-muted-foreground">
        Showing 1 to {rows.length} of {rows.length}
      </p>
    </div>
  );
}

const TONE_CLASSES: Record<ReturnType<typeof transferStatusTone>, string> = {
  success: 'bg-success/20 text-success',
  warning: 'bg-warning/20 text-warning',
  danger: 'bg-danger/20 text-danger',
};

const STATUS_LABEL: Record<TransferStatus, string> = {
  completed: 'Completed',
  pending: 'Pending',
  failed: 'Failed',
};

export function TransferStatusBadge({ status }: { status: TransferStatus }) {
  const Icon = status === 'completed' ? CheckCircle2 : status === 'failed' ? XCircle : Clock;
  return (
    <span
      className={cn(
        'self-start inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold',
        TONE_CLASSES[transferStatusTone(status)],
      )}
    >
      <Icon className="w-3.5 h-3.5" />
      {STATUS_LABEL[status]}
    </span>
  );
}
