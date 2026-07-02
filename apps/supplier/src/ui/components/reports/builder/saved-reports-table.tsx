import { Pencil, Trash2 } from 'lucide-react';
import { DefaultTable, type Column } from '../../table/default-table';
import { SAVED_REPORTS_MOCK, type SavedReport } from './builder-mocks';

const columns: Column<SavedReport>[] = [
  { header: 'Report Name', accessor: 'name' },
  { header: 'Metrics', accessor: 'metrics' },
  { header: 'Schedule', accessor: 'schedule' },
  { header: 'Last Run', accessor: 'last_run' },
  {
    header: 'Action',
    accessor: 'id',
    render: () => (
      <div className="flex items-center gap-2">
        <button type="button" className="tap-effect text-[#FBC02D] hover:text-[#FBC02D]/80">
          <Pencil className="h-4 w-4" />
        </button>
        <button type="button" className="tap-effect text-red-500 hover:text-red-400">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    ),
  },
];

interface SavedReportsTableProps {
  reports?: SavedReport[];
}

export function SavedReportsTable({ reports = SAVED_REPORTS_MOCK }: SavedReportsTableProps) {
  return (
    <DefaultTable
      columns={columns}
      data={reports}
      itemsPerPage={5}
      noDataMessage="No saved reports yet"
      getRowId={(row) => row.id}
    />
  );
}
