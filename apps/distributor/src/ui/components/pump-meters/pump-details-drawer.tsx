import { X, Pencil, AlertCircle } from 'lucide-react';

type Pump = {
  id: string;
  name: string;
  product: string;
  nozzleCount: number;
  totalSales: number;
  volumeSold: number;
  meterReading: number;
  status: string;
};

type PumpDetailsDrawerProps = {
  open: boolean;
  pump: Pump | null;
  onClose: () => void;
};

export function PumpDetailsDrawer({
  open,
  pump,
  onClose,
}: PumpDetailsDrawerProps) {
  if (!open || !pump) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/70"
        onClick={onClose}
      />

      <div className="fixed right-0 top-0 z-50 h-screen w-full max-w-[420px] overflow-y-auto bg-[#0D0D0D] p-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">
              {pump.name} — {pump.product}
            </h2>

            <p className="text-xs text-[#8B8B8B]">
              Trans Ekulu • Shift History
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-[#1A1A1A]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Top Stats */}
        <div className="mt-5 grid grid-cols-3 gap-3">
          <StatCard
            title="Today's Total"
            value={`${pump.volumeSold.toLocaleString()} L`}
          />

          <StatCard
            title="Total Revenue"
            value={`₦${(
              pump.totalSales / 1000000
            ).toFixed(1)}M`}
          />

          <StatCard
            title="Variance"
            value="+0 L"
            success
          />
        </div>

        {/* Readings */}
        <div className="mt-5 rounded-2xl border border-[#262626] bg-[#121212] p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-medium text-white">
              Today's Readings
            </h3>

            <button className="flex items-center gap-1 text-xs text-[#F5B91E]">
              <Pencil size={12} />
              Edit
            </button>
          </div>

          <ReadingCard
            title={`${pump.product} Day Shift`}
            opening="152,400L"
            closing="142,880L"
            dispensed="9,520L"
            status="Complete"
          />

          <ReadingCard
            title={`${pump.product} Night Shift`}
            opening="142,880L"
            closing="-"
            dispensed="-"
            status="Pending"
          />

          <ReadingCard
            title={`${pump.product} Day Shift`}
            opening="-"
            closing="-"
            dispensed="-"
            status="Pending"
          />

          {/* Performance */}
          <div className="mt-4 rounded-xl border border-[#262626]">
            <div className="border-b border-[#262626] p-3">
              <h4 className="text-sm text-white">
                Attendant Performance
              </h4>
            </div>

            <div className="flex justify-between p-3 text-sm">
              <span className="text-[#8B8B8B]">
                Chukwuemeka (day shift)
              </span>

              <span className="text-white">
                7 shifts
              </span>
            </div>

            <div className="flex justify-between border-t border-[#262626] p-3 text-sm">
              <span className="text-[#8B8B8B]">
                Sunday (night shift)
              </span>

              <span className="text-white">
                7 shifts
              </span>
            </div>
          </div>
        </div>

        {/* Pump Info */}
        <div className="mt-5 rounded-2xl border border-[#262626] bg-[#121212]">
          <div className="border-b border-[#262626] p-4">
            <h3 className="text-sm font-medium text-white">
              Pump Info
            </h3>
          </div>

          <InfoRow
            label="Shift Structure"
            value="Day & Night"
          />

          <InfoRow
            label="Product"
            value={pump.product}
          />

          <InfoRow
            label="Nozzles"
            value={pump.nozzleCount.toString()}
          />

          <InfoRow
            label="Meter Reading"
            value={pump.meterReading.toLocaleString()}
          />
        </div>

        {/* Danger Button */}
        <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-full border border-red-600 py-3 text-sm text-red-500">
          <AlertCircle size={16} />
          Decommission Pump
        </button>
      </div>
    </>
  );
}

function StatCard({
  title,
  value,
  success,
}: {
  title: string;
  value: string;
  success?: boolean;
}) {
  return (
    <div className="rounded-xl bg-[#1A1A1A] p-3">
      <p className="text-[10px] text-[#8B8B8B]">
        {title}
      </p>

      <p
        className={`mt-2 text-lg font-semibold ${
          success
            ? 'text-green-500'
            : 'text-white'
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function ReadingCard({
  title,
  opening,
  closing,
  dispensed,
  status,
}: {
  title: string;
  opening: string;
  closing: string;
  dispensed: string;
  status: string;
}) {
  return (
    <div className="mb-3 rounded-xl border border-[#262626] p-3">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm text-white">
          {title}
        </p>

        <span
          className={`rounded-full px-2 py-1 text-[10px] ${
            status === 'Complete'
              ? 'bg-green-500/20 text-green-400'
              : 'bg-yellow-500/20 text-yellow-400'
          }`}
        >
          {status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-[10px] text-[#8B8B8B]">
            Opening
          </p>
          <p className="text-white">
            {opening}
          </p>
        </div>

        <div>
          <p className="text-[10px] text-[#8B8B8B]">
            Closing
          </p>
          <p className="text-white">
            {closing}
          </p>
        </div>
      </div>

      <p className="mt-2 text-xs text-green-400">
        Dispensed: {dispensed}
      </p>
    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-[#262626] p-4 last:border-b-0">
      <span className="text-sm text-[#8B8B8B]">
        {label}
      </span>

      <span className="text-sm text-white">
        {value}
      </span>
    </div>
  );
}