export const StatusBadge = ({ status }: { status: string }) => {
  const styles = {
    approved:
      'bg-green-500/20 text-green-400 border border-green-500/30',
    rejected:
      'bg-red-500/20 text-red-400 border border-red-500/30',
    pending:
      'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    expiring:
      'bg-gray-500/20 text-gray-400 border border-gray-500/30',
  };

  return (
    <span
      className={`rounded-full px-2 py-1 text-xs ${styles[status as keyof typeof styles]}`}
    >
      {status}
    </span>
  );
};