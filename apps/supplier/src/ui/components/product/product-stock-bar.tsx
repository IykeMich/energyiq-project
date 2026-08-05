import { getStockTierColor } from './product-catalog-mocks';

interface ProductStockBarProps {
  percentage: number;
}

/** Stock-health indicator: "{pct}% in stock" over a two-layer progress bar. */
export function ProductStockBar({ percentage }: ProductStockBarProps) {
  const tierColor = getStockTierColor(percentage);

  return (
    <div className="flex w-[169px] flex-col gap-1">
      <span className="text-xs text-[#FAFAFA]">{percentage}% in stock</span>
      <div className="h-[5px] w-full rounded-full" style={{ backgroundColor: `${tierColor}80` }}>
        <div
          className="h-full rounded-full"
          style={{ width: `${percentage}%`, backgroundColor: tierColor }}
        />
      </div>
    </div>
  );
}
