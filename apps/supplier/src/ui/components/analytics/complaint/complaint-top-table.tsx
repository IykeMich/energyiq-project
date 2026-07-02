import { DefaultTable, type Column } from '../../table/default-table';
import { TOP_COMPLAINTS_MOCK, type TopComplaintRow } from './complaint-analytics-mocks';

const columns: Column<TopComplaintRow>[] = [
  { header: 'Complaint ID', accessor: 'complaint_id' },
  { header: 'Product', accessor: 'product' },
  { header: 'Severity', accessor: 'severity' },
  { header: 'Time to SLA', accessor: 'time_to_sla', align: 'right' },
];

export function ComplaintTopTable() {
  return (
    <DefaultTable
      columns={columns}
      data={TOP_COMPLAINTS_MOCK}
      itemsPerPage={5}
      showPagination={false}
      noDataMessage="No complaints available"
      getRowId={(row) => row.id}
    />
  );
}
