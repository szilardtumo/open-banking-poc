import { api } from "~/trpc/server";
import { LoginForm } from "./LoginForm";

import { LogoutForm } from "./LogoutForm";

export async function Header() {
  const isLoggedIn = await api.auth.getIsLoggedIn();

  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <div className="flex w-full items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">Open Banking POC</h1>
        {isLoggedIn ? <LogoutForm /> : <LoginForm />}
      </div>
    </header>
  );
}
