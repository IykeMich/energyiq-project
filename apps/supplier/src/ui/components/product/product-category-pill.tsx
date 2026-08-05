interface ProductCategoryPillProps {
  category: string;
  subtitle?: string;
}

/** Table-cell pill: "{category}" or "{category} · {subtitle}". */
export function ProductCategoryPill({ category, subtitle }: ProductCategoryPillProps) {
  return (
    <span className="inline-flex items-center whitespace-nowrap rounded-[11px] bg-[#616161B2] px-3 py-1 text-xs font-semibold text-[#FAFAFA]">
      {subtitle ? `${category} · ${subtitle}` : category}
    </span>
  );
}
