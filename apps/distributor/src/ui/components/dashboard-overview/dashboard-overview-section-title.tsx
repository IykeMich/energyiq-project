import type { ReactNode } from 'react';
import { cn } from '@energyiq/shared';

interface DashboardOverviewSectionTitleProps {
  title: string;
  /** 'lg' matches the 22px panel headers; 'sm' matches the 18px sub-panel headers. */
  size?: 'sm' | 'lg';
  right?: ReactNode;
  className?: string;
}

export function DashboardOverviewSectionTitle({
  title,
  size = 'sm',
  right,
  className,
}: DashboardOverviewSectionTitleProps) {
  const isLarge = size === 'lg';
  return (
    <div className={cn('flex items-center justify-between gap-3', className)}>
      <div className="flex items-center gap-2">
        <div
          className={cn('w-[5px] rounded-sm bg-[#FBC02D]', isLarge ? 'h-[35px]' : 'h-[23px]')}
        />
        <h3
          className={cn(
            'font-semibold text-white',
            isLarge ? 'text-[22px] leading-tight' : 'text-lg',
          )}
        >
          {title}
        </h3>
      </div>
      {right}
    </div>
  );
}
