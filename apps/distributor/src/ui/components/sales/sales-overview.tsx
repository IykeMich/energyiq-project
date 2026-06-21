import { useMemo, useState } from 'react';
import { Download, Plus } from 'lucide-react';

import { PageHeaderContent } from '@/ui/layouts/page-header';
import { SalesSearchBar } from './sales-search-bar';
import { SalesActionButton } from './sales-action-button';
import { SalesStatsTracker } from './sales-stats-tracker';
import { SalesFilterChips } from './sales-filter-chips';
import { SalesTable } from './sales-tables';
import { SALES_MOCK, type SaleRow } from './sales-mocks';

import { SaleDetailsModal } from './sales-details-modal';
import { VoidSaleModal } from './void-sale-modal';

export function SalesHistory() {
  const [searchQuery, setSearchQuery] =
    useState('');

  const [selectedSale, setSelectedSale] =
    useState<SaleRow | null>(null);

  const [detailsOpen, setDetailsOpen] =
    useState(false);

  const [voidOpen, setVoidOpen] =
    useState(false);

  const filteredSales = useMemo(() => {
    const normalizedQuery =
      searchQuery.trim().toLowerCase();

    return SALES_MOCK.filter((sale) => {
      return (
        normalizedQuery === '' ||
        sale.id
          .toLowerCase()
          .includes(normalizedQuery) ||
        sale.customer
          .toLowerCase()
          .includes(normalizedQuery) ||
        sale.product
          .toLowerCase()
          .includes(normalizedQuery)
      );
    });
  }, [searchQuery]);

  const handleViewDetails = (
    sale: SaleRow,
  ) => {
    setSelectedSale(sale);
    setDetailsOpen(true);
  };

  const handleVoidSale = (
    sale: SaleRow,
  ) => {
    setSelectedSale(sale);
    setVoidOpen(true);
  };

  return (
    <>
      <section className="flex flex-col gap-6">
        <PageHeaderContent>
          <SalesSearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </PageHeaderContent>

        <header>
          <h1 className="text-2xl font-semibold text-[#FAFAFA]">
            Sales Log
          </h1>
        </header>

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

        <div className="flex flex-col gap-5 rounded-[18px] bg-[#6161611A] p-6">
          <SalesFilterChips />

          <SalesTable
            sales={filteredSales}
            onViewDetails={
              handleViewDetails
            }
            onVoidSale={
              handleVoidSale
            }
          />
        </div>
      </section>

      <SaleDetailsModal
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        sale={selectedSale}
      />

      <VoidSaleModal
        open={voidOpen}
        onOpenChange={setVoidOpen}
        sale={selectedSale}
      />
    </>
  );
}