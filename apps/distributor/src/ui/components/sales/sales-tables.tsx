import { useMemo, useState } from 'react';
import { MoreHorizontal, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@energyiq/ui';
import { DefaultTable } from '../table/default-table';
import type { Column } from '../table/default-table';
import type { SaleRow } from './sales-mocks';
import { SalesStatusBadge } from './sales-status-badge';

interface SaleRowActionsProps {
  row: SaleRow;
  onViewDetails: (sale: SaleRow) => void;
  onVoidSale: (sale: SaleRow) => void;
}

function SaleRowActions({
  row,
  onViewDetails,
  onVoidSale,
}: SaleRowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="
            inline-flex
            h-8
            w-8
            items-center
            justify-center
            rounded-full
            text-[#FAFAFA]
            hover:bg-[#262626]
          "
        >
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => onViewDetails(row)}
        >
          View Details
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => onVoidSale(row)}
        >
          Void Sale
        </DropdownMenuItem>

        <DropdownMenuItem>
          Download Receipt
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function buildColumns(
  selectedIds: string[],
  toggleSale: (id: string) => void,
  onViewDetails: (sale: SaleRow) => void,
  onVoidSale: (sale: SaleRow) => void,
): Column<SaleRow>[] {
  return [
    {
      header: 'Sales ID',
      accessor: 'id',
      sortable: true,
      render: (_, row) => {
        const checked = selectedIds.includes(row.id);

        return (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => toggleSale(row.id)}
              className={`
                flex
                h-5
                w-5
                items-center
                justify-center
                rounded-[4px]
                border
                transition-colors
                ${
                  checked
                    ? 'border-[#FBC02D] bg-[#FBC02D]'
                    : 'border-[#FBC02D] bg-transparent'
                }
              `}
            >
              {checked && (
                <Check
                  className="h-3 w-3 text-black"
                  strokeWidth={3}
                />
              )}
            </button>

            <span>{row.id}</span>
          </div>
        );
      },
    },
    {
      header: 'Customer',
      accessor: 'customer',
      sortable: true,
    },
    {
      header: 'Product',
      accessor: 'product',
      sortable: true,
    },
    {
      header: 'Qty',
      accessor: 'qty',
      align: 'center',
      sortable: true,
    },
    {
      header: 'Unit Price',
      accessor: 'unitPrice',
      sortable: true,
      render: (value) =>
        `₦${(value as number).toLocaleString('en-NG')}`,
    },
    {
      header: 'Total',
      accessor: 'total',
      sortable: true,
      render: (value) =>
        `₦${(value as number).toLocaleString('en-NG')}`,
    },
    {
      header: 'Date',
      accessor: 'date',
      sortable: true,
    },
    {
      header: 'Method',
      accessor: 'method',
      sortable: true,
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (_, row) => (
        <SalesStatusBadge status={row.status} />
      ),
    },
    {
      header: '',
      accessor: 'id',
      align: 'center',
      render: (_, row) => (
        <SaleRowActions
          row={row}
          onViewDetails={onViewDetails}
          onVoidSale={onVoidSale}
        />
      ),
    },
  ];
}

interface SalesTableProps {
  sales: SaleRow[];
}

export function SalesTable({
  sales,
}: SalesTableProps) {
  const [selectedIds, setSelectedIds] =
    useState<string[]>([]);

  const toggleSale = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter(
            (saleId) => saleId !== id,
          )
        : [...prev, id],
    );
  };

  const handleViewDetails = (
    sale: SaleRow,
  ) => {
    console.log('View details', sale);
  };

  const handleVoidSale = (
    sale: SaleRow,
  ) => {
    console.log('Void sale', sale);
  };

  const columns = useMemo(
    () =>
      buildColumns(
        selectedIds,
        toggleSale,
        handleViewDetails,
        handleVoidSale,
      ),
    [selectedIds],
  );

  return (
    <DefaultTable
      columns={columns}
      data={sales}
      itemsPerPage={10}
      getRowId={(row) => row.id}
      noDataMessage="No sales found"
    />
  );
}