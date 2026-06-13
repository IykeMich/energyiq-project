import type { ComplaintStatus } from './complaints-mocks';
import { COMPLAINT_STATUS_COLOR } from './complaints-mocks';

interface ComplaintsStatusBadgeProps {
  status: ComplaintStatus;
}

/** Pill badge with a leading dot for the complaint status column. */
export function ComplaintsStatusBadge({ status }: ComplaintsStatusBadgeProps) {
  const color = COMPLAINT_STATUS_COLOR[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-normal"
      style={{ color, backgroundColor: `${color}26` }}
    >
      <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: color }} />
      {status}
    </span>
  );
}
