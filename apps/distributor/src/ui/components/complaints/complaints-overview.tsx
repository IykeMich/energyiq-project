import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { PageHeaderContent } from '@/ui/layouts/page-header';
import { OrdersActionButton } from '../orders/orders-action-button';
import { ComplaintsSearchBar } from './complaints-search-bar';
import { ComplaintsBanner } from './complaints-banner';
import { ComplaintsStats } from './complaints-stats';
import { ComplaintsFilter } from './complaints-filter';
import { ComplaintsTable } from './complaints-table';
import { ComplaintDetailSheet } from './complaint-detail-sheet';
import { RaiseComplaintModal } from './raise-complaint-modal';
import {
  COMPLAINTS_MOCK,
  COMPLAINTS_UNDER_REVIEW,
  COMPLAINT_DETAIL_MOCK,
  type ComplaintDetail,
  type ComplaintStatus,
} from './complaints-mocks';

/**
 * Supplier Complaints page. The header search and the Status filter narrow the
 * table client-side for now; swap `COMPLAINTS_MOCK` for the complaints query hook
 * once the endpoint lands (see TODO(orval) markers in complaints-mocks.ts).
 */
export function ComplaintsOverview() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | 'All'>('All');
  const [selectedComplaint, setSelectedComplaint] = useState<ComplaintDetail | null>(null);
  const [isRaiseOpen, setIsRaiseOpen] = useState(false);

  const filteredComplaints = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    return COMPLAINTS_MOCK.filter((complaint) => {
      const matchesStatus = statusFilter === 'All' || complaint.status === statusFilter;
      const matchesQuery =
        normalizedQuery === '' ||
        complaint.id.toLowerCase().includes(normalizedQuery) ||
        complaint.type.toLowerCase().includes(normalizedQuery) ||
        complaint.reference.toLowerCase().includes(normalizedQuery);
      return matchesStatus && matchesQuery;
    });
  }, [searchQuery, statusFilter]);

  const handleAddComplaint = () => setIsRaiseOpen(true);

  const handleRowClick = () => {
    // TODO(orval): fetch the clicked complaint's detail by id; one mock stands in for now.
    setSelectedComplaint(COMPLAINT_DETAIL_MOCK);
  };

  const handleCancel = () => {
    // TODO(orval): wire row cancel to the complaints mutation once the API lands.
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
        <ComplaintsBanner count={COMPLAINTS_UNDER_REVIEW} />
        <OrdersActionButton label="Add Complaint" icon={Plus} onClick={handleAddComplaint} />
      </div>

      <ComplaintsStats />

      {/* Table card: status filter, then the complaints table with pagination. */}
      <div className="flex flex-col gap-5 rounded-[18px] bg-[#6161611A] p-6">
        <ComplaintsFilter status={statusFilter} onStatusChange={setStatusFilter} />
        <ComplaintsTable
          complaints={filteredComplaints}
          onCancel={handleCancel}
          onRowClick={handleRowClick}
        />
      </div>

      <ComplaintDetailSheet
        complaint={selectedComplaint}
        onOpenChange={(open) => !open && setSelectedComplaint(null)}
      />
      <RaiseComplaintModal open={isRaiseOpen} onOpenChange={setIsRaiseOpen} />
    </section>
  );
}
