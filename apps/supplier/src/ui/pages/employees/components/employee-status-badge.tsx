export function EmployeeStatusBadge({
  status,
}: {
  status: 'active' | 'inactive' | 'pending';
}) {
  const styles = {
    active: 'bg-green-500/20 text-green-500',
    inactive: 'bg-red-500/20 text-red-500',
    pending: 'bg-yellow-500/20 text-yellow-500',
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}