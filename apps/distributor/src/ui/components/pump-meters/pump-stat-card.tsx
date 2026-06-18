interface Props {
  title: string;
  value: string | number;
}

export function PumpStatCard({
  title,
  value,
}: Props) {
  return (
    <div className="rounded-[20px] border border-[#2A2A2A] bg-[#181818] p-5">
      <p className="text-xs text-[#8B8B8B]">
        {title}
      </p>

      <h3 className="mt-3 text-2xl font-semibold text-white">
        {value}
      </h3>
    </div>
  );
}