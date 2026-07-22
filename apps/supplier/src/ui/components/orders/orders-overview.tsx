import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeaderContent } from '@/ui/layouts/page-header';
import { useOrdersQuery, useOrderStatsQuery, useCancelOrderMutation } from '@/hooks/use-orders';
import { OrdersSearchBar } from './orders-search-bar';
import { OrdersStatusTabs } from './orders-status-tabs';
import { OrdersFilterChips, type OrderFilterSelection } from './orders-filter-chips';
import { OrdersTable } from './orders-table';
import { buildStatusTabs, toBackendStatus, toOrderRow } from './orders-mapper';
import type { OrderStatus } from './orders-mocks';

/**
 * Supplier Orders page. Lists orders from the real order endpoint and exposes
 * status filtering, client-side search, and row-level cancel.
 */
export function OrdersOverview() {
  const navigate = useNavigate();
  const { slug = '' } = useParams<{ slug: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [filters, setFilters] = useState<OrderFilterSelection>({});

  const backendStatus = toBackendStatus(activeTab as OrderStatus | 'All');
  const { data: listResult, isLoading } = useOrdersQuery(
    backendStatus ? { status: backendStatus, limit: 100 } : { limit: 100 },
  );
  const { data: stats } = useOrderStatsQuery();
  const cancelMutation = useCancelOrderMutation();

  const orders = useMemo(() => (listResult?.items ?? []).map(toOrderRow), [listResult]);
  const tabs = useMemo(() => buildStatusTabs(stats), [stats]);

  const setFilter = (filterId: string, option: string | null) => {
    setFilters((previous) => ({ ...previous, [filterId]: option }));
  };

  const filteredOrders = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const distributorFilter = filters.distributor;
    const paymentFilter = filters['payment-status'];
    return orders.filter((order) => {
      const matchesQuery =
        normalizedQuery === '' ||
        order.id.toLowerCase().includes(normalizedQuery) ||
        order.distributor.toLowerCase().includes(normalizedQuery);
      const matchesDistributor =
        !distributorFilter ||
        order.distributor.toLowerCase().includes(distributorFilter.toLowerCase());
      const matchesPayment = !paymentFilter || order.payment === paymentFilter;
      return matchesQuery && matchesDistributor && matchesPayment;
    });
  }, [searchQuery, filters, orders]);

  return (
    <section className="flex flex-col gap-6">
      {/* Order search replaces the default title in the layout header (dynamic per page). */}
      <PageHeaderContent>
        <OrdersSearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      </PageHeaderContent>

      <h1 className="text-2xl font-semibold text-[#FAFAFA]">Orders</h1>

      {/* Table card: status tabs, filter chips, then the orders table. */}
      <div className="flex flex-col gap-5 rounded-[18px] bg-[#6161611A] p-6">
        <OrdersStatusTabs activeLabel={activeTab} onChange={setActiveTab} tabs={tabs} />
        <OrdersFilterChips selection={filters} onChange={setFilter} />
        <OrdersTable
          orders={filteredOrders}
          isLoading={isLoading}
          onEdit={(order) => navigate(`/${slug}/orders/${order.id}`)}
          onCancel={(order) => cancelMutation.mutate(order.id)}
        />
      </div>
    </section>
  );
}
