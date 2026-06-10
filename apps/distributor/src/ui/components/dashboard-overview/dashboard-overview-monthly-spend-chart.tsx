import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { DashboardOverviewSectionTitle } from './dashboard-overview-section-title';
import { DashboardOverviewFilterChips } from './dashboard-overview-filter-chips';
import { DashboardOverviewEmptyChart } from './dashboard-overview-empty-chart';
import { MONTHLY_SPEND_MOCK } from './dashboard-overview-mocks';
import type { MonthlySpendPoint } from './dashboard-overview-mocks';

const Y_TICKS = [10, 20, 30];
const formatYAxis = (value: number) => `${value}M`;

interface SpendTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: MonthlySpendPoint }>;
}

function SpendTooltip({ active, payload }: SpendTooltipProps) {
  if (!active || !payload?.length) return null;
  const point = payload[0]?.payload;
  if (!point) return null;
  return (
    <div className="rounded-lg border border-gray-700 bg-[#27272A] px-3 py-1.5 shadow-lg">
      <div className="text-sm font-semibold text-white">{point.spend}M</div>
    </div>
  );
}

interface DashboardOverviewMonthlySpendChartProps {
  isEmpty?: boolean;
}

export function DashboardOverviewMonthlySpendChart({
  isEmpty = false,
}: DashboardOverviewMonthlySpendChartProps) {
  if (isEmpty) {
    return (
      <div className="flex flex-1 flex-col rounded-[18px] bg-[#6161611A] p-6 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
        <DashboardOverviewSectionTitle
          title="Monthly Purchase Spend"
          right={<DashboardOverviewFilterChips filters={['region', 'time', 'product']} />}
          className="flex-wrap gap-3"
        />
        <DashboardOverviewEmptyChart />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col rounded-[18px] bg-[#6161611A] p-6 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
      <DashboardOverviewSectionTitle
        title="Monthly Purchase Spend"
        right={<DashboardOverviewFilterChips filters={['region', 'time', 'product']} />}
        className="flex-wrap gap-3"
      />
      <div className="mt-4 h-72 lg:h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={MONTHLY_SPEND_MOCK} margin={{ top: 10, right: 16, left: 8, bottom: 8 }} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="0" stroke="#D9D9D9" strokeOpacity={0.2} vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fill: '#FFFFFF', fontSize: 14 }}
              axisLine={{ stroke: '#D9D9D9' }}
              tickLine={false}
              dy={8}
            />
            <YAxis
              tickFormatter={formatYAxis}
              tick={{ fill: '#FFFFFF', fontSize: 14 }}
              axisLine={false}
              tickLine={false}
              dx={-6}
              domain={[0, 30]}
              ticks={Y_TICKS}
            />
            <Tooltip content={<SpendTooltip />} cursor={{ fill: '#FFFFFF0A' }} />
            <Bar dataKey="spend" fill="#FBC02D" radius={[2, 2, 0, 0]} barSize={42} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 text-sm text-[#FAFAFA]">*Total value of completed orders</p>
    </div>
  );
}
