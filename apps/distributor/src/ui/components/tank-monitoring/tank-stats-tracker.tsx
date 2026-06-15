interface Props {
  className?: string;
}

export function TankStatsTracker({
  className,
}: Props) {
  return (
    <div
      className={`grid gap-4 md:grid-cols-4 ${className}`}
    >
      <div className="rounded-[16px] bg-[#6161611A] p-5">
        <p className="text-xs text-[#FFFFFF80]">
          Total tanks
        </p>

        <h3 className="mt-2 text-2xl font-semibold text-white">
          14
        </h3>
      </div>

      <div className="rounded-[16px] bg-[#6161611A] p-5">
        <p className="text-xs text-[#FFFFFF80]">
          Alerts
        </p>

        <h3 className="mt-2 text-2xl font-semibold text-red-500">
          2
        </h3>
      </div>

      <div className="rounded-[16px] bg-[#6161611A] p-5">
        <p className="text-xs text-[#FFFFFF80]">
          Last Dip
        </p>

        <h3 className="mt-2 text-2xl font-semibold text-white">
          Today
        </h3>
      </div>

      <div className="rounded-[16px] bg-[#6161611A] p-5">
        <p className="text-xs text-[#FFFFFF80]">
          Avg Days Left
        </p>

        <h3 className="mt-2 text-2xl font-semibold text-white">
          13
        </h3>
      </div>
    </div>
  );
}