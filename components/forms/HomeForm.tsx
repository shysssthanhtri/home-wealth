"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { forwardRef, useCallback, useImperativeHandle } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { homesSchema } from "@/schemas";

const HomeFormSchema = homesSchema.pick({
  name: true,
});
type FormSchema = z.infer<typeof HomeFormSchema>;

interface Props {
  home?: z.infer<typeof HomeFormSchema>;
  onSubmit?: (value: FormSchema) => void;
  isLoading?: boolean;
}
export type HomeFormRef = {
  submit: () => void;
};

export const HomeForm = forwardRef<HomeFormRef, Props>(
  ({ onSubmit, isLoading, home }, ref) => {
    const form = useForm<FormSchema>({
      resolver: zodResolver(HomeFormSchema),
      defaultValues: {
        name: "",
        ...home,
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
      }),
      [form, handleSubmit],
    );

    return (
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <FieldGroup>
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="name">Home name</FieldLabel>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  placeholder="Name"
                  autoComplete="off"
                  disabled={isLoading}
                  id="name"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
      </form>
    );
  },
);

HomeForm.displayName = "HomeForm";
