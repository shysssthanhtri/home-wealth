import type { Metadata } from "next";

import { LoginForm } from "@/components/login-form";

export const metadata: Metadata = {
  title: "Login - Home Wealth",
  description: "Login to your Home Wealth account",
};

export default function LoginPage() {
  return <LoginForm />;
}
