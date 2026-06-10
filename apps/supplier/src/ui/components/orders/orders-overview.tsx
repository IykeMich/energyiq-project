import { useMemo, useState } from 'react';
import { PageHeaderContent } from '@/ui/layouts/page-header';
import { OrdersSearchBar } from './orders-search-bar';
import { OrdersStatusTabs } from './orders-status-tabs';
import { OrdersFilterChips, type OrderFilterSelection } from './orders-filter-chips';
import { OrdersTable } from './orders-table';
import { ORDERS_MOCK } from './orders-mocks';

/**
 * Supplier Orders page. Search, the status tabs and the filter chips filter the
 * table client-side for now; swap `ORDERS_MOCK` for the orders query hook once
 * the endpoint lands.
 */
export function OrdersOverview() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [filters, setFilters] = useState<OrderFilterSelection>({});

  const setFilter = (filterId: string, option: string | null) => {
    setFilters((previous) => ({ ...previous, [filterId]: option }));
  };

  const filteredOrders = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const distributorFilter = filters.distributor;
    const paymentFilter = filters['payment-status'];
    return ORDERS_MOCK.filter((order) => {
      const matchesTab = activeTab === 'All' || order.status === activeTab;
      const matchesQuery =
        normalizedQuery === '' ||
        order.id.toLowerCase().includes(normalizedQuery) ||
        order.distributor.toLowerCase().includes(normalizedQuery);
      const matchesDistributor =
        !distributorFilter ||
        order.distributor.toLowerCase().includes(distributorFilter.toLowerCase());
      const matchesPayment = !paymentFilter || order.payment === paymentFilter;
      // NOTE: the "Date" chip is presentational — its relative ranges (Today,
      // This Week, …) don't map to the static mock dates. TODO(orval): apply it
      // once orders carry real timestamps from the endpoint.
      return matchesTab && matchesQuery && matchesDistributor && matchesPayment;
    });
  }, [searchQuery, activeTab, filters]);

  return (
    <section className="flex flex-col gap-6">
      {/* Order search replaces the default title in the layout header (dynamic per page). */}
      <PageHeaderContent>
        <OrdersSearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      </PageHeaderContent>

      <h1 className="text-2xl font-semibold text-[#FAFAFA]">Orders</h1>

      {/* Table card: status tabs, filter chips, then the orders table. */}
      <div className="flex flex-col gap-5 rounded-[18px] bg-[#6161611A] p-6">
        <OrdersStatusTabs activeLabel={activeTab} onChange={setActiveTab} />
        <OrdersFilterChips selection={filters} onChange={setFilter} />
        <OrdersTable
          orders={filteredOrders}
          onEdit={() => {
            // TODO(orval): open the edit flow once the order routes/endpoints land.
          }}
          onCancel={() => {
            // TODO(orval): wire the cancel-order action once the endpoint lands.
          }}
        />
      </div>
    </section>
  );
}
