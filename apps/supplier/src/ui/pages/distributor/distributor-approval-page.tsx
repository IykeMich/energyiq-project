import { useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDistributorsQuery } from '@/hooks/use-distributor';
import { toDistributorApplication } from './mocks';
import { DistributorApprovalReview } from '@/ui/components/distributor/distributor-approval-review';

export function DistributorApprovalPage() {
  const navigate = useNavigate();
  const { slug = '' } = useParams<{ slug: string }>();

  const pendingQuery = useDistributorsQuery({ status: 'pending' });
  const applications = useMemo(
    () => (pendingQuery.data?.items ?? []).map(toDistributorApplication),
    [pendingQuery.data],
  );

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-3.5">
          <button
            type="button"
            onClick={() => navigate(`/${slug}/distributors`)}
            aria-label="Back to distributors"
            className="tap-effect flex h-7.75 w-7.75 items-center justify-center rounded-full bg-brand text-brand-foreground hover:opacity-90"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="text-2xl font-semibold text-foreground">Distributor Approval</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          {applications.length} pending applications awaiting review
        </p>
      </header>

      {pendingQuery.isError && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
          Couldn't load pending applications. Please try again.
        </div>
      )}

      <DistributorApprovalReview applications={applications} isEmpty={!pendingQuery.isLoading && applications.length === 0} />
    </section>
  );
}
