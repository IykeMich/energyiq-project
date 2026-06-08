import { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@energyiq/ui';
import type { SalesPointMock } from '../mocks';
import { SALES_TREND_MOCK, SALES_TREND_REGIONS, SALES_TREND_TIMES, SALES_TREND_PRODUCTS } from '../mocks';

const Y_TICKS = [5, 10, 15, 20, 25];
const formatYAxis = (value: number) => `${value}M`;

interface SalesTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: SalesPointMock }>;
}

function CustomTooltip({ active, payload }: SalesTooltipProps) {
  if (!active || !payload?.length) return null;
  const point = payload[0]?.payload;
  if (!point) return null;
  return (
    <div className="bg-[#27272A] border border-gray-700 rounded-lg shadow-lg px-4 py-2">
      <div className="text-sm font-semibold text-white">{point.sales}M</div>
    </div>
  );
}

interface FilterPickerProps {
  value: string;
  onChange: (next: string) => void;
  options: string[];
  ariaLabel: string;
}

function FilterPicker({ value, onChange, options, ariaLabel }: FilterPickerProps) {
  return (
    <Select value={value} onValueChange={(next) => next != null && onChange(next)}>
      <SelectTrigger size="sm" aria-label={ariaLabel} className="border-gray-600 text-gray-300">
        <SelectValue placeholder={ariaLabel} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function DashboardSalesTrendChart() {
  const [region, setRegion] = useState(SALES_TREND_REGIONS[0]);
  const [time, setTime] = useState(SALES_TREND_TIMES[0]);
  const [product, setProduct] = useState(SALES_TREND_PRODUCTS[0]);

  return (
    <>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 bg-[#FBC02D] rounded" />
          <h3 className="text-lg font-semibold text-white">Sales Trend</h3>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <FilterPicker value={region} onChange={setRegion} options={SALES_TREND_REGIONS} ariaLabel="Region" />
          <FilterPicker value={time} onChange={setTime} options={SALES_TREND_TIMES} ariaLabel="Time" />
          <FilterPicker value={product} onChange={setProduct} options={SALES_TREND_PRODUCTS} ariaLabel="Product" />
        </div>
      </div>
      <div className="h-64 lg:h-96 rounded-lg relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={SALES_TREND_MOCK} margin={{ top: 10, right: 10, left: 10, bottom: 30 }}>
            <defs>
              <linearGradient id="dashboardSalesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FBC02D" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#FBC02D" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="0" stroke="#3f3f46" vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              dy={10}
            />
            <YAxis
              tickFormatter={formatYAxis}
              tick={{ fill: '#FBC02D', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              dx={-10}
              domain={[0, 25]}
              ticks={Y_TICKS}
              label={{
                value: 'Sales(#M/D)',
                angle: -90,
                position: 'insideLeft',
                fill: '#FBC02D',
                fontSize: 12,
                style: { textAnchor: 'middle' },
              }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#FBC02D', strokeWidth: 1 }} />
            <Area
              type="monotone"
              dataKey="sales"
              stroke="#FFFFFF"
              strokeWidth={2}
              fill="url(#dashboardSalesGradient)"
              dot={{ fill: '#FFFFFF', r: 4, strokeWidth: 2, stroke: '#FBC02D' }}
              activeDot={{ r: 6, fill: '#FFFFFF', strokeWidth: 2, stroke: '#FBC02D' }}
            />
          </AreaChart>
        </ResponsiveContainer>
        <div className="absolute bottom-2 right-4">
          <span className="text-xs text-[#FBC02D]">Days</span>
        </div>
      </div>
    </>
  );
}
