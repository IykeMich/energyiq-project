import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { approval } from '@energyiq/domain';
import { useApprovalDashboardQuery, useApprovalListQuery } from '@/hooks/use-approval';
import { ProductAuthorizationStats } from './product-authorization-stats';
import { ProductAuthorizationFilterBar } from './product-authorization-filter-bar';
import { ProductAuthorizationRequestRow } from './product-authorization-request-row';

export function ProductAuthorizationQueueOverview() {
  const navigate = useNavigate();
  const { slug = 'demo' } = useParams<{ slug: string }>();
  const [status, setStatus] = useState<approval.ApprovalStatus | undefined>(undefined);

  const listQuery = useApprovalListQuery({ category: 'product', status });
  const dashboardQuery = useApprovalDashboardQuery('product');

  const requests = listQuery.data?.items ?? [];
  const isEmpty = !listQuery.isLoading && requests.length === 0;

  const summary = dashboardQuery.data ?? listQuery.data?.summary;

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-[10px]">
        <h1 className="text-2xl font-semibold text-[#FAFAFA]">Authorization Queue</h1>
        <p className="text-base text-[#FAFAFA]">
          Restricted actions wait here until an authenticated approver reviews them.
        </p>
      </header>

      <ProductAuthorizationStats
        pendingCount={summary?.pending_review ?? 0}
        approvedCount={summary?.approved ?? 0}
        rejectedCount={summary?.rejected ?? 0}
      />

      <ProductAuthorizationFilterBar selectedStatus={status} onStatusChange={setStatus} />

      {listQuery.isLoading ? (
        <div className="flex min-h-[240px] items-center justify-center rounded-[10px] bg-[#6161611A]">
          <p className="text-sm text-[#9E9E9E]">Loading authorization requests...</p>
        </div>
      ) : isEmpty ? (
        <div className="flex min-h-[240px] items-center justify-center rounded-[10px] bg-[#6161611A]">
          <p className="text-sm text-[#9E9E9E]">No pending authorization requests.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {requests.map((request) => (
            <ProductAuthorizationRequestRow
              key={request.id}
              request={request}
              onClick={() => navigate(`/${slug}/products/authorization/${request.id}`)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
