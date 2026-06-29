
import type { TankRow } from './tank-mock';

interface Props {
  tank: TankRow;
  onVarianceClick: () => void;
}

export function TankLevelCard({
  tank,
}: Props) {
  const percent =
    (tank.current / tank.capacity) * 100;

  const status =
    tank.status === 'Healthy'
      ? {
          text: '80% Adequate',
          textColor: 'text-green-500',
          barColor: 'bg-green-500',
        }
      : tank.status === 'Low Stock'
      ? {
          text: '5% Critical',
          textColor: 'text-orange-500',
          barColor: 'bg-orange-500',
        }
      : {
          text: '2% Critical',
          textColor: 'text-red-500',
          barColor: 'bg-red-500',
        };

  return (
    <div className="rounded-[16px] border border-[#3A3A3A] bg-transparent p-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-[13px] font-medium text-white">
            {tank.name}
          </h3>

          <p className="mt-1 text-[10px] text-[#8C8C8C]">
            {tank.product}
          </p>
        </div>

        <span
          className={`text-[11px] font-medium ${status.textColor}`}
        >
          {status.text}
        </span>
      </div>

      <div className="mt-3 h-1 rounded-full bg-[#2B2B2B]">
        <div
          className={ `h-1 rounded-full ${status.barColor}`}
          style={{
            width: `${Math.max(percent, 8)}%`,
          }}
        />
      </div>

      <div className="mt-4 flex items-center justify-between text-[10px]">
        <span className="text-white">
          Stock: {tank.current.toLocaleString()}L
        </span>

        <span className="text-white">
          Coverage: {tank.daysLeft}.2 days
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <button
          className="
            rounded-md
            bg-[#F4B52A]
            px-3
            py-1.5
            text-[10px]
            font-medium
            text-black
          "
        >
          Order Refill
        </button>

        <span className="text-[10px] text-[#8C8C8C]">
          Reorder: {Math.max(1, tank.daysLeft - 2)} days
        </span>
      </div>
    </div>
  );
}

