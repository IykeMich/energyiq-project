import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DataGrid, type ColDef } from '@energyiq/ui';
import { DISTRIBUTORS_MOCK, buildDistributorSummary, type Distributor } from './mocks';
import { DistributorSummaryStats } from './components/distributor-summary-stats';
import { DistributorFilterBar } from './components/distributor-filter-bar';
import { DistributorTierBadge } from './components/distributor-tier-badge';
import { DistributorStatusBadge } from './components/distributor-status-badge';

const NGN = new Intl.NumberFormat('en-NG');

function formatMillions(value: number): string {
  if (value >= 1_000_000) return `₦${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `₦${(value / 1_000).toFixed(1)}K`;
  return `₦${NGN.format(value)}`;
}

export function DistributorListPage() {
  const navigate = useNavigate();
  const { slug = '' } = useParams<{ slug: string }>();

  const summary = useMemo(() => buildDistributorSummary(DISTRIBUTORS_MOCK), []);

  const columnDefs = useMemo<ColDef<Distributor>[]>(
    () => [
      {
        field: 'name',
        headerName: 'Distributor',
        minWidth: 200,
        cellRenderer: (p: { value: string }) => (
          <div className="flex items-center gap-3 h-full">
            <span className="w-7 h-7 rounded-full bg-brand text-brand-foreground text-xs font-bold flex items-center justify-center shrink-0">
              {p.value.charAt(0)}
            </span>
            <span>{p.value}</span>
          </div>
        ),
      },
      {
        field: 'tier',
        headerName: 'Tier',
        width: 110,
        flex: 0,
        cellRenderer: (p: { value: Distributor['tier'] }) => <DistributorTierBadge value={p.value} />,
      },
      { field: 'totalOrders', headerName: 'Total Orders', width: 140, flex: 0, type: 'numericColumn' },
      {
        field: 'totalValueNGN',
        headerName: 'Total Value',
        width: 140,
        flex: 0,
        valueFormatter: (p) => (typeof p.value === 'number' ? formatMillions(p.value) : ''),
      },
      { field: 'lastOrder', headerName: 'Last Order', width: 140, flex: 0 },
      { field: 'location', headerName: 'Location', minWidth: 180 },
      {
        field: 'status',
        headerName: 'Status',
        width: 130,
        flex: 0,
        cellRenderer: (p: { value: Distributor['status'] }) => <DistributorStatusBadge value={p.value} />,
      },
    ],
    [],
  );

  return (
    <section className="flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Distributor Management</h1>
          <p className="text-xs text-muted-foreground mt-1">Today</p>
        </div>
      </header>

      <DistributorSummaryStats summary={summary} />

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <DistributorFilterBar />

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(`/${slug}/distributors/tiers`)}
            className="h-[46px] px-6 rounded-full border border-brand text-brand font-semibold text-sm"
          >
            Manage Tiers
          </button>
          <button
            type="button"
            onClick={() => navigate(`/${slug}/distributors/invite`)}
            className="h-[46px] px-6 rounded-full bg-brand text-brand-foreground font-semibold text-sm"
          >
            Invite Distributor
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">Distributor Table</h2>
        <button
          type="button"
          className="text-sm text-brand underline font-semibold"
        >
          Distributor Approval
        </button>
      </div>

      <DataGrid<Distributor>
        rowData={DISTRIBUTORS_MOCK}
        columnDefs={columnDefs}
        rowHeight={64}
        onRowClicked={(e) => e.data && navigate(`/${slug}/distributors/${e.data.id}`)}
        className="h-[640px] bg-surface-card rounded-[18px] overflow-hidden cursor-pointer"
      />
    </section>
  );
}
