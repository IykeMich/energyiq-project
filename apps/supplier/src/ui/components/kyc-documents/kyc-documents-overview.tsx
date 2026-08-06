import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useGetV1DocumentOverview,
  useGetV1DocumentCompliance,
} from '@energyiq/api/generated/documents/documents';
import type { GetV1DocumentOverviewStatus } from '@energyiq/api/generated/schemas';
import { KycDocumentsKpiStrip } from './kyc-documents-kpi-strip';
import { KycDocumentsTypesPanel } from './kyc-documents-types-panel';
import { KycDocumentsPendingReviewList } from './kyc-documents-pending-review-list';
import { KycDocumentsExpiringSoonList } from './kyc-documents-expiring-soon-list';
import { KycDocumentsFilterBar } from './kyc-documents-filter-bar';
import { KycDocumentsListTable } from './kyc-documents-list-table';
import {
  mapDashboardSummaryToKpis,
  mapComplianceSummaryToKpi,
  mapDocumentTypePreviewToSummary,
  mapReviewQueueItemToPendingReview,
  mapExpiringSoonItemToUi,
  mapDashboardRowToDocumentListRow,
  mapDashboardFilterOptions,
} from './kyc-documents-mappers';
import type { DocumentListRow, KycDocumentFilterSelection } from './kyc-documents-types';

/** Drives every section's state in one place (loaded vs. loading vs. empty). */
export type KycDocumentsStatus = 'ready' | 'loading' | 'empty';

interface KycDocumentsOverviewProps {
  /** Defaults to the loaded design; flip to preview the loading/empty states. */
  status?: KycDocumentsStatus;
}

/**
 * Supplier KYC "Document Management" dashboard. Every section — KPIs, Document Types
 * panel, Pending Review, Expiring Soon, the Document Lists table, and its filters —
 * reads from the single `GET /v1/document/overview` "dashboard" endpoint, which
 * returns display strings already formatted to match the Figma design. A single
 * `status` prop threads the loaded / loading / empty states down for previewing.
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

  const { data: overviewResponse, isLoading: isFetching } = useGetV1DocumentOverview({
    status: (filters.status as GetV1DocumentOverviewStatus | undefined) ?? undefined,
    distributor_id: filters.distributor ?? undefined,
    document_type: filters.document_type ?? undefined,
    // The Document Lists table paginates client-side (see KycDocumentsListTable), so
    // request a page large enough that its pager isn't silently truncating rows the
    // server would otherwise hold back behind its own default page size.
    limit: 100,
  });
  const dashboard = overviewResponse?.data.data;

  const { data: complianceResponse } = useGetV1DocumentCompliance();
  const compliance = complianceResponse?.data.data;

  const kpis = useMemo(
    () => [...mapDashboardSummaryToKpis(dashboard?.summary), mapComplianceSummaryToKpi(compliance)],
    [dashboard, compliance],
  );
  const typeSummaries = useMemo(
    () => (dashboard?.document_types ?? []).slice(0, 3).map(mapDocumentTypePreviewToSummary),
    [dashboard],
  );
  const pendingReviewItems = useMemo(
    () => (dashboard?.review_queue?.items ?? []).map(mapReviewQueueItemToPendingReview),
    [dashboard],
  );
  const expiringSoonItems = useMemo(
    () => (dashboard?.expiring_soon?.items ?? []).map(mapExpiringSoonItemToUi),
    [dashboard],
  );
  const filterDefs = useMemo(
    () => [
      mapDashboardFilterOptions('distributor', 'All Distributors', dashboard?.filters?.distributors),
      mapDashboardFilterOptions('document_type', 'All Document Types', dashboard?.filters?.document_types),
      mapDashboardFilterOptions('status', 'All Status', dashboard?.filters?.statuses),
    ],
    [dashboard],
  );

  const tableRows = useMemo(() => {
    if (isEmpty) return [];
    return (dashboard?.table?.items ?? []).map(mapDashboardRowToDocumentListRow);
  }, [isEmpty, dashboard]);

  const hasActiveFilter = Object.values(filters).some(Boolean);

  const goToTypes = () => navigate(`/${slug}/kyc-documents/types`);
  const goToReview = () => navigate(`/${slug}/kyc-documents/review`);
  const goToEditType = (typeId: string) => navigate(`/${slug}/kyc-documents/types/${typeId}/edit`);
  const goToDocument = (documentId: string) => navigate(`/${slug}/kyc-documents/documents/${documentId}`);

  const handleRowAction = (row: DocumentListRow) => {
    if (row.action === 'review') {
      goToReview();
      return;
    }
    // TODO: no per-distributor/document detail page exists yet for the 'view' action —
    // route there once one lands. Review Queue is the closest destination today.
    goToReview();
  };

  return (
    <section className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">
          {dashboard?.page_title ?? 'Document Management'}
        </h1>
        {dashboard?.page_subtitle && (
          <p className="mt-1 text-sm text-gray-400">{dashboard.page_subtitle}</p>
        )}
      </div>

      <KycDocumentsKpiStrip kpis={kpis} placeholder={!isReady || isFetching} />

      {isReady && (
        <>
          <KycDocumentsTypesPanel
            title={dashboard?.document_types_title ?? 'Document Types'}
            actionLabel={dashboard?.document_types_action_label ?? 'See all'}
            summaries={typeSummaries}
            onSeeAll={goToTypes}
            onEditType={goToEditType}
          />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <KycDocumentsPendingReviewList
              title={dashboard?.review_queue?.title ?? 'Pending review'}
              actionLabel={dashboard?.review_queue?.action_label ?? 'View all'}
              items={pendingReviewItems}
              onViewAll={goToReview}
              onReview={() => goToReview()}
              onViewDocument={goToDocument}
            />
            <KycDocumentsExpiringSoonList
              title={dashboard?.expiring_soon?.title ?? 'Expiring Soon'}
              items={expiringSoonItems}
              onViewDocument={goToDocument}
            />
          </div>

          <KycDocumentsFilterBar filters={filterDefs} selection={filters} onChange={setFilter} />
        </>
      )}

      <KycDocumentsListTable
        rows={tableRows}
        isLoading={isLoading || isFetching}
        noDataMessage={
          hasActiveFilter ? 'No documents match your filters' : 'No distributor documents yet'
        }
        showingLabel={dashboard?.table?.showing_label}
        onAction={handleRowAction}
      />
    </section>
  );
}
