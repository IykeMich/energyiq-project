/** Centered no-results message shown inside the report card when no sales match the filters. */
export function SalesEntryEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-24 text-center">
      <p className="text-sm font-medium italic text-[#FAFAFA]">No results match your filters</p>
      <p className="max-w-md text-xs italic text-[#9E9E9E]">
        Try adjusting the product, region, or date range. If you&apos;ve just onboarded, sales data
        will appear after the first recorded transaction.
      </p>
    </div>
  );
}
