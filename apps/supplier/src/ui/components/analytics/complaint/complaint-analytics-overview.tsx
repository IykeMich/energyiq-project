import { Button } from '@energyiq/ui';
import { Download } from 'lucide-react';
import { AnalyticsSectionCard } from '../analytics-section-card';
import { AnalyticsKpiCard } from '../analytics-kpi-card';
import { COMPLAINT_ANALYTICS_KPIS_MOCK } from './complaint-analytics-mocks';
import { ComplaintsOverTimeChart } from './complaints-over-time-chart';
import { ComplaintTypeChart } from './complaint-type-chart';
import { ComplaintByProductChart } from './complaint-by-product-chart';
import { ComplaintResolutionEffectiveness } from './complaint-resolution-effectiveness';
import { ComplaintResolutionSla } from './complaint-resolution-sla';
import { ComplaintResolutionTypeAnalysis } from './complaint-resolution-type-analysis';
import { ComplaintTopTable } from './complaint-top-table';

export function ComplaintAnalyticsOverview() {
  return (
    <section className="flex flex-col gap-6">
      <header className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Complaint Analytics</h1>
          <p className="text-sm text-[#FFFFFFCC] mt-1">
            Track complaints, resolution times, and satisfaction trends.
          </p>
        </div>
        <Button className="bg-[#FBC02D] text-[#121212] hover:bg-[#FBC02D]/90">
          <Download className="w-4 h-4 mr-1.5" />
          Create Report
        </Button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {COMPLAINT_ANALYTICS_KPIS_MOCK.map((kpi) => (
          <AnalyticsKpiCard
            key={kpi.label}
            label={kpi.label}
            value={kpi.value}
            trend={kpi.trend}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalyticsSectionCard title="Complaints over Time">
          <ComplaintsOverTimeChart />
        </AnalyticsSectionCard>
        <AnalyticsSectionCard title="Complaint Type">
          <ComplaintTypeChart />
        </AnalyticsSectionCard>
      </div>

      <AnalyticsSectionCard title="Complaint by Product">
        <ComplaintByProductChart />
      </AnalyticsSectionCard>

      <AnalyticsSectionCard title="Resolution Effectiveness">
        <ComplaintResolutionEffectiveness />
      </AnalyticsSectionCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalyticsSectionCard title="Resolution Time SLA">
          <ComplaintResolutionSla />
        </AnalyticsSectionCard>
        <AnalyticsSectionCard title="Resolution Type Analysis">
          <ComplaintResolutionTypeAnalysis />
        </AnalyticsSectionCard>
      </div>

      <AnalyticsSectionCard title="Top Complaints">
        <ComplaintTopTable />
      </AnalyticsSectionCard>
    </section>
  );
}
