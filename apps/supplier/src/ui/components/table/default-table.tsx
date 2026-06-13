import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { ChevronDown, ChevronUp, ChevronsUpDown, X } from 'lucide-react';
import { cn } from '@energyiq/shared';

export type ColumnAlignment = 'left' | 'center' | 'right';

export interface Column<RowData> {
  /** Text shown in the header cell. */
  header: string;
  /** Custom header renderer; overrides `header` when present (e.g. a select-all checkbox). */
  renderHeader?: () => ReactNode;
  /** Key on the row used to read the cell value. */
  accessor: keyof RowData;
  /** Fixed column width (any CSS width, e.g. "120px"). */
  width?: string;
  /** Horizontal alignment for both the header and body cells. Defaults to "left". */
  align?: ColumnAlignment;
  /** When true, clicking the header cycles ascending → descending → unsorted. */
  sortable?: boolean;
  /** Custom cell renderer. Receives the cell value and the full row. */
  render?: (value: RowData[keyof RowData], row: RowData) => ReactNode;
  headerClassName?: string;
  cellClassName?: string;
}

type SortDirection = 'asc' | 'desc';

interface SortState<RowData> {
  column: keyof RowData;
  direction: SortDirection;
}

interface DefaultTableProps<RowData extends object> {
  columns: Column<RowData>[];
  data: RowData[];
  /** Rows shown per page when pagination is enabled. Defaults to 10. */
  itemsPerPage?: number;
  showPagination?: boolean;
  isLoading?: boolean;
  noDataMessage?: string;
  /** Stable row key. Falls back to the row index when omitted. */
  getRowId?: (row: RowData, index: number) => string | number;
  onRowClick?: (row: RowData) => void;
  /** Extra classes for the outer wrapper. */
  className?: string;
}

const ALIGNMENT_CLASS: Record<ColumnAlignment, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

function compareValues(first: unknown, second: unknown): number {
  if (typeof first === 'number' && typeof second === 'number') {
    return first - second;
  }
  return String(first ?? '').localeCompare(String(second ?? ''));
}

/** Builds the condensed page list, e.g. [1, 2, 3, "ellipsis", 50]. */
function buildPageList(totalPages: number, currentPage: number): (number | 'ellipsis')[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }
  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, 'ellipsis', totalPages];
  }
  if (currentPage >= totalPages - 3) {
    return [1, 'ellipsis', ...Array.from({ length: 5 }, (_, index) => totalPages - 4 + index)];
  }
  return [1, 'ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis', totalPages];
}

/**
 * Generic, dark-themed data table with client-side sorting and pagination.
 * Filtering lives in the parent: pass already-filtered `data` and the table
 * handles sort → paginate → render. Designed to be reused across pages.
 */
