interface ProductAuthorizationStatsProps {
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
}

export function ProductAuthorizationStats({
  pendingCount,
  approvedCount,
  rejectedCount,
}: ProductAuthorizationStatsProps) {
  const cards = [
    { label: 'Pending Review:', value: String(pendingCount) },
    { label: 'Approved:', value: String(approvedCount) },
    { label: 'Rejected:', value: String(rejectedCount) },
  ];

  return (
    <div className="flex flex-wrap gap-4 rounded-[18px] bg-[#6161611A] p-6">
      {cards.map((card) => (
        <div
          key={card.label}
          className="flex flex-1 min-w-[180px] flex-col justify-center gap-2 rounded-[14px] bg-[#FFFFFF1A] p-5"
        >
          <span className="text-base text-white">{card.label}</span>
          <span className="text-[22px] font-semibold text-white">{card.value}</span>
        </div>
      ))}
    </div>
  );
}
