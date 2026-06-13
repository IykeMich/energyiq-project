import { cn } from '@energyiq/shared';

/** Pending-invite footer lifecycle: awaiting acceptance → confirming revoke → revoked. */
export type DistributorRevokeState = 'sent' | 'confirming' | 'revoked';

interface DistributorInviteFooterProps {
  revokeState: DistributorRevokeState;
  onRevokeClick: () => void;
  onConfirmRevoke: () => void;
  onResend: () => void;
}

const BUTTON_BASE = 'tap-effect flex h-12 flex-1 items-center justify-center rounded-full text-sm font-semibold';

/** Two-button footer for the pending Invite Details tab; the left button changes by state. */
export function DistributorInviteFooter({
  revokeState,
  onRevokeClick,
  onConfirmRevoke,
  onResend,
}: DistributorInviteFooterProps) {
  return (
    <div className="flex items-center gap-3">
      {revokeState === 'sent' && (
        <button type="button" onClick={onRevokeClick} className={cn(BUTTON_BASE, 'bg-[#2A2A2A] text-[#FAFAFA]')}>
          Revoke Invite
        </button>
      )}

      {revokeState === 'confirming' && (
        <button type="button" onClick={onConfirmRevoke} className={cn(BUTTON_BASE, 'bg-[#2A2A2A] text-[#FAFAFA]')}>
          Yes, Revoke Invite
        </button>
      )}

      {revokeState === 'revoked' && (
        <span className={cn(BUTTON_BASE, 'bg-[#2A2A2A] text-[#FFFFFF66]')}>Invite Revoked</span>
      )}

      <button
        type="button"
        onClick={onResend}
        disabled={revokeState === 'confirming'}
        className={cn(
          BUTTON_BASE,
          'bg-[#FBC02D] text-[#121212]',
          revokeState === 'confirming' && 'cursor-not-allowed opacity-50',
        )}
      >
        Resend Invite
      </button>
    </div>
  );
}
