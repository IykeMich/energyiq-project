import type { ComponentType, SVGProps } from 'react';
import { cn } from '@energyiq/shared';

interface DashboardKpiCardProps {
  title: string;
  value: string | number;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  badge?: { label: string; value?: string };
  emphasis?: 'default' | 'destructive';
  className?: string;
}

export function DashboardKpiCard({
  title,
  value,
  Icon,
  badge,
  emphasis = 'default',
  className,
}: DashboardKpiCardProps) {
  return (
    <div className={cn('bg-[#FFFFFF1A] rounded-2xl p-6 shadow-sm', className)}>
      <div className="flex items-center gap-3 mb-4">
        <Icon className="w-6 h-6 text-gray-300" aria-hidden="true" />
        <h4 className="text-sm font-medium text-gray-300">{title}</h4>
      </div>
      <div className="flex items-baseline gap-2">
        <span
          className={cn(
            'text-3xl font-bold',
            emphasis === 'destructive' ? 'text-red-500' : 'text-white',
          )}
        >
          {value}
        </span>
      </div>
      {badge && (
        <div className="mt-4 flex w-full justify-end">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#388E3C33] text-[#388E3C]">
            <span className="font-light">{badge.label}{badge.value && ':'}</span>
            {badge.value && <span className="ml-1 font-semibold">{badge.value}</span>}
          </span>
        </div>
      )}
    </div>
  );
}
