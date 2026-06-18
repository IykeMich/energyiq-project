interface Props {
  title: string;
  value: string | number;
}

export function PumpMetricCard({
  title,
  value,
}: Props) {
  return (
    <div className="rounded-2xl border border-[#262626] bg-[#181818] p-4">
      <p className="text-xs text-[#737373]">
        {title}
      </p>

      <h3 className="mt-2 text-lg font-semibold text-white">
        {value}
      </h3>
    </div>
  );
}