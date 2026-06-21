
export function TankWarningBanner() {
  return (
    <div className="flex items-center justify-between rounded-lg border border-[#5A1D1D] bg-[#4B1113] px-3 py-2">
      <p className="text-[11px] text-[#FCA5A5]">
        Variance Alert: Main Depot (Tank A) expected
        25,000L actual 24,420L (-580L)
      </p>

      <button className="text-[11px] font-medium text-white underline">
        View
      </button>
    </div>
  );
}

