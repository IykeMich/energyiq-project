import type { GetV1DistributorComplaintListStatus } from '@energyiq/api/generated/schemas';
import { COMPLAINT_STATUS_COLOR } from './complaints-mocks';

interface ComplaintsStatusBadgeProps {
  /** Machine status code, e.g. "under_review" — selects the badge color. */
  statusCode: GetV1DistributorComplaintListStatus;
  /** Display label, e.g. "In Review" — falls back to the status code. */
  label?: string;
}

/** Pill badge with a leading dot for the complaint status column. */
export function ComplaintsStatusBadge({ statusCode, label }: ComplaintsStatusBadgeProps) {
  const color = COMPLAINT_STATUS_COLOR[statusCode] ?? COMPLAINT_STATUS_COLOR.open;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-normal"
      style={{ color, backgroundColor: `${color}26` }}
    >
      <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: color }} />
      {label ?? statusCode}
    </span>
  );
}
