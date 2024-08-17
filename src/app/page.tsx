"use client";

import { useCallback } from "react";

import { Button } from "~/components/ui/button";
import { loginAction, logoutAction } from "~/server/actions/auth";
import { api } from "~/trpc/react";

export default function Home() {
  const { data: hello } = api.hello.hello.useQuery({ text: "from tRPC" });
  const { data: isLoggedIn, isLoading } = api.auth.getIsLoggedIn.useQuery();
  const utils = api.useUtils();

  const handleLogin = useCallback(async () => {
    await loginAction();
    await utils.auth.invalidate();
  }, [utils]);

  const handleLogout = useCallback(async () => {
    await logoutAction();
    await utils.auth.invalidate();
  }, [utils]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <p className="text-2xl text-white">
        {hello ? hello.greeting : "Loading tRPC query..."}
        {isLoading ? (
          "Loading..."
        ) : isLoggedIn ? (
          <Button onClick={handleLogout}>Logout</Button>
        ) : (
          <Button onClick={handleLogin}>Login</Button>
        )}
      </p>
    </main>
  );
}
