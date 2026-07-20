import { useState } from 'react';

import { PageHeaderContent } from '@/ui/layouts/page-header';
import { ExpensesSearchBar } from './expenses-search-bar';
import { LogExpenseModal } from './log-expense-modal';
import {
  Users,
  Wrench,
  Shield,
  Zap,
  Receipt,
} from 'lucide-react';

export function ExpensesOverview() {

   const getExpenseIcon = (title: string) => {
  if (title.includes('Staff')) {
    return (
      <Users
        size={12}
        className="text-[#3BD16F]"
      />
    );
  }

  if (title.includes('repair')) {
    return (
      <Wrench
        size={12}
        className="text-[#FF4D4D]"
      />
    );
  }

  if (title.includes('Security')) {
    return (
      <Shield
        size={12}
        className="text-[#FF8C3A]"
      />
    );
  }

  if (title.includes('electricity')) {
    return (
      <Zap
        size={12}
        className="text-[#4D8DFF]"
      />
    );
  }

  return (
    <Receipt
      size={12}
      className="text-[#8A8A8A]"
    />
  );
};

  const [searchQuery, setSearchQuery] = useState('');
  const [logExpenseOpen, setLogExpenseOpen] = useState(false);

  const recentEntries = [
    {
      title: 'Staff salaries',
      sub: 'Staff costs · Recurring monthly',
      amount: '₦1,350,000',
      date: 'May 8',
    },
    {
      title: 'EEDC electricity bill',
      sub: 'Utilities · Monthly',
      amount: '₦256,000',
      date: 'May 7',
    },
    {
      title: 'Pump 2 nozzle repair',
      sub: 'Maintenance · One-off',
      amount: '₦96,500',
      date: 'May 6',
    },
    {
      title: 'Security Personnel',
      sub: 'Security · Recurring monthly',
      amount: '₦180,000',
      date: 'May 5',
    },
    {
      title: 'Security Personnel',
      sub: 'Security · Recurring monthly',
      amount: '₦180,000',
      date: 'May 5',
    },
    {
      title: 'EEDC electricity bill',
      sub: 'Utilities · Monthly',
      amount: '₦284,000',
      date: 'May 3',
    },
    {
      title: 'Pump 2 nozzle repair',
      sub: 'Maintenance · One-off',
      amount: '₦96,500',
      date: 'May 2',
    },
    {
      title: 'Staff salaries',
      sub: 'Staff costs · Recurring monthly',
      amount: '₦1,350,000',
      date: 'May 1',
    },
  ];

  const filteredEntries = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return recentEntries.filter(
      (entry) =>
        query === '' ||
        entry.title.toLowerCase().includes(query) ||
        entry.sub.toLowerCase().includes(query),
    );
  }, [searchQuery]);

  return (
    <>
     <section className="flex h-full min-h-[calc(100vh-120px)] flex-col gap-5 p-6">
        <PageHeaderContent>
          <ExpensesSearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </PageHeaderContent>

        {/* Page Header */}
        <div>
          <h1 className="text-lg font-semibold text-white">
            Expenses
          </h1>

          <div className="mt-2 flex items-center gap-2">
            <span className="rounded-full bg-[#F5B91E]/15 px-2.5 py-0.5 text-[10px] text-[#F5B91E]">
              Active
            </span>

            <span className="rounded-full border border-[#2D2D2D] px-2.5 py-0.5 text-[10px] text-[#8A8A8A]">
              Network
            </span>
          </div>
        </div>

        {/* Main Card */}
       <div className="flex flex-1 flex-col rounded-[20px] border border-[#252525] bg-[#0F0F0F] p-5">
          {/* Stats */}
          <div className="grid gap-3 md:grid-cols-3">
            <StatCard
              title="Network Total"
              value="₦49.6M"
              footer="Today"
            />

            <StatCard
              title="Dispensed"
              value="112,480 L"
              footer="All stations"
            />

            <StatCard
              title="Alerts"
              value="3"
              footer="Needs attention"
              danger
            />
          </div>

          {/* Breakdown */}
          <div className="mt-5 rounded-xl border border-[#343434] p-3">
            <h3 className="mb-3 text-[11px] font-medium text-white">
              Breakdown by category
            </h3>

            <div className="h-1.5 rounded-full bg-[#252525] p-px">
  <div className="flex h-full gap-0.5">
    <div className="w-[35%] rounded-full bg-[#3BD16F]" />
    <div className="w-[20%] rounded-full bg-[#4D8DFF]" />
    <div className="w-[18%] rounded-full bg-[#FF4D4D]" />
    <div className="w-[15%] rounded-full bg-[#FF8C3A]" />
    <div className="w-[12%] rounded-full bg-[#666666]" />
  </div>
</div>

            <div className="mt-3 flex flex-wrap gap-3">
              <Legend color="bg-[#3BD16F]" label="Staff salaries" />
              <Legend color="bg-[#4D8DFF]" label="Utilities" />
              <Legend color="bg-[#FF4D4D]" label="Maintenance" />
              <Legend color="bg-[#FF8C3A]" label="Security bills" />
            <Legend color="bg-[#666666]" label="Overheads" />
            </div>
          </div>

          {/* Recent Entries */}
         <div className="mt-5 flex flex-1 flex-col overflow-hidden rounded-xl border border-[#2A2A2A]">
            <div className="flex items-center justify-between border-b border-[#232323] px-4 py-3">
              <h2 className="text-sm font-medium text-white">
                Recent entries
              </h2>

              <button
                onClick={() => setLogExpenseOpen(true)}
                className="rounded-full bg-[#F5B91E] px-3 py-1.5 text-[10px] font-medium text-black transition hover:opacity-90"
              >
                + Log new expense
              </button>
            </div>

           <div className="flex-1 overflow-y-auto">
  {filteredEntries.map((item, index) => (
    <div
      key={index}
      className="flex items-center justify-between border-b border-[#1D1D1D] px-4 py-3 transition hover:bg-[#141414]"
    >
      <div className="flex items-center gap-3">
       <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[#2D2D2D] bg-[#1A1A1A] text-[#A0A0A0]">
  {getExpenseIcon(item.title)}
</div>

        <div>
          <p className="text-[11px] font-medium text-white">
            {item.title}
          </p>

          <p className="text-[9px] text-[#767676]">
            {item.sub}
          </p>
        </div>
      </div>

      <div className="text-right">
        <p className="text-[11px] font-medium text-white">
          {item.amount}
        </p>

        <p className="text-[9px] text-[#767676]">
          {item.date}
        </p>
      </div>
    </div>
  ))}
</div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-[9px] text-[#6F6F6F]">
                Showing 1 to 8 of 50 Entries
              </span>

              <div className="flex items-center gap-1">
                <button className="flex h-5 w-5 items-center justify-center rounded border border-[#2A2A2A] text-[9px] text-[#AAA]">
                  ‹
                </button>

                <button className="flex h-5 w-5 items-center justify-center rounded bg-[#F5B91E] text-[9px] font-medium text-black">
                  1
                </button>

                <button className="flex h-5 w-5 items-center justify-center rounded border border-[#2A2A2A] text-[9px] text-[#AAA]">
                  2
                </button>

                <button className="flex h-5 w-5 items-center justify-center rounded border border-[#2A2A2A] text-[9px] text-[#AAA]">
                  ›
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <LogExpenseModal
        open={logExpenseOpen}
        onOpenChange={setLogExpenseOpen}
      />
    </>
  );
}

function StatCard({
  title,
  value,
  footer,
  danger,
}: {
  title: string;
  value: string;
  footer: string;
  danger?: boolean;
}) {
  return (
    <div className="rounded-xl border border-[#262626] bg-[#181818] px-4 py-3">
      <p className="text-[10px] text-[#8C8C8C]">
        {title}
      </p>

      <h3
        className={`mt-2 text-lg font-semibold ${
          danger ? 'text-[#FF4D4D]' : 'text-white'
        }`}
      >
        {value}
      </h3>

      <p
        className={`mt-3 text-right text-[9px] ${
          danger
            ? 'text-[#FF4D4D]'
            : 'text-[#777777]'
        }`}
      >
        {footer}
      </p>
    </div>
  );
}

function Legend({
  color,
  label,
}: {
  color: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <div className={`h-1.5 w-1.5 rounded-full ${color}`} />

      <span className="text-[10px] text-[#8A8A8A]">
        {label}
      </span>
    </div>
  );
}