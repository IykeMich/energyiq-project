import { SalesEntryEmptyState } from './sales-entry-empty-state';
import { SalesEntryTable } from './sales-entry-table';
import { SALES_REPORT_TITLE } from './sales-entry-mocks';
import type { SalesRow } from './sales-entry-mocks';

interface SalesEntryReportCardProps {
  isEmpty: boolean;
  sales: SalesRow[];
  selectedIds: Set<string>;
  onToggleRow: (id: string) => void;
  onToggleAll: (checked: boolean) => void;
  onSelect: (row: SalesRow) => void;
}

/**
 * Titled report panel: a gold accent bar + heading, then either the populated sales
 * table or the empty-state message, driven by the single `isEmpty` flag.
 */
export function SalesEntryReportCard({
  isEmpty,
  sales,
  selectedIds,
  onToggleRow,
  onToggleAll,
  onSelect,
}: SalesEntryReportCardProps) {
  return (
    <div className="flex flex-col gap-5 rounded-[18px] bg-[#6161611A] p-6">
      <div className="flex items-center gap-3">
        <span className="h-5 w-1 rounded-full bg-[#FBC02D]" aria-hidden="true" />
        <h2 className="text-base font-medium text-[#FAFAFA]">{SALES_REPORT_TITLE}</h2>
      </div>

      {isEmpty ? (
        <SalesEntryEmptyState />
      ) : (
        <SalesEntryTable
          sales={sales}
          selectedIds={selectedIds}
          onToggleRow={onToggleRow}
          onToggleAll={onToggleAll}
          onSelect={onSelect}
        />
      )}
    </div>
  );
}
