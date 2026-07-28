interface ComplaintsBannerProps {
  /** Pre-formatted alert text from `distributor_complaint_alert.message`. */
  message: string;
}

/** Amber outlined notice above the complaints stats. */
export function ComplaintsBanner({ message }: ComplaintsBannerProps) {
  return (
    <p className="flex-1 rounded-full border border-[#FB8C1C] bg-[#FB8C1C1A] px-6 py-3 text-sm text-[#FB8C1C]">
      {message}
    </p>
  );
}
