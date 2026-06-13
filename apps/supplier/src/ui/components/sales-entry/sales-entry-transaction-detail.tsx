import { ArrowLeft } from 'lucide-react';
import { Modal } from '@energyiq/ui';
import { SalesEntryDistributorIdentity } from './sales-entry-distributor-identity';
import { SalesEntryInfoCard } from './sales-entry-info-card';
import { SalesEntryStatusBadge } from './sales-entry-status-badge';
import {
  SALES_KYC_VERIFIED_COLOR,
  SALES_STATUS_COLOR,
  formatNaira,
} from './sales-entry-mocks';
import type { SalesTransactionDetail } from './sales-entry-mocks';

interface SalesEntryTransactionDetailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  detail: SalesTransactionDetail | null;
  onVoid: () => void;
}

/**
 * Transaction Detail modal. Uses `Modal` purely as a centered, animated dialog shell
 * (no built-in title/close) so the header can carry a back arrow, subtitle and the
 * top-right "Void Transaction" action exactly as designed.
 */
export function SalesEntryTransactionDetail({
  open,
  onOpenChange,
  detail,
  onVoid,
}: SalesEntryTransactionDetailProps) {
  if (!detail) return null;

  const { distributor, summary } = detail;

  return (
    <Modal open={open} onOpenChange={onOpenChange} size="md" showClose={false}>
      <div className="flex flex-col gap-6">
        <header className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              aria-label="Back"
              className="tap-effect flex h-8 w-8 items-center justify-center rounded-full bg-[#FBC02D] text-[#121212]"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <div className="flex flex-col">
              <h2 className="text-xl font-semibold text-[#FAFAFA]">Transaction Detail</h2>
              <span className="text-xs text-[#9E9E9E]">{summary.transactionId}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onVoid}
            className="tap-effect h-9 rounded-full border border-[#FBC02D] px-4 text-xs font-semibold text-[#FBC02D]"
          >
            Void Transaction
          </button>
        </header>

        <SalesEntryInfoCard
          title="Distributor"
          header={
            <SalesEntryDistributorIdentity
              name={distributor.name}
              location={distributor.location}
              onViewProfile={() => {
                // TODO(orval): navigate to the distributor profile once the route lands.
              }}
            />
          }
          rows={[
            { label: 'Account Details:', value: distributor.accountValue },
            { label: 'Purchases:', value: distributor.purchases },
            { label: 'Active Since:', value: distributor.activeSince },
            {
              label: 'KYC Status:',
              value: (
                <SalesEntryStatusBadge
                  label={distributor.kycStatus}
                  color={SALES_KYC_VERIFIED_COLOR}
                />
              ),
            },
          ]}
        />

        <SalesEntryInfoCard
          title="Transaction summary"
          rows={[
            { label: 'Transaction ID:', value: summary.transactionId },
            { label: 'Date:', value: summary.dateTime },
            { label: 'Product:', value: summary.product },
            { label: 'Unit price:', value: formatNaira(summary.unitPrice) },
            { label: 'Total amount:', value: formatNaira(summary.totalAmount) },
            { label: 'Payment method:', value: summary.paymentMethod },
            {
              label: 'Status:',
              value: (
                <SalesEntryStatusBadge
                  label={summary.status}
                  color={SALES_STATUS_COLOR[summary.status]}
                />
              ),
            },
          ]}
        />
      </div>
    </Modal>
  );
}
