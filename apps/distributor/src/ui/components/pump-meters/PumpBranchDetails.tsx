import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { PumpDetailsDrawer } from './pump-details-drawer';
import { PUMPS } from './pump-mocks';
import { RecordMeterReadingModal } from './record-meter-reading-modal';

export function PumpBranchDetails() {
  const navigate = useNavigate();

  const [selectedPump, setSelectedPump] =
    useState<any>(null);
    const [showRecordReading, setShowRecordReading] =
  useState(false);

  return (
    <>
      <section className="pb-6">
        <div className="rounded-[32px] border border-[#232323] bg-[#0F0F0F] p-6">
          {/* Header */}
          <div className="mb-6 flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="rounded-full bg-[#F5B91E] p-2"
            >
              <ArrowLeft
                size={14}
                className="text-black"
              />
            </button>

            <h1 className="text-xl font-semibold text-white">
              Pumps & Meters
            </h1>
          </div>

          {/* Branch Name */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white">
              Trans Ekulu Station
            </h2>
          </div>

          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <InfoCard
              title="Branch Revenue"
              value="₦38.2M"
              footer="Today"
            />

            <InfoCard
              title="Dispensed"
              value="47,820 L"
              footer="May 2025"
            />

            <InfoCard
              title="Pumps Available"
              value="3/3"
              footer="Active"
            />
          </div>

          {/* Pumps */}
          <div className="mt-6 rounded-2xl border border-[#2A2A2A] bg-[#141414] p-4">
            <h3 className="mb-4 text-sm font-medium text-white">
              Pumps
            </h3>

            <div className="space-y-3">
              {PUMPS.map((pump) => (
                <div
                  key={pump.id}
                  onClick={() =>
                    setSelectedPump(pump)
                  }
                  className="cursor-pointer rounded-xl border border-[#2A2A2A] bg-[#1B1B1B] p-4 transition hover:border-[#F5B91E]"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-white">
                        {pump.name}
                      </h4>

                      <p className="mt-1 text-xs text-[#8B8B8B]">
                        View shift history
                      </p>
                    </div>

                    <span className="text-xs text-[#F5B91E]">
                      Open
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shift 1 */}
          <ShiftCard
          
            title="Day Shift: May 6"
            status="Complete"
           
            nozzles={[
              {
                name: 'Nozzle 1A - AGO',
                open: '152,400L',
                close: '142,880L',
                sales: '₦530L',
              },
              {
                name: 'Nozzle 1B - AGO',
                open: '106,350L',
                close: '98,120L',
                sales: '₦870L',
              },
            ]}
          />

          {/* Shift 2 */}
          <ShiftCard
            title="Day Shift: May 6"
            status="Reading Pending"
            onClick={() => setShowRecordReading(true)}
            editable
            nozzles={[
              {
                name: 'Nozzle 1A - PMS',
                open: '77,000L',
              },
              {
                name: 'Nozzle 1B - PMS',
                open: '44,230L',
              },
            ]}
          />

          {/* Shift 3 */}
          <ShiftCard
            title="Night Shift: May 6"
             onClick={() => setShowRecordReading(true)}
            status="Reading Pending"
            editable
            nozzles={[
              {
                name: 'Nozzle 1A - PMS',
                open: '61,120L',
              },
              {
                name: 'Nozzle 1B - PMS',
                open: '29,840L',
              },
            ]}
          />
        </div>
      </section>

      <PumpDetailsDrawer
        open={!!selectedPump}
        pump={selectedPump}
        onClose={() =>
          setSelectedPump(null)
        }
      />
      <RecordMeterReadingModal
  open={showRecordReading}
  onClose={() =>
    setShowRecordReading(false)
  }
/>
    </>
  );
}

function InfoCard({
  title,
  value,
  footer,
}: {
  title: string;
  value: string;
  footer: string;
}) {
  return (
    <div className="rounded-2xl bg-[#1A1A1A] p-4">
      <p className="text-xs text-[#8B8B8B]">
        {title}
      </p>

      <h3 className="mt-3 text-xl font-semibold text-white">
        {value}
      </h3>

      <p className="mt-4 text-right text-[10px] text-[#8B8B8B]">
        {footer}
      </p>
    </div>
  );
}

function ShiftCard({
  title,
  status,
  nozzles,
  editable,
  onClick,
}: {
  title: string;
  status: string;
  editable?: boolean;
  nozzles: any[];
  onClick?: () => void;
}) {
  return (
   
     <div
  onClick={onClick}
  className="mt-6 cursor-pointer rounded-2xl border border-[#2A2A2A] bg-[#141414] p-4 transition hover:border-[#F5B91E]"
>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-white">
          {title}
        </h3>

        <span
          className={`rounded-full px-3 py-1 text-xs ${
            status === 'Complete'
              ? 'bg-green-500/20 text-green-400'
              : 'bg-yellow-500/20 text-yellow-400'
          }`}
        >
          {status}
        </span>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {nozzles.map((nozzle) => (
          <div
            key={nozzle.name}
            className="rounded-2xl bg-[#1B1B1B] p-4"
          >
            <p className="text-xs text-[#8B8B8B]">
              {nozzle.name}
            </p>

            <p className="mt-2 text-sm text-white">
              {nozzle.open}
              {' → '}
              {nozzle.close || '--'}
            </p>

            <p className="mt-2 text-xs text-green-400">
              {nozzle.sales || 'Pending'}
            </p>
          </div>
        ))}
      </div>

      {editable && (
        <div className="mt-4 flex gap-3">
          <input
            placeholder="Closing Reading"
            className="flex-1 rounded-xl border border-[#2A2A2A] bg-transparent px-3 py-2 text-white"
          />

          <button className="rounded-xl bg-[#F5B91E] px-5 text-sm font-medium text-black">
            Save
          </button>
        </div>
      )}
    </div>
  );
}