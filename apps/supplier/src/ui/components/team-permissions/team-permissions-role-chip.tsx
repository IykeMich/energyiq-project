interface TeamPermissionsRoleChipProps {
  label: string;
}

/** Small brand-tinted pill for an assigned-role tag in the details/edit drawer. */
export function TeamPermissionsRoleChip({ label }: TeamPermissionsRoleChipProps) {
  return (
    <span className="inline-flex items-center rounded-full border border-border-strong px-3 py-1 text-xs font-medium text-foreground">
      {label}
    </span>
  );
}
