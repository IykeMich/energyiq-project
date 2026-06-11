import { ChevronDown, SlidersHorizontal } from 'lucide-react';

const FILTER_CHIPS = ['Role', 'Status'] as const;

type EmployeeFilterBarProps = {
  onInviteMember: () => void;
};

export function InviteEmployeeModal({ onInviteMember }: EmployeeFilterBarProps) {
  return (
    <div className="flex items-center gap-3">
      {/* Filter Label */}
      <div className="flex items-center gap-2">
        <SlidersHorizontal size={16} />
        <span>Filter By:</span>
      </div>

      {/* Chips */}
      {FILTER_CHIPS.map((label) => (
        <FilterChip key={label} label={label} />
      ))}

      <div className="flex-1" />

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="h-10 rounded-full border border-brand px-5 text-sm font-medium text-brand hover:bg-brand/5"
        >
          Manage Access
        </button>

        <button
          type="button"
          onClick={onInviteMember}
          className="h-10 rounded-full bg-brand px-5 text-sm font-medium text-background hover:opacity-90"
        >
          + Invite Member
        </button>
      </div>
    </div>
  );
}

function FilterChip({ label }: { label: string }) {
  return (
    <button className="flex items-center gap-2 rounded-full border px-4 py-2">
      {label}
      <ChevronDown size={14} />
    </button>
  );
}