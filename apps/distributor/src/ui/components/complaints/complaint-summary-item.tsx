interface ComplaintSummaryItemProps {
  label: string;
  value: string;
}

/** Stacked label-over-value cell in the review step's "Complaint Summary" card. */
export function ComplaintSummaryItem({ label, value }: ComplaintSummaryItemProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-[#FFFFFFCC]">{label}</span>
      <span className="text-sm font-semibold text-[#FAFAFA]">{value}</span>
    </div>
  );
}
