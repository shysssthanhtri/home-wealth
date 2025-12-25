"use server";

import z from "zod";

import { getCurrentUserIdAndHomeId } from "@/auth";
import { prisma } from "@/lib/prisma";
import { expensesSchema } from "@/schemas";

export const createExpense = async (
  expense: Pick<
    z.infer<typeof expensesSchema>,
    "amount" | "description" | "type" | "date"
  >,
) => {
  const { userId, homeId } = await getCurrentUserIdAndHomeId();
  const createdExpense = await prisma.expenses.create({
    data: {
      amount: expense.amount,
      description: expense.description,
      type: expense.type,
      userId,
      homeId,
      date: expense.date,
    },
  });
  return createdExpense;
};
