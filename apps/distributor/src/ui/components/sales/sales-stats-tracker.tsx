import { cn } from '@energyiq/shared';

interface Props {
  className?: string;
}

const STATS = [
  {
    label: 'Revenue today',
    value: '₦1,842,500',
  },
  {
    label: 'Volume today',
    value: '14,300 L',
  },
  {
    label: 'Sales recorded',
    value: '9',
  },
  {
    label: 'Avg margin/sale',
    value: '₦204,722',
  },
];

export function SalesStatsTracker({
  className,
}: Props) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4',
        className,
      )}
    >
      {STATS.map((item) => (
        <div
          key={item.label}
          className="rounded-[15px] bg-[#6161611A] p-5"
        >
          <p className="text-xs text-[#FFFFFF99]">
            {item.label}
          </p>

          <h3 className="mt-2 text-lg font-semibold text-white">
            {item.value}
          </h3>
        </div>
      ))}
    </div>
  );
}