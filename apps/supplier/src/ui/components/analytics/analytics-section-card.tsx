import { cn } from '@energyiq/shared';

interface AnalyticsSectionCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

export function AnalyticsSectionCard({
  title,
  children,
  className,
  action,
}: AnalyticsSectionCardProps) {
  return (
    <div className={cn('bg-[#FFFFFF1A] rounded-2xl p-5', className)}>
      <div className="flex items-center justify-between gap-4 mb-4">
        <h3 className="text-base font-medium text-white">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}
