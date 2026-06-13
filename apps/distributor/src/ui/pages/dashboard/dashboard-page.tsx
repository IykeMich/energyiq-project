import { useSearchParams } from 'react-router-dom';
import { DashboardOverview } from '@/ui/components/dashboard-overview/dashboard-overview';

export function DashboardPage() {
  // Preview the design's empty/loading state via `/dashboard?state=empty`.
  // TODO(orval): drive this from the query's `isLoading`/empty result once the API lands.
  const [searchParams] = useSearchParams();
  const isEmpty = searchParams.get('state') === 'empty';

  return <DashboardOverview isEmpty={isEmpty} />;
}
