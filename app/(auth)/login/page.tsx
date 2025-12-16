import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { SocialLogin } from "./_components/SocialLogin";

const LoginPage = () => {
  return (
    <main className="bg-auth-light dark:bg-auth-dark bg-cover bg-center bg-no-repeat flex w-full items-center justify-center min-h-svh p-6 md:p-10">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>
            Join{" "}
            <span className="italic">
              Home <span className="text-primary uppercase">Wealth</span>
            </span>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <SocialLogin />
        </CardContent>
      </Card>
    </main>
  );
};

export default LoginPage;
