export interface ExpenseRow {
  id: string;
  title: string;
  category: string;
  amount: number;
  date: string;
}

export const EXPENSES_MOCK: ExpenseRow[] = [
  {
    id: 'EXP-001',
    title: 'Staff salaries',
    category: 'Staff Costs',
    amount: 350000,
    date: 'May 1',
  },
  {
    id: 'EXP-002',
    title: 'Pump 2 nozzle repair',
    category: 'Maintenance',
    amount: 9500,
    date: 'May 2',
  },
  {
    id: 'EXP-003',
    title: 'Security personnel',
    category: 'Security',
    amount: 100000,
    date: 'May 4',
  },
];

export interface ExpenseFilter {
  id: string;
  label: string;
  options: string[];
}

export const EXPENSE_FILTERS: ExpenseFilter[] =
  [
    {
      id: 'category',
      label: 'Category',
      options: [
        'Staff Costs',
        'Utilities',
        'Maintenance',
        'Security',
      ],
    },
    {
      id: 'amount',
      label: 'Amount',
      options: [
        'Low',
        'Medium',
        'High',
      ],
    },
    {
      id: 'date',
      label: 'Date',
      options: [
        'Today',
        'This Week',
        'This Month',
      ],
    },
  ];