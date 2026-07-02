import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { TRADE_OVER_TIME_MOCK } from './trading-analytics-mocks';
import { AnalyticsChartTooltip } from '../analytics-chart-tooltip';

export function TradingOverTimeChart() {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={TRADE_OVER_TIME_MOCK} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="tradingGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FBC02D" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#FBC02D" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="0" stroke="#3f3f46" vertical={false} />
          <XAxis dataKey="day" tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip content={<AnalyticsChartTooltip />} />
          <Area
            type="monotone"
            dataKey="trades"
            stroke="#FBC02D"
            strokeWidth={2}
            fill="url(#tradingGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
