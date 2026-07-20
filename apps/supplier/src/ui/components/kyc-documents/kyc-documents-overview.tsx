import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useGetV1DocumentCompliance,
  useGetV1DocumentList,
} from '@energyiq/api/generated/documents/documents';
import { useGetV1DoctypeList } from '@energyiq/api/generated/document-types/document-types';
import { KycDocumentsKpiStrip } from './kyc-documents-kpi-strip';
import { KycDocumentsTypesPanel } from './kyc-documents-types-panel';
import { KycDocumentsPendingReviewList } from './kyc-documents-pending-review-list';
import { KycDocumentsExpiringSoonList } from './kyc-documents-expiring-soon-list';
import { KycDocumentsFilterBar } from './kyc-documents-filter-bar';
import { KycDocumentsListTable } from './kyc-documents-list-table';
import {
  mapComplianceSummaryToKpis,
  mapDocumentsToPendingReviewItems,
  mapDocumentsToExpiringSoonItems,
  mapDocumentTypeToSummary,
} from './kyc-documents-mappers';
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
 * Supplier KYC "Document Management" dashboard. Every section below the (still-mocked,
 * see kyc-documents-mocks.ts) Document Lists table reads live data from the documents/
 * document-types endpoints via kyc-documents-mappers.ts. A single `status` prop threads
 * the loaded / loading / empty states down for design-state previewing.
 */
export function KycDocumentsOverview({ status = 'ready' }: KycDocumentsOverviewProps) {
  const navigate = useNavigate();
  const { slug = 'demo' } = useParams<{ slug: string }>();
  const [filters, setFilters] = useState<KycDocumentFilterSelection>({});

  const isReady = status === 'ready';
  const isLoading = status === 'loading';
  const isEmpty = status === 'empty';

  const { data: compliance } = useGetV1DocumentCompliance();
  const { data: doctypeList } = useGetV1DoctypeList();
  const { data: pendingDocuments } = useGetV1DocumentList({ status: 'pending' });
  const { data: approvedDocuments } = useGetV1DocumentList({ status: 'approved' });

  const kpis = useMemo(
    () => mapComplianceSummaryToKpis(compliance?.data?.data ?? {}),
    [compliance],
  );
  const typeSummaries = useMemo(
    () => (doctypeList?.data?.data ?? []).slice(0, 3).map(mapDocumentTypeToSummary),
    [doctypeList],
  );
  const pendingReviewItems = useMemo(
    () => mapDocumentsToPendingReviewItems(pendingDocuments?.data?.data ?? []),
    [pendingDocuments],
  );
  const expiringSoonItems = useMemo(
    () => mapDocumentsToExpiringSoonItems(approvedDocuments?.data?.data ?? []),
    [approvedDocuments],
  );

  const setFilter = (filterId: string, option: string | null) => {
    setFilters((previous) => ({ ...previous, [filterId]: option }));
  };

  const hasActiveFilter = Object.values(filters).some(Boolean);

  // TODO(orval): this table stays client-side-filtered mock data — no endpoint returns
  // a distributor's name/tier/completeness rollup to drive it for real (see mocks file).
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
    goToReview();
  };

  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-white">Document Management</h1>

      <KycDocumentsKpiStrip kpis={kpis} placeholder={!isReady} />

      {isReady && (
        <>
          <KycDocumentsTypesPanel
            summaries={typeSummaries}
            onSeeAll={goToTypes}
            onEditType={() => goToTypes()}
          />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <KycDocumentsPendingReviewList
              items={pendingReviewItems}
              onViewAll={goToReview}
              onReview={() => goToReview()}
            />
            <KycDocumentsExpiringSoonList items={expiringSoonItems} />
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
