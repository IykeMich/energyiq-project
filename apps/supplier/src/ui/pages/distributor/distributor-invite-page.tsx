import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { InviteDistributorForm } from '@/ui/components/distributor/invite-distributor-form';

export function DistributorInvitePage() {
  const navigate = useNavigate();
  const { slug = '' } = useParams<{ slug: string }>();

  return (
    <section className="flex flex-col gap-6">
      <header className="flex items-center gap-3.5">
        <button
          type="button"
          onClick={() => navigate(`/${slug}/distributors`)}
          aria-label="Back to distributors"
          className="flex h-7.75 w-7.75 items-center justify-center rounded-full bg-brand text-brand-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <h1 className="text-2xl font-semibold text-foreground">Invite Distributor</h1>
      </header>

      <InviteDistributorForm />
    </section>
  );
}
