import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TANKS_MOCK, TANK_SUMMARY_MOCK, VARIANCE_ALERT_MOCK } from './mocks';
import { VarianceAlertBanner } from './components/variance-alert-banner';
import { TankSummaryStats } from './components/tank-summary-stats';
import { TankCard } from './components/tank-card';
import { RecordDipForm } from './components/record-dip-form';
import { VarianceAlertModal } from './components/variance-alert-modal';
import { ReenterReadingModal } from './components/reenter-reading-modal';
import { SuccessModal, type SuccessModalDetail } from '@energyiq/ui';
import { SavingOverlay } from './components/saving-overlay';
import { NoConnectionBanner } from './components/no-connection-banner';

interface SuccessState {
  open: boolean;
  title: string;
  subtitle: string;
  details: SuccessModalDetail[];
  primaryLabel: string;
  secondaryLabel?: string;
}

const SAVE_DELAY_MS = 1200;

export function TankMonitoringPage() {
  const navigate = useNavigate();

  const [varianceOpen, setVarianceOpen] = useState(false);
  const [reenterOpen, setReenterOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState<SuccessState>({
    open: false,
    title: '',
    subtitle: '',
    details: [],
    primaryLabel: '',
  });
  const [isOnline, setIsOnline] = useState(() =>
    typeof navigator === 'undefined' ? true : navigator.onLine,
  );

  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  const findTank = (id: string) => TANKS_MOCK.find((t) => t.id === id);

  const runSaveFlow = (success: SuccessState) => {
    setIsSaving(true);
    window.setTimeout(() => {
      setIsSaving(false);
      setSuccess(success);
    }, SAVE_DELAY_MS);
  };

  const handleVarianceConfirm = () => {
    setVarianceOpen(false);
    setSuccess({
      open: true,
      title: 'Dip accepted',
      subtitle: `${VARIANCE_ALERT_MOCK.actualL.toLocaleString()} L recorded as the confirmed stock level for ${VARIANCE_ALERT_MOCK.tankName}.`,
      details: [
        { label: 'Confirmed Stock:', value: `${VARIANCE_ALERT_MOCK.actualL.toLocaleString()} L` },
        {
          label: 'Variance logged:',
          value: `-${(VARIANCE_ALERT_MOCK.expectedL - VARIANCE_ALERT_MOCK.actualL).toLocaleString()} L`,
        },
        { label: 'Coverage:', value: '1 Day' },
        { label: 'Recorded at:', value: '07:02am.' },
      ],
      primaryLabel: 'Place an Order',
      secondaryLabel: 'Back to Tanks',
    });
  };

  const handleVarianceReenter = () => {
    setVarianceOpen(false);
    setReenterOpen(true);
  };

  const handleReenterSave = ({ tankId, litres }: { tankId: string; litres: number }) => {
    const tank = findTank(tankId);
    setReenterOpen(false);
    runSaveFlow({
      open: true,
      title: 'Dip Record Saved',
      subtitle: `${tank?.name ?? 'Tank'} updated. Coverage recalculated.`,
      details: [
        { label: 'Tank:', value: tank?.name ?? '—' },
        { label: 'Reading:', value: `${litres.toLocaleString()} L` },
        { label: 'Coverage:', value: '1 Day' },
        { label: 'Recorded at:', value: '07:02am.' },
      ],
      primaryLabel: 'Place an Order',
      secondaryLabel: 'Back to Tanks',
    });
  };

  const handleFormSave = ({ tankId, litres }: { tankId: string; litres: number }) => {
    const tank = findTank(tankId);
    runSaveFlow({
      open: true,
      title: 'Dip Record Saved',
      subtitle: `${tank?.name ?? 'Tank'} updated. Coverage recalculated.`,
      details: [
        { label: 'Tank:', value: tank?.name ?? '—' },
        { label: 'Reading:', value: `${litres.toLocaleString()} L` },
        { label: 'Coverage:', value: tank ? `${tank.coverageDays} days` : '—' },
        { label: 'Recorded at:', value: '07:02am.' },
      ],
      primaryLabel: 'Place an Order',
      secondaryLabel: 'Back to Tanks',
    });
  };

  const closeSuccess = () => setSuccess((s) => ({ ...s, open: false }));

  return (
    <section className="flex flex-col gap-6">
      <header className="flex items-center gap-3.5">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-[31px] h-[31px] rounded-full border border-border-strong flex items-center justify-center text-foreground"
          aria-label="Back"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-2xl font-semibold text-foreground">Tank Monitoring</h1>
      </header>

      {!isOnline && <NoConnectionBanner onRetry={() => setIsOnline(navigator.onLine)} />}

      <VarianceAlertBanner
        alert={VARIANCE_ALERT_MOCK}
        onView={() => setVarianceOpen(true)}
      />

      <TankSummaryStats summary={TANK_SUMMARY_MOCK} />

      <div className="border border-border-subtle rounded-[48px] p-6 md:p-9 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">Tank Levels</h2>
          <button
            type="button"
            className="text-sm text-brand underline font-semibold"
          >
            Dip Reading History
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {TANKS_MOCK.map((tank) => (
            <TankCard key={tank.id} tank={tank} />
          ))}
        </div>

        <div className="border-t border-border-subtle -mx-6 md:-mx-9 my-2" />

        <RecordDipForm tanks={TANKS_MOCK} onSave={handleFormSave} />
      </div>

      <VarianceAlertModal
        open={varianceOpen}
        onOpenChange={setVarianceOpen}
        tankAffected={VARIANCE_ALERT_MOCK.tankName}
        expectedL={VARIANCE_ALERT_MOCK.expectedL}
        actualL={VARIANCE_ALERT_MOCK.actualL}
        onReenter={handleVarianceReenter}
        onConfirm={handleVarianceConfirm}
      />

      <ReenterReadingModal
        open={reenterOpen}
        onOpenChange={setReenterOpen}
        tanks={TANKS_MOCK}
        defaultTankId={TANKS_MOCK.find((t) => t.name === VARIANCE_ALERT_MOCK.tankName)?.id}
        onSave={handleReenterSave}
      />

      <SuccessModal
        open={success.open}
        onOpenChange={(open) => !open && closeSuccess()}
        title={success.title}
        subtitle={success.subtitle}
        details={success.details}
        primaryAction={{ label: success.primaryLabel, onClick: closeSuccess }}
        secondaryAction={
          success.secondaryLabel
            ? { label: success.secondaryLabel, onClick: closeSuccess }
            : undefined
        }
      />

      {isSaving && <SavingOverlay />}
    </section>
  );
}
