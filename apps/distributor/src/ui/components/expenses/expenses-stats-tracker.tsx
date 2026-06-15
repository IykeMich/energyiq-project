interface Props {
  className?: string;
}

export function ExpensesStatsTracker({
  className,
}: Props) {
  return (
    <div
      className={`grid gap-4 md:grid-cols-3 ${className}`}
    >
      <div className="rounded-[16px] bg-[#6161611A] p-5">
        <p className="text-xs text-[#FFFFFF80]">
          Netflow today
        </p>

        <h3 className="mt-2 text-2xl font-semibold text-white">
          ₦24.6M
        </h3>
      </div>

      <div className="rounded-[16px] bg-[#6161611A] p-5">
        <p className="text-xs text-[#FFFFFF80]">
          Dispensed
        </p>

        <h3 className="mt-2 text-2xl font-semibold text-white">
          112,480L
        </h3>
      </div>

      <div className="rounded-[16px] bg-[#6161611A] p-5">
        <p className="text-xs text-[#FFFFFF80]">
          Alerts
        </p>

        <h3 className="mt-2 text-2xl font-semibold text-[#EF4444]">
          3
        </h3>
      </div>
    </div>
  );
}