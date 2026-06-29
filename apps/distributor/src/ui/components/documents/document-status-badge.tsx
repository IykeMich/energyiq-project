export function StatusBadge({
  status,
}: {
  status: string;
}) {
  const styles = {
    approved:
      'bg-[#1D3B26] text-[#56D17D]',
    rejected:
      'bg-[#4A1B1B] text-[#FF6666]',
    pending:
      'bg-[#4A3512] text-[#F5BF2A]',
    expiring:
      'bg-[#303030] text-[#B5B5B5]',
  };

  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[9px] font-medium ${
        styles[status as keyof typeof styles]
      }`}
    >
      {status}
    </span>
  );
}