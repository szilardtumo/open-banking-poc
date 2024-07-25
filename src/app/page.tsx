import { Button } from "~/components/ui/button";
import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
  const hello = await api.hello.hello({ text: "from tRPC" });

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <p className="text-2xl text-white">
          {hello ? hello.greeting : "Loading tRPC query..."}
          <Button>Button</Button>
        </p>
      </main>
    </HydrateClient>
  );
}
