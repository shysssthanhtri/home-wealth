"use client";

import { redirect } from "next/navigation";
import { useRef, useTransition } from "react";

import { createHome } from "@/actions/home-actions";
import { HomeForm, HomeFormRef } from "@/components/forms/HomeForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { ROUTES } from "@/constants/routes";

const HomelessPage = () => {
  const [isProcessing, start] = useTransition();
  const ref = useRef<HomeFormRef>(null);

  const onSubmit = (home: { name: string }) => {
    start(async () => {
      const createdHome = await createHome(home);
      console.log("createdHome: ", createdHome);
      redirect(ROUTES.HOME);
    });
  };

  return (
    <main className="flex w-full items-center justify-center min-h-svh">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Create your first home</CardTitle>
        </CardHeader>

        <CardContent>
          <FieldGroup>
            <FieldSet>
              <Field>
                <HomeForm
                  isLoading={isProcessing}
                  ref={ref}
                  onSubmit={onSubmit}
                />
              </Field>
              <Field>
                <Button
                  onClick={() => ref.current?.submit()}
                  disabled={isProcessing}
                >
                  {isProcessing && <Spinner className="w-4 h-4" />}
                  Create
                </Button>
              </Field>
            </FieldSet>
            <FieldSeparator />
            <Field className="text-center">
              Or request to be added to your home.
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>
    </main>
  );
};

export default HomelessPage;
