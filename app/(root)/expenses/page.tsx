import { AddExpense } from "@/app/(root)/expenses/_components/AddExpense";
import { ExpenseList } from "@/app/(root)/expenses/_components/ExpenseList";
import { ExpensesCalendar } from "@/app/(root)/expenses/_components/ExpensesCalendar";

const ExpensesPage = () => {
  return (
    <div className="flex gap-4">
      <ExpensesCalendar />
      <div>
        <AddExpense />
        <ExpenseList />
      </div>
    </div>
  );
};

export default ExpensesPage;
