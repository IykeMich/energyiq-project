import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { OrdersSearchBar } from './orders-search-bar';
import { OrdersActionButton } from './orders-action-button';
import { OrdersStatusTracker } from './orders-status-tracker';
import { OrdersStatusTabs } from './orders-status-tabs';
import { OrdersFilterChips } from './orders-filter-chips';
import { OrdersTable } from './orders-table';
import { ORDERS_MOCK } from './orders-mocks';

/**
 * Supplier Orders page. Search and the status tabs filter the table client-side
 * for now; swap `ORDERS_MOCK` for the orders query hook once the endpoint lands.
 */
export function OrdersOverview() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  const filteredOrders = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    return ORDERS_MOCK.filter((order) => {
      const matchesTab = activeTab === 'All' || order.status === activeTab;
      const matchesQuery =
        normalizedQuery === '' ||
        order.id.toLowerCase().includes(normalizedQuery) ||
        order.supplier.toLowerCase().includes(normalizedQuery);
      return matchesTab && matchesQuery;
    });
  }, [searchQuery, activeTab]);

  return (
    <section className="flex flex-col gap-6">
      {/* Header row: order search */}
      <OrdersSearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <div className="h-0.5 w-full bg-[#D9D9D9]" />

      {/* Title row: heading on the left, primary action on the right */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <header>
          <h1 className="text-2xl font-semibold text-[#FAFAFA]">Orders</h1>
          <p className="mt-1 text-sm text-[#FAFAFA]">View and manage all your past orders</p>
        </header>
        <OrdersActionButton label="New Order" icon={Plus} />
      </div>

      {/* Tracker band: status tracker on the left, invite action on the right */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <OrdersStatusTracker className="w-full lg:max-w-[600px]" />
        <OrdersActionButton label="Invite Distributor" />
      </div>

      {/* Table card: status tabs, filter chips, then the orders table */}
      <div className="flex flex-col gap-5 rounded-[18px] bg-[#6161611A] p-6">
        <OrdersStatusTabs activeLabel={activeTab} onChange={setActiveTab} />
        <OrdersFilterChips />
        <OrdersTable orders={filteredOrders} />
      </div>
    </section>
  );
}
