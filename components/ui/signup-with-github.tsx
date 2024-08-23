"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "./button";

export function SignIn() {
  const { signIn } = useAuthActions();
  return <Button onClick={() => signIn("github")}>Login</Button>;
}
