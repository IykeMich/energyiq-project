import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { PageHeaderContent } from '@/ui/layouts/page-header';
import { OrdersActionButton } from '../orders/orders-action-button';
import {
  useDistributorComplaintsQuery,
  useDistributorComplaintOverviewQuery,
  useDistributorComplaintQuery,
} from '@/hooks/use-complaints';
import { ComplaintsSearchBar } from './complaints-search-bar';
import { ComplaintsBanner } from './complaints-banner';
import { ComplaintsStats } from './complaints-stats';
import { ComplaintsFilter } from './complaints-filter';
import { ComplaintsTable } from './complaints-table';
import { ComplaintDetailSheet } from './complaint-detail-sheet';
import { RaiseComplaintModal } from './raise-complaint-modal';
import { toComplaintDetail, toComplaintRow, toComplaintStats } from './complaints-mapper';
import type { ComplaintDetail, ComplaintRow, ComplaintStatus } from './complaints-mocks';

/**
 * Distributor Complaints page. Wires the complaints UI to the real distributor
 * complaint API.
 */
export function ComplaintsOverview() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | 'All'>('All');
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);
  const [isRaiseOpen, setIsRaiseOpen] = useState(false);

  const { data: listResult, isLoading } = useDistributorComplaintsQuery({ limit: 100 });
  const { data: overview } = useDistributorComplaintOverviewQuery();
  const { data: detailResult } = useDistributorComplaintQuery(selectedComplaintId ?? '', {
    enabled: Boolean(selectedComplaintId),
  });

  const complaints = useMemo(() => (listResult?.items ?? []).map(toComplaintRow), [listResult]);
  const stats = useMemo(() => toComplaintStats(overview), [overview]);
  const underReviewCount = overview?.open_in_review ?? 0;

  const filteredComplaints = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    return complaints.filter((complaint) => {
      const matchesStatus = statusFilter === 'All' || complaint.status === statusFilter;
      const matchesQuery =
        normalizedQuery === '' ||
        complaint.id.toLowerCase().includes(normalizedQuery) ||
        complaint.type.toLowerCase().includes(normalizedQuery) ||
        complaint.reference.toLowerCase().includes(normalizedQuery);
      return matchesStatus && matchesQuery;
    });
  }, [searchQuery, statusFilter, complaints]);

  const selectedComplaint: ComplaintDetail | null = useMemo(
    () => (detailResult ? toComplaintDetail(detailResult) : null),
    [detailResult],
  );

  const handleAddComplaint = () => setIsRaiseOpen(true);

  const handleRowClick = (row: ComplaintRow) => {
    setSelectedComplaintId(row.rawId);
  };

  return (
    <section className="flex flex-col gap-6">
      {/* Complaint search replaces the default title in the layout header. */}
      <PageHeaderContent>
        <ComplaintsSearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      </PageHeaderContent>

      <header>
        <h1 className="text-2xl font-semibold text-[#FAFAFA]">Complaints</h1>
      </header>

      {/* Review banner on the left, primary action on the right. */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <ComplaintsBanner count={underReviewCount} />
        <OrdersActionButton label="Add Complaint" icon={Plus} onClick={handleAddComplaint} />
      </div>

      <ComplaintsStats stats={stats} />

      {/* Table card: status filter, then the complaints table with pagination. */}
      <div className="flex flex-col gap-5 rounded-[18px] bg-[#6161611A] p-6">
        <ComplaintsFilter status={statusFilter} onStatusChange={setStatusFilter} />
        <ComplaintsTable
          complaints={filteredComplaints}
          isLoading={isLoading}
          onRowClick={handleRowClick}
        />
      </div>

      <ComplaintDetailSheet
        complaint={selectedComplaint}
        onOpenChange={(open) => !open && setSelectedComplaintId(null)}
      />
      <RaiseComplaintModal open={isRaiseOpen} onOpenChange={setIsRaiseOpen} />
    </section>
  );
}
