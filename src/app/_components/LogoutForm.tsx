"use client";

import { useFormState } from "react-dom";
import { Button } from "~/components/ui/button";
import { logoutAction } from "~/server/actions/auth";

export function LogoutForm() {
  const [, formAction, isPending] = useFormState(logoutAction, undefined);

  return (
    <form action={formAction} className="flex w-full justify-end gap-3">
      <Button type="submit" disabled={isPending}>
        Logout
      </Button>
    </form>
  );
}
