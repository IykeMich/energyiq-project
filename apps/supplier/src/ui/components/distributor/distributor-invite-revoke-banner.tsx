import { AlertTriangle } from 'lucide-react';

/** Orange warning shown while confirming a pending-invite revoke. */
export function DistributorInviteRevokeBanner({ recipientName }: { recipientName: string }) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-warning/60 bg-warning/10 px-4 py-3">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" aria-hidden="true" />
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-warning">Revoke this invite?</p>
        <p className="text-xs leading-relaxed text-warning/90">
          The invite link will stop working immediately. {recipientName} won't be able to use it to
          sign up.
        </p>
      </div>
    </div>
  );
}
