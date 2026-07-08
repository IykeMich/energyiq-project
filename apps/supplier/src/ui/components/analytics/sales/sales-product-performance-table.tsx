import { Download } from 'lucide-react';
import { DefaultTable, type Column } from '../../table/default-table';
import { PRODUCT_PERFORMANCE_MOCK, type ProductPerformanceRow } from './sales-analytics-mocks';

const columns: Column<ProductPerformanceRow>[] = [
  { header: 'Product', accessor: 'product' },
  { header: 'Category', accessor: 'category' },
  { header: 'Units Sold', accessor: 'units_sold' },
  { header: 'Revenue', accessor: 'revenue' },
  { header: 'Avg Price', accessor: 'avg_price' },
  { header: 'Top Region', accessor: 'top_region' },
  { header: 'Growth', accessor: 'growth', align: 'right' },
];

export function SalesProductPerformanceTable() {
  return (
    <DefaultTable
      columns={columns}
      data={PRODUCT_PERFORMANCE_MOCK}
      itemsPerPage={4}
      showPagination={false}
      noDataMessage="No product performance data available"
      getRowId={(row) => row.id}
    />
  );
}

export function SalesProductPerformanceExportButton() {
  return (
    <button
      type="button"
      className="tap-effect flex h-9 items-center gap-1.5 rounded-full border border-[#616161B2] px-4 text-xs font-medium text-[#FAFAFA] hover:bg-[#FFFFFF1A]"
    >
      <Download className="h-3.5 w-3.5" />
      Export
    </button>
  );
}
