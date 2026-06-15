import {
 
  type ExpenseRow,
} from './expenses-mocks';

interface Props {
  expenses: ExpenseRow[];
}

export function ExpensesTable({
  expenses,
}: Props) {
  return (
    <div className="rounded-[16px] bg-[#0F0F0F]">
      {expenses.map((expense) => (
        <div
          key={expense.id}
          className="flex items-center justify-between border-b border-[#1F1F1F] p-5"
        >
          <div>
            <h3 className="font-medium text-white">
              {expense.title}
            </h3>

            <p className="text-xs text-[#FFFFFF80]">
              {expense.category}
            </p>
          </div>

          <div className="text-right">
            <h3 className="font-semibold text-white">
              ₦
              {expense.amount.toLocaleString(
                'en-NG',
              )}
            </h3>

            <p className="text-xs text-[#FFFFFF80]">
              {expense.date}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}