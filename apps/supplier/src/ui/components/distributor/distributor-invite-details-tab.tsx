import { useState } from 'react';
import type { DistributorDetail } from '@/ui/pages/distributor/mocks';
import { DistributorDetailsStatBox } from './distributor-details-stat-box';
import { DistributorDetailsRow } from './distributor-details-row';
import { DistributorInviteRevokeBanner } from './distributor-invite-revoke-banner';
import { DistributorInviteFooter, type DistributorRevokeState } from './distributor-invite-footer';

interface DistributorInviteDetailsTabProps {
  detail: DistributorDetail;
  isActive: boolean;
}

/** Invite Details tab — accepted summary for active distributors, invite lifecycle for pending. */
export function DistributorInviteDetailsTab({ detail, isActive }: DistributorInviteDetailsTabProps) {
  return isActive ? (
    <AcceptedInvite detail={detail} />
  ) : (
    <PendingInvite detail={detail} />
  );
}

function AcceptedInvite({ detail }: { detail: DistributorDetail }) {
  const { acceptedInvite } = detail;
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-4 gap-2.5">
        <DistributorDetailsStatBox label="Joined:" value={acceptedInvite.joined} />
        <DistributorDetailsStatBox label="Contact Person:" value={acceptedInvite.contactPerson} />
        <DistributorDetailsStatBox label="Orders received:" value={acceptedInvite.ordersReceived} />
        <DistributorDetailsStatBox label="Last Activity:" value={acceptedInvite.lastActivity} />
      </div>

      <div className="flex flex-col gap-4 rounded-2xl bg-[#6161611A] px-5 py-4">
        <DistributorDetailsRow label="Original Invite:" value={acceptedInvite.originalInvite} />
        <DistributorDetailsRow label="Invited by:" value={acceptedInvite.invitedBy} />
        <DistributorDetailsRow label="Invite sent:" value={acceptedInvite.inviteSent} />
      </div>
    </div>
  );
}

function PendingInvite({ detail }: { detail: DistributorDetail }) {
  const { pendingInvite } = detail;
  const [revokeState, setRevokeState] = useState<DistributorRevokeState>('sent');

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-4 gap-2.5">
        <DistributorDetailsStatBox label="Invited on:" value={pendingInvite.invitedOn} />
        <DistributorDetailsStatBox
          label="Invite expired:"
          value={pendingInvite.inviteExpired}
          valueClassName="text-brand"
        />
        <DistributorDetailsStatBox label="Days Remaining:" value={pendingInvite.daysRemaining} />
        <DistributorDetailsStatBox label="Invite by:" value={pendingInvite.invitedBy} />
      </div>

      <div className="flex flex-col gap-4 rounded-2xl bg-[#6161611A] px-5 py-4">
        <DistributorDetailsRow label="Invite Email:" value="Sent" />
        <DistributorDetailsRow label="Sent to:" value={pendingInvite.email} />
        <DistributorDetailsRow label="Subject:" value={pendingInvite.subject} />
      </div>

      {revokeState === 'confirming' && (
        <DistributorInviteRevokeBanner recipientName={pendingInvite.recipientName} />
      )}

      <DistributorInviteFooter
        revokeState={revokeState}
        onRevokeClick={() => setRevokeState('confirming')}
        onConfirmRevoke={() => setRevokeState('revoked')}
        onResend={() => setRevokeState('sent')}
      />
    </div>
  );
}
