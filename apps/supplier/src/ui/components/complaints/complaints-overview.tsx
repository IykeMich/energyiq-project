import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeaderContent } from '@/ui/layouts/page-header';
import { ComplaintsSearchBar } from './complaints-search-bar';
import { ComplaintsStatStrip } from './complaints-stat-strip';
import { ComplaintsFilterChips, type ComplaintFilterSelection } from './complaints-filter-chips';
import { ComplaintsTable } from './complaints-table';
import { COMPLAINTS_MOCK } from './complaints-mocks';

/** Drives every section's state in one place (loaded vs. loading vs. empty). */
export type ComplaintsStatus = 'ready' | 'loading' | 'empty';

interface ComplaintsOverviewProps {
  /** Defaults to the loaded design; flip to preview the loading/empty states. */
  status?: ComplaintsStatus;
}

/**
 * Supplier Complaints page. Search and the filter chips filter the table
 * client-side for now; swap `COMPLAINTS_MOCK` for the complaints query hook once
 * the endpoint lands.
 */
export function ComplaintsOverview({ status = 'ready' }: ComplaintsOverviewProps) {
  const navigate = useNavigate();
  const { slug = '' } = useParams<{ slug: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<ComplaintFilterSelection>({});

  const isLoading = status === 'loading';
  const isEmpty = status === 'empty';

  const setFilter = (filterId: string, option: string | null) => {
    setFilters((previous) => ({ ...previous, [filterId]: option }));
  };

  const filteredComplaints = useMemo(() => {
    if (isEmpty) return [];
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const typeFilter = filters.type;
    const productFilter = filters.product;
    const statusFilter = filters.status;
    const severityFilter = filters.severity;
    return COMPLAINTS_MOCK.filter((complaint) => {
      const matchesQuery =
        normalizedQuery === '' ||
        complaint.id.toLowerCase().includes(normalizedQuery) ||
        complaint.orderNo.toLowerCase().includes(normalizedQuery) ||
        complaint.product.toLowerCase().includes(normalizedQuery) ||
        complaint.distributor.toLowerCase().includes(normalizedQuery);
      const matchesType = !typeFilter || complaint.issueType === typeFilter;
      const matchesProduct = !productFilter || complaint.product === productFilter;
      const matchesStatus = !statusFilter || complaint.status === statusFilter;
      const matchesSeverity = !severityFilter || complaint.severity === severityFilter;
      // NOTE: the "From/To Date" chips are presentational — their relative ranges
      // don't map to the static mock timestamps. TODO(orval): apply them once
      // complaints carry real timestamps from the endpoint.
      return matchesQuery && matchesType && matchesProduct && matchesStatus && matchesSeverity;
    });
  }, [isEmpty, searchQuery, filters]);

  return (
    <section className="flex flex-col gap-6">
      {/* Complaint search replaces the default title in the layout header (dynamic per page). */}
      <PageHeaderContent>
        <ComplaintsSearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      </PageHeaderContent>

      <h1 className="text-2xl font-semibold text-[#FAFAFA]">Complaints</h1>

      <ComplaintsStatStrip isEmpty={isEmpty} />

      {/* Table card: filter chips, then the complaints table. */}
      <div className="flex flex-col gap-5 rounded-[18px] bg-[#6161611A] p-6">
        <ComplaintsFilterChips selection={filters} onChange={setFilter} />
        <ComplaintsTable
          complaints={filteredComplaints}
          isLoading={isLoading}
          onSelect={(complaint) => navigate(`/${slug}/complaints/${complaint.id}`)}
          onCancel={() => {
            // TODO(orval): wire the cancel-complaint action once the endpoint lands.
          }}
        />
      </div>
    </section>
  );
}
