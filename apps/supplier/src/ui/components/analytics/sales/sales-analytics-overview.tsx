import { Button } from '@energyiq/ui';
import { Download } from 'lucide-react';
import { AnalyticsSectionCard } from '../analytics-section-card';
import { AnalyticsKpiCard } from '../analytics-kpi-card';
import { SALES_ANALYTICS_KPIS_MOCK } from './sales-analytics-mocks';
import { SalesRevenueVsCostsChart } from './sales-revenue-vs-costs-chart';
import { SalesProductOverviewChart } from './sales-product-overview-chart';
import { SalesProductPerformanceTable } from './sales-product-performance-table';
import { SalesTopDistributorsList } from './sales-top-distributors-list';

export function SalesAnalyticsOverview() {
  return (
    <section className="flex flex-col gap-6">
      <header className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Sales Analytics</h1>
          <p className="text-sm text-[#FFFFFFCC] mt-1">
            Track revenue, product performance, and top distributors.
          </p>
        </div>
        <Button className="bg-[#FBC02D] text-[#121212] hover:bg-[#FBC02D]/90">
          <Download className="w-4 h-4 mr-1.5" />
          Export
        </Button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {SALES_ANALYTICS_KPIS_MOCK.map((kpi) => (
          <AnalyticsKpiCard
            key={kpi.label}
            label={kpi.label}
            value={kpi.value}
            trend={kpi.trend}
          />
        ))}
      </div>

      <AnalyticsSectionCard title="Revenue vs Costs">
        <SalesRevenueVsCostsChart />
      </AnalyticsSectionCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalyticsSectionCard title="Product Sales Overview">
          <SalesProductOverviewChart />
        </AnalyticsSectionCard>
        <AnalyticsSectionCard title="Top Distributors by Sales">
          <SalesTopDistributorsList />
        </AnalyticsSectionCard>
      </div>

      <AnalyticsSectionCard title="Product Performance">
        <SalesProductPerformanceTable />
      </AnalyticsSectionCard>
    </section>
  );
}
