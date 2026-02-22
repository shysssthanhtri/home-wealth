import type { Metadata } from "next";

import { SignupForm } from "@/components/signup-form";

export const metadata: Metadata = {
  title: "Sign Up - Home Wealth",
  description: "Create a new Home Wealth account",
};

export default function SignupPage() {
  return <SignupForm />;
}
