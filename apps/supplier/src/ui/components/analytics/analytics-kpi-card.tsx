import { cn } from '@energyiq/shared';

export interface AnalyticsKpiCardProps {
  label: string;
  value: string | number;
  trend?: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
  };
  className?: string;
}

export function AnalyticsKpiCard({ label, value, trend, className }: AnalyticsKpiCardProps) {
  return (
    <div className={cn('bg-[#FFFFFF1A] rounded-2xl p-5', className)}>
      <p className="text-sm text-[#FFFFFFCC] mb-2">{label}</p>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-2xl font-bold text-white">{value}</span>
        {trend && (
          <span
            className={cn(
              'text-xs font-medium',
              trend.direction === 'up' && 'text-success',
              trend.direction === 'down' && 'text-danger',
              trend.direction === 'neutral' && 'text-[#FFFFFFCC]',
            )}
          >
            {trend.value}
          </span>
        )}
      </div>
    </div>
  );
}
