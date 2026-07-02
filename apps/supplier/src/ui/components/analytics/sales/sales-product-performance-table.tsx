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
