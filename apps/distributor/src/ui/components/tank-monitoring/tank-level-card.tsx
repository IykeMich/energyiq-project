
import type { TankRow } from './tank-mock';

interface Props {
  tank: TankRow;
  onVarianceClick: () => void;
}

export function TankLevelCard({
  tank,
  onVarianceClick,
}: Props) {
  const percent =
    (tank.current / tank.capacity) * 100;

  return (
    <div className="rounded-[18px] border border-[#2A2A2A] p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-white">
          {tank.name}
        </h3>

        <button
          onClick={onVarianceClick}
          className="text-xs text-[#FBC02D]"
        >
          View
        </button>
      </div>

      <p className="mt-1 text-xs text-[#FFFFFF80]">
        {tank.product}
      </p>

      <div className="mt-4 h-2 rounded-full bg-[#222]">
        <div
          className="h-2 rounded-full bg-[#22C55E]"
          style={{
            width: `${percent}%`,
          }}
        />
      </div>

      <div className="mt-3 flex justify-between text-xs text-[#FFFFFF80]">
        <span>
          {tank.current.toLocaleString()}L
        </span>

        <span>
          Capacity {tank.daysLeft} days
        </span>
      </div>
    </div>
  );
}