export function DefaultTable<RowData extends object>({
  columns,
  data,
  itemsPerPage = 10,
  showPagination = true,
  isLoading = false,
  noDataMessage = 'No Data Found',
  getRowId,
  onRowClick,
  className,
}: DefaultTableProps<RowData>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState<SortState<RowData> | null>(null);

  const sortedData = useMemo(() => {
    if (!sort) return data;
    const ordered = [...data].sort((rowA, rowB) =>
      compareValues(rowA[sort.column], rowB[sort.column]),
    );
    return sort.direction === 'asc' ? ordered : ordered.reverse();
  }, [data, sort]);

  const totalPages = Math.max(1, Math.ceil(sortedData.length / itemsPerPage));

  // Keep the current page in range when the data or sort shrinks the result set.
  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  const startIndex = showPagination ? (currentPage - 1) * itemsPerPage : 0;
  const endIndex = showPagination ? startIndex + itemsPerPage : sortedData.length;
  const visibleRows = sortedData.slice(startIndex, endIndex);

  const toggleSort = (column: Column<RowData>) => {
    if (!column.sortable) return;
    setSort((previous) => {
      if (!previous || previous.column !== column.accessor) {
        return { column: column.accessor, direction: 'asc' };
      }
      if (previous.direction === 'asc') {
        return { column: column.accessor, direction: 'desc' };
      }
      return null;
    });
  };

  const renderSortIcon = (column: Column<RowData>) => {
    if (!column.sortable) return null;
    const isActive = sort?.column === column.accessor;
    if (!isActive) {
      return <ChevronsUpDown className="h-3.5 w-3.5 text-[#616161B2]" aria-hidden="true" />;
    }
    return sort?.direction === 'asc' ? (
      <ChevronUp className="h-3.5 w-3.5 text-[#FBC02D]" aria-hidden="true" />
    ) : (
      <ChevronDown className="h-3.5 w-3.5 text-[#FBC02D]" aria-hidden="true" />
    );
  };

  return (
    <div className={cn('flex w-full flex-col gap-6', className)}>
      {sort && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setSort(null)}
            className="tap-effect inline-flex items-center gap-1 text-xs font-medium text-[#FBC02D] hover:underline"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
            Clear sort
          </button>
        </div>
      )}
      <div className="w-full overflow-x-auto no-scrollbar">
        <table className="w-full min-w-max border-separate border-spacing-y-1">
          <thead>
            <tr>
              {columns.map((column, columnIndex) => {
                const alignment = column.align ?? 'left';
                return (
                  <th
                    key={columnIndex}
                    style={{ width: column.width }}
                    onClick={() => toggleSort(column)}
                    className={cn(
                      'border-y border-[#616161B2] bg-transparent px-4 py-3 text-base font-semibold text-[#FAFAFA] whitespace-nowrap',
                      ALIGNMENT_CLASS[alignment],
                      columnIndex === 0 && 'rounded-l-[28px] border-l',
                      columnIndex === columns.length - 1 && 'rounded-r-[28px] border-r',
                      column.sortable && 'cursor-pointer select-none',
                      column.headerClassName,
                    )}
                  >
                    <span
                      className={cn(
                        'flex items-center gap-1',
                        alignment === 'center' && 'justify-center',
                        alignment === 'right' && 'justify-end',
                      )}
                    >
                      {column.renderHeader ? column.renderHeader() : column.header}
                      {renderSortIcon(column)}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              Array.from({ length: itemsPerPage }).map((_, skeletonIndex) => (
                <tr key={`skeleton-${skeletonIndex}`}>
                  {columns.map((_column, columnIndex) => (
                    <td key={columnIndex} className="px-4 py-3">
                      <div className="h-4 w-full animate-pulse rounded bg-[#6161611A]" />
                    </td>
                  ))}
                </tr>
              ))
            ) : visibleRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-16 text-center">
                  <p className="text-sm text-[#FFFFFFCC]">{noDataMessage}</p>
                </td>
              </tr>
            ) : (
              visibleRows.map((row, rowIndex) => (
                <tr
                  key={getRowId ? getRowId(row, startIndex + rowIndex) : startIndex + rowIndex}
                  role={onRowClick ? 'button' : undefined}
                  tabIndex={onRowClick ? 0 : undefined}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  onKeyDown={
                    onRowClick
                      ? (event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            onRowClick(row);
                          }
                        }
                      : undefined
                  }
                  className={cn(
                    'transition-colors',
                    onRowClick && 'cursor-pointer hover:bg-[#6161611A]',
                  )}
                >
                  {columns.map((column, columnIndex) => {
                    const alignment = column.align ?? 'left';
                    const value = row[column.accessor];
                    return (
                      <td
                        key={columnIndex}
                        className={cn(
                          'px-4 py-4 text-sm text-[#FAFAFA] whitespace-nowrap',
                          ALIGNMENT_CLASS[alignment],
                          column.cellClassName,
                        )}
                      >
                        {column.render ? column.render(value, row) : String(value)}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showPagination && !isLoading && sortedData.length > 0 && (
        <div className="flex flex-col items-center justify-between gap-4 px-1 sm:flex-row">
          <p className="text-sm font-medium text-[#FAFAFA]">
            Showing {startIndex + 1} to {Math.min(endIndex, sortedData.length)} of{' '}
            {sortedData.length} Entries
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              className="tap-effect rounded-md border border-[#FBC02D] px-3 py-1 text-xs font-medium text-[#FBC02D] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Prev
            </button>

            {buildPageList(totalPages, currentPage).map((page, pageIndex) =>
              page === 'ellipsis' ? (
                <span key={`ellipsis-${pageIndex}`} className="px-1 text-xs text-[#FAFAFA]">
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={cn(
                    'tap-effect min-w-[24px] rounded-md px-2 py-1 text-xs font-medium transition-colors',
                    currentPage === page
                      ? 'bg-[#FBC02D] text-[#121212]'
                      : 'text-[#FAFAFA] hover:bg-[#6161611A]',
                  )}
                >
                  {page}
                </button>
              ),
            )}

            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={currentPage === totalPages}
              className="tap-effect rounded-md bg-[#FBC02D] px-3 py-1 text-xs font-medium text-[#121212] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
