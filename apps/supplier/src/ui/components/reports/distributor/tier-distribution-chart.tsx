import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { TIER_DISTRIBUTION_MOCK } from './distributor-mocks';
import { AnalyticsChartTooltip } from '../../analytics/analytics-chart-tooltip';

export function TierDistributionChart() {
  return (
    <div className="flex flex-col lg:flex-row items-center gap-6">
      <div className="w-full lg:w-1/2 h-52">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={TIER_DISTRIBUTION_MOCK}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              dataKey="percentage"
              paddingAngle={2}
            >
              {TIER_DISTRIBUTION_MOCK.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<AnalyticsChartTooltip valueSuffix="%" />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="w-full lg:w-1/2 space-y-3">
        {TIER_DISTRIBUTION_MOCK.map((tier) => (
          <div key={tier.name} className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: tier.color }} />
            <span className="text-sm text-white font-medium">{tier.name}</span>
            <span className="text-sm text-[#FFFFFFCC] ml-auto">
              {tier.count} ({tier.percentage}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
