import { useState } from 'react';
import { useGetV1DistributorComplaintOverview } from '@energyiq/api/generated/distributor-complaints/distributor-complaints';
import type { GetV1DistributorComplaintOverviewStatus } from '@energyiq/api/generated/schemas';
import { PageHeaderContent } from '@/ui/layouts/page-header';
import { OrdersActionButton } from '../orders/orders-action-button';
import { ComplaintsSearchBar } from './complaints-search-bar';
import { ComplaintsBanner } from './complaints-banner';
import { ComplaintsStats } from './complaints-stats';
import { ComplaintsFilter } from './complaints-filter';
import { ComplaintsTable } from './complaints-table';
import { ComplaintDetailSheet } from './complaint-detail-sheet';
import { RaiseComplaintModal } from './raise-complaint-modal';
import { ALL_STATUSES } from './complaints-mocks';

/** Distributor Complaints page — driven by the distributor complaint dashboard endpoint. */
export function ComplaintsOverview() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | typeof ALL_STATUSES>(ALL_STATUSES);
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);
  const [isRaiseOpen, setIsRaiseOpen] = useState(false);

  const { data, isLoading } = useGetV1DistributorComplaintOverview({
    status: statusFilter === ALL_STATUSES ? undefined : (statusFilter as GetV1DistributorComplaintOverviewStatus),
    search: searchQuery.trim() || undefined,
    limit: 100,
  });
  const dashboard = data?.data.data;

  const handleAddComplaint = () => setIsRaiseOpen(true);

  return (
    <section className="flex flex-col gap-6">
      {/* Complaint search replaces the default title in the layout header. */}
      <PageHeaderContent>
        <ComplaintsSearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      </PageHeaderContent>

      <header>
        <h1 className="text-2xl font-semibold text-[#FAFAFA]">{dashboard?.page_title ?? 'Complaints'}</h1>
      </header>

      {/* Review banner on the left, primary action on the right. */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        {dashboard?.distributor_complaint_alert && dashboard.distributor_complaint_alert.count! > 0 && (
          <ComplaintsBanner message={dashboard.distributor_complaint_alert.message ?? ''} />
        )}
        <OrdersActionButton
          label={dashboard?.distributor_complaint_primary_action_label ?? 'Add Complaint'}
          // icon={Plus}
          onClick={handleAddComplaint}
        />
      </div>

      <ComplaintsStats summary={dashboard?.distributor_complaint_summary} isLoading={isLoading} />

      {/* Table card: status filter, then the complaints table with pagination. */}
      <div className="flex flex-col gap-5 rounded-[18px] bg-[#6161611A] p-6">
        <ComplaintsFilter
          status={statusFilter}
          onStatusChange={setStatusFilter}
          options={dashboard?.distributor_complaint_status_filter_options ?? []}
        />
        <ComplaintsTable
          complaints={dashboard?.distributor_complaint_table?.items ?? []}
          onRowClick={(complaint) => setSelectedComplaintId(complaint.distributor_complaint_id ?? null)}
        />
      </div>

      <ComplaintDetailSheet
        complaintId={selectedComplaintId}
        onOpenChange={(open) => !open && setSelectedComplaintId(null)}
      />
      <RaiseComplaintModal open={isRaiseOpen} onOpenChange={setIsRaiseOpen} />
    </section>
  );
}
