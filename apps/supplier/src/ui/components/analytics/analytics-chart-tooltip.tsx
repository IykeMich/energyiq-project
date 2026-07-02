interface AnalyticsTooltipProps {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number; payload?: Record<string, unknown> }>;
  label?: string;
  valueSuffix?: string;
}

export function AnalyticsChartTooltip({
  active,
  payload,
  label,
  valueSuffix = '',
}: AnalyticsTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-[#27272A] border border-[#616161B2] rounded-lg shadow-lg px-4 py-2 min-w-[140px]">
      {label && <p className="text-xs text-[#FFFFFFCC] mb-1">{label}</p>}
      {payload.map((item, index) => (
        <p key={index} className="text-sm font-semibold text-white">
          {item.name}: {item.value}{valueSuffix}
        </p>
      ))}
    </div>
  );
}
