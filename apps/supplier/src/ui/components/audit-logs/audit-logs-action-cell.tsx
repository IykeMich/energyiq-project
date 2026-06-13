interface AuditLogsActionCellProps {
  action: string;
  description: string;
}

/** Action column: bold action title above a grey description line. */
export function AuditLogsActionCell({ action, description }: AuditLogsActionCellProps) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-sm font-medium text-[#FAFAFA]">{action}</span>
      <span className="text-xs text-[#9E9E9E]">{description}</span>
    </div>
  );
}
