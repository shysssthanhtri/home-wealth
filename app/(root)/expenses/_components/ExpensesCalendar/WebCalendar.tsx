"use client";

import React from "react";

import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
}

export const WebCalendar = ({ className }: Props) => {
  const [date, setDate] = React.useState(new Date());

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={(date) => {
        setDate(date);
      }}
      className={cn("bg-transparent p-0", className)}
      required
    />
  );
};
