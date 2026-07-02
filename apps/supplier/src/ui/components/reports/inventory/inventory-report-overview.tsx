import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@energyiq/ui';
import { Download, AlertTriangle, AlertCircle } from 'lucide-react';
import { useAuth } from '@energyiq/ui';
import { AnalyticsSectionCard } from '../../analytics/analytics-section-card';
import { AnalyticsKpiCard } from '../../analytics/analytics-kpi-card';
import { ReportFilterChips, type ReportFilterSelection } from '../report-filter-chips';
import { useReportExport } from '../modals/use-report-export';
import {
  INVENTORY_KPIS_MOCK,
  INVENTORY_FILTERS_MOCK,
  INVENTORY_ALERTS_MOCK,
} from './inventory-mocks';
import { StockMovementTable } from './stock-movement-table';
import { StockLevelsChart } from './stock-levels-chart';
import { StockMovementChart } from './stock-movement-chart';

export function InventoryReportOverview() {
  const navigate = useNavigate();
  const { slug: stateSlug } = useAuth();
  const slug = stateSlug ?? 'demo';
  const [filters, setFilters] = useState<ReportFilterSelection>({});
  const { openExport, exportModals } = useReportExport('Inventory Report');

  return (
    <section className="flex flex-col gap-6">
      <header className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Inventory Report</h1>
          <p className="text-sm text-[#FFFFFFCC] mt-1">
            Stock levels, movement history and reorder alerts across platforms.
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
        {INVENTORY_KPIS_MOCK.map((kpi) => (
          <AnalyticsKpiCard
            key={kpi.label}
            label={kpi.label}
            value={kpi.value}
            trend={kpi.trend}
          />
        ))}
      </div>

      <ReportFilterChips
        filters={INVENTORY_FILTERS_MOCK}
        selection={filters}
        onChange={(id, option) => setFilters((previous) => ({ ...previous, [id]: option }))}
      />

      <AnalyticsSectionCard title="Stock movement history">
        <StockMovementTable />
      </AnalyticsSectionCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalyticsSectionCard title="Stock Levels by Product (Liters)">
          <StockLevelsChart />
        </AnalyticsSectionCard>
        <AnalyticsSectionCard
          title="Stock Movement"
          action={<span className="text-xs text-[#FFFFFFCC]">Units Dispatched Daily</span>}
        >
          <StockMovementChart />
        </AnalyticsSectionCard>
      </div>

      <div className="flex flex-col gap-3">
        {INVENTORY_ALERTS_MOCK.map((alert, index) => (
          <div key={index} className="flex items-start gap-3 text-sm">
            {alert.type === 'critical' ? (
              <AlertCircle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
            ) : (
              <AlertTriangle className="h-4 w-4 shrink-0 text-[#FBC02D] mt-0.5" />
            )}
            <span className={alert.type === 'critical' ? 'text-red-400' : 'text-[#FFFFFFCC]'}>
              <span className="font-medium">{alert.product}:</span> {alert.message}
            </span>
          </div>
        ))}
      </div>

      {exportModals}
    </section>
  );
}
