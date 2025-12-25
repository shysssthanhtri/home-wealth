"use client";

import { useRef, useTransition } from "react";

import { createExpense } from "@/actions/expense-actions";
import {
  ExpenseForm,
  ExpenseFormRef,
  ExpenseFormValue,
} from "@/app/(root)/expenses/form/ExpenseForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

export const AddExpense = () => {
  const ref = useRef<ExpenseFormRef>(null);
  const [isProcessing, start] = useTransition();

  const onSubmit = (expense: ExpenseFormValue) => {
    start(async () => {
      await createExpense({
        ...expense,
        date: new Date(),
      });
      ref.current?.reset({ type: expense.type });
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add expense</CardTitle>
      </CardHeader>
      <CardContent>
        <ExpenseForm ref={ref} onSubmit={onSubmit} isLoading={isProcessing} />
      </CardContent>
      <CardFooter className="flex justify-end gap-4">
        <Button
          variant="secondary"
          onClick={() => ref.current?.reset()}
          disabled={isProcessing}
        >
          Clear
        </Button>
        <Button onClick={() => ref.current?.submit()} disabled={isProcessing}>
          {isProcessing && <Spinner className="w-4 h-4" />}
          Add
        </Button>
      </CardFooter>
    </Card>
  );
};
