"use client";

import { redirect } from "next/navigation";
import React, { useRef, useTransition } from "react";

import { createHome } from "@/actions/home-actions";
import { HomeForm, HomeFormRef } from "@/components/forms/HomeForm";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { ROUTES } from "@/constants/routes";

export const CreateHome = () => {
  const [isProcessing, start] = useTransition();
  const ref = useRef<HomeFormRef>(null);

  const onSubmit = (home: { name: string }) => {
    start(async () => {
      await createHome(home);
      redirect(ROUTES.HOME);
    });
  };

  return (
    <FieldGroup>
      <FieldSet>
        <FieldLegend>Create your home</FieldLegend>
        <Field>
          <HomeForm isLoading={isProcessing} ref={ref} onSubmit={onSubmit} />
        </Field>
        <Field>
          <Button onClick={() => ref.current?.submit()} disabled={isProcessing}>
            {isProcessing && <Spinner className="w-4 h-4" />}
            Create
          </Button>
        </Field>
      </FieldSet>
      <FieldSeparator />
      <Field className="text-center text-sm">
        Or request to be added to your home.
      </Field>
    </FieldGroup>
  );
};
