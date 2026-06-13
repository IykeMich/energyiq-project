import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { DISTRIBUTOR_APPLICATIONS_MOCK } from './mocks';
import { DistributorApprovalReview } from '@/ui/components/distributor/distributor-approval-review';

export function DistributorApprovalPage() {
  const navigate = useNavigate();
  const { slug = '' } = useParams<{ slug: string }>();

  // TODO(orval): replace with the generated pending-applications query.
  const applications = DISTRIBUTOR_APPLICATIONS_MOCK;

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-3.5">
          <button
            type="button"
            onClick={() => navigate(`/${slug}/distributors`)}
            aria-label="Back to distributors"
            className="flex h-7.75 w-7.75 items-center justify-center rounded-full bg-brand text-brand-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="text-2xl font-semibold text-foreground">Distributor Approval</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          {applications.length} pending applications awaiting review
        </p>
      </header>

      <DistributorApprovalReview applications={applications} />
    </section>
  );
}
