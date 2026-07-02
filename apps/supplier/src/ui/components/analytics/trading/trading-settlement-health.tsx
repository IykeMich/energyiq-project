import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { TRADE_SETTLEMENT_STATUS_MOCK, SETTLEMENT_LINE_DISTRIBUTION_MOCK } from './trading-analytics-mocks';
import { AnalyticsChartTooltip } from '../analytics-chart-tooltip';

export function TradingSettlementHealth() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <h4 className="text-sm font-medium text-white mb-4">Trade Settlement Status</h4>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={TRADE_SETTLEMENT_STATUS_MOCK} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                {TRADE_SETTLEMENT_STATUS_MOCK.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<AnalyticsChartTooltip valueSuffix="%" />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap justify-center gap-3 mt-4">
          {TRADE_SETTLEMENT_STATUS_MOCK.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-xs text-white">{item.name} - {item.value}%</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-white mb-4">Settlement Line Distribution</h4>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={SETTLEMENT_LINE_DISTRIBUTION_MOCK} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="0" stroke="#3f3f46" vertical={false} />
              <XAxis dataKey="range" tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<AnalyticsChartTooltip />} />
              <Bar dataKey="count" fill="#FBC02D" radius={[4, 4, 0, 0]} barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
