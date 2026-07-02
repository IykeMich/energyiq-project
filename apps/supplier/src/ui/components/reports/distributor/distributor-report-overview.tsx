import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@energyiq/ui';
import { Download, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@energyiq/ui';
import { AnalyticsSectionCard } from '../../analytics/analytics-section-card';
import { AnalyticsKpiCard } from '../../analytics/analytics-kpi-card';
import { ReportFilterChips, type ReportFilterSelection } from '../report-filter-chips';
import { useReportExport } from '../modals/use-report-export';
import {
  DISTRIBUTOR_KPIS_MOCK,
  DISTRIBUTOR_FILTERS_MOCK,
  DISTRIBUTOR_INSIGHTS_MOCK,
} from './distributor-mocks';
import { TierDistributionChart } from './tier-distribution-chart';
import { TopDistributorsChart } from './top-distributors-chart';
import { DistributorPerformanceTable } from './distributor-performance-table';

export function DistributorReportOverview() {
  const navigate = useNavigate();
  const { slug: stateSlug } = useAuth();
  const slug = stateSlug ?? 'demo';
  const [filters, setFilters] = useState<ReportFilterSelection>({});
  const { openExport, exportModals } = useReportExport('Distributor Report');

  return (
    <section className="flex flex-col gap-6">
      <header className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Distributor Report</h1>
          <p className="text-sm text-[#FFFFFFCC] mt-1">
            Performance metrics, tier status, and compliance overview for all 152 distributors.
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
        {DISTRIBUTOR_KPIS_MOCK.map((kpi) => (
          <AnalyticsKpiCard
            key={kpi.label}
            label={kpi.label}
            value={kpi.value}
            trend={kpi.trend}
          />
        ))}
      </div>

      <ReportFilterChips
        filters={DISTRIBUTOR_FILTERS_MOCK}
        selection={filters}
        onChange={(id, option) => setFilters((previous) => ({ ...previous, [id]: option }))}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalyticsSectionCard title="Tier Distribution">
          <TierDistributionChart />
          <div className="mt-4 flex flex-col gap-2">
            {DISTRIBUTOR_INSIGHTS_MOCK.map((insight, index) => (
              <div key={index} className="flex items-start gap-2 text-sm text-[#FFFFFFCC]">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#FBC02D] mt-0.5" />
                <span>{insight}</span>
              </div>
            ))}
          </div>
        </AnalyticsSectionCard>
        <AnalyticsSectionCard title="Top 5 Distributors by Sales Volume">
          <TopDistributorsChart />
          <div className="mt-4 text-sm text-[#FFFFFFCC]">
            <span className="font-medium text-[#FBC02D]">Top performing distributor:</span> Emeka Gas Supplies (#1.22M sales)
          </div>
        </AnalyticsSectionCard>
      </div>

      <AnalyticsSectionCard title="Distributor Performance Table">
        <DistributorPerformanceTable />
      </AnalyticsSectionCard>

      {exportModals}
    </section>
  );
}
