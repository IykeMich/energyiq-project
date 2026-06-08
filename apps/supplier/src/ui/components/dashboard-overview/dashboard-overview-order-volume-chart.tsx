import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Label,
} from 'recharts';
import { DashboardOverviewSectionTitle } from './dashboard-overview-section-title';
import { DashboardOverviewFilterChips } from './dashboard-overview-filter-chips';
import { DashboardOverviewEmptyChart } from './dashboard-overview-empty-chart';
import { ORDER_VOLUME_MOCK } from './dashboard-overview-mocks';
import type { OrderVolumePoint } from './dashboard-overview-mocks';

const Y_TICKS = [1, 2, 3, 4, 5];

interface OrderTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: OrderVolumePoint }>;
}

function OrderTooltip({ active, payload }: OrderTooltipProps) {
  if (!active || !payload?.length) return null;
  const point = payload[0]?.payload;
  if (!point) return null;
  return (
    <div className="rounded-lg border border-gray-700 bg-[#27272A] px-3 py-1.5 shadow-lg">
      <div className="text-sm font-semibold text-white">{point.orders} orders</div>
    </div>
  );
}

interface DashboardOverviewOrderVolumeChartProps {
  isEmpty?: boolean;
}

export function DashboardOverviewOrderVolumeChart({
  isEmpty = false,
}: DashboardOverviewOrderVolumeChartProps) {
  return (
    <div className="flex flex-1 flex-col rounded-[18px] bg-[#6161611A] p-6 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
      <DashboardOverviewSectionTitle
        title="Order Volume"
        size="lg"
        right={<DashboardOverviewFilterChips filters={['time', 'product']} />}
        className="flex-wrap gap-3"
      />
      {isEmpty ? (
        <DashboardOverviewEmptyChart />
      ) : (
        <div className="mt-4 h-72 lg:h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={ORDER_VOLUME_MOCK} margin={{ top: 10, right: 16, left: 8, bottom: 24 }}>
            <CartesianGrid strokeDasharray="0" stroke="#3f3f46" vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fill: '#FFFFFF', fontSize: 14 }}
              axisLine={{ stroke: '#FFFFFF' }}
              tickLine={false}
              dy={10}
            >
              <Label value="Time (Days)" position="insideBottomRight" offset={-18} fill="#FFFFFF" fontSize={12} />
            </XAxis>
            <YAxis
              tick={{ fill: '#FFFFFF', fontSize: 12 }}
              axisLine={{ stroke: '#FFFFFF' }}
              tickLine={false}
              dx={-6}
              domain={[1, 5]}
              ticks={Y_TICKS}
              label={{
                value: 'Orders',
                angle: -90,
                position: 'insideLeft',
                fill: '#FFFFFF',
                fontSize: 12,
                style: { textAnchor: 'middle' },
              }}
            />
            <Tooltip content={<OrderTooltip />} cursor={{ stroke: '#FBC02D', strokeWidth: 1 }} />
            <Line
              type="linear"
              dataKey="orders"
              stroke="#FAFAFA"
              strokeWidth={2}
              dot={{ fill: '#FFFFFF', r: 4, strokeWidth: 0 }}
              activeDot={{ r: 6, fill: '#FFFFFF', stroke: '#FBC02D', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
