import { useState } from 'react';
import { X } from 'lucide-react';

type Props = {
  open: boolean;
  onClose: () => void;
};

export function RecordMeterReadingModal({
  open,
  onClose,
}: Props) {
  const [step, setStep] = useState(1);
  const [showRecordReading, setShowRecordReading] =
  useState(false);

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 `z-[9998] bg-black/80"
        onClick={onClose}
      />

      <div className="fixed inset-0 `z-[9999] flex items-center justify-center p-4">
        <div className="w-full `max-w-[520px] rounded-[32px] bg-[#0F0F0F] p-6">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Record Meter Readings
              </h2>

              <p className="text-xs text-[#8B8B8B]">
                Emeka Gas Supplies
              </p>
            </div>

            <button
              onClick={onClose}
              className="rounded-full bg-[#1A1A1A] p-2"
            >
              <X
                size={16}
                className="text-white"
              />
            </button>
          </div>

          {/* Progress */}
          <div className="mb-6 flex justify-center gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-1 w-12 rounded-full ${
                  s <= step
                    ? 'bg-[#F5B91E]'
                    : 'bg-[#2A2A2A]'
                }`}
              />
            ))}
          </div>

          {/* STEP 1 */}
          {step === 1 && (
            <>
              <h3 className="mb-4 text-white">
                Active Pumps
              </h3>

              <div className="space-y-3">
                <PumpCard
                  name="Pump 1"
                  product="PMS"
                />

                <PumpCard
                  name="Pump 2"
                  product="AGO"
                  active
                />

                <PumpCard
                  name="Pump 3"
                  product="AGO"
                />
              </div>

              <FooterButtons
                cancel={onClose}
                continueAction={() =>
                  setStep(2)
                }
              />
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <>
              <h3 className="mb-4 text-white">
                Reading Date
              </h3>

              <div className="grid grid-cols-3 gap-3">
                <SelectBox
                  selected
                  title="Today's Reading"
                  value="17 Jun 2026"
                />

                <SelectBox
                  title="Yesterday"
                  value="16 Jun 2026"
                />

                <SelectBox
                  title="Other"
                  value=""
                />
              </div>

              <h3 className="mb-4 mt-6 text-white">
                Shift Type
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <SelectBox
                  selected
                  title="Day Shift"
                  value="6AM - 6PM"
                />

                <SelectBox
                  title="Night Shift"
                  value="6PM - 11PM"
                />
              </div>

              <FooterButtons
                cancel={() => setStep(1)}
                continueAction={() =>
                  setStep(3)
                }
              />
            </>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <>
              <h3 className="mb-4 text-white">
                Nozzle Readings
              </h3>

              <div className="space-y-4">
                <NozzleCard />

                <NozzleCard />
              </div>

              <div className="mt-4">
                <label className="mb-2 block text-xs text-[#8B8B8B]">
                  Price Per Litre
                </label>

                <input
                  defaultValue="700"
                  className="w-full rounded-xl border border-[#2A2A2A] bg-[#171717] px-4 py-3 text-white"
                />
              </div>

              <FooterButtons
                cancel={() => setStep(2)}
                continueAction={() =>
                  setStep(4)
                }
                continueText="Review Summary"
              />
            </>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <>
              <h3 className="mb-4 text-white">
                Review & Confirm
              </h3>

              <SummaryRow
                label="Opening Reading"
                value="44,250L"
              />

              <SummaryRow
                label="Closing Reading"
                value="46,150L"
              />

              <SummaryRow
                label="Volume Dispensed"
                value="1,900L"
              />

              <SummaryRow
                label="Price Per Litre"
                value="₦700"
              />

              <SummaryRow
                label="Total Revenue"
                value="₦1,330,000"
              />

              <FooterButtons
                cancel={() => setStep(3)}
                continueText="Confirm & Save"
                continueAction={() =>
                  setStep(5)
                }
              />
            </>
          )}

          {/* STEP 5 */}
          {step === 5 && (
            <div className="py-10 text-center">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#F5B91E] text-black">
                ✓
              </div>

              <h3 className="text-xl font-semibold text-white">
                Reading Recorded
              </h3>

              <p className="mt-2 text-sm text-[#8B8B8B]">
                Meter reading saved
                successfully.
              </p>

              <button
                onClick={() => {
                  setStep(1);
                  onClose();
                }}
                className="mt-6 w-full rounded-full bg-[#F5B91E] py-3 font-medium text-black"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function PumpCard({
  name,
  product,
  active,
}: any) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        active
          ? 'border-[#F5B91E]'
          : 'border-[#2A2A2A]'
      }`}
    >
      <p className="font-medium text-white">
        {name}
      </p>

      <p className="text-xs text-[#8B8B8B]">
        {product}
      </p>
    </div>
  );
}

function SelectBox({
  title,
  value,
  selected,
}: any) {
  return (
    <div
      className={`rounded-xl border p-3 ${
        selected
          ? 'border-[#F5B91E]'
          : 'border-[#2A2A2A]'
      }`}
    >
      <p className="text-xs text-white">
        {title}
      </p>

      <p className="mt-1 text-[11px] text-[#8B8B8B]">
        {value}
      </p>
    </div>
  );
}

function NozzleCard() {
  return (
    <div className="rounded-2xl border border-[#2A2A2A] p-4">
      <input
        placeholder="Open Reading"
        className="mb-3 w-full rounded-xl border border-[#2A2A2A] bg-[#171717] px-3 py-2 text-white"
      />

      <input
        placeholder="Close Reading"
        className="w-full rounded-xl border border-[#2A2A2A] bg-[#171717] px-3 py-2 text-white"
      />
    </div>
  );
}

function SummaryRow({
  label,
  value,
}: any) {
  return (
    <div className="flex justify-between border-b border-[#2A2A2A] py-3">
      <span className="text-[#8B8B8B]">
        {label}
      </span>

      <span className="text-white">
        {value}
      </span>
    </div>
  );
}

function FooterButtons({
  cancel,
  continueAction,
  continueText = 'Continue',
}: any) {
  return (
    <div className="mt-6 flex gap-3">
      <button
        onClick={cancel}
        className="flex-1 rounded-full bg-[#2A2A2A] py-3 text-white"
      >
        Cancel
      </button>

      <button
        onClick={continueAction}
        className="flex-1 rounded-full bg-[#F5B91E] py-3 font-medium text-black"
      >
        {continueText}
      </button>
    </div>
  );
}