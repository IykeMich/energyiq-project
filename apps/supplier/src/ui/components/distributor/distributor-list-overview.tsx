import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeaderContent } from '@/ui/layouts/page-header';
import { useDistributorsQuery } from '@/hooks/use-distributor';
import {
  buildDistributorSummary,
  toDistributorRow,
  type Distributor,
  type DistributorStatus,
  type DistributorTier,
} from '@/ui/pages/distributor/mocks';
import { DistributorSearchBar } from './distributor-search-bar';
import { DistributorSummaryStats } from './distributor-summary-stats';
import { DistributorFilterBar } from './distributor-filter-bar';
import { DistributorListTable } from './distributor-list-table';
import { DistributorDetailsSheet } from './distributor-details-sheet';

const SEARCH_DEBOUNCE_MS = 300;

/** Supplier Distributor Management page. Search/tier/status filter server-side via GET /v1/distributor/list. */
export function DistributorListOverview() {
  const navigate = useNavigate();
  const { slug = '' } = useParams<{ slug: string }>();
  const [selectedDistributor, setSelectedDistributor] = useState<Distributor | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<DistributorTier>();
  const [statusFilter, setStatusFilter] = useState<DistributorStatus>();

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedQuery(searchQuery.trim()), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  // Unfiltered so the KPI cards always reflect the full distributor base, not the current filter.
  const summaryQuery = useDistributorsQuery();
  const summaryRows = useMemo(
    () => (summaryQuery.data ?? []).map(toDistributorRow),
    [summaryQuery.data],
  );
  const summary = useMemo(() => buildDistributorSummary(summaryRows), [summaryRows]);

  const distributorsQuery = useDistributorsQuery({
    search: debouncedQuery || undefined,
    status: statusFilter,
    tier: tierFilter?.toLowerCase(),
  });
  const rows = useMemo(() => (distributorsQuery.data ?? []).map(toDistributorRow), [distributorsQuery.data]);

  return (
    <section className="flex flex-col gap-6">
      {/* Distributor search replaces the default title in the layout header (dynamic per page). */}
      <PageHeaderContent>
        <DistributorSearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      </PageHeaderContent>

      <h1 className="text-2xl font-semibold text-[#FAFAFA]">Distributor Management</h1>

      <div className="flex flex-col gap-4 rounded-[18px] bg-[#6161611A] p-6">
        <p className="text-sm text-[#FAFAFA]">Today</p>
        <DistributorSummaryStats summary={summary} />
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <DistributorFilterBar
          selectedTier={tierFilter}
          onTierChange={setTierFilter}
          selectedStatus={statusFilter}
          onStatusChange={setStatusFilter}
        />

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(`/${slug}/tier-management`)}
            className="tap-effect h-[46px] px-6 rounded-full bg-brand/20 text-brand font-semibold text-sm hover:bg-brand/30"
          >
            Manage Tiers
          </button>
          <button
            type="button"
            onClick={() => navigate(`/${slug}/distributors/invite`)}
            className="tap-effect h-[46px] px-6 rounded-full bg-brand text-brand-foreground font-semibold text-sm hover:opacity-90"
          >
            Invite Distributor
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="h-[27px] w-[5px] rounded-sm bg-brand" />
          <h2 className="text-lg font-medium text-[#FAFAFA]">Distributor Table</h2>
        </div>
        <button
          type="button"
          onClick={() => navigate(`/${slug}/distributors/approval`)}
          className="tap-effect text-base font-semibold text-brand underline hover:opacity-80"
        >
          Distributor Approval
        </button>
      </div>

      {distributorsQuery.isError && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
          Couldn't load distributors. Please try again.
        </div>
      )}

      <DistributorListTable
        rows={rows}
        isLoading={distributorsQuery.isLoading}
        onRowClick={setSelectedDistributor}
      />

      <DistributorDetailsSheet
        distributor={selectedDistributor}
        onOpenChange={(open) => !open && setSelectedDistributor(null)}
      />
    </section>
  );
}
