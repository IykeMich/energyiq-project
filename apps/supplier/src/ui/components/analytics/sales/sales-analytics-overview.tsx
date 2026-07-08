import { Button } from '@energyiq/ui';
import { Download } from 'lucide-react';
import { AnalyticsSectionCard } from '../analytics-section-card';
import { SalesTierCards } from './sales-tier-cards';
import { SalesRevenueVsCostsChart } from './sales-revenue-vs-costs-chart';
import { SalesProductOverviewChart } from './sales-product-overview-chart';
import { SalesProductPerformanceTable, SalesProductPerformanceExportButton } from './sales-product-performance-table';
import { SalesTopDistributorsList } from './sales-top-distributors-list';

export function SalesAnalyticsOverview() {
  return (
    <section className="flex flex-col gap-6">
      <header className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Sales Analytics</h1>
          <p className="text-sm text-[#FFFFFFCC] mt-1">Updated 5 mins ago</p>
        </div>
        <Button className="bg-[#FBC02D] text-[#121212] hover:bg-[#FBC02D]/90">
          <Download className="w-4 h-4 mr-1.5" />
          Export
        </Button>
      </header>

      <SalesTierCards />

      <AnalyticsSectionCard title="Revenue Vs Costs">
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

      <AnalyticsSectionCard title="Product Performance" action={<SalesProductPerformanceExportButton />}>
        <SalesProductPerformanceTable />
      </AnalyticsSectionCard>
    </section>
  );
}
