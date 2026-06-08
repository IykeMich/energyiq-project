import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { cn } from '@energyiq/shared';
import { TOP_PRODUCTS_MOCK, LOW_STOCK_MOCKS } from '../mocks';

interface InventoryTooltipProps {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number }>;
}

function CustomTooltip({ active, payload }: InventoryTooltipProps) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  if (!item) return null;
  return (
    <div className="bg-[#27272A] border border-gray-700 rounded-lg shadow-lg px-4 py-2">
      <div className="text-sm font-semibold text-white">
        {item.name}: {item.value}%
      </div>
    </div>
  );
}

export function DashboardInventoryStatusChart() {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-medium text-white mb-4">Top Products:</h4>
        <div className="flex flex-col lg:flex-row items-center gap-6">
          <div className="w-full lg:w-[200px] h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={TOP_PRODUCTS_MOCK} cx="50%" cy="50%" labelLine={false} outerRadius={80} dataKey="value">
                  {TOP_PRODUCTS_MOCK.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex-1 space-y-3">
            {TOP_PRODUCTS_MOCK.map((product) => (
              <div key={product.name} className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: product.color }}
                />
                <span className="text-sm text-white font-light">
                  {product.name} - {product.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-white mb-4">Low Stock Alerts:</h4>
        <div className="space-y-3">
          {LOW_STOCK_MOCKS.map((alert) => (
            <div key={`${alert.name}-${alert.quantity}`} className="flex items-center gap-3">
              <div
                className={cn(
                  'w-2 h-2 rounded-full shrink-0',
                  alert.level === 'critical' ? 'bg-red-500' : 'bg-[#FBC02D]',
                )}
              />
              <span className="text-sm text-white font-light">
                {alert.name} - {alert.quantity}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
