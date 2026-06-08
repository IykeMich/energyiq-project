import { cn } from '@energyiq/shared';
import { SectionHeader } from '@energyiq/ui';
import { DashboardAccountCard } from './account-card';
import type { AccountMock } from '../mocks';

interface DashboardFinancialSnapshotProps {
  title?: string;
  actionLink?: { label: string; href?: string; onClick?: () => void };
  accounts: AccountMock[];
  className?: string;
}

export function DashboardFinancialSnapshot({
  title = 'Financial Snapshot',
  actionLink,
  accounts,
  className,
}: DashboardFinancialSnapshotProps) {
  return (
    <div className={cn('bg-[#6161611A] rounded-2xl p-6 shadow-sm', className)}>
      <SectionHeader title={title} actionLink={actionLink} />
      <div className="grid grid-cols-2 gap-4 mt-6 mb-4">
        {accounts.map((account) => (
          <DashboardAccountCard key={account.label} label={account.label} value={account.value} />
        ))}
      </div>
    </div>
  );
}
