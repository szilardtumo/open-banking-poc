import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Form } from "~/components/ui/form";
import { api } from "~/trpc/server";
import { AddIntegrationCard } from "./AddIntegrationCard";

export async function Dashboard() {
  const requisitions = await api.goCardless.getRequisitions();
  console.log("requisitions", requisitions);

  return (
    <div className="flex flex-col gap-6">
      <AddIntegrationCard />
      <Card x-chunk="dashboard-04-chunk-2">
        <CardHeader>
          <CardTitle>Bank accounts</CardTitle>
        </CardHeader>
        <CardContent>accounts</CardContent>
      </Card>
    </div>
  );
}
