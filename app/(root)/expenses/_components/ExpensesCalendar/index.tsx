import React from "react";

import { MobileCalendar } from "@/app/(root)/expenses/_components/ExpensesCalendar/MobileCalendar";
import { WebCalendar } from "@/app/(root)/expenses/_components/ExpensesCalendar/WebCalendar";
import { Card, CardContent } from "@/components/ui/card";

export const ExpensesCalendar = () => {
  return (
    <Card>
      <CardContent>
        <WebCalendar className="hidden md:block" />
        <MobileCalendar className="block md:hidden" />
      </CardContent>
    </Card>
  );
};
