import React from "react";

import { MobileCalendar } from "@/app/(root)/expenses/_components/ExpensesCalendar/MobileCalendar";
import { WebCalendar } from "@/app/(root)/expenses/_components/ExpensesCalendar/WebCalendar";

export const ExpensesCalendar = () => {
  return (
    <>
      <WebCalendar className="hidden md:block" />
      <MobileCalendar className="block md:hidden" />
    </>
  );
};
