"use client";

import { SwitchProps } from "@radix-ui/react-switch";
import { TrendingDown, TrendingUp } from "lucide-react";
import { RefAttributes } from "react";

import { Switch } from "@/components/ui/switch";
import { ExpenseType } from "@/generated/prisma";

interface Props
  extends
    Omit<SwitchProps, "value" | "onChange">,
    RefAttributes<HTMLButtonElement> {
  value: ExpenseType;
  onChange: (value: ExpenseType) => void;
}
export const ExpenseTypeSwitcher = ({ value, onChange, ...props }: Props) => {
  const expenseDisplay = {
    label: "Expense",
    icon: TrendingDown,
  };

  const incomeDisplay = {
    label: "Income",
    icon: TrendingUp,
  };

  const display = value === ExpenseType.INCOME ? incomeDisplay : expenseDisplay;

  const label = (
    <span className="text-sm flex gap-1 items-center">
      {display.label}
      <display.icon className="w-4 h-4" />
    </span>
  );

  return (
    <div className="flex gap-4 items-center justify-left">
      <Switch
        {...props}
        checked={value === ExpenseType.INCOME}
        onCheckedChange={(checked) => {
          onChange(!!checked ? ExpenseType.INCOME : ExpenseType.EXPENSE);
        }}
      />
      {label}
    </div>
  );
};
