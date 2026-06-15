interface Props {
  status: string;
}

export function SalesStatusBadge({
  status,
}: Props) {
  const isRecorded = status === 'Recorded';

  return (
    <span
      className={`
        px-3
        py-1
        rounded-full
        text-xs
        font-medium
        ${
          isRecorded
            ? 'bg-[#163C22] text-[#4ADE80]'
            : 'bg-[#3C1616] text-[#EF4444]'
        }
      `}
    >
      {status}
    </span>
  );
}