"use client";

import {
  IconBrandGithubFilled,
  IconBrandGoogleFilled,
} from "@tabler/icons-react";
import { useTransition } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";

const supportSocials = [
  {
    icon: IconBrandGithubFilled,
    name: "Github",
    provider: "github",
  },
  {
    icon: IconBrandGoogleFilled,
    name: "Google",
    provider: "google",
  },
] as const;

export const SocialLogin = () => {
  const [isAuthenticating, startAuthenticating] = useTransition();

  const onLogin = async (provider: "github" | "google") => {
    startAuthenticating(async () => {
      await new Promise<void>((res) => {
        setTimeout(() => {
          res();
        }, 2000);
      });
    });
  };

  return (
    <FieldGroup>
      {isAuthenticating && (
        <Field>
          <Badge variant="outline">
            <Spinner />
            Log you in...
          </Badge>
        </Field>
      )}

      <Field>
        {supportSocials.map((social) => (
          <Button
            variant="outline"
            type="button"
            key={social.provider}
            disabled={isAuthenticating}
            onClick={() => onLogin(social.provider)}
          >
            <social.icon />
            Login with {social.name}
          </Button>
        ))}
      </Field>
    </FieldGroup>
  );
};
