import { Plus } from 'lucide-react';

interface TeamPermissionsEmptyStateProps {
  onInvite: () => void;
  onReviewRoles: () => void;
}

/** Shown when no team members exist yet: prompts the first invite. */
export function TeamPermissionsEmptyState({
  onInvite,
  onReviewRoles,
}: TeamPermissionsEmptyStateProps) {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center gap-4 rounded-[18px] border border-[#616161B2] p-6 text-center">
      <p className="text-sm font-semibold text-[#FAFAFA]">No team members yet.</p>
      <p className="text-sm italic text-[#FFFFFFCC]">
        Invite your first team member and assign a role.
      </p>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={onInvite}
          className="tap-effect inline-flex items-center gap-1.5 rounded-lg bg-[#FBC02D] px-4 py-2 text-xs font-medium text-[#121212]"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          Invite a Member
        </button>
        <button
          type="button"
          onClick={onReviewRoles}
          className="tap-effect rounded-lg border border-[#616161B2] px-4 py-2 text-xs font-medium text-white"
        >
          Review Roles first
        </button>
      </div>
    </div>
  );
}
