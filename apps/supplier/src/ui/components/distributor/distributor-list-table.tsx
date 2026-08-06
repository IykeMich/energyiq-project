import { Avatar, AvatarFallback, AvatarImage } from '@energyiq/ui';
import { getInitials } from '@energyiq/shared';
import { DefaultTable, type Column } from '@/ui/components/table/default-table';
import { TableCheckbox } from '@/ui/components/table/table-checkbox';
import { DistributorTierBadge } from './distributor-tier-badge';
import { DistributorStatusBadge } from './distributor-status-badge';
import type { Distributor } from '@/ui/pages/distributor/mocks';

const NGN = new Intl.NumberFormat('en-NG');

function formatMillions(value: number): string {
  if (value >= 1_000_000) return `₦${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `₦${(value / 1_000).toFixed(1)}K`;
  return `₦${NGN.format(value)}`;
}

function DistributorCell({ name, location }: { name: string; location?: string }) {
  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-9 w-9">
        <AvatarImage src={undefined} alt={name} />
        <AvatarFallback className="bg-[#FBC02D] text-xs text-[#121212]">{getInitials(name)}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-[#FAFAFA]">{name}</span>
        {location && <span className="text-xs text-[#9E9E9E]">{location}</span>}
      </div>
    </div>
  );
}

interface DistributorListTableProps {
  rows: Distributor[];
  isLoading: boolean;
  onRowClick: (row: Distributor) => void;
}

export function DistributorListTable({ rows, isLoading, onRowClick }: DistributorListTableProps) {
  const columns: Column<Distributor>[] = [
    {
      header: '',
      accessor: 'id',
      width: '48px',
      renderHeader: () => <TableCheckbox checked={false} onChange={() => {}} aria-label="Select all distributors" />,
      render: (_value, row) => (
        <TableCheckbox checked={false} onChange={() => {}} aria-label={`Select ${row.name}`} />
      ),
    },
    {
      header: 'Distributor',
      accessor: 'name',
      render: (value, row) => <DistributorCell name={String(value)} location={row.location} />,
    },
    {
      header: 'Tier',
      accessor: 'tier',
      render: (value) => <DistributorTierBadge value={value as Distributor['tier']} />,
    },
    {
      header: 'Total Orders',
      accessor: 'totalOrders',
      render: (value) => (typeof value === 'number' ? String(value) : '—'),
    },
    {
      header: 'Total Value',
      accessor: 'totalValueNGN',
      render: (value) => (typeof value === 'number' ? formatMillions(value) : '—'),
    },
    {
      header: 'Last Order',
      accessor: 'lastOrder',
      render: (value) => (value ? String(value) : '—'),
    },
    {
      header: 'Location',
      accessor: 'location',
      render: (value) => (value ? String(value) : '—'),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (value) => <DistributorStatusBadge value={value as Distributor['status']} />,
    },
  ];

  return (
    <DefaultTable<Distributor>
      columns={columns}
      data={rows}
      isLoading={isLoading}
      noDataMessage="No distributors found."
      getRowId={(row) => row.id}
      onRowClick={onRowClick}
      entityLabel="Distributors"
    />
  );
}
