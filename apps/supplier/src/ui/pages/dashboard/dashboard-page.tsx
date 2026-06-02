import { DashboardKpiCard } from './dashboard-kpi-card';
import { DashboardSectionHeader } from './dashboard-section-header';
import { DashboardFinancialSnapshot } from './dashboard-financial-snapshot';
import { DashboardQuickActionCard } from './dashboard-quick-action-card';
import { DashboardSalesTrendChart } from './dashboard-sales-trend-chart';
import { DashboardInventoryStatusChart } from './dashboard-inventory-status-chart';
import {
  KPI_MOCKS,
  RECENT_ACTIVITY_MOCKS,
  FINANCIAL_ACCOUNT_MOCKS,
  QUICK_ACTION_MOCKS,
} from './dashboard-mocks';

export function DashboardPage() {
  return (
    <section className="flex flex-col gap-6">
      <header className="mt-3">
        <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
        <p className="text-sm text-gray-400 mt-1">
          Welcome back! Here&apos;s your business performance summary.
        </p>
      </header>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* KPI panel */}
        <div className="flex flex-col gap-2 py-6 px-6 bg-[#6161611A] rounded-2xl shadow-sm lg:w-[65%]">
          <p className="text-xs font-light text-white mb-3">Updated 5 mins ago</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {KPI_MOCKS.map((kpi) => (
              <DashboardKpiCard
                key={kpi.title}
                title={kpi.title}
                value={kpi.value}
                Icon={kpi.Icon}
                badge={kpi.badge}
                emphasis={kpi.emphasis}
              />
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-[#6161611A] hover:border hover:border-[#616161B2] rounded-2xl pt-6 px-6 pb-0! flex-1 lg:max-h-[445px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
          <DashboardSectionHeader title="Recent Activity" actionLink={{ label: 'See all', href: '#' }} />
          <div className="space-y-4 max-h-[350px]! overflow-y-auto mt-6 lg:mt-8">
            {RECENT_ACTIVITY_MOCKS.map((activity, index) => {
              const isLast = index === RECENT_ACTIVITY_MOCKS.length - 1;
              return (
                <div
                  key={`${activity.description}-${index}`}
                  className={isLast ? '' : 'border-b border-gray-700 pb-3 flex flex-col gap-y-1 lg:gap-2'}
                >
                  <div className="flex items-start gap-x-2">
                    <div className="w-2 h-2 bg-white rounded-full shrink-0 mt-1.5" />
                    <div className="flex flex-col gap-y-1 lg:gap-2">
                      <p className="text-sm text-white font-light leading-[140%]">
                        {activity.description}
                      </p>
                      <p className="text-xs text-[#FFFFFFCC] mt-1 font-light leading-[100%]">
                        {activity.timestamp}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 w-full">
        <div className="flex flex-col w-full lg:w-1/2 gap-6">
          <DashboardFinancialSnapshot
            actionLink={{ label: 'See Details', href: '#' }}
            accounts={FINANCIAL_ACCOUNT_MOCKS}
          />
          <div className="bg-[#27272A] rounded-2xl p-6 shadow-sm">
            <DashboardSectionHeader title="Inventory Status" actionLink={{ label: 'Manage', href: '#' }} />
            <DashboardInventoryStatusChart />
          </div>
        </div>

        <div className="flex flex-col gap-6 w-full lg:w-1/2">
          <div className="bg-[#27272A] rounded-2xl p-6 shadow-sm">
            <DashboardSalesTrendChart />
          </div>
          <div className="bg-[#27272A] rounded-2xl p-6 shadow-sm">
            <DashboardSectionHeader title="Quick Actions" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6 mb-6">
              {QUICK_ACTION_MOCKS.map((action, index) => (
                <DashboardQuickActionCard
                  key={`${action.title}-${index}`}
                  title={action.title}
                  Icon={action.Icon}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
