"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { forwardRef, useCallback, useImperativeHandle } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

import { ExpenseTypeSwitcher } from "@/app/(root)/expenses/_components/ExpenseTypeSwitcher";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ExpenseType } from "@/generated/prisma";
import { expensesSchema } from "@/schemas";

const Schema = expensesSchema.pick({
  amount: true,
  description: true,
  type: true,
});
type FormSchema = z.infer<typeof Schema>;

interface Props {
  expense?: Partial<FormSchema>;
  onSubmit?: (value: FormSchema) => void;
  isLoading?: boolean;
}
export type ExpenseFormRef = {
  submit: () => void;
  reset: (value?: Partial<FormSchema>) => void;
};

export const ExpenseForm = forwardRef<ExpenseFormRef, Props>(
  ({ onSubmit, isLoading, expense }, ref) => {
    console.log("expense: ", expense);
    const form = useForm<FormSchema>({
      resolver: zodResolver(Schema),
      defaultValues: {
        amount: 0,
        description: "",
        type: ExpenseType.EXPENSE,
        ...expense,
      },
    });

    const handleSubmit = useCallback(
      (value: FormSchema) => {
        onSubmit?.(value);
      },
      [onSubmit],
    );

    useImperativeHandle(
      ref,
      () => ({
        submit: () => {
          void form.handleSubmit(handleSubmit)();
        },
        reset: (value) => {
          form.reset(value);
        },
      }),
      [form, handleSubmit],
    );

    return (
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <FieldGroup>
          <Controller
            name="amount"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="name">Amount</FieldLabel>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  placeholder="0.00"
                  autoComplete="off"
                  disabled={isLoading}
                  type="number"
                  id="amount"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="description"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <Input
                  {...field}
                  value={field.value ?? undefined}
                  aria-invalid={fieldState.invalid}
                  placeholder="Purpose"
                  autoComplete="off"
                  disabled={isLoading}
                  id="description"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="type"
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <ExpenseTypeSwitcher
                  value={field.value}
                  onChange={field.onChange}
                  aria-invalid={fieldState.invalid}
                  id="type"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </>
            )}
          />
        </FieldGroup>
      </form>
    );
  },
);

ExpenseForm.displayName = "ExpenseForm";
export type ExpenseFormValue = FormSchema;
