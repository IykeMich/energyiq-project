import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { KycDocumentsKpiStrip } from './kyc-documents-kpi-strip';
import { KycDocumentsTypesPanel } from './kyc-documents-types-panel';
import { KycDocumentsPendingReviewList } from './kyc-documents-pending-review-list';
import { KycDocumentsExpiringSoonList } from './kyc-documents-expiring-soon-list';
import { KycDocumentsFilterBar } from './kyc-documents-filter-bar';
import { KycDocumentsListTable } from './kyc-documents-list-table';
import {
  DOCUMENT_LIST_ROWS,
  type DocumentListRow,
  type KycDocumentFilterSelection,
} from '@/ui/pages/kyc-documents/kyc-documents-mocks';

/** Drives every section's state in one place (loaded vs. loading vs. empty). */
export type KycDocumentsStatus = 'ready' | 'loading' | 'empty';

interface KycDocumentsOverviewProps {
  /** Defaults to the loaded design; flip to preview the loading/empty states. */
  status?: KycDocumentsStatus;
}

/**
 * Supplier KYC "Document Management" dashboard. Sections read from the KYC mocks
 * for now; swap each block for its generated query once the compliance endpoints
 * land. A single `status` prop threads the loaded / loading / empty states down.
 */
export function KycDocumentsOverview({ status = 'ready' }: KycDocumentsOverviewProps) {
  const navigate = useNavigate();
  const { slug = 'demo' } = useParams<{ slug: string }>();
  const [filters, setFilters] = useState<KycDocumentFilterSelection>({});

  const isReady = status === 'ready';
  const isLoading = status === 'loading';
  const isEmpty = status === 'empty';

  const setFilter = (filterId: string, option: string | null) => {
    setFilters((previous) => ({ ...previous, [filterId]: option }));
  };

  const hasActiveFilter = Object.values(filters).some(Boolean);

  // TODO(orval): replace this client-side filtering with the documents list query's params.
  const filteredRows = useMemo(() => {
    if (isEmpty) return [];
    return DOCUMENT_LIST_ROWS.filter((row) =>
      Object.entries(filters).every(
        ([filterId, option]) => !option || String(row[filterId as keyof DocumentListRow]) === option,
      ),
    );
  }, [isEmpty, filters]);

  const goToTypes = () => navigate(`/${slug}/kyc-documents/types`);
  const goToReview = () => navigate(`/${slug}/kyc-documents/review`);

  const handleRowAction = (_row: DocumentListRow) => {
    // TODO(orval): open the distributor's document detail/review view.
  };

  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-white">Document Management</h1>

      <KycDocumentsKpiStrip placeholder={!isReady} />

      {isReady && (
        <>
          <KycDocumentsTypesPanel
            onSeeAll={goToTypes}
            onEditType={() => goToTypes()}
          />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <KycDocumentsPendingReviewList onViewAll={goToReview} onReview={() => goToReview()} />
            <KycDocumentsExpiringSoonList />
          </div>

          <KycDocumentsFilterBar selection={filters} onChange={setFilter} />
        </>
      )}

      <KycDocumentsListTable
        rows={filteredRows}
        isLoading={isLoading}
        noDataMessage={
          hasActiveFilter ? 'No documents match your filters' : 'No distributor documents yet'
        }
        onAction={handleRowAction}
      />
    </section>
  );
}
