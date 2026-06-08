import { AlertCircle } from 'lucide-react';
import type { VarianceAlert } from '../mocks';

interface VarianceAlertBannerProps {
  alert: VarianceAlert;
  onView?: () => void;
}

export function VarianceAlertBanner({ alert, onView }: VarianceAlertBannerProps) {
  const diff = alert.actualL - alert.expectedL;
  const sign = diff >= 0 ? '+' : '−';
  return (
    <div className="bg-danger/30 rounded-[10px] px-4 py-3 flex items-center gap-3">
      <AlertCircle className="w-5 h-5 text-danger shrink-0" />
      <p className="text-sm font-semibold text-danger flex-1">
        Variance Alert - {alert.tankName} - expected {alert.expectedL.toLocaleString()} L, actual{' '}
        {alert.actualL.toLocaleString()} L ({sign}
        {Math.abs(diff).toLocaleString()}L)
      </p>
      <button
        type="button"
        onClick={onView}
        className="text-sm font-semibold text-foreground underline shrink-0"
      >
        View
      </button>
    </div>
  );
}
