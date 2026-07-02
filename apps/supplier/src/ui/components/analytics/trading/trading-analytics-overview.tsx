import { Button } from '@energyiq/ui';
import { Download } from 'lucide-react';
import { AnalyticsSectionCard } from '../analytics-section-card';
import { AnalyticsKpiCard } from '../analytics-kpi-card';
import { TRADING_ANALYTICS_KPIS_MOCK } from './trading-analytics-mocks';
import { TradingOverTimeChart } from './trading-over-time-chart';
import { TradingTopDistributorsChart } from './trading-top-distributors-chart';
import { TradingSettlementHealth } from './trading-settlement-health';
import { TradingPaymentPerformance } from './trading-payment-performance';

export function TradingAnalyticsOverview() {
  return (
    <section className="flex flex-col gap-6">
      <header className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Trading Analytics</h1>
          <p className="text-sm text-[#FFFFFFCC] mt-1">
            Monitor trade volumes, settlement health, and payment performance.
          </p>
        </div>
        <Button className="bg-[#FBC02D] text-[#121212] hover:bg-[#FBC02D]/90">
          <Download className="w-4 h-4 mr-1.5" />
          Create Report
        </Button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {TRADING_ANALYTICS_KPIS_MOCK.map((kpi) => (
          <AnalyticsKpiCard
            key={kpi.label}
            label={kpi.label}
            value={kpi.value}
            trend={kpi.trend}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalyticsSectionCard title="Trade over Time">
          <TradingOverTimeChart />
        </AnalyticsSectionCard>
        <AnalyticsSectionCard title="Top Trading Distributor">
          <TradingTopDistributorsChart />
        </AnalyticsSectionCard>
      </div>

      <AnalyticsSectionCard title="Settlement Health Issues">
        <TradingSettlementHealth />
      </AnalyticsSectionCard>

      <AnalyticsSectionCard title="Payment Performance Analysis">
        <TradingPaymentPerformance />
      </AnalyticsSectionCard>
    </section>
  );
}
