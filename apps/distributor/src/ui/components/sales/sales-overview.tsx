import { useMemo, useState } from 'react';
import { Download, Plus } from 'lucide-react';
import { PageHeaderContent } from '@/ui/layouts/page-header';
import { SalesSearchBar } from './sales-search-bar';
import { SalesActionButton } from './sales-action-button';
import { SalesStatsTracker } from './sales-stats-tracker';
import { SalesFilterChips } from './sales-filter-chips';
import { SalesTable } from './sales-tables';
import { SALES_MOCK } from './sales-mocks';

export function SalesHistory() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSales = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return SALES_MOCK.filter((sale) => {
      return (
        normalizedQuery === '' ||
        sale.id.toLowerCase().includes(normalizedQuery) ||
        sale.customer.toLowerCase().includes(normalizedQuery) ||
        sale.product.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [searchQuery]);

  return (
    <section className="flex flex-col gap-6">
      {/* Search bar in header */}
      <PageHeaderContent>
        <SalesSearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </PageHeaderContent>

      {/* Title */}
      <header>
        <h1 className="text-2xl font-semibold text-[#FAFAFA]">
          Sales Log
        </h1>
      </header>

      {/* Stats + Action buttons */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <SalesStatsTracker className="w-full lg:max-w-[700px]" />

        <div className="flex flex-wrap items-center gap-3">
          <SalesActionButton
            label="Export CSV"
            icon={Download}
            onClick={() => {}}
          />

          <SalesActionButton
            label="Report Sales"
            icon={Plus}
            onClick={() => {}}
          />
        </div>
      </div>

      {/* Table Card */}
      <div className="flex flex-col gap-5 rounded-[18px] bg-[#6161611A] p-6">
        <SalesFilterChips />

        <SalesTable sales={filteredSales} />
      </div>
    </section>
  );
}