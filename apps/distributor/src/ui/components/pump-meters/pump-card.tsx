import type { Pump } from './types';

interface Props {
  pump: Pump;
}

export function PumpCard({
  pump,
}: Props) {
  const badgeStyles = {
    active:
      'bg-[#0E2D18] text-[#22C55E]',
    inactive:
      'bg-[#33210A] text-[#F59E0B]',
    faulty:
      'bg-[#2D0E0E] text-[#EF4444]',
  };

  return (
    <div className="rounded-[20px] border border-[#2A2A2A] bg-[#181818] p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-white">
          {pump.name}
        </h3>

        <span
          className={`rounded-full px-3 py-1 text-xs capitalize ${badgeStyles[pump.status]}`}
        >
          {pump.status}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-5">
        <div>
          <p className="text-xs text-[#737373]">
            Product
          </p>

          <h4 className="mt-1 text-white">
            {pump.product}
          </h4>
        </div>

        <div>
          <p className="text-xs text-[#737373]">
            Nozzles
          </p>

          <h4 className="mt-1 text-white">
            {pump.nozzleCount}
          </h4>
        </div>

        <div>
          <p className="text-xs text-[#737373]">
            Total Sales
          </p>

          <h4 className="mt-1 text-white">
            ₦
            {pump.totalSales.toLocaleString()}
          </h4>
        </div>

        <div>
          <p className="text-xs text-[#737373]">
            Volume Sold
          </p>

          <h4 className="mt-1 text-white">
            {pump.volumeSold}L
          </h4>
        </div>
      </div>

      <button className="mt-6 h-10 w-full rounded-xl bg-[#FFB800] font-medium text-black">
        View Details
      </button>
    </div>
  );
}