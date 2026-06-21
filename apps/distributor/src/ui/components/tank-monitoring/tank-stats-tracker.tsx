interface Props {
  className?: string;
}

const stats = [
  {
    label: 'Total Tanks:',
    value: '4',
    footer: '4 Products',
    valueClass: 'text-white',
    footerClass: 'text-[#7D7D7D]',
  },
  {
    label: 'Alerts:',
    value: '2',
    footer: 'Needs attention',
    valueClass: 'text-[#EF4444]',
    footerClass: 'text-[#22C55E]',
  },
  {
    label: 'Last Dip:',
    value: 'Today',
    footer: 'Last 7:05am',
    valueClass: 'text-white',
    footerClass: 'text-[#7D7D7D]',
  },
  {
    label: 'Avg Days Left:',
    value: '13',
    footer: '',
    valueClass: 'text-white',
    footerClass: 'text-[#7D7D7D]',
  },
];

export function TankStatsTracker({
  className = '',
}: Props) {
  return (
    <div
      className={`grid grid-cols-2 gap-3 lg:grid-cols-4 ${className}`}
    >
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="
            rounded-[16px]
            bg-[#232323]
            px-4
            py-3
          "
        >
          <p className="text-[10px] text-[#8C8C8C]">
            {stat.label}
          </p>

          <h3
            className={`mt-2 text-[24px] font-semibold ${stat.valueClass}`}
          >
            {stat.value}
          </h3>

          <p
            className={`mt-1 text-[9px] ${stat.footerClass}`}
          >
            {stat.footer}
          </p>
        </div>
      ))}
    </div>
  );
}