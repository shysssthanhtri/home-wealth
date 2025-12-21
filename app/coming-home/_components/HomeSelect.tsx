"use client";

import { redirect } from "next/navigation";

import { loginHome } from "@/actions/home-actions";
import {
  Field,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ROUTES } from "@/constants/routes";

interface Props {
  homes: { id: string; name: string }[];
}
export const HomeSelect = ({ homes }: Props) => {
  return (
    <FieldGroup>
      <FieldSet>
        <FieldLegend>Select your home</FieldLegend>
        <Field>
          <Select
            onValueChange={async (value) => {
              await loginHome(value);
              redirect(ROUTES.HOME);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecting home..." />
            </SelectTrigger>

            <SelectContent>
              {homes.map((home) => (
                <SelectItem key={home.id} value={home.id}>
                  {home.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </FieldSet>
    </FieldGroup>
  );
};
