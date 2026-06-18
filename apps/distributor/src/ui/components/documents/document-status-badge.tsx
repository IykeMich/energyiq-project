interface Props {
  status: string;
}

export function StatusBadge({ status }: Props) {
  const styles = {
    approved:
      'bg-green-500/15 text-green-400 border border-green-500/30',

    rejected:
      'bg-red-500/15 text-red-400 border border-red-500/30',

    pending:
      'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30',

    expiring:
      'bg-orange-500/15 text-orange-400 border border-orange-500/30',
  };

  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-[11px] capitalize ${
        styles[status as keyof typeof styles]
      }`}
    >
      {status}
    </span>
  );
}