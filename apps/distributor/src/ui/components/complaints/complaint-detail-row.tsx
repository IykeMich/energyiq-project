interface ComplaintDetailRowProps {
  label: string;
  value: string;
}

/** One label/value line in the detail sheet's "Complaint Details" list. */
export function ComplaintDetailRow({ label, value }: ComplaintDetailRowProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-[#FFFFFFCC]">{label}</span>
      <span className="text-sm text-[#FAFAFA]">{value}</span>
    </div>
  );
}
