import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { PageHeaderContent } from '@/ui/layouts/page-header';
import { useOrdersQuery, useOrderStatsQuery } from '@/hooks/use-orders';
import { OrdersSearchBar } from './orders-search-bar';
import { OrdersActionButton } from './orders-action-button';
import { OrdersStatusTracker } from './orders-status-tracker';
import { OrdersStatusTabs } from './orders-status-tabs';
import { OrdersFilterChips } from './orders-filter-chips';
import { OrdersTable } from './orders-table';
import { toOrderRow, toBackendStatus } from './orders-mapper';

/**
 * Distributor Orders page. Wires the order list UI to the real order API.
 */
export function OrdersOverview() {
  const navigate = useNavigate();
  const { slug = '' } = useParams<{ slug: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  const backendStatus = toBackendStatus(activeTab);
  const { data: listResult, isLoading } = useOrdersQuery(
    backendStatus ? { status: backendStatus, limit: 100 } : { limit: 100 },
  );
  const { data: stats } = useOrderStatsQuery();

  const orders = useMemo(() => (listResult?.items ?? []).map(toOrderRow), [listResult]);

  const filteredOrders = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    return orders.filter((orderItem) => {
      const matchesTab = activeTab === 'All' || orderItem.status === activeTab;
      const matchesQuery =
        normalizedQuery === '' ||
        orderItem.id.toLowerCase().includes(normalizedQuery) ||
        orderItem.supplier.toLowerCase().includes(normalizedQuery);
      return matchesTab && matchesQuery;
    });
  }, [searchQuery, activeTab, orders]);

  return (
    <section className="flex flex-col gap-6">
      {/* Order search replaces the default title in the layout header (dynamic per page). */}
      <PageHeaderContent>
        <OrdersSearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      </PageHeaderContent>

      {/* Title row: heading on the left, primary action on the right */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <header>
          <h1 className="text-2xl font-semibold text-[#FAFAFA]">Orders</h1>
          <p className="mt-1 text-sm text-[#FAFAFA]">View and manage all your past orders</p>
        </header>
      </div>

      {/* Tracker band: status tracker on the left, invite action on the right */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <OrdersStatusTracker className="w-full lg:min-w-160 lg:max-w-50" />
        <OrdersActionButton
          label="New Order"
          icon={Plus}
          onClick={() => navigate(`/${slug}/orders/new`)}
        />
      </div>

      {/* Table card: status tabs, filter chips, then the orders table */}
      <div className="flex flex-col gap-5 rounded-[18px] bg-[#6161611A] p-6">
        <OrdersStatusTabs activeLabel={activeTab} onChange={setActiveTab} stats={stats} />
        <OrdersFilterChips />
        <OrdersTable
          orders={filteredOrders}
          isLoading={isLoading}
          onViewDetails={(orderItem) => navigate(`/${slug}/orders/${orderItem.id}`)}
        />
      </div>
    </section>
  );
}
