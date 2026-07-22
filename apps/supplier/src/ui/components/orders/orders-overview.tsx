import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from '@energyiq/ui';
import { PageHeaderContent } from '@/ui/layouts/page-header';
import { useOrdersQuery, useOrderStatsQuery, useCancelOrderMutation } from '@/hooks/use-orders';
import { useDistributorsQuery } from '@/hooks/use-distributor';
import { OrdersSearchBar } from './orders-search-bar';
import { OrdersStatusTabs } from './orders-status-tabs';
import { OrdersFilterChips, type OrderFilterSelection } from './orders-filter-chips';
import { OrdersTable } from './orders-table';
import {
  mapOrderToRow,
  mapOrderStatsToTabs,
  dateFilterToRange,
  ORDER_STATUS_TAB_DEFS,
  type OrderRow,
} from './orders-mocks';

/**
 * Supplier Orders page. Wired to GET /v1/order/list + /v1/order/list/stats, with
 * distributor names resolved from GET /v1/distributor/list. Search still filters
 * client-side (id / distributor name); the status tab and date filter are sent to
 * the API as real query params so pagination/counts stay accurate.
 */
export function OrdersOverview() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { slug = '' } = useParams<{ slug: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [filters, setFilters] = useState<OrderFilterSelection>({});
  
  const setFilter = (filterId: string, option: string | null) => {
    setFilters((previous) => ({ ...previous, [filterId]: option }));
  };

  const activeStatus = ORDER_STATUS_TAB_DEFS.find((tab) => tab.label === activeTab)?.status;
  const { date_from, date_to } = dateFilterToRange(filters.date);

  const { data: listResult, isLoading } = useOrdersQuery({
    status: activeStatus,
    date_from,
    date_to,
  });
  const { data: stats } = useOrderStatsQuery({ date_from, date_to });
  const cancelOrder = useCancelOrderMutation();
  const { data: distributorsResult } = useDistributorsQuery({ limit: 100 });

  const tabs = useMemo(() => mapOrderStatsToTabs(stats), [stats]);
  const distributorNameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const item of distributorsResult?.items ?? []) {
      if (item.id) map.set(item.id, item.name ?? item.id);
    }
    return map;
  }, [distributorsResult]);
  const rows = useMemo(
    () =>
      (listResult?.items ?? []).map((order) => {
        const row = mapOrderToRow(order);
        const resolvedName = order.distributor_id && distributorNameById.get(order.distributor_id);
        return resolvedName ? { ...row, distributor: resolvedName } : row;
      }),
    [listResult, distributorNameById],
  );

  const filteredOrders = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (!normalizedQuery) return rows;
    return rows.filter(
      (order) =>
        order.id.toLowerCase().includes(normalizedQuery) ||
        order.distributor.toLowerCase().includes(normalizedQuery),
    );
  }, [rows, searchQuery]);

  const handleCancel = async (order: OrderRow) => {
    try {
      await cancelOrder.mutateAsync(order.id);
      await queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Order cancelled', { description: `Order ${order.id} has been cancelled.` });
    } catch {
      toast.error('Could not cancel order', { description: 'Please try again.' });
    }
  };

  return (
    <section className="flex flex-col gap-6">
      {/* Order search replaces the default title in the layout header (dynamic per page). */}
      <PageHeaderContent>
        <OrdersSearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      </PageHeaderContent>

      <h1 className="text-2xl font-semibold text-[#FAFAFA]">Orders</h1>

      {/* Table card: status tabs, filter chips, then the orders table. */}
      <div className="flex flex-col gap-5 rounded-[18px] bg-[#6161611A] p-6">
        <OrdersStatusTabs tabs={tabs} activeLabel={activeTab} onChange={setActiveTab} />
        <OrdersFilterChips selection={filters} onChange={setFilter} />
        <OrdersTable
          orders={filteredOrders}
          isLoading={isLoading}
          onEdit={(order) => navigate(`/${slug}/orders/${order.id}`)}
          onCancel={handleCancel}
        />
      </div>
    </section>
  );
}
