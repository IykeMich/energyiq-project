import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@energyiq/ui';
import { Download } from 'lucide-react';
import { useAuth } from '@energyiq/ui';
import { AnalyticsSectionCard } from '../../analytics/analytics-section-card';
import { AnalyticsKpiCard } from '../../analytics/analytics-kpi-card';
import { ReportFilterChips, type ReportFilterSelection } from '../report-filter-chips';
import { useReportExport } from '../modals/use-report-export';
import { COMPLIANCE_KPIS_MOCK, COMPLIANCE_FILTERS_MOCK } from './compliance-mocks';
import { DocumentStatusList } from './document-status-list';
import { ExpiringDocumentsChart } from './expiring-documents-chart';
import { VerificationQueueTable } from './verification-queue-table';

export function ComplianceReportOverview() {
  const navigate = useNavigate();
  const { slug: stateSlug } = useAuth();
  const slug = stateSlug ?? 'demo';
  const [filters, setFilters] = useState<ReportFilterSelection>({});
  const { openExport, exportModals } = useReportExport('Compliance Report');

  return (
    <section className="flex flex-col gap-6">
      <header className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Compliance Report</h1>
          <p className="text-sm text-[#FFFFFFCC] mt-1">
            KYC status, document expiry tracking, and audit readiness across the network.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="border-[#616161B2] text-white hover:bg-[#FFFFFF1A]"
            onClick={() => navigate(`/${slug}/reports/custom`)}
          >
            Generate Custom Report
          </Button>
          <Button
            className="bg-[#FBC02D] text-[#121212] hover:bg-[#FBC02D]/90"
            onClick={openExport}
          >
            <Download className="w-4 h-4 mr-1.5" />
            Export All
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {COMPLIANCE_KPIS_MOCK.map((kpi) => (
          <AnalyticsKpiCard
            key={kpi.label}
            label={kpi.label}
            value={kpi.value}
            trend={kpi.trend}
          />
        ))}
      </div>

      <ReportFilterChips
        filters={COMPLIANCE_FILTERS_MOCK}
        selection={filters}
        onChange={(id, option) => setFilters((previous) => ({ ...previous, [id]: option }))}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalyticsSectionCard title="Document status by type">
          <DocumentStatusList />
        </AnalyticsSectionCard>
        <AnalyticsSectionCard
          title="Documents expiring within 30 days"
          action={<span className="text-xs text-[#FFFFFFCC]">Sorted by urgency — days remaining</span>}
        >
          <ExpiringDocumentsChart />
        </AnalyticsSectionCard>
      </div>

      <AnalyticsSectionCard title="Verification queue — 14 pending">
        <VerificationQueueTable />
      </AnalyticsSectionCard>

      {exportModals}
    </section>
  );
}
