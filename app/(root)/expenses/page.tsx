import { AddExpense } from "@/app/(root)/expenses/_components/AddExpense";
import { ExpenseList } from "@/app/(root)/expenses/_components/ExpenseList";
import { ExpensesCalendar } from "@/app/(root)/expenses/_components/ExpensesCalendar";

const ExpensesPage = () => {
  return (
    <div className="flex gap-4">
      <ExpensesCalendar />
      <div className="w-full flex flex-col gap-4">
        <AddExpense />
        <ExpenseList />
      </div>
    </div>
  );
};

export default ExpensesPage;
