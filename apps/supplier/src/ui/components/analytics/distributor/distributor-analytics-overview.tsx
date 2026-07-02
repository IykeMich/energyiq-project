import { Button } from '@energyiq/ui';
import { Download } from 'lucide-react';
import { AnalyticsSectionCard } from '../analytics-section-card';
import { AnalyticsKpiCard } from '../analytics-kpi-card';
import { DISTRIBUTOR_ANALYTICS_KPIS_MOCK } from './distributor-analytics-mocks';
import { DistributorTierDistribution } from './distributor-tier-distribution';
import { DistributorMetricsGrid } from './distributor-metrics-grid';
import { DistributorPerformanceTable } from './distributor-performance-table';

export function DistributorAnalyticsOverview() {
  return (
    <section className="flex flex-col gap-6">
      <header className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Distributor Analytics</h1>
          <p className="text-sm text-[#FFFFFFCC] mt-1">
            Monitor distributor tiers, performance, and health metrics.
          </p>
        </div>
        <Button className="bg-[#FBC02D] text-[#121212] hover:bg-[#FBC02D]/90">
          <Download className="w-4 h-4 mr-1.5" />
          Create Report
        </Button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {DISTRIBUTOR_ANALYTICS_KPIS_MOCK.map((kpi) => (
          <AnalyticsKpiCard
            key={kpi.label}
            label={kpi.label}
            value={kpi.value}
            trend={kpi.trend}
          />
        ))}
      </div>

      <AnalyticsSectionCard title="Tier Distribution">
        <DistributorTierDistribution />
      </AnalyticsSectionCard>

      <AnalyticsSectionCard title="Distributor Metrics">
        <DistributorMetricsGrid />
      </AnalyticsSectionCard>

      <AnalyticsSectionCard title="Distributor Performance">
        <DistributorPerformanceTable />
      </AnalyticsSectionCard>
    </section>
  );
}
