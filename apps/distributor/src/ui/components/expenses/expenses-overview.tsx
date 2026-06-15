import { useMemo, useState } from 'react';
import { Download, Plus } from 'lucide-react';
import { PageHeaderContent } from '@/ui/layouts/page-header';
import { ExpensesSearchBar } from './expenses-search-bar';
import { ExpensesStatsTracker } from './expenses-stats-tracker';
import { ExpensesFilterChips } from './expenses-filter-chips';
import { ExpensesTable } from './expenses-table';
import { SalesActionButton } from '../sales/sales-action-button';
import { LogExpenseModal } from './log-expense-modal';
import { EXPENSES_MOCK } from './expenses-mocks';

export function ExpensesOverview() {
  const [searchQuery, setSearchQuery] = useState('');
  const [logExpenseOpen, setLogExpenseOpen] =
    useState(false);

  const filteredExpenses = useMemo(() => {
    const query = searchQuery
      .trim()
      .toLowerCase();

    return EXPENSES_MOCK.filter(
      (expense) =>
        query === '' ||
        expense.title
          .toLowerCase()
          .includes(query) ||
        expense.category
          .toLowerCase()
          .includes(query),
    );
  }, [searchQuery]);

  return (
    <section className="flex flex-col gap-6">
      <PageHeaderContent>
        <ExpensesSearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </PageHeaderContent>

      <header>
        <h1 className="text-2xl font-semibold text-[#FAFAFA]">
          Expenses
        </h1>
      </header>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <ExpensesStatsTracker className="w-full lg:max-w-[700px]" />

        <div className="flex items-center gap-3">
          <SalesActionButton
            label="Export CSV"
            icon={Download}
            onClick={() => {}}
          />

          <SalesActionButton
            label="Log Expense"
            icon={Plus}
            onClick={() =>
              setLogExpenseOpen(true)
            }
          />
        </div>
      </div>

      <div className="flex flex-col gap-5 rounded-[18px] bg-[#6161611A] p-6">
        <ExpensesFilterChips />

        <ExpensesTable
          expenses={filteredExpenses}
        />
      </div>

      <LogExpenseModal
        open={logExpenseOpen}
        onOpenChange={setLogExpenseOpen}
      />
    </section>
  );
}