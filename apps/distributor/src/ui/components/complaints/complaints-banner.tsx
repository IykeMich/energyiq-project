interface ComplaintsBannerProps {
  /** Number of complaints currently under supplier review. */
  count: number;
}

/** Amber outlined notice above the complaints stats. */
export function ComplaintsBanner({ count }: ComplaintsBannerProps) {
  return (
    <p className="flex-1 rounded-full border border-[#FB8C1C] bg-[#FB8C1C1A] px-6 py-3 text-sm text-[#FB8C1C]">
      You have <span className="font-semibold">{count} complaints</span> under supplier review —
      resolutions are typically issued within <span className="font-semibold">72 hours</span>.
    </p>
  );
}
