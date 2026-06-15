export function TankWarningBanner() {
  return (
    <div className="flex items-center justify-between rounded-[12px] bg-[#2A0C0C] px-4 py-3">
      <p className="text-sm text-[#EF4444]">
        Variance Alert: Main Depot Tank A
        expected 32,000L and reads
        28,400L.
      </p>

      <button className="text-sm font-medium text-white underline">
        View
      </button>
    </div>
  );
}