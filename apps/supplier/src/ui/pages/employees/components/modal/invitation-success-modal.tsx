// components/invitation-success-modal.tsx

interface InvitationSuccessModalProps {
  open: boolean;
  onClose: () => void;
}

export function InvitationSuccessModal({
  open,
  onClose,
}: InvitationSuccessModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-md rounded-3xl bg-[#111111] p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500">
          ✓
        </div>

        <h2 className="mt-6 text-2xl font-semibold text-white">
          Invitation sent!
        </h2>

        <p className="mt-3 text-sm text-zinc-400">
          An invitation email has been successfully sent to the
          employee.
        </p>

        <div className="mt-8 flex gap-3">
          <button
            className="flex-1 rounded-full border py-3"
            onClick={() => {
              onClose();
            }}
          >
            Invite Another
          </button>

          <button
            className="flex-1 rounded-full bg-yellow-500 py-3 text-black"
            onClick={onClose}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}