import { cn } from '@energyiq/shared';

const PILL_BASE = 'tap-effect rounded-full px-5 py-1.5 text-xs font-medium transition-colors';

/** Gold-filled "Preview" button (opens the document preview pane). */
export function PreviewButton({ onClick, className }: { onClick: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(PILL_BASE, 'bg-[#FBC02D] text-[#121212]', className)}
    >
      Preview
    </button>
  );
}

/** Red-outline "Reject" button. */
export function RejectButton({ onClick, className }: { onClick: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(PILL_BASE, 'border border-[#D30A0A] text-[#D30A0A]', className)}
    >
      Reject
    </button>
  );
}

/** Green-outline "Approve" button. */
export function ApproveButton({ onClick, className }: { onClick: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(PILL_BASE, 'border border-[#2E7D32] text-[#2E7D32]', className)}
    >
      Approve
    </button>
  );
}
