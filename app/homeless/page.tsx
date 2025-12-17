import React from "react";

import { HomeForm } from "@/components/forms/HomeForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";

const HomelessPage = () => {
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
                <HomeForm />
              </Field>
              <Field>
                <Button>Create</Button>
              </Field>
            </FieldSet>
            <FieldSeparator />
            <Field className="text-center">
              Or request to be added to your home
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>
    </main>
  );
};

export default HomelessPage;
