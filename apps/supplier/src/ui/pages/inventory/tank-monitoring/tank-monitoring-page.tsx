import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TANKS_MOCK, TANK_SUMMARY_MOCK, VARIANCE_ALERT_MOCK } from './mocks';
import { VarianceAlertBanner } from './components/variance-alert-banner';
import { TankSummaryStats } from './components/tank-summary-stats';
import { TankCard } from './components/tank-card';
import { RecordDipForm } from './components/record-dip-form';

export function TankMonitoringPage() {
  const navigate = useNavigate();

  return (
    <section className="flex flex-col gap-6">
      <header className="flex items-center gap-3.5">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-[31px] h-[31px] rounded-full border border-[#9E9E9E] flex items-center justify-center text-[#FAFAFA]"
          aria-label="Back"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-2xl font-semibold text-[#FAFAFA]">Tank Monitoring</h1>
      </header>

      <VarianceAlertBanner alert={VARIANCE_ALERT_MOCK} />

      <TankSummaryStats summary={TANK_SUMMARY_MOCK} />

      <div className="border border-[#616161B2] rounded-[48px] p-6 md:p-9 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-[#FAFAFA]">Tank Levels</h2>
          <button
            type="button"
            className="text-sm text-[#FBC02D] underline font-semibold"
          >
            Dip Reading History
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {TANKS_MOCK.map((tank) => (
            <TankCard key={tank.id} tank={tank} />
          ))}
        </div>

        <div className="border-t border-[#616161B2] -mx-6 md:-mx-9 my-2" />

        <RecordDipForm
          tanks={TANKS_MOCK}
          onSave={(d) => console.info('save dip', d)}
        />
      </div>
    </section>
  );
}
