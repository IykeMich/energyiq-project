import { X, Pencil, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { RecordMeterReadingModal } from './record-meter-reading-modal';

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

  const [showEditPump, setShowEditPump] = useState(false);
const [showSelectPump, setShowSelectPump] = useState(false);
const [showShiftType, setShowShiftType] = useState(false);
const [showReadingForm, setShowReadingForm] = useState(false);
const [showReview, setShowReview] = useState(false);
const [showSuccess, setShowSuccess] = useState(false);
const [showRecordReading, setShowRecordReading] =
  useState(false);

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/70"
        onClick={onClose}
      />

      <div className="fixed right-0 top-0 z-50 h-screen w-full `max-w-[420px] overflow-y-auto bg-[#0D0D0D] p-5">
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

            <button
  onClick={() => setShowEditPump(true)}
  className="flex items-center gap-1 text-xs text-[#F5B91E]"
>
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
  status="Complete"
  onRecordReading={() =>
    setShowRecordReading(true)
  }
/>

          <ReadingCard
            title={`${pump.product} Day Shift`}
            opening="-"
            closing="-"
            dispensed="-"
            status="Pending"
             onRecordReading={() =>
    setShowRecordReading(true)
  }
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
        <div className="mt-5 space-y-3">
 

  

  <button className="flex w-full items-center justify-center gap-2 rounded-full border border-red-600 py-3 text-sm text-red-500">
    <AlertCircle size={16} />
    Decommission Pump
  </button>
</div>
      </div>

      {showEditPump && (
  <div className="fixed inset-0 `z-[80] flex items-center justify-center bg-black/80">
    <div className="w-full max-w-md rounded-[28px] bg-[#0F0F0F] p-6">
      <h3 className="mb-5 text-lg font-semibold text-white">
        Edit Pump
      </h3>

      <div className="space-y-4">
        <input
          defaultValue={pump.name}
          className="w-full rounded-xl bg-[#171717] px-4 py-3 text-white"
        />

        <select className="w-full rounded-xl bg-[#171717] px-4 py-3 text-white">
          <option>Day & Night</option>
        </select>

        <select className="w-full rounded-xl bg-[#171717] px-4 py-3 text-white">
          <option>{pump.product}</option>
        </select>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          onClick={() => setShowEditPump(false)}
          className="flex-1 rounded-full bg-[#2A2A2A] py-3 text-white"
        >
          Cancel
        </button>

        <button
          onClick={() => setShowEditPump(false)}
          className="flex-1 rounded-full bg-[#F5B91E] py-3 text-black"
        >
          Save Changes
        </button>
      </div>
    </div>
  </div>
)}

{showReadingForm && (
  <div className="fixed inset-0 `z-[80] flex items-center justify-center bg-black/80">
    <div className="w-full max-w-lg rounded-[28px] bg-[#0F0F0F] p-6">
      <h3 className="mb-5 text-white">
        Record Reading
      </h3>

      <div className="space-y-4">
        <div className="rounded-xl border border-[#2A2A2A] p-4">
          <p className="text-xs text-[#8B8B8B]">
            Opening Reading
          </p>

          <input
            defaultValue="2345"
            className="mt-2 w-full rounded-lg bg-[#171717] px-3 py-2 text-white"
          />
        </div>

        <div className="rounded-xl border border-[#2A2A2A] p-4">
          <p className="text-xs text-[#8B8B8B]">
            Closing Reading
          </p>

          <input
            defaultValue="2456"
            className="mt-2 w-full rounded-lg bg-[#171717] px-3 py-2 text-white"
          />
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          onClick={() => setShowReadingForm(false)}
          className="flex-1 rounded-full bg-[#2A2A2A] py-3 text-white"
        >
          Cancel
        </button>

        <button
          onClick={() => {
            setShowReadingForm(false);
            setShowReview(true);
          }}
          className="flex-1 rounded-full bg-[#F5B91E] py-3 text-black"
        >
          Review Summary
        </button>
      </div>
    </div>
  </div>
)}

{showReview && (
  <div className="fixed inset-0 `z-[90] flex items-center justify-center bg-black/80">
    <div className="w-full max-w-md rounded-[28px] bg-[#0F0F0F] p-6">
      <h3 className="mb-5 text-white">
        Review & Confirm
      </h3>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-[#8B8B8B]">Pump</span>
          <span className="text-white">{pump.name}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-[#8B8B8B]">Product</span>
          <span className="text-white">{pump.product}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-[#8B8B8B]">Volume Sold</span>
          <span className="text-white">111L</span>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          onClick={() => setShowReview(false)}
          className="flex-1 rounded-full bg-[#2A2A2A] py-3 text-white"
        >
          Cancel
        </button>

        <button
          onClick={() => {
            setShowReview(false);
            setShowSuccess(true);
          }}
          className="flex-1 rounded-full bg-[#F5B91E] py-3 text-black"
        >
          Confirm & Save
        </button>
      </div>
    </div>
  </div>
)}

{showRecordReading && (
  <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/90 p-4">
    <div className="w-full `max-w-[520px] rounded-[32px] bg-[#0D0D0D] p-6">
      <h3 className="mb-2 text-lg font-semibold text-white">
        Record Meter Readings
      </h3>

      <p className="mb-6 text-xs text-[#8B8B8B]">
        Emeka Gas Supplies — Trans Ekulu
      </p>

      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-xs text-[#8B8B8B]">
            Opening Reading
          </label>

          <input
            className="w-full rounded-xl border border-[#2A2A2A] bg-[#171717] px-4 py-3 text-white"
            defaultValue="142,880"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs text-[#8B8B8B]">
            Closing Reading
          </label>

          <input
            className="w-full rounded-xl border border-[#2A2A2A] bg-[#171717] px-4 py-3 text-white"
            placeholder="Enter closing reading"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs text-[#8B8B8B]">
            Price Per Litre
          </label>

          <input
            className="w-full rounded-xl border border-[#2A2A2A] bg-[#171717] px-4 py-3 text-white"
            defaultValue="700"
          />
        </div>
      </div>

      <div className="mt-8 flex gap-3">
        <button
          onClick={() =>
            setShowRecordReading(false)
          }
          className="flex-1 rounded-full bg-[#2A2A2A] py-3 text-white"
        >
          Cancel
        </button>

        <button
          onClick={() => {
            setShowRecordReading(false);
            setShowReview(true);
          }}
          className="flex-1 rounded-full bg-[#F5B91E] py-3 font-medium text-black"
        >
          Review Summary
        </button>
      </div>
    </div>
  </div>
)}

{showSuccess && (
  <div className="fixed inset-0 `z-[100] flex items-center justify-center bg-black/90">
    <div className="w-full max-w-md rounded-[32px] bg-[#0F0F0F] p-8 text-center">
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#F5B91E]">
        ✓
      </div>

      <h3 className="text-xl font-semibold text-white">
        Reading Recorded
      </h3>

      <p className="mt-3 text-sm text-[#8B8B8B]">
        Meter reading has been successfully
        recorded.
      </p>

      <button
        onClick={() => {
          setShowSuccess(false);
          onClose();
        }}
        className="mt-6 w-full rounded-full bg-[#F5B91E] py-3 font-medium text-black"
      >
        Done
      </button>
    </div>
  </div>
)}
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
  onRecordReading,
}: {
  title: string;
  opening: string;
  closing: string;
  dispensed: string;
  status: string;
  onRecordReading?: () => void;
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

     {status === 'Complete' ? (
  <p className="mt-2 text-xs text-green-400">
    Dispensed: {dispensed}
  </p>
) : (
  <button
    onClick={onRecordReading}
    className="mt-3 rounded-full bg-[#F5B91E] px-4 py-2 text-xs font-medium text-black"
  >
    Record Reading
  </button>
)}
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