interface ProductPricingTierRowProps {
  dotColor: string;
  tierName: string;
  basePrice: string;
  discountValue: string;
  onDiscountChange: (next: string) => void;
}

/** One row of the "Tier Discounts" table: tier name, editable discount %, computed distributor price. */
export function ProductPricingTierRow({
  dotColor,
  tierName,
  basePrice,
  discountValue,
  onDiscountChange,
}: ProductPricingTierRowProps) {
  const base = Number(basePrice) || 0;
  const discount = Number(discountValue) || 0;
  const distributorPrice = (base * (1 - discount / 100)).toFixed(0);

  return (
    <div className="flex items-center justify-between py-3 border-b border-[#616161B2] last:border-b-0">
      <div className="flex items-center gap-2.5">
        <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: dotColor }} />
        <span className="text-sm font-medium text-foreground">{tierName}</span>
      </div>

      <div className="flex items-center gap-1 text-sm font-medium">
        <input
          type="number"
          min={0}
          max={100}
          value={discountValue}
          onChange={(e) => onDiscountChange(e.target.value)}
          placeholder="0"
          className="w-10 bg-transparent text-right text-muted-foreground outline-none"
        />
        <span className="text-muted-foreground">%</span>
      </div>

      <span className="rounded-3xl bg-[#6161611A] px-4 py-1.5 text-xs font-semibold text-foreground/80">
        ₦{distributorPrice}/L
      </span>
    </div>
  );
}
