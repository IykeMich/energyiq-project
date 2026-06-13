import { useMemo } from 'react';
import { DefaultTable } from '../table/default-table';
import type { Column } from '../table/default-table';
import { SalesEntryCheckbox } from './sales-entry-checkbox';
import { SalesEntryStatusBadge } from './sales-entry-status-badge';
import { SALES_STATUS_COLOR, formatNairaCompact } from './sales-entry-mocks';
import type { SalesRow } from './sales-entry-mocks';

interface SalesEntryTableProps {
  sales: SalesRow[];
  selectedIds: Set<string>;
  onToggleRow: (id: string) => void;
  onToggleAll: (checked: boolean) => void;
  /** Opens the Transaction Detail modal for the clicked row. */
  onSelect: (row: SalesRow) => void;
}

function buildColumns(
  sales: SalesRow[],
  selectedIds: Set<string>,
  onToggleRow: (id: string) => void,
  onToggleAll: (checked: boolean) => void,
): Column<SalesRow>[] {
  const allSelected = sales.length > 0 && sales.every((row) => selectedIds.has(row.id));

  return [
    {
      header: '',
      accessor: 'id',
      width: '48px',
      align: 'center',
      renderHeader: () => (
        <SalesEntryCheckbox
          checked={allSelected}
          onChange={onToggleAll}
          aria-label="Select all sales"
        />
      ),
      render: (_value, row) => (
        <SalesEntryCheckbox
          checked={selectedIds.has(row.id)}
          onChange={() => onToggleRow(row.id)}
          aria-label={`Select sale for ${row.distributor}`}
        />
      ),
    },
    {
      header: 'Distributor',
      accessor: 'distributor',
      sortable: true,
      render: (_value, row) => (
        <div className="flex flex-col">
          <span className="text-sm text-[#FAFAFA]">{row.distributor}</span>
          <span className="text-xs text-[#9E9E9E]">ID: {row.distributorId}</span>
        </div>
      ),
    },
    { header: 'Date', accessor: 'date', sortable: true },
    { header: 'Product', accessor: 'product', sortable: true },
    { header: 'Quantity', accessor: 'quantity', sortable: true },
    {
      header: 'Amount',
      accessor: 'amount',
      sortable: true,
      render: (value) => formatNairaCompact(value as number),
    },
    { header: 'Payment', accessor: 'payment', sortable: true },
    {
      header: 'Status',
      accessor: 'status',
      render: (_value, row) => (
        <SalesEntryStatusBadge label={row.status} color={SALES_STATUS_COLOR[row.status]} />
      ),
    },
  ];
}

export function SalesEntryTable({
  sales,
  selectedIds,
  onToggleRow,
  onToggleAll,
  onSelect,
}: SalesEntryTableProps) {
  const columns = useMemo(
    () => buildColumns(sales, selectedIds, onToggleRow, onToggleAll),
    [sales, selectedIds, onToggleRow, onToggleAll],
  );

  return (
    <DefaultTable
      columns={columns}
      data={sales}
      itemsPerPage={6}
      getRowId={(row) => row.id}
      onRowClick={onSelect}
      noDataMessage="No results match your filters"
    />
  );
}